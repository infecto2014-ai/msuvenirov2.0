// Login to the chat panel: one owner, password stored as a scrypt hash in the env file (ADMIN_PASSWORD_HASH),
// sessions kept in the data dir (only a SHA-256 of the token), cookie HttpOnly + Secure + SameSite=Strict.
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const N = 16384;
const R = 8;
const P = 1;
export const COOKIE = 'msuv_admin';
const SESSION_DAYS = 60;

/** «scrypt$16384$8$1$<salt>$<hash>» */
export const hashPassword = (password) => {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${hash.toString('base64')}`;
};

export const verifyPassword = (password, stored) => {
  const parts = String(stored ?? '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, r, p, salt, hash] = parts;
  const expected = Buffer.from(hash, 'base64');
  const got = scryptSync(String(password), Buffer.from(salt, 'base64'), expected.length, { N: Number(n), r: Number(r), p: Number(p) });
  return got.length === expected.length && timingSafeEqual(got, expected);
};

const sha = (s) => createHash('sha256').update(s).digest('hex');

export const cookieOf = (req, name = COOKIE) => {
  const raw = String(req.headers.cookie ?? '');
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return '';
};

/** @param {import('./store.mjs').Store} store */
export const sessions = (store, now = () => Date.now()) => ({
  create(meta = '') {
    const token = randomBytes(32).toString('hex');
    const map = store.sessions();
    const t = now();
    for (const [k, v] of Object.entries(map)) if (v.exp < t) delete map[k];
    map[sha(token)] = { exp: t + SESSION_DAYS * 864e5, meta: String(meta).slice(0, 120) };
    store.setSessions(map);
    return token;
  },
  valid(token) {
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
    const s = store.sessions()[sha(token)];
    return !!s && s.exp > now();
  },
  drop(token) {
    const map = store.sessions();
    delete map[sha(token)];
    store.setSessions(map);
  },
  dropAll() {
    store.setSessions({});
  },
});

export const sessionCookie = (token, secure = true) =>
  `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DAYS * 86400}${secure ? '; Secure' : ''}`;
export const clearCookie = (secure = true) => `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`;
