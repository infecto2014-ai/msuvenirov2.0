# Реестр лицензий и условий использования

Ведётся с 12.11.2026. Правила — `COMPONENT_REUSE_POLICY.md`. Подробные таблицы с лицензией, ссылкой на первоисточник и статусом по каждому ресурсу — в `DESIGN_RESOURCE_REGISTRY.md` (столбцы «Лицензия», «Коммерч.», «Атрибуция», «Статус проверки»). Это справка, не юридическая консультация.

## 1. Использовано в проекте

Сюда попадает каждый сторонний ресурс **до** добавления в проект.

| Название | Источник | Компонент / файл | Лицензия | Коммерч. | Атрибуция | Дата проверки | Изменения |
|---|---|---|---|---|---|---|---|
| Astro | github.com/withastro/astro | фреймворк (npm `astro`) | MIT | да | нет (сохранять текст лицензии в пакете) | 12.11.2026 (npm) | — |
| Preact, @astrojs/preact | github.com/preactjs/preact | острова (npm) | MIT | да | нет | 12.11.2026 (npm) | — |
| Rubik Variable | fontsource.org / Google Fonts | `@fontsource-variable/rubik` | OFL-1.1 | да | нет; нельзя продавать шрифт отдельно | 12.11.2026 (npm) | — |
| JetBrains Mono Variable | fontsource.org | `@fontsource-variable/jetbrains-mono` | OFL-1.1 | да | нет | 12.11.2026 (npm) | — |
| Caveat | fontsource.org | `@fontsource/caveat` (главная) | OFL-1.1 | да | нет | 12.11.2026 (npm) | — |
| Cormorant Garamond | fontsource.org | `@fontsource/cormorant-garamond` (главная) | OFL-1.1 | да | нет | 12.11.2026 (npm) | — |
| Скилл ui-ux-pro-max | github.com/nextlevelbuilder/ui-ux-pro-max-skill | `.claude/skills/ui-ux-pro-max/` | MIT | да | сохранён текст лицензии | 06.11.2026 (CLAUDE.md) | — |
| Скилл Hallmark | github.com/Nutlope/hallmark | `.claude/skills/hallmark/` | MIT | да | сохранён текст лицензии | 09.11.2026 (CLAUDE.md) | — |

Изображения текущего сайта (не сторонние ресурсы, но учитываются по правилу о трёх видах фото):
- реальные фото работ и мастерской — `public/img/portfolio*` и др., от владельца;
- сгенерированные визуализации — первый экран (`hero-kaliningrad-*`), «Изделия и цены» (`public/img/products/*`, Gemini через AITUNNEL) — это демонстрационные изображения, не портфолио; в v3 при показе рядом с реальными работами обозначать честно;
- стоковых фото на сайте нет.

Для v3 записи появятся здесь по мере выбора библиотек.

## 2. Сводка по найденным ресурсам (12.11.2026)

**Бесплатно в коммерции без атрибуции (ПРОВЕРЕНО):**
шрифты на OFL (все из раздела 1; лицензию хранить в пакете), Lucide (ISC), Phosphor, Tabler, Heroicons (MIT), Material Symbols (Apache-2.0, уведомление при распространении), Simple Icons (CC0, но товарные знаки), astro-icon (MIT), три-js/model-viewer/OGL/css-doodle/geopattern (код), Iconify-наборы MIT/ISC/Apache/CC0. Из вторичных данных: Unsplash, Pexels, Pixabay (фото), unDraw.

**Требуют атрибуции (ПРОВЕРЕНО по npm):**
Iconify: twemoji, streamline, solar, Font Awesome 6 (fa6-solid), pepicons-pop (CC BY 4.0), game-icons (CC BY 3.0). По памяти (НЕ ПРОВЕРЕНО): Storyset/Freepik, Icons8, Blush (free), Hero Patterns (CC BY), Transparent Textures.

**С ограничениями / не использовать без разрешения:**
- Логотипы брендов из Simple Icons и фото с чужими брендами: товарные знаки (Fonbet на сайте запрещён решением владельца).
- openmoji (CC BY-SA, copyleft).
- Remix Icon: нельзя как логотип/знак, нельзя перепродавать как набор.
- Fontshare: условия не проверены; кириллица не подтверждена; перераспространять нельзя.
- SVG Repo, Sketchfab, Poly Pizza, мокапы: лицензия у каждого файла своя; «personal use only» возможен.
- Пакет `halftone` в npm без лицензии.

