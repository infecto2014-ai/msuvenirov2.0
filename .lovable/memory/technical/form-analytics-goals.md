---
name: Form analytics goals
description: Yandex Metrika goals for order form funnel tracking
type: feature
---
FloatingOrderButton tracks the full funnel via `reachGoal()`:
- order_open — клик по CTA-кнопке
- form_open_restored — открытие с восстановленными данными из sessionStorage
- form_open_promo_url — открытие через ?promo= параметр
- file_attached — прикреплён файл
- promo_applied — промокод успешно проверен
- form_validation_error — невалидные имя/телефон
- form_promo_unverified — попытка отправки с непроверенным промо
- form_submit_attempt — клик по «Отправить»
- form_submit_success — успешная отправка (+ order_submit для совместимости)
- form_submit_with_files — отправка с вложениями
- form_submit_with_promo — отправка с применённым промо
- form_submit_error — ошибка при отправке
