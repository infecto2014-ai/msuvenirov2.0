

## Удаление кнопки «Оставить отзыв» и связанного функционала

### Что будет сделано

**`src/components/ReviewsSection.tsx`**
- Удалить импорт `ReviewForm` (lazy), `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `MessageSquarePlus`, `Suspense`
- Удалить состояние `showForm`
- Удалить блок CTA-кнопки «Оставить отзыв»
- Удалить блок `<Dialog>` с формой отзыва

**`src/components/ReviewForm.tsx`**
- Удалить файл полностью — больше нигде не используется

**Edge functions остаются** — `notify-review` и `telegram-review-webhook` не трогаем, они могут пригодиться если форма вернётся или отзывы будут приниматься другим способом.

