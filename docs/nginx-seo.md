# Настройка nginx для пререндеренного сайта

После `npm run build` в `dist/` лежат плоские HTML-файлы для каждой страницы:
`index.html`, `price.html`, `faq.html`, `pechat_na_tkani.html`, `mug-print.html`,
`public-offer.html`, `privacy-policy.html`, `card.html` (noindex) и `404.html`.
Чтобы поисковики получали готовый HTML нужной страницы, nginx должен отдавать именно эти файлы.

## Пример конфигурации

```nginx
# --- вне server{}, один раз (например, в http{} или conf.d) ---
gzip on;
gzip_comp_level 5;
gzip_min_length 1024;
gzip_vary on;
gzip_proxied any;
gzip_types text/plain text/css text/xml application/json application/javascript
           text/javascript application/xml image/svg+xml application/ld+json;
# text/html сжимается gzip всегда, добавлять в gzip_types не нужно

server {
    server_name msuvenirov.ru;
    root /var/www/msuvenirov.ru/dist;

    # 1. Редиректы на канонические адреса (301).
    #    ВАЖНО: проверяется $request_uri (исходный адрес запроса), а не $uri.
    #    Внутренние переходы try_files на /price.html и т.п. не меняют $request_uri,
    #    поэтому петель не возникает.
    #    /index.html -> /
    if ($request_uri ~* "^/index\.html(\?|$)") {
        return 301 /;
    }
    #    /price.html -> /price (файл верификации Яндекса yandex_*.html не трогаем)
    if ($request_uri ~* "^/(?!yandex_)([^?]+)\.html(\?.*)?$") {
        return 301 /$1;
    }
    #    /price/ -> /price (корень "/" не затрагивается: нужен минимум один символ перед слэшем)
    rewrite ^/(.+)/$ /$1 permanent;

    # 2. Неизвестные адреса -> HTTP 404 с телом 404.html
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
    #    /404 не должен отдаваться как обычная страница (через $uri.html)
    location = /404 {
        return 404;
    }

    # 3. Главная
    location = / {
        try_files /index.html =404;
    }

    # 4. Хешированные ассеты — кэшируем надолго.
    #    ^~ нужен, чтобы этот location имел приоритет над regex-location ниже.
    location ^~ /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 5. Остальная статика (шрифты, картинки, sitemap, robots, sw.js и т.д.)
    location ~* \.(?:woff2?|webp|jpg|jpeg|png|svg|ico|txt|xml|webmanifest|js|css)$ {
        try_files $uri =404;
    }

    # 6. Страницы: /price -> price.html, /faq -> faq.html, /card -> card.html ...
    location / {
        try_files $uri $uri.html =404;
    }
}
```

## Как это работает и проверка на петли

- `/` — точное совпадение `location = /`, отдаётся `/index.html` напрямую (без внутреннего
  редиректа), редирект с `/index.html` срабатывает только если пользователь сам запросил
  `/index.html` (проверка `$request_uri`). Петли нет.
- `/price` -> `try_files $uri $uri.html` -> файл `price.html`, ответ 200 без редиректа.
  Внутренний переход на `/price.html` не вызывает правило "*.html -> без расширения",
  так как `$request_uri` остаётся `/price`.
- `/price.html` и `/index.html` -> 301 на `/price` и `/`. `/price/` -> 301 на `/price`.
  Правило слэша `^/(.+)/$` не совпадает с `/`, поэтому `/` не редиректится.
- Неизвестный адрес (`/foo`, `/price/abc`) -> `=404` -> `error_page` -> `404.html` с кодом 404
  (в странице `noindex`). `/404` -> тоже 404. Настоящие страницы сайта работают как раньше,
  а React-роутер подхватывает страницу после загрузки скриптов.
- `/card` отдаёт `card.html` (noindex; в sitemap его нет, в robots.txt остаётся Disallow).
- gzip: если он уже включён в основном конфиге, дублировать директивы не нужно.

## Проверка после применения

```bash
sudo nginx -t && sudo systemctl reload nginx
curl -sI https://msuvenirov.ru/                  # 200, text/html
curl -sI https://msuvenirov.ru/price             # 200, text/html
curl -sI https://msuvenirov.ru/price/            # 301 -> /price
curl -sI https://msuvenirov.ru/price.html        # 301 -> /price
curl -sI https://msuvenirov.ru/index.html        # 301 -> /
curl -sI https://msuvenirov.ru/404               # 404
curl -sI https://msuvenirov.ru/no-such-page      # 404
curl -sI https://msuvenirov.ru/card              # 200
curl -s  https://msuvenirov.ru/price | grep -o '<h1[^>]*>[^<]*'   # заголовок есть в HTML
curl -sI -H 'Accept-Encoding: gzip' https://msuvenirov.ru/price | grep -i content-encoding
```

## Важно

Деплой (`git reset --hard origin/main && npm ci && npm run build`) пересоздаёт `dist/`
целиком, правок в конфигурации после каждого деплоя не требуется. Если конфиг nginx ещё
не обновлён и на все адреса отдаётся `index.html` (главная), сайт всё равно работает:
клиентский код видит, что разметка предназначена для другого маршрута, и рендерит страницу
заново без гидратации.
