# Выкладка нового сайта msuvenirov.ru: безопасность и деплой

Пошаговая инструкция для владельца. Выполняйте по порядку. Значения секретов в этот файл
и в git не записывайте — везде ниже стоят заглушки `<...>`.

## 0. Перед началом

- Нужен доступ к проекту Supabase (`iqcolrciqeokfsnweoej`) и к серверу по SSH под root.
- Установите Supabase CLI и войдите: `supabase login`, затем `supabase link --project-ref iqcolrciqeokfsnweoej`.

## 1. Миграция базы данных

Файл: `supabase/migrations/20261031120000_security_hardening.sql`. Что делает:
создаёт закрытую таблицу `orders` (заявки), запрещает анонимную вставку в `reviews`,
добавляет проверки длины/рейтинга (`NOT VALID`, старые строки не трогаются),
закрывает публичное чтение `promo_codes`.

Способ А — панель Supabase: Dashboard → SQL Editor → вставить содержимое файла → Run.

Способ Б — CLI: `supabase db push`.

Миграция идемпотентна: повторный запуск безопасен.

## 2. Секреты функций

Задайте новые секреты (значения придумайте сами, длинные и случайные):

```bash
# случайная строка для секретов:  openssl rand -hex 32
supabase secrets set TELEGRAM_WEBHOOK_SECRET=<случайная_строка_A>
supabase secrets set INTERNAL_FUNCTION_SECRET=<случайная_строка_B>
supabase secrets set TELEGRAM_ADMIN_IDS=<ваш_telegram_id>,<id_второго_админа>
```

- `TELEGRAM_WEBHOOK_SECRET` — только латиница, цифры, `_` и `-`, до 256 символов (требование Telegram).
- `TELEGRAM_ADMIN_IDS` — числовые Telegram ID людей, которые могут одобрять/отклонять отзывы
  (узнать свой ID можно у бота @userinfobot). Если пусто — никто не сможет модерировать.
- Уже существующие `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` остаются как есть.
  `SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` Supabase подставляет автоматически.

Проверить список (значения не показываются): `supabase secrets list`.

## 3. Деплой edge-функций

```bash
supabase functions deploy send-telegram
supabase functions deploy telegram-review-webhook
supabase functions deploy notify-review
supabase functions deploy verify-promo
```

Для `telegram-review-webhook` в `supabase/config.toml` уже стоит `verify_jwt = false`
(Telegram не присылает JWT; защита — секретный заголовок).

Важно: `notify-review` теперь принимает только `review_id` и заголовок
`x-internal-secret: <INTERNAL_FUNCTION_SECRET>`. На новом сайте формы отзывов нет, поэтому
вызывать функцию может только серверная часть (например, триггер БД). Отзывы теперь добавляются
вручную через Dashboard / service role.

## 4. Перерегистрация вебхука Telegram (с секретом)

Без `secret_token` модерация отзывов перестанет работать (функция вернёт 403).

```bash
curl -sS "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -d "url=https://iqcolrciqeokfsnweoej.supabase.co/functions/v1/telegram-review-webhook" \
  -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>" \
  -d 'allowed_updates=["callback_query"]'
```

Проверка: `curl -sS "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo"` —
в ответе `url` верный, `last_error_message` пустой. Не публикуйте токен бота в чатах и логах.

## 5. Файл `.env` и git

Секреты не должны лежать в репозитории. `.env`/`.env.*` уже добавлены в `.gitignore`
(кроме `.env.example`, где только имена переменных `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`).
Осталось убрать уже закоммиченный `.env` из индекса (сам файл на диске останется):

```bash
git rm --cached .env
git commit -m "Remove .env from git"
```

Затем создайте локальный `.env` по образцу `.env.example`. Ключ `anon`/publishable публичен по
своей природе, но если в истории git лежали другие ключи (`service_role` и т.п.) — перевыпустите их
в Supabase (Settings → API) и обновите секреты.

## 6. Node.js на сервере

Новая сборка (Astro) требует **Node ≥ 18.20.8**. На сервере:

```bash
node -v
```

Если версия ниже — обновите Node (например, через nodesource или nvm) ДО следующего деплоя,
иначе `npm run build` в GitHub Actions упадёт.

## 7. GitHub Actions

Workflow `.github/workflows/deploy.yml` сделан безопаснее (минимальные права, один деплой за раз).
Рекомендуется добавить секрет репозитория `SSH_KNOWN_HOSTS` (защита от подмены сервера):

```bash
ssh-keyscan -p <SSH_PORT> <SSH_HOST>
```

Вывод целиком вставьте в Settings → Secrets and variables → Actions → New repository secret
`SSH_KNOWN_HOSTS`. Без него используется прежний `ssh-keyscan` (работает, но менее надёжно).

## 8. nginx

На сервере под root:

```bash
cp /etc/nginx/sites-enabled/msuvenirov.ru /root/msuvenirov.ru.backup
mkdir -p /etc/nginx/snippets
cp /var/www/msuvenirov.ru/deploy/nginx/snippets/msuvenirov-security-headers.conf /etc/nginx/snippets/
cp /var/www/msuvenirov.ru/deploy/nginx/msuvenirov.ru.conf /etc/nginx/sites-enabled/msuvenirov.ru
nginx -t && systemctl reload nginx
```

Если `nginx -t` ругается — конфиг не применится, сайт продолжит работать на старом.
Откат: `cp /root/msuvenirov.ru.backup /etc/nginx/sites-enabled/msuvenirov.ru && nginx -t && systemctl reload nginx`.

