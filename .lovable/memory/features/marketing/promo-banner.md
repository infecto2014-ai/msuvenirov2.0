---
name: Promo Banner
description: Floating promo code banner on homepage with NEW15 code, 7-day cookie dismissal, Yandex Metrika goals
type: feature
---
PromoBanner (src/components/PromoBanner.tsx) shows after 3s on homepage only (mounted in Index.tsx, lazy).
Cookie `promo_banner_dismissed` (7 days, SameSite=Lax) prevents re-showing.
On "Применить" — sets ?promo=NEW15 in URL and clicks [data-order-button] (FloatingOrderButton picks up promo from URL).
Promo code: NEW15 (15% on first order).
Metrika goals: promo_banner_shown, promo_banner_dismissed, promo_banner_applied.
Position: fixed bottom-center, z-9997 (under FloatingOrderButton 9998/9999).
