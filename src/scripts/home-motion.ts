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

if (!reduce && 'IntersectionObserver' in window) {
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
    b.classList.add('m-fade');
    io.observe(b);
  });
}
root.classList.add('motion-on');
