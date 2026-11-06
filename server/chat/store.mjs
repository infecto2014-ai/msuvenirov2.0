// File storage for the site chat: one JSON file per conversation + a map «Telegram message → conversation».
// Small volume (a few dozen chats a day), so plain files are enough; every write is atomic (temp file + rename).
import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
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

export class Store {
  /** @param {string} dir data directory (created if missing) */
  constructor(dir) {
    this.dir = dir;
    this.chats = join(dir, 'chats');
    mkdirSync(this.chats, { recursive: true });
    this.mapFile = join(dir, 'tgmap.json');
    this.counterFile = join(dir, 'counter.json');
    this.callbacksFile = join(dir, 'callbacks.jsonl');
    /** @type {Record<string, string>} telegram message id → conversation id */
    this.tgmap = readJson(this.mapFile, {});
  }

  file(sid) {
    if (!SID_RE.test(sid)) throw new Error('bad sid');
    return join(this.chats, `${sid}.json`);
  }

  /** @returns {null | { id: string, no: number, createdAt: string, page?: string, contact?: string, messages: { id: number, from: 'visitor' | 'manager', text: string, at: string }[] }} */
  get(sid) {
    const f = this.file(sid);
    return existsSync(f) ? readJson(f, null) : null;
  }

  /** conversation for this visitor; created (with the next short number) on the first message */
  ensure(sid, page) {
    let c = this.get(sid);
    if (!c) {
      const n = readJson(this.counterFile, { last: 0 }).last + 1;
      writeJson(this.counterFile, { last: n });
      c = { id: sid, no: n, createdAt: new Date().toISOString(), page, messages: [] };
    }
    return c;
  }

  save(c) {
    writeJson(this.file(c.id), c);
  }

  /** adds a message and returns it */
  add(sid, from, text, page) {
    const c = this.ensure(sid, page);
    const m = { id: c.messages.length + 1, from, text, at: new Date().toISOString() };
    c.messages.push(m);
    if (page) c.lastPage = page;
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

  /** messages after the given id (ids start at 1) */
  since(sid, after) {
    const c = this.get(sid);
    return c ? c.messages.filter((m) => m.id > after) : [];
  }

  link(tgMessageId, sid) {
    this.tgmap[String(tgMessageId)] = sid;
    // keep the map small: only the last 5000 links are needed to reply
    const keys = Object.keys(this.tgmap);
    if (keys.length > 5000) for (const k of keys.slice(0, keys.length - 5000)) delete this.tgmap[k];
    writeJson(this.mapFile, this.tgmap);
  }

  byTelegram(tgMessageId) {
    return this.tgmap[String(tgMessageId)] ?? null;
  }

  addCallback(entry) {
    appendFileSync(this.callbacksFile, JSON.stringify({ ...entry, at: new Date().toISOString() }) + '\n');
  }
}
