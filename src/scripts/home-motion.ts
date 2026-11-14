/**
 * Home page motion — reduced (owner, 14.11.2026: «анимации однотипные… сделай их меньше, аккуратнее,
 * не прогрузкой снизу вверх»; skill remove-animations). See docs/MOTION.md.
 *
 * What is left:
 *  - the first screen: one quiet entrance in CSS (lux.css, html.motion-ready) — no JS needed;
 *  - every block below: one soft fade of the whole block when it comes into view (opacity only, no movement,
 *    no per-element staggers), triggered early so fast scrollers never meet an empty block.
 * No GSAP: an IntersectionObserver and a CSS transition are enough for this.
 */
const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce && 'IntersectionObserver' in window && document.body.classList.contains('theme-lux')) {
  const blocks = document.querySelectorAll<HTMLElement>('main > .band, main > .hny, .lx-clients');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px 10% 0px' }, // starts a little before the block reaches the screen
  );
  blocks.forEach((b) => {
    // blocks already on screen at load are shown as they are — no fade for what the visitor already sees
    if (b.getBoundingClientRect().top < window.innerHeight) return;
    // reviews have their own entrance (below) — one entrance per block
    if (b.querySelector('.reviews')) return;
    b.classList.add('m-fade');
    io.observe(b);
  });

  // reviews: ratings count up and the stars fill; the cards settle one after another (a short wave, ≤ 0.35 s)
  const ratings = document.querySelector<HTMLElement>('.reviews .rev-ratings');
  const grid = document.querySelector<HTMLElement>('.reviews .rev-grid');
  grid?.querySelectorAll<HTMLElement>('.rev').forEach((card, i) => card.style.setProperty('--d', `${Math.min(i, 5) * 0.07}s`));
  const countUp = (el: HTMLElement) => {
    const target = parseFloat((el.textContent ?? '').replace(',', '.'));
    if (!Number.isFinite(target)) return;
    const t0 = performance.now();
    const dur = 900;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 4);
      el.textContent = (target * eased).toFixed(1).replace('.', ',');
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = '0,0';
    requestAnimationFrame(step);
  };
  const revIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.classList.add('is-on');
        if (el === ratings) el.querySelectorAll<HTMLElement>('.rev-rating').forEach(countUp);
        revIo.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  if (ratings) revIo.observe(ratings);
  if (grid) revIo.observe(grid);
}
root.classList.add('motion-on');
