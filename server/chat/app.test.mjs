// Tests of the chat service: a real HTTP server on a random port, files in a temp dir, a fake push service.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer } from 'node:http';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { verify } from 'node:crypto';
import { createApp, limiter } from './app.mjs';
import { Store } from './store.mjs';
import { hashPassword, verifyPassword } from './auth.mjs';
import { generateVapid, vapidJwt, vapidPublicKeyObject } from './push.mjs';

const pushes = [];
const fakeFetch = async (url, init) => {
  pushes.push({ url, init });
  return { ok: true, status: 201 };
};

let dir, server, base, cookie;
const SID = 'abcdefghijklmnop1234';
const PASSWORD = 'секретный-пароль-1';
const vapid = { ...generateVapid(), subject: 'mailto:test@example.com' };

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), 'chat-'));
  const app = createApp({ store: new Store(dir), passwordHash: hashPassword(PASSWORD), vapid, secureCookie: false, fetch: fakeFetch, log: () => {} });
  server = createServer(app);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
afterAll(() => {
  server.close();
  rmSync(dir, { recursive: true, force: true });
});

const req = (path, { method = 'GET', body, headers = {}, raw } = {}) =>
  fetch(base + path, {
    method,
    headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(cookie ? { cookie } : {}), ...headers },
    body: raw ?? (body ? JSON.stringify(body) : undefined),
  });
const j = async (r) => ({ status: r.status, body: await r.json() });
const post = (path, body, headers = {}) => req(path, { method: 'POST', body, headers: { 'x-msuv': '1', ...headers } }).then(j);
const get = (path) => req(path).then(j);

