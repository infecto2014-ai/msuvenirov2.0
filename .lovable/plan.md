

## Уведомление о новых отзывах в Telegram с модерацией

### Что будет сделано

**1. Edge Function `notify-review`**
- Принимает данные отзыва (name, content, rating, review_id)
- Отправляет сообщение в Telegram с inline-кнопками «Одобрить ✅» / «Отклонить ❌»
- Callback data кнопок содержит ID отзыва для идентификации
- Использует существующие секреты `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`

**2. Edge Function `telegram-review-webhook`**
- Обрабатывает callback_query от нажатий кнопок в Telegram
- При «Одобрить» — ставит `is_approved = true` в таблице reviews (через service role)
- При «Отклонить» — удаляет отзыв из БД
- Отвечает в Telegram: редактирует исходное сообщение, убирая кнопки и показывая статус
- Использует `SUPABASE_SERVICE_ROLE_KEY` для обхода RLS

**3. Регистрация вебхука**
- Однократный вызов Telegram API `setWebhook` для привязки URL edge function `telegram-review-webhook` к боту
- Будет выполнено через `curl` после деплоя функции

**4. Обновление `ReviewForm.tsx`**
- После успешного `insert` — вызов `supabase.functions.invoke('notify-review', { body: { name, content, rating } })`
- Fire-and-forget: ошибка уведомления не блокирует пользователя

### Формат сообщения в Telegram

```text
⭐⭐⭐⭐⭐ Новый отзыв!

👤 Иван
💬 Отличная работа, заказывал печать на футболках...

[✅ Одобрить]  [❌ Отклонить]
```

### Технические детали

- `notify-review` возвращает `id` вставленного отзыва из insert-запроса и передаёт его в callback_data кнопок
- Вебхук-функция использует `answerCallbackQuery` для подтверждения нажатия и `editMessageReplyMarkup` для удаления кнопок после действия
- RLS не мешает: webhook-функция использует service role key для UPDATE/DELETE