---
## Фото как принт на товарах: что разрешено
**Из того, что удалось подтвердить (ВТОРИЧНО, цитаты из ToS Pixabay через поиск):** Pixabay разрешает merchandise только при условии, что фото изменено или вставлено в новый дизайн; продажа в исходном виде («as a print, wallpaper, poster or on merchandise») запрещена, а «filter, changing colors, resizing or cropping» не считается изменением. Узнаваемые бренды, логотипы и товарные знаки на фото запрещено использовать для товаров. Для Pexels из ToS по пересказу: нельзя продавать «as-is», а фото с узнаваемыми товарными знаками нельзя использовать для товаров; прямая фраза про merch у Pexels обрезана, итог не подтверждён. Для Unsplash: по Printful license разрешает коммерцию без атрибуции, но запрещает продавать контент «on its own», то есть нужны существенные изменения; текст первоисточника не прочитан. Сторонний сайт утверждает, что бесплатная лицензия Unsplash вообще не для мерча; это мнение, не первоисточник. Unsplash+ заявляет более широкие права, текст НЕ ПРОВЕРЕН.
**Практический вывод:** чужое стоковое фото без изменений на футболку или кружку на продажу не печатать. Печатать можно только материалы клиента, свои фото и CC0 (Poly Haven, пре-2019 Pixabay CC0, Open Peeps и т.п., после проверки). Для мерча брать платные лицензии с явным правом на «physical products / merchandise» (например, Unsplash+), с model/property release. При сомнении писать в поддержку сервиса и сохранить ответ.

---

### Компоненты и анимации
- **MIT / ISC, коммерчески можно, атрибуция не нужна (проверено по LICENSE):** shadcn/ui, Magic UI (бесплатная часть), Motion Primitives, Motion, Lenis, AutoAnimate, Anime.js, Swup, Astro, Embla, Swiper, Splide, PhotoSwipe, GLightbox, lottie-web, dotLottie-плеер, Rive runtime, Atropos, vanilla-tilt, tsParticles, canvas-confetti (ISC), Floating UI, Rough Notation, Open Props, Splitting.js, Typed.js, Zag.js, Ark UI, Web Awesome (бесплатная часть), AstroWind, ScrewFast, Tabler, Lucide (ISC), Phosphor; Lit — BSD-3. Требование одно: сохранять текст лицензии/уведомление при копировании кода.
- **С особыми условиями:** React Bits — «MIT + Commons Clause» (на своём сайте можно; нельзя продавать/раздавать сами компоненты); GSAP — бесплатная, но не MIT («Standard No Charge», запрет на конкурирующие с Webflow конструкторы анимаций) — *вторично, проверить по первоисточнику перед использованием*.
- **Платное — только с разрешения владельца:** Magic UI Pro, Aceternity UI Pro, React Bits Pro, Web Awesome Pro, Motion+, редактор Rive, премиум LottieFiles, Unsplash+.
- **Лицензия не подтверждена — не использовать до проверки:** Aceternity UI (бесплатная часть), Animista, сайт uiverse.io (зеркало на GitHub — MIT), отдельные анимации LottieFiles (у каждой своя лицензия).

## 3. Что осталось проверить по первоисточнику

Нужен доступ к сайтам сервисов (сейчас закрыт сетью среды):
- фото: лицензии Unsplash, Pexels, Pixabay (в т.ч. пункт о печати на товарах), Unsplash+;
- шрифты: Fontshare (ITF Free Font License, наличие кириллицы);
- иллюстрации: unDraw, Open Doodles, Open Peeps, Humaaans, Storyset, Blush, DrawKit, ManyPixels, SVG Repo, Icons8;
- 3D: Poly Haven, Poly Pizza, Sketchfab, Spline, 3dicons, Kenney;
- текстуры и фоны: Hero Patterns, Pattern Monster, Haikei, SVG Backgrounds, Transparent Textures, fffuel, getwaves, BGJar;
- мокапы изделий: все источники;
- компоненты: GSAP Standard License, Aceternity UI, условия Pro-версий.

До проверки эти ресурсы имеют статус «не использовать».
