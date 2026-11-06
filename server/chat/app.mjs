// HTTP handler of the site chat (owner, 06.11.2026: «свой аналог Jivo с отправкой в Telegram»).
//
//   POST /api/chat/message   { sid, text, page?, hp? }      visitor → server → Telegram
//   GET  /api/chat/messages  ?sid=…&after=N                   new messages (long polling, up to 25 s)
//   POST /api/chat/contact   { sid, contact }                 phone / Telegram left in the chat
//   POST /api/callback       { phone, name?, page?, hp? }     «Перезвоните мне»
//   POST /api/tg/webhook     Telegram update (secret header)  owner's reply → visitor
//
// The owner answers with Telegram's «Reply» on any message of a chat. `hp` is a honeypot field (bots fill it).
import { EventEmitter } from 'node:events';
import { SID_RE } from './store.mjs';

const MAX_BODY = 16 * 1024;
const MAX_TEXT = 2000;
const POLL_MS = 25_000;

const json = (res, status, data) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(data));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error('too large'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        reject(new Error('bad json'));
      }
    });
    req.on('error', reject);
  });

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

/**
 * @param {{ store: import('./store.mjs').Store, tg: import('./telegram.mjs').Telegram, webhookSecret?: string, ownerChatId?: string, log?: (s: string) => void }} o
 */
export const createApp = ({ store, tg, webhookSecret = '', ownerChatId = '', log = console.log }) => {
  const events = new EventEmitter();
  events.setMaxListeners(1000);
  const perIp = limiter(30, 10 * 60_000);
  const perSid = limiter(20, 10 * 60_000);
  const callbacks = limiter(3, 30 * 60_000);
  let waiting = 0;

  const ipOf = (req) => String(req.headers['x-real-ip'] ?? req.socket.remoteAddress ?? '');

  const visitorMessage = async (req, res) => {
    const b = await readBody(req);
    if (b.hp) return json(res, 200, { ok: true }); // honeypot: pretend it worked
    const sid = String(b.sid ?? '');
    const text = clean(b.text, MAX_TEXT);
    if (!SID_RE.test(sid) || !text) return json(res, 400, { ok: false, error: 'Напишите сообщение.' });
    if (!perIp(ipOf(req)) || !perSid(sid)) return json(res, 429, { ok: false, error: 'Слишком много сообщений — подождите пару минут.' });
    const page = pageOf(b.page);
    const first = !store.get(sid);
    const { conversation: c, message } = store.add(sid, 'visitor', text, page);
    const head = `💬 Чат №${c.no} · ${page}${c.contact ? `\n📇 ${c.contact}` : ''}`;
    const tail = first ? '\n\n↩️ Ответьте на это сообщение (кнопка «Ответить») — ответ появится в чате на сайте.' : '';
    try {
      const id = await tg.send(`${head}\n\n${text}${tail}`);
      store.link(id, sid);
    } catch (e) {
      log(`telegram send failed: ${e.message}`);
    }
    events.emit(sid);
    json(res, 200, { ok: true, message });
  };

  const messages = async (req, res, url) => {
    const sid = String(url.searchParams.get('sid') ?? '');
    const after = Number(url.searchParams.get('after') ?? 0) || 0;
    if (!SID_RE.test(sid)) return json(res, 400, { ok: false });
    const now = store.since(sid, after);
    const wait = url.searchParams.get('wait') !== '0';
    if (now.length || !wait || waiting > 800) return json(res, 200, { ok: true, messages: now });
    waiting++;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      waiting--;
      clearTimeout(timer);
      events.off(sid, finish);
      if (!res.writableEnded) json(res, 200, { ok: true, messages: store.since(sid, after) });
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
    try {
      const id = await tg.send(`📇 Чат №${c.no}: оставили контакт — ${value}`);
      store.link(id, sid);
    } catch (e) {
      log(`telegram send failed: ${e.message}`);
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
    const name = clean(b.name, 60);
    const page = pageOf(b.page);
    store.addCallback({ phone, name, page });
    try {
      await tg.send(`📞 Перезвоните: ${phone}${name ? ` · ${name}` : ''}\nСтраница: ${page}`);
    } catch (e) {
      log(`telegram send failed: ${e.message}`);
    }
    json(res, 200, { ok: true });
  };

  const webhook = async (req, res) => {
    if (webhookSecret && req.headers['x-telegram-bot-api-secret-token'] !== webhookSecret) return json(res, 401, { ok: false });
    const u = await readBody(req);
    json(res, 200, { ok: true }); // Telegram only needs a quick 200
    const m = u.message;
    if (!m || (ownerChatId && String(m.chat?.id) !== String(ownerChatId))) return;
    const replyTo = m.reply_to_message?.message_id;
    const sid = replyTo ? store.byTelegram(replyTo) : null;
    const text = clean(m.text ?? m.caption, MAX_TEXT);
    if (!sid) {
      if (text && !text.startsWith('/')) await tg.replyTo(m.chat.id, m.message_id, 'Чтобы ответить посетителю, нажмите «Ответить» на его сообщении из чата.').catch(() => {});
      return;
    }
    if (!text) {
      await tg.replyTo(m.chat.id, m.message_id, 'Файлы в чат пока не отправляются — напишите ответ текстом.').catch(() => {});
      return;
    }
    store.add(sid, 'manager', text);
    store.link(m.message_id, sid); // a reply to the owner's own answer also goes to this chat
    events.emit(sid);
    await tg.react(m.chat.id, m.message_id);
  };

  return async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    try {
      if (req.method === 'POST' && url.pathname === '/api/chat/message') return await visitorMessage(req, res);
      if (req.method === 'GET' && url.pathname === '/api/chat/messages') return await messages(req, res, url);
      if (req.method === 'POST' && url.pathname === '/api/chat/contact') return await contact(req, res);
      if (req.method === 'POST' && url.pathname === '/api/callback') return await callback(req, res);
      if (req.method === 'POST' && url.pathname === '/api/tg/webhook') return await webhook(req, res);
      if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok: true });
      json(res, 404, { ok: false });
    } catch (e) {
      log(`error ${url.pathname}: ${e.message}`);
      if (!res.headersSent) json(res, 400, { ok: false });
    }
  };
};
