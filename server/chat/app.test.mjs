// Tests of the site chat service: a real HTTP server on a random port, files in a temp dir, a fake Telegram.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer } from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp, limiter } from './app.mjs';
import { Store } from './store.mjs';

const sent = [];
const reactions = [];
const replies = [];
let nextId = 500;
const tg = {
  send: async (text) => {
    sent.push(text);
    return ++nextId;
  },
  react: async (chatId, messageId) => reactions.push(messageId),
  replyTo: async (chatId, messageId, text) => replies.push(text),
};

let dir, server, base;
const SID = 'abcdefghijklmnop1234';
const OWNER = '777';
const SECRET = 'secret_A';

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), 'chat-'));
  const app = createApp({ store: new Store(dir), tg, webhookSecret: SECRET, ownerChatId: OWNER, log: () => {} });
  server = createServer(app);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
afterAll(() => {
  server.close();
  rmSync(dir, { recursive: true, force: true });
});

const post = (path, body, headers = {}) =>
  fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) }).then(async (r) => ({ status: r.status, body: await r.json() }));
const hook = (message) => post('/api/tg/webhook', { update_id: 1, message }, { 'x-telegram-bot-api-secret-token': SECRET });

describe('site chat', () => {
  it('a visitor message is stored and sent to Telegram with the chat number and page', async () => {
    const r = await post('/api/chat/message', { sid: SID, text: 'Сколько стоят 10 кружек?', page: 'https://msuvenirov.ru/pechat-na-kruzhkah' });
    expect(r.status).toBe(200);
    expect(r.body.message).toMatchObject({ id: 1, from: 'visitor', text: 'Сколько стоят 10 кружек?' });
    expect(sent.at(-1)).toContain('💬 Чат №1 · /pechat-na-kruzhkah');
    expect(sent.at(-1)).toContain('Ответьте на это сообщение');
  });

  it('the owner replies in Telegram → the reply reaches a waiting visitor (long polling)', async () => {
    const waiting = fetch(`${base}/api/chat/messages?sid=${SID}&after=1`).then((r) => r.json());
    await new Promise((r) => setTimeout(r, 50));
    const r = await hook({ message_id: 900, chat: { id: Number(OWNER) }, text: 'Здравствуйте! 10 кружек — 3500 ₽.', reply_to_message: { message_id: nextId } });
    expect(r.status).toBe(200);
    const got = await waiting;
    expect(got.messages).toEqual([expect.objectContaining({ id: 2, from: 'manager', text: 'Здравствуйте! 10 кружек — 3500 ₽.' })]);
    expect(reactions).toContain(900);
  });

  it('a second visitor message does not repeat the hint; the owner can reply to his own answer', async () => {
    await post('/api/chat/message', { sid: SID, text: 'А за сколько дней?' });
    expect(sent.at(-1)).not.toContain('Ответьте на это сообщение');
    await hook({ message_id: 901, chat: { id: Number(OWNER) }, text: 'За 1–2 дня.', reply_to_message: { message_id: 900 } });
    const r = await fetch(`${base}/api/chat/messages?sid=${SID}&after=3&wait=0`).then((x) => x.json());
    expect(r.messages.map((m) => m.text)).toEqual(['За 1–2 дня.']);
  });

  it('webhook: wrong secret, other chats and replies without a chat are ignored', async () => {
    const bad = await post('/api/tg/webhook', { message: { message_id: 1, chat: { id: OWNER }, text: 'x' } }, { 'x-telegram-bot-api-secret-token': 'nope' });
    expect(bad.status).toBe(401);
    await hook({ message_id: 902, chat: { id: 123 }, text: 'чужой чат', reply_to_message: { message_id: 900 } });
    await hook({ message_id: 903, chat: { id: Number(OWNER) }, text: 'просто текст' });
    expect(replies.at(-1)).toContain('нажмите «Ответить»');
    const r = await fetch(`${base}/api/chat/messages?sid=${SID}&after=0&wait=0`).then((x) => x.json());
    expect(r.messages).toHaveLength(4);
  });

  it('contact and callback go to Telegram; bad input is rejected; honeypot is silently dropped', async () => {
    expect((await post('/api/chat/contact', { sid: SID, contact: '+7 900 000-00-00' })).status).toBe(200);
    expect(sent.at(-1)).toContain('📇 Чат №1');
    expect((await post('/api/callback', { phone: '12' })).status).toBe(400);
    const before = sent.length;
    expect((await post('/api/callback', { phone: '+7 900 111-22-33', hp: 'bot' })).status).toBe(200);
    expect(sent.length).toBe(before);
    expect((await post('/api/callback', { phone: '+7 900 111-22-33', name: 'Анна', page: '/znachki' })).status).toBe(200);
    expect(sent.at(-1)).toBe('📞 Перезвоните: +7 900 111-22-33 · Анна\nСтраница: /znachki');
    expect((await post('/api/chat/message', { sid: 'bad sid', text: 'x' })).status).toBe(400);
    expect((await post('/api/chat/message', { sid: SID, text: '   ' })).status).toBe(400);
  });

  it('the limiter blocks after the limit and frees after the window', () => {
    let t = 0;
    const l = limiter(2, 1000, () => t);
    expect([l('a'), l('a'), l('a')]).toEqual([true, true, false]);
    t = 1500;
    expect(l('a')).toBe(true);
  });
});
