# Настройка nginx для пререндеренного сайта

После `npm run build` в `dist/` лежат плоские HTML-файлы для каждой страницы:
`index.html`, `price.html`, `faq.html`, `pechat_na_tkani.html`, `mug-print.html`,
`public-offer.html`, `privacy-policy.html`, `card.html` (noindex) и `404.html`.
Чтобы поисковики получали готовый HTML нужной страницы, nginx должен отдавать именно эти файлы.

Готовый конфиг сервера: [`deploy/nginx/msuvenirov.ru.conf`](../deploy/nginx/msuvenirov.ru.conf).
Он основан на текущем конфиге сервера (переадресации с http и www, SSL-сертификаты, логи,
кэш статики сохранены) и отличается только основным блоком `msuvenirov.ru`:

- `/price` отдаёт `price.html`, `/faq` — `faq.html` и т.д. (`try_files $uri $uri.html =404`);
- неизвестные адреса отвечают кодом 404 со страницей `404.html` (раньше — 200 и главная);
- 301-переадресации на канонические адреса: `/index.html` → `/`, `/price.html` → `/price`,
  `/price/` → `/price`. Проверяется `$request_uri`, поэтому петель нет; `/` не переадресуется;
- HTML-страницы отдаются с `Cache-Control: no-cache`, чтобы после выкладки сразу была новая версия;
- включено gzip-сжатие для css/js/svg/json.

## Установка (на сервере, под root)

Файл попадает на сервер вместе с выкладкой сайта (`/var/www/msuvenirov.ru/deploy/...`).

```bash
cp /etc/nginx/sites-enabled/msuvenirov.ru /root/msuvenirov.ru.backup
cp /var/www/msuvenirov.ru/deploy/nginx/msuvenirov.ru.conf /etc/nginx/sites-enabled/msuvenirov.ru
nginx -t && systemctl reload nginx
```

`nginx -t` проверяет конфиг; если он с ошибкой, nginx не перезагружается и продолжает
работать со старыми настройками.

## Откат

```bash
cp /root/msuvenirov.ru.backup /etc/nginx/sites-enabled/msuvenirov.ru && nginx -t && systemctl reload nginx
```

## Проверка

```bash
curl -sI https://msuvenirov.ru/                  # 200
curl -sI https://msuvenirov.ru/price             # 200
curl -sI https://msuvenirov.ru/price/            # 301 -> /price
curl -sI https://msuvenirov.ru/price.html        # 301 -> /price
curl -sI https://msuvenirov.ru/index.html        # 301 -> /
curl -sI https://msuvenirov.ru/no-such-page      # 404
curl -s  https://msuvenirov.ru/price | grep -o '<title>[^<]*'   # «Прайс на полиграфию…»
```

## Важно

Выкладка (`git reset --hard origin/main && npm ci && npm run build`) пересоздаёт `dist/`
целиком; конфиг nginx она не трогает, повторно копировать его нужно только если он изменится.
Если certbot при продлении сертификата перепишет конфиг, проверьте, что блоки выше сохранились.
