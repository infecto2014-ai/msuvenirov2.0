// HTTP handler of the chat service (owner, 06.11.2026: own chat + panel-app on PC and phone, no Telegram).
//
// Public (site widget):
//   POST /api/chat/message   { sid, text, page?, hp? }           visitor message
//   POST /api/chat/file      ?sid=…&name=…  (raw body)            visitor file (image / layout)
//   GET  /api/chat/messages  ?sid=…&after=N[&wait=0]              new messages (long polling, up to 25 s)
//   GET  /api/chat/file      ?sid=…&id=N                          a file of this conversation
//   POST /api/chat/contact   { sid, contact }                    phone / Telegram left in the chat
//   POST /api/chat/typing    { sid }                              «печатает…» for the panel
//   GET  /api/chat/status                                         { online } for the widget header
//   POST /api/callback       { phone, name?, page?, hp? }        «Перезвоните мне»
// Panel (/admin, cookie session; POST needs the header «x-msuv: 1»):
//   POST /api/admin/login { password } · POST /api/admin/logout · GET /api/admin/me
//   GET  /api/admin/chats · GET /api/admin/chats/:sid · POST /api/admin/chats/:sid/reply { text }
//   POST /api/admin/chats/:sid/file ?name=… (raw) · POST /api/admin/chats/:sid/read { upTo } · GET /api/admin/file ?sid&id
//   GET  /api/admin/callbacks · POST /api/admin/callbacks/:id { status }
//   GET|POST /api/admin/settings { status: auto|online|offline } · GET|POST /api/admin/templates { list }
//   GET  /api/admin/push/key · POST /api/admin/push/subscribe { subscription } · POST /api/admin/push/test
//   GET  /api/admin/notify (for the service worker) · GET /api/admin/events (server-sent events)
import { EventEmitter } from 'node:events';
import { createReadStream, statSync } from 'node:fs';
import { SID_RE } from './store.mjs';
import { COOKIE, clearCookie, cookieOf, sessionCookie, sessions, verifyPassword } from './auth.mjs';
import { pushAll } from './push.mjs';

const MAX_BODY = 16 * 1024;
const MAX_FILE = 10 * 1024 * 1024;
const MAX_TEXT = 2000;
const POLL_MS = 25_000;
const SEEN_MS = 45_000;
const FILE_EXT = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'heic', 'pdf', 'ai', 'eps', 'cdr', 'psd', 'svg', 'tif', 'tiff', 'zip', 'rar', '7z', 'docx', 'xlsx', 'txt']);
const INLINE = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

const json = (res, status, data, headers = {}) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers });
  res.end(JSON.stringify(data));
};

