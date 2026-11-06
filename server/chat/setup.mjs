// One-time setup of the chat panel: asks for the panel password and writes /etc/msuvenirov-chat.env
// (password hash + keys for notifications). Run on the server as root:
//   node /var/www/msuvenirov.ru/server/chat/setup.mjs
// Run it again any time to change the password (the notification keys are kept).
// Options: --env <file> (default /etc/msuvenirov-chat.env), --password <p> (no prompt; for scripts/tests).
import { chmodSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { hashPassword } from './auth.mjs';
import { generateVapid } from './push.mjs';

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const file = arg('--env') ?? '/etc/msuvenirov-chat.env';

const ask = (q, hidden) =>
  new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muted = false; // the typed password is not shown on the screen
    rl._writeToOutput = (str) => {
      if (!muted) rl.output.write(str);
    };
    rl.question(q, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer);
    });
    muted = hidden;
  });

const old = existsSync(file) ? Object.fromEntries(readFileSync(file, 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)])) : {};

let password = arg('--password');
while (!password) {
  const a = await ask('Придумайте пароль для панели чата (не короче 8 символов): ', true);
  if (a.length < 8) {
    console.log('Слишком короткий — нужно хотя бы 8 символов.');
    continue;
  }
  const b = await ask('Повторите пароль: ', true);
  if (a !== b) {
    console.log('Пароли не совпали, попробуйте ещё раз.');
    continue;
  }
  password = a;
}

const vapid = old.VAPID_PUBLIC_KEY && old.VAPID_PRIVATE_KEY ? { publicKey: old.VAPID_PUBLIC_KEY, privateKey: old.VAPID_PRIVATE_KEY } : generateVapid();
const env = {
  ...old,
  ADMIN_PASSWORD_HASH: hashPassword(password),
  VAPID_PUBLIC_KEY: vapid.publicKey,
  VAPID_PRIVATE_KEY: vapid.privateKey,
  VAPID_SUBJECT: old.VAPID_SUBJECT ?? 'mailto:msuvenirov39@yandex.ru',
  CHAT_PORT: old.CHAT_PORT ?? '8787',
  CHAT_DATA_DIR: old.CHAT_DATA_DIR ?? '/var/lib/msuvenirov-chat',
};
writeFileSync(file, '# Chat panel settings (written by server/chat/setup.mjs). Keep private.\n' + Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n') + '\n');
chmodSync(file, 0o600);
console.log(`Готово: настройки записаны в ${file}.`);
console.log('Перезапустите чат: systemctl restart msuvenirov-chat');
