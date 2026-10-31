# Мастерская сувениров 2.0 — msuvenirov.ru

Сайт мастерской печати в Калининграде: печать на одежде, кружках и сувенирах, полиграфия.
Статический сайт на [Astro](https://astro.build) с интерактивными блоками на Preact (калькулятор, смета, форма заявки).

## Запуск

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # проверка типов + сборка в dist/
npm test           # тесты расчёта цен
```

## Где что лежит

| Что | Файл |
|---|---|
| Все цены и правила расчёта | `src/data/pricing.ts` |
| Контакты, адрес, меню | `src/data/site.ts` |
| Тексты страниц услуг | `src/data/services.ts` |
| Вопросы и ответы | `src/data/faq.ts` |
| Отзывы, портфолио | `src/data/reviews.ts`, `src/data/portfolio.ts` |
| Калькулятор и форма заявки | `src/components/islands/` |
| Дизайн-система (цвета, шрифты, кнопки) | `src/styles/global.css` |
| Серверные функции (заявки в Telegram) | `supabase/functions/` |
| Конфиг nginx | `deploy/nginx/` |

Чтобы поменять цену, достаточно исправить число в `src/data/pricing.ts` — калькуляторы, прайс-таблицы, цены «от» и микроразметка обновятся сами.

## Публикация

Пошаговая инструкция — в [`docs/DEPLOY.md`](docs/DEPLOY.md).
