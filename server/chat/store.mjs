// File storage of the chat service: one JSON file per conversation, uploaded files next to it, small JSON files for
// callbacks, settings, quick replies, push subscriptions and sessions. Small volume (a few dozen chats a day), so
// plain files are enough; every write is atomic (temp file + rename).
import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';

export const SID_RE = /^[a-z0-9]{16,40}$/;

const readJson = (file, fallback) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
};
const writeJson = (file, data) => {
  const tmp = `${file}.${randomBytes(4).toString('hex')}.tmp`;
  writeFileSync(tmp, JSON.stringify(data));
  renameSync(tmp, file);
};

/**
 * @typedef {{ name: string, type: string, size: number, path: string }} FileInfo
 * @typedef {{ id: number, from: 'visitor' | 'manager', text: string, at: string, file?: FileInfo }} Message
 * @typedef {{ id: string, no: number, createdAt: string, page?: string, lastPage?: string, contact?: string, readUpTo: number, messages: Message[] }} Conversation
 * @typedef {{ id: number, phone: string, name: string, page: string, at: string, status: 'new' | 'called' | 'done' }} Callback
 */

export class Store {
  /** @param {string} dir data directory (created if missing) */
  constructor(dir) {
    this.dir = dir;
    this.chats = join(dir, 'chats');
    this.files = join(dir, 'files');
    mkdirSync(this.chats, { recursive: true });
    mkdirSync(this.files, { recursive: true });
    this.f = (name) => join(dir, name);
  }

  // ---------------------------------------------------------------- conversations
  file(sid) {
    if (!SID_RE.test(sid)) throw new Error('bad sid');
    return join(this.chats, `${sid}.json`);
  }

  /** @returns {Conversation | null} */
  get(sid) {
    const f = this.file(sid);
    if (!existsSync(f)) return null;
    const c = readJson(f, null);
    if (c && c.readUpTo === undefined) c.readUpTo = 0;
    return c;
  }

  /** conversation for this visitor; created (with the next short number) on the first message */
  ensure(sid, page) {
    let c = this.get(sid);
    if (!c) {
      const counter = readJson(this.f('counter.json'), { last: 0 });
      const n = counter.last + 1;
      writeJson(this.f('counter.json'), { last: n });
      c = { id: sid, no: n, createdAt: new Date().toISOString(), page, readUpTo: 0, messages: [] };
    }
    return c;
  }

  save(c) {
    writeJson(this.file(c.id), c);
  }

  /** adds a message and returns it; `file` — an already stored upload */
  add(sid, from, text, page, file) {
    const c = this.ensure(sid, page);
    /** @type {Message} */
    const m = { id: c.messages.length + 1, from, text, at: new Date().toISOString(), ...(file ? { file } : {}) };
    c.messages.push(m);
    if (page) c.lastPage = page;
    if (from === 'manager') c.readUpTo = m.id; // answering means everything above was read
    this.save(c);
    return { conversation: c, message: m };
  }

  setContact(sid, contact) {
    const c = this.get(sid);
    if (!c) return null;
    c.contact = contact;
    this.save(c);
    return c;
  }

  markRead(sid, upTo) {
    const c = this.get(sid);
    if (!c) return null;
    c.readUpTo = Math.max(c.readUpTo, Math.min(upTo, c.messages.length));
    this.save(c);
    return c;
  }

  /** messages after the given id (ids start at 1) */
  since(sid, after) {
    const c = this.get(sid);
    return c ? c.messages.filter((m) => m.id > after) : [];
  }

  /** all conversations, newest activity first (summaries for the panel list) */
  list() {
    const out = [];
    for (const name of readdirSync(this.chats)) {
      if (!name.endsWith('.json')) continue;
      const c = readJson(join(this.chats, name), null);
      if (!c || !c.messages?.length) continue;
      const last = c.messages[c.messages.length - 1];
      const unread = c.messages.filter((m) => m.from === 'visitor' && m.id > (c.readUpTo ?? 0)).length;
      out.push({
        id: c.id,
        no: c.no,
        contact: c.contact ?? '',
        page: c.lastPage ?? c.page ?? '/',
        createdAt: c.createdAt,
        lastAt: last.at,
        last: { from: last.from, text: last.text || (last.file ? `📎 ${last.file.name}` : '') },
        unread,
        count: c.messages.length,
      });
    }
    return out.sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
  }

  // ---------------------------------------------------------------- uploads
  /** stores an uploaded file of a conversation and returns its info */
  saveFile(sid, name, type, buf) {
    if (!SID_RE.test(sid)) throw new Error('bad sid');
    const dir = join(this.files, sid);
    mkdirSync(dir, { recursive: true });
    const safe = name.replace(/[^\p{L}\p{N}._ -]+/gu, '_').slice(-80) || 'file';
    const path = `${Date.now().toString(36)}-${randomBytes(3).toString('hex')}-${safe}`;
    writeFileSync(join(dir, path), buf);
    return { name: safe, type, size: buf.length, path };
  }

  filePath(sid, path) {
    if (!SID_RE.test(sid) || !/^[\p{L}\p{N}._ -]+$/u.test(path) || path.includes('..')) return null;
    const p = join(this.files, sid, path);
    return existsSync(p) ? p : null;
  }

  // ---------------------------------------------------------------- callbacks («Перезвоните мне»)
  /** @returns {Callback[]} */
  callbacks() {
    return readJson(this.f('callbacks.json'), []);
  }

  addCallback({ phone, name, page }) {
    const list = this.callbacks();
    const cb = { id: (list[0]?.id ?? 0) + 1, phone, name, page, at: new Date().toISOString(), status: 'new' };
    writeJson(this.f('callbacks.json'), [cb, ...list].slice(0, 2000));
    return cb;
  }

  setCallbackStatus(id, status) {
    const list = this.callbacks();
    const cb = list.find((x) => x.id === id);
    if (!cb) return null;
    cb.status = status;
    writeJson(this.f('callbacks.json'), list);
    return cb;
  }

  // ---------------------------------------------------------------- settings, quick replies, push, sessions
  settings() {
    return { status: 'auto', ...readJson(this.f('settings.json'), {}) };
  }

  setSettings(patch) {
    const s = { ...this.settings(), ...patch };
    writeJson(this.f('settings.json'), s);
    return s;
  }

  templates() {
    return readJson(this.f('templates.json'), [
      'Здравствуйте! Сейчас посчитаем и напишем.',
      'Пришлите, пожалуйста, макет или картинку в хорошем качестве — сюда в чат или на почту.',
      'Сделаем за 1–2 дня после согласования макета. Забрать можно в ТЦ «Экватор».',
      'Оставьте, пожалуйста, телефон — перезвоним и всё уточним.',
    ]);
  }

  setTemplates(list) {
    writeJson(this.f('templates.json'), list);
    return list;
  }

  pushSubs() {
    return readJson(this.f('push.json'), []);
  }

  setPushSubs(list) {
    writeJson(this.f('push.json'), list);
  }

  sessions() {
    return readJson(this.f('sessions.json'), {});
  }

  setSessions(map) {
    writeJson(this.f('sessions.json'), map);
  }
}