Проверка:

```bash
curl -sI https://msuvenirov.ru/ | grep -iE 'strict-transport|content-security|x-content-type|server:'
curl -sI https://msuvenirov.ru/pechat_na_tkani   # 301 -> /pechat-na-futbolkah
curl -sI https://msuvenirov.ru/mug-print         # 301 -> /pechat-na-kruzhkah
curl -sI https://msuvenirov.ru/no-such-page      # 404
```

Необязательно: ограничение частоты запросов (`limit_req_zone`) — инструкция в комментарии в начале
`deploy/nginx/msuvenirov.ru.conf` (директива должна быть в контексте `http {}`).

Продление сертификата: путь `/.well-known/acme-challenge/` оставлен открытым. Если certbot работает
в режиме `--webroot` с папкой внутри `dist/`, учтите, что `dist/` пересоздаётся при каждой сборке;
надёжнее режим `--nginx`. Проверка: `certbot renew --dry-run`.

## 9. CSP: из Report-Only в боевой режим

Сейчас в заголовке `Content-Security-Policy-Report-Only` ничего не блокируется — браузер лишь пишет
нарушения в консоль. Порядок включения:

1. Откройте в браузере все типы страниц (главная, прайс, калькулятор/смета, страницы услуг, форма заявки
   с загрузкой файла, страница с картой/видео), при включённых Яндекс.Метрике и JivoSite.
2. DevTools → Console: ищите сообщения «Content Security Policy ... violates / would violate».
3. Для каждого легитимного источника добавьте домен в нужную директиву в
   `deploy/nginx/snippets/msuvenirov-security-headers.conf` (на сервере — `/etc/nginx/snippets/...`).
4. Когда на всех страницах консоль чистая, замените в этом файле имя заголовка
   `Content-Security-Policy-Report-Only` на `Content-Security-Policy`, затем `nginx -t && systemctl reload nginx`.
5. Снова пройдите страницы; при поломке верните `-Report-Only` (откат за минуту).

`'unsafe-inline'` оставлен для inline-скриптов Astro; позже его можно заменить хэшами/nonce.

## 10. Итоговая проверка

- Форма заявки: сообщение пришло в Telegram, строка появилась в таблице `orders` (Dashboard → Table Editor).
- С другого домена запрос к `send-telegram` блокируется CORS.
- Более 5 заявок с одного IP за 10 минут → 429.
- Нажатие «Одобрить/Отклонить» под отзывом в Telegram работает только у ID из `TELEGRAM_ADMIN_IDS`.

## 11. Чат на сайте (свой, вместо Jivo)

Окно чата (`src/components/islands/ChatWidget.tsx`) шлёт сообщения на небольшую программу на этом же сервере
(`server/chat/`, без сторонних библиотек, нужен Node ≥ 18). Она хранит переписку в `/var/lib/msuvenirov-chat`
и пересылает сообщения в Telegram; ответ владельца (кнопка «Ответить» на сообщении бота) возвращается в окно чата.
Там же — заявки «Перезвоните мне».

1. **Отдельный бот для чата.** В Telegram: @BotFather → `/newbot` → имя, например «Мастерская сувениров — чат».
   Сохраните токен. Отдельный бот нужен потому, что у бота может быть только один вебхук, а у бота заявок
   он уже занят модерацией отзывов (Supabase).
2. **Куда приходят сообщения.** Напишите новому боту `/start`. Свой ID узнайте у @userinfobot.
   Если отвечать будут несколько человек — создайте группу, добавьте туда бота и возьмите ID группы (начинается с `-100`).
3. **Настройки на сервере** (под root):
   ```bash
   cp /var/www/msuvenirov.ru/deploy/chat/msuvenirov-chat.env.example /etc/msuvenirov-chat.env
   nano /etc/msuvenirov-chat.env        # TG_BOT_TOKEN, TG_CHAT_ID, TG_WEBHOOK_SECRET
   chmod 600 /etc/msuvenirov-chat.env
   cp /var/www/msuvenirov.ru/deploy/chat/msuvenirov-chat.service /etc/systemd/system/
   systemctl daemon-reload && systemctl enable --now msuvenirov-chat
   systemctl status msuvenirov-chat      # должно быть active (running)
   curl -s http://127.0.0.1:8787/api/health   # {"ok":true}
   ```
4. **nginx:** блок `location ^~ /api/` уже есть в `deploy/nginx/msuvenirov.ru.conf` (раздел 8 — как обновить конфиг).
5. **Вебхук бота чата:**
   ```bash
   curl -sS "https://api.telegram.org/bot<TG_BOT_TOKEN>/setWebhook" \
     -d "url=https://msuvenirov.ru/api/tg/webhook" \
     -d "secret_token=<TG_WEBHOOK_SECRET>" \
     -d 'allowed_updates=["message"]'
   ```
6. **Проверка:** откройте сайт, напишите в чат — сообщение придёт от бота. Нажмите «Ответить» и напишите ответ —
   он появится в окне чата, а на вашем ответе бот поставит 👍. Кнопка «Перезвоните мне» присылает номер.
7. Jivo с сайта убран (скрипт больше не подключается). Подписку Jivo можно отключить после проверки чата.

Персональные данные: переписка и номера хранятся на этом сервере в России; пересылка в Telegram — трансграничная
передача (решение по юридической части владелец примет отдельно).