const readRaw = (req, max) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > max) {
        reject(Object.assign(new Error('too large'), { status: 413 }));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
const readBody = async (req) => {
  const buf = await readRaw(req, MAX_BODY);
  try {
    return buf.length ? JSON.parse(buf.toString('utf8')) : {};
  } catch {
    throw new Error('bad json');
  }
};

/** simple sliding-window limiter: at most `max` hits per `windowMs` for a key */
export const limiter = (max, windowMs, now = () => Date.now()) => {
  const hits = new Map();
  return (key) => {
    const t = now();
    const list = (hits.get(key) ?? []).filter((x) => t - x < windowMs);
    if (list.length >= max) {
      hits.set(key, list);
      return false;
    }
    list.push(t);
    hits.set(key, list);
    if (hits.size > 10_000) hits.clear();
    return true;
  };
};

const clean = (s, max) =>
  String(s ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max);
const pageOf = (s) => clean(s, 200).replace(/^https?:\/\/[^/]+/, '') || '/';

/** working hours 10:00–20:00 in Kaliningrad */
export const inHours = (d = new Date()) => {
  const h = Number(new Intl.DateTimeFormat('ru-RU', { hour: 'numeric', hour12: false, timeZone: 'Europe/Kaliningrad' }).format(d));
  return h >= 10 && h < 20;
};

/**
 * @param {{ store: import('./store.mjs').Store, passwordHash?: string, vapid?: { publicKey: string, privateKey: string, subject: string }, secureCookie?: boolean, fetch?: typeof fetch, now?: () => Date, log?: (s: string) => void }} o
 */
export const createApp = ({ store, passwordHash = '', vapid, secureCookie = true, fetch: f = globalThis.fetch, now = () => new Date(), log = console.log }) => {
  const events = new EventEmitter(); // per-conversation wake-ups for the widget
  events.setMaxListeners(1000);
  const panel = new EventEmitter(); // everything the panel should know about
  panel.setMaxListeners(50);
  const auth = sessions(store);
  const perIp = limiter(30, 10 * 60_000);
  const perSid = limiter(20, 10 * 60_000);
  const uploads = limiter(10, 10 * 60_000);
  const callbacks = limiter(3, 30 * 60_000);
  const logins = limiter(8, 15 * 60_000);
  const seen = new Map(); // sid → last time the visitor's page polled
  const typing = new Map(); // sid → last «печатает»
  let waiting = 0;

  const ipOf = (req) => String(req.headers['x-real-ip'] ?? req.socket.remoteAddress ?? '');
  const online = () => {
    const s = store.settings().status;
    return s === 'online' ? true : s === 'offline' ? false : inHours(now());
  };
  const notify = (type, data) => {
    panel.emit('event', { type, ...data });
    if (type === 'message' || type === 'callback') pushAll({ vapid, store, fetch: f, log }).catch(() => {});
  };

  // ---------------------------------------------------------------- public: the site widget
  const visitorMessage = async (req, res) => {
    const b = await readBody(req);
    if (b.hp) return json(res, 200, { ok: true }); // honeypot: pretend it worked
    const sid = String(b.sid ?? '');
    const text = clean(b.text, MAX_TEXT);
    if (!SID_RE.test(sid) || !text) return json(res, 400, { ok: false, error: 'Напишите сообщение.' });
    if (!perIp(ipOf(req)) || !perSid(sid)) return json(res, 429, { ok: false, error: 'Слишком много сообщений — подождите пару минут.' });
    const { conversation: c, message } = store.add(sid, 'visitor', text, pageOf(b.page));
    seen.set(sid, Date.now());
    typing.delete(sid);
    events.emit(sid);
    notify('message', { sid, no: c.no, from: 'visitor' });
    json(res, 200, { ok: true, message });
  };

  const uploadFile = async (req, res, sid, from) => {
    const name = clean(decodeURIComponent(new URL(req.url, 'http://x').searchParams.get('name') ?? 'file'), 120);
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (!FILE_EXT.has(ext)) return json(res, 400, { ok: false, error: 'Такой тип файла не подходит. Подойдут картинки, PDF, AI, CDR, PSD, архивы.' });
    if (Number(req.headers['content-length'] ?? 0) > MAX_FILE) return json(res, 413, { ok: false, error: 'Файл больше 10 МБ.' });
    const buf = await readRaw(req, MAX_FILE);
    if (!buf.length) return json(res, 400, { ok: false, error: 'Пустой файл.' });
    const type = clean(req.headers['content-type'], 80) || 'application/octet-stream';
    const file = store.saveFile(sid, name, type, buf);
    const { conversation: c, message } = store.add(sid, from, '', undefined, file);
    events.emit(sid);
    if (from === 'visitor') notify('message', { sid, no: c.no, from });
    else panel.emit('event', { type: 'message', sid, no: c.no, from });
    json(res, 200, { ok: true, message });
  };

  const visitorFile = async (req, res, url) => {
    const sid = String(url.searchParams.get('sid') ?? '');
    if (!SID_RE.test(sid)) return json(res, 400, { ok: false });
    if (!uploads(ipOf(req))) return json(res, 429, { ok: false, error: 'Слишком много файлов — подождите немного.' });
    return uploadFile(req, res, sid, 'visitor');
  };

  const sendFile = (res, sid, id) => {
    const c = SID_RE.test(sid) ? store.get(sid) : null;
    const m = c?.messages.find((x) => x.id === id);
    const p = m?.file ? store.filePath(sid, m.file.path) : null;
    if (!p) return json(res, 404, { ok: false });
    const inline = INLINE.has(m.file.type);
    res.writeHead(200, {
      'content-type': inline ? m.file.type : 'application/octet-stream',
      'content-length': statSync(p).size,
      'content-disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(m.file.name)}`,
      'x-content-type-options': 'nosniff',
      'cache-control': 'private, max-age=86400',
    });
    createReadStream(p).pipe(res);
  };

  const messages = async (req, res, url) => {
    const sid = String(url.searchParams.get('sid') ?? '');
    const after = Number(url.searchParams.get('after') ?? 0) || 0;
    if (!SID_RE.test(sid)) return json(res, 400, { ok: false });
    if (store.get(sid)) {
      const first = !seen.has(sid) || Date.now() - seen.get(sid) > SEEN_MS;
      seen.set(sid, Date.now());
      if (first) panel.emit('event', { type: 'seen', sid });
    }
    const list = store.since(sid, after);
    const wait = url.searchParams.get('wait') !== '0';
    if (list.length || !wait || waiting > 800) return json(res, 200, { ok: true, messages: list, online: online() });
    waiting++;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      waiting--;
      clearTimeout(timer);
      events.off(sid, finish);
      if (!res.writableEnded) json(res, 200, { ok: true, messages: store.since(sid, after), online: online() });
    };
    const timer = setTimeout(finish, POLL_MS);
    events.on(sid, finish);
    req.on('close', finish);
  };

  const contact = async (req, res) => {
    const b = await readBody(req);
    const sid = String(b.sid ?? '');
    const value = clean(b.contact, 100);
    if (!SID_RE.test(sid) || value.length < 3) return json(res, 400, { ok: false, error: 'Укажите телефон или Telegram.' });
    if (!perIp(ipOf(req))) return json(res, 429, { ok: false });
    const c = store.setContact(sid, value);
    if (!c) return json(res, 404, { ok: false });
    panel.emit('event', { type: 'contact', sid });
    json(res, 200, { ok: true });
  };

  const visitorTyping = async (req, res) => {
    const b = await readBody(req);
    const sid = String(b.sid ?? '');
    if (SID_RE.test(sid) && store.get(sid)) {
      typing.set(sid, Date.now());
      panel.emit('event', { type: 'typing', sid });
    }
    json(res, 200, { ok: true });
  };

  const callback = async (req, res) => {
    const b = await readBody(req);
    if (b.hp) return json(res, 200, { ok: true });
    const phone = clean(b.phone, 30);
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return json(res, 400, { ok: false, error: 'Проверьте номер телефона.' });
    if (!callbacks(ipOf(req))) return json(res, 429, { ok: false, error: 'Заявка уже отправлена — мы скоро перезвоним.' });
    const cb = store.addCallback({ phone, name: clean(b.name, 60), page: pageOf(b.page) });
    notify('callback', { id: cb.id });
    json(res, 200, { ok: true });
  };

  // ---------------------------------------------------------------- panel
  const authed = (req) => auth.valid(cookieOf(req, COOKIE));

  const login = async (req, res) => {
    if (!logins(ipOf(req))) return json(res, 429, { ok: false, error: 'Слишком много попыток — подождите 15 минут.' });
    const b = await readBody(req);
    if (!passwordHash || !verifyPassword(String(b.password ?? ''), passwordHash)) return json(res, 401, { ok: false, error: 'Неверный пароль.' });
    const token = auth.create(req.headers['user-agent']);
    json(res, 200, { ok: true }, { 'set-cookie': sessionCookie(token, secureCookie) });
  };

  const chatList = () => {
    const t = Date.now();
    return store.list().map((c) => ({ ...c, online: t - (seen.get(c.id) ?? 0) < SEEN_MS, typing: t - (typing.get(c.id) ?? 0) < 6000 }));
  };

  const notifyText = () => {
    const chats = store.list();
    const unreadChats = chats.filter((c) => c.unread > 0);
    const unread = unreadChats.reduce((s, c) => s + c.unread, 0);
    const newCalls = store.callbacks().filter((x) => x.status === 'new');
    const latestCall = newCalls[0];
    const latestChat = unreadChats[0];
    if (latestCall && (!latestChat || latestCall.at > latestChat.lastAt))
      return { title: `📞 Перезвоните: ${latestCall.phone}`, body: [latestCall.name, latestCall.page].filter(Boolean).join(' · '), tag: `call-${latestCall.id}`, url: '/admin#calls', unread };
    if (latestChat)
      return { title: `💬 Чат №${latestChat.no}${latestChat.contact ? ` · ${latestChat.contact}` : ''}`, body: latestChat.last.text.slice(0, 180), tag: `chat-${latestChat.id}`, url: `/admin#chat-${latestChat.id}`, unread };
    return { title: 'Мастерская сувениров', body: 'Новых сообщений нет', tag: 'none', url: '/admin', unread: 0 };
  };

  const sse = (req, res) => {
    res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-store', connection: 'keep-alive', 'x-accel-buffering': 'no' });
    res.write('retry: 3000\n\n');
    const send = (e) => res.write(`data: ${JSON.stringify(e)}\n\n`);
    const ping = setInterval(() => res.write(': ping\n\n'), 20_000);
    panel.on('event', send);
    req.on('close', () => {
      clearInterval(ping);
      panel.off('event', send);
    });
  };

  const admin = async (req, res, url) => {
    const p = url.pathname;
    if (req.method === 'POST' && p === '/api/admin/login') return login(req, res);
    if (!authed(req)) return json(res, 401, { ok: false, error: 'Нужно войти.' });
    if (req.method === 'POST' && req.headers['x-msuv'] !== '1') return json(res, 403, { ok: false });

    if (req.method === 'POST' && p === '/api/admin/logout') {
      auth.drop(cookieOf(req, COOKIE));
      return json(res, 200, { ok: true }, { 'set-cookie': clearCookie(secureCookie) });
    }
    if (req.method === 'GET' && p === '/api/admin/me') return json(res, 200, { ok: true, online: online(), settings: store.settings() });
    if (req.method === 'GET' && p === '/api/admin/events') return sse(req, res);
    if (req.method === 'GET' && p === '/api/admin/notify') return json(res, 200, { ok: true, ...notifyText() });
    if (req.method === 'GET' && p === '/api/admin/chats') return json(res, 200, { ok: true, chats: chatList(), calls: store.callbacks().filter((x) => x.status === 'new').length });
    if (req.method === 'GET' && p === '/api/admin/file') return sendFile(res, String(url.searchParams.get('sid') ?? ''), Number(url.searchParams.get('id')));

    const chat = p.match(/^\/api\/admin\/chats\/([a-z0-9]{16,40})(\/reply|\/file|\/read)?$/);
    if (chat) {
      const [, sid, action] = chat;
      if (!store.get(sid)) return json(res, 404, { ok: false });
      if (req.method === 'GET' && !action) {
        const t = Date.now();
        return json(res, 200, { ok: true, chat: { ...store.get(sid), online: t - (seen.get(sid) ?? 0) < SEEN_MS } });
      }
      if (req.method === 'POST' && action === '/reply') {
        const b = await readBody(req);
        const text = clean(b.text, MAX_TEXT);
        if (!text) return json(res, 400, { ok: false });
        const { conversation: c, message } = store.add(sid, 'manager', text);
        events.emit(sid);
        panel.emit('event', { type: 'message', sid, no: c.no, from: 'manager' });
        return json(res, 200, { ok: true, message });
      }
      if (req.method === 'POST' && action === '/file') return uploadFile(req, res, sid, 'manager');
      if (req.method === 'POST' && action === '/read') {
        const b = await readBody(req);
        store.markRead(sid, Number(b.upTo) || 0);
        panel.emit('event', { type: 'read', sid });
        return json(res, 200, { ok: true });
      }
    }

    if (req.method === 'GET' && p === '/api/admin/callbacks') return json(res, 200, { ok: true, callbacks: store.callbacks() });
    const cbm = p.match(/^\/api\/admin\/callbacks\/(\d+)$/);
    if (req.method === 'POST' && cbm) {
      const b = await readBody(req);
      if (!['new', 'called', 'done'].includes(b.status)) return json(res, 400, { ok: false });
      const cb = store.setCallbackStatus(Number(cbm[1]), b.status);
      panel.emit('event', { type: 'callback-status' });
      return json(res, cb ? 200 : 404, { ok: !!cb });
    }

    if (p === '/api/admin/settings') {
      if (req.method === 'GET') return json(res, 200, { ok: true, settings: store.settings(), online: online() });
      const b = await readBody(req);
      if (!['auto', 'online', 'offline'].includes(b.status)) return json(res, 400, { ok: false });
      const s = store.setSettings({ status: b.status });
      panel.emit('event', { type: 'settings' });
      return json(res, 200, { ok: true, settings: s, online: online() });
    }
    if (p === '/api/admin/templates') {
      if (req.method === 'GET') return json(res, 200, { ok: true, list: store.templates() });
      const b = await readBody(req);
      const list = (Array.isArray(b.list) ? b.list : []).map((x) => clean(x, 500)).filter(Boolean).slice(0, 30);
      return json(res, 200, { ok: true, list: store.setTemplates(list) });
    }

    if (req.method === 'GET' && p === '/api/admin/push/key') return json(res, 200, { ok: true, key: vapid?.publicKey ?? '' });
    if (req.method === 'POST' && p === '/api/admin/push/subscribe') {
      const b = await readBody(req);
      const s = b.subscription;
      if (!s?.endpoint || !/^https:\/\//.test(s.endpoint)) return json(res, 400, { ok: false });
      const subs = store.pushSubs().filter((x) => x.endpoint !== s.endpoint);
      store.setPushSubs([...subs, { endpoint: s.endpoint, device: clean(b.device, 80), at: new Date().toISOString() }].slice(-20));
      return json(res, 200, { ok: true });
    }
    if (req.method === 'POST' && p === '/api/admin/push/test') {
      const sent = await pushAll({ vapid, store, fetch: f, log });
      return json(res, 200, { ok: true, sent });
    }
    json(res, 404, { ok: false });
  };

  return async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const p = url.pathname;
    try {
      if (p.startsWith('/api/admin/')) return await admin(req, res, url);
      if (req.method === 'POST' && p === '/api/chat/message') return await visitorMessage(req, res);
      if (req.method === 'POST' && p === '/api/chat/file') return await visitorFile(req, res, url);
      if (req.method === 'GET' && p === '/api/chat/messages') return await messages(req, res, url);
      if (req.method === 'GET' && p === '/api/chat/file') return sendFile(res, String(url.searchParams.get('sid') ?? ''), Number(url.searchParams.get('id')));
      if (req.method === 'POST' && p === '/api/chat/contact') return await contact(req, res);
      if (req.method === 'POST' && p === '/api/chat/typing') return await visitorTyping(req, res);
      if (req.method === 'GET' && p === '/api/chat/status') return json(res, 200, { ok: true, online: online() });
      if (req.method === 'POST' && p === '/api/callback') return await callback(req, res);
      if (req.method === 'GET' && p === '/api/health') return json(res, 200, { ok: true });
      json(res, 404, { ok: false });
    } catch (e) {
      log(`error ${p}: ${e.message}`);
      if (!res.headersSent) json(res, e.status ?? 400, { ok: false, error: e.status === 413 ? 'Файл больше 10 МБ.' : undefined });
    }
  };
};
