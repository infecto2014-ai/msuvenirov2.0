// Entry point of the site chat service. Runs on the site's server behind nginx (location /api/ → 127.0.0.1:CHAT_PORT).
// Settings come from environment variables (see deploy/chat/msuvenirov-chat.env.example and docs/DEPLOY.md):
//   TG_BOT_TOKEN        token of the chat bot (@BotFather)
//   TG_CHAT_ID          chat where messages arrive (your Telegram id or a group id)
//   TG_WEBHOOK_SECRET   random string, the same as in setWebhook (secret_token)
//   CHAT_DATA_DIR       where conversations are stored (default /var/lib/msuvenirov-chat)
//   CHAT_PORT           default 8787
// Without TG_BOT_TOKEN it runs in «dry run»: messages are printed to the log instead of Telegram (for testing).
import { createServer } from 'node:http';
import { createApp } from './app.mjs';
import { Store } from './store.mjs';
import { Telegram } from './telegram.mjs';

const env = process.env;
const port = Number(env.CHAT_PORT ?? 8787);
const store = new Store(env.CHAT_DATA_DIR ?? '/var/lib/msuvenirov-chat');
const tg = new Telegram({ token: env.TG_BOT_TOKEN, chatId: env.TG_CHAT_ID });
const app = createApp({ store, tg, webhookSecret: env.TG_WEBHOOK_SECRET ?? '', ownerChatId: env.TG_CHAT_ID ?? '' });

createServer(app).listen(port, '127.0.0.1', () => {
  console.log(`msuvenirov chat on 127.0.0.1:${port}${tg.dryRun ? ' (dry run: no Telegram token)' : ''}`);
});