describe('chat service', () => {
  it('password hash: right password passes, wrong fails', () => {
    const h = hashPassword('qwerty123');
    expect(verifyPassword('qwerty123', h)).toBe(true);
    expect(verifyPassword('qwerty124', h)).toBe(false);
    expect(verifyPassword('x', 'garbage')).toBe(false);
  });

  it('the panel is closed without login; a wrong password is rejected; the right one sets a cookie', async () => {
    expect((await get('/api/admin/chats')).status).toBe(401);
    expect((await post('/api/admin/login', { password: 'неверный' })).status).toBe(401);
    const r = await req('/api/admin/login', { method: 'POST', body: { password: PASSWORD } });
    expect(r.status).toBe(200);
    const set = r.headers.get('set-cookie');
    expect(set).toMatch(/msuv_admin=[a-f0-9]{64}; Path=\/; HttpOnly; SameSite=Strict/);
    cookie = set.split(';')[0];
    expect((await get('/api/admin/me')).body.ok).toBe(true);
  });

  it('a visitor message appears in the panel as unread and triggers a push to the owner devices', async () => {
    await post('/api/admin/push/subscribe', { subscription: { endpoint: 'https://push.example.com/abc' }, device: 'Телефон' });
    pushes.length = 0;
    const r = await post('/api/chat/message', { sid: SID, text: 'Сколько стоят 10 кружек?', page: 'https://msuvenirov.ru/pechat-na-kruzhkah' });
    expect(r.body.message).toMatchObject({ id: 1, from: 'visitor' });
    const list = (await get('/api/admin/chats')).body.chats;
    expect(list[0]).toMatchObject({ id: SID, no: 1, unread: 1, page: '/pechat-na-kruzhkah', last: { text: 'Сколько стоят 10 кружек?' } });
    await new Promise((x) => setTimeout(x, 30));
    expect(pushes).toHaveLength(1);
    expect(pushes[0].url).toBe('https://push.example.com/abc');
    expect(pushes[0].init.headers.Authorization).toMatch(/^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=/);
    const n = (await get('/api/admin/notify')).body;
    expect(n.title).toBe('💬 Чат №1');
    expect(n.body).toBe('Сколько стоят 10 кружек?');
  });

  it('the owner replies from the panel → a waiting visitor gets it; the chat becomes read', async () => {
    const waiting = fetch(`${base}/api/chat/messages?sid=${SID}&after=1`).then((x) => x.json());
    await new Promise((x) => setTimeout(x, 50));
    const r = await post(`/api/admin/chats/${SID}/reply`, { text: 'Здравствуйте! 10 кружек — 3500 ₽.' });
    expect(r.status).toBe(200);
    const got = await waiting;
    expect(got.messages).toEqual([expect.objectContaining({ id: 2, from: 'manager', text: 'Здравствуйте! 10 кружек — 3500 ₽.' })]);
    expect((await get('/api/admin/chats')).body.chats[0].unread).toBe(0);
  });

  it('files: visitor uploads an image, the owner downloads it; bad types are refused; other sids cannot read it', async () => {
    const png = Buffer.from('89504e470d0a1a0a', 'hex');
    const up = await req(`/api/chat/file?sid=${SID}&name=${encodeURIComponent('макет.png')}`, { method: 'POST', raw: png, headers: { 'content-type': 'image/png' } }).then(j);
    expect(up.body.message.file).toMatchObject({ name: 'макет.png', type: 'image/png', size: 8 });
    const id = up.body.message.id;
    const dl = await req(`/api/admin/file?sid=${SID}&id=${id}`);
    expect(dl.headers.get('content-type')).toBe('image/png');
    expect(Buffer.from(await dl.arrayBuffer()).equals(png)).toBe(true);
    expect((await req(`/api/chat/file?sid=zzzzzzzzzzzzzzzz0000&id=${id}`)).status).toBe(404);
    const bad = await req(`/api/chat/file?sid=${SID}&name=virus.exe`, { method: 'POST', raw: Buffer.from('x') }).then(j);
    expect(bad.status).toBe(400);
  });

  it('callbacks: stored as «new», shown in the panel, status can be changed', async () => {
    expect((await post('/api/callback', { phone: '12' })).status).toBe(400);
    expect((await post('/api/callback', { phone: '+7 900 111-22-33', hp: 'bot' })).status).toBe(200); // honeypot
    expect((await post('/api/callback', { phone: '+7 900 111-22-33', name: 'Анна', page: '/znachki' })).status).toBe(200);
    const list = (await get('/api/admin/callbacks')).body.callbacks;
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ phone: '+7 900 111-22-33', name: 'Анна', page: '/znachki', status: 'new' });
    expect((await get('/api/admin/notify')).body.title).toBe('📞 Перезвоните: +7 900 111-22-33');
    expect((await post(`/api/admin/callbacks/${list[0].id}`, { status: 'called' })).status).toBe(200);
    expect((await get('/api/admin/callbacks')).body.callbacks[0].status).toBe('called');
  });

  it('online status: the owner switches it, the widget sees it', async () => {
    await post('/api/admin/settings', { status: 'offline' });
    expect((await get('/api/chat/status')).body.online).toBe(false);
    await post('/api/admin/settings', { status: 'online' });
    expect((await get('/api/chat/status')).body.online).toBe(true);
  });

  it('panel POST without the x-msuv header is refused (protection from other sites); logout closes the session', async () => {
    const r = await req(`/api/admin/chats/${SID}/reply`, { method: 'POST', body: { text: 'x' } });
    expect(r.status).toBe(403);
    expect((await post('/api/admin/logout', {})).status).toBe(200);
    expect((await get('/api/admin/chats')).status).toBe(401);
  });

  it('VAPID token is a valid ES256 JWT for the push service origin', () => {
    const t = vapidJwt(vapid, 'https://fcm.googleapis.com');
    const [h, c, s] = t.split('.');
    expect(JSON.parse(Buffer.from(c, 'base64url').toString())).toMatchObject({ aud: 'https://fcm.googleapis.com', sub: 'mailto:test@example.com' });
    const ok = verify('sha256', Buffer.from(`${h}.${c}`), { key: vapidPublicKeyObject(vapid.publicKey), dsaEncoding: 'ieee-p1363' }, Buffer.from(s, 'base64url'));
    expect(ok).toBe(true);
    expect(Buffer.from(vapid.publicKey, 'base64url')).toHaveLength(65);
  });

  it('setup.mjs writes the env file with a working password hash and push keys', () => {
    const env = join(dir, 'test.env');
    execFileSync(process.execPath, [join(import.meta.dirname, 'setup.mjs'), '--env', env, '--password', 'пароль-12345']);
    const vars = Object.fromEntries(readFileSync(env, 'utf8').split('\n').filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
    expect(verifyPassword('пароль-12345', vars.ADMIN_PASSWORD_HASH)).toBe(true);
    expect(vars.VAPID_PUBLIC_KEY).toMatch(/^[\w-]{87}$/);
    // running again keeps the push keys (devices stay subscribed)
    execFileSync(process.execPath, [join(import.meta.dirname, 'setup.mjs'), '--env', env, '--password', 'другой-пароль']);
    expect(readFileSync(env, 'utf8')).toContain(`VAPID_PUBLIC_KEY=${vars.VAPID_PUBLIC_KEY}`);
  });

  it('the limiter blocks after the limit and frees after the window', () => {
    let t = 0;
    const l = limiter(2, 1000, () => t);
    expect([l('a'), l('a'), l('a')]).toEqual([true, true, false]);
    t = 1500;
    expect(l('a')).toBe(true);
  });
});
