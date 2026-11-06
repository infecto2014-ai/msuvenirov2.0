// Entry point of the chat service. Runs on the site's server behind nginx (location /api/ → 127.0.0.1:CHAT_PORT).
// Settings come from /etc/msuvenirov-chat.env (written by `node server/chat/setup.mjs`, see docs/ЧАТ_ИНСТРУКЦИЯ.md):
//   ADMIN_PASSWORD_HASH   password of the panel /admin (scrypt hash)
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT   keys for notifications to phone and PC (Web Push)
//   CHAT_DATA_DIR         where conversations are stored (default /var/lib/msuvenirov-chat)
//   CHAT_PORT             default 8787
//   CHAT_INSECURE_COOKIE  «1» only for local testing over http
import { createServer } from 'node:http';
import { createApp } from './app.mjs';
import { Store } from './store.mjs';

const env = process.env;
const port = Number(env.CHAT_PORT ?? 8787);
const store = new Store(env.CHAT_DATA_DIR ?? '/var/lib/msuvenirov-chat');
const app = createApp({
  store,
  passwordHash: env.ADMIN_PASSWORD_HASH ?? '',
  vapid: env.VAPID_PUBLIC_KEY ? { publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY ?? '', subject: env.VAPID_SUBJECT ?? 'mailto:msuvenirov39@yandex.ru' } : undefined,
  secureCookie: env.CHAT_INSECURE_COOKIE !== '1',
});

createServer(app).listen(port, '127.0.0.1', () => {
  console.log(`msuvenirov chat on 127.0.0.1:${port}${env.ADMIN_PASSWORD_HASH ? '' : ' — WARNING: ADMIN_PASSWORD_HASH is empty, the panel login is closed'}`);
});
