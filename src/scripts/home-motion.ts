/**
 * Home page motion — implements docs/MOTION.md (owner, 14.11.2026: «нужны анимации… Motion Design System»).
 * GSAP + ScrollTrigger + SplitText for scenes and scroll choreography; CSS transitions stay for hovers/presses.
 * Rules: transform/opacity/clip-path only; one lead per scene; nothing blocks clicks; reduced motion → no movement.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ---------- tokens (keep in sync with docs/MOTION.md) */
const D = { micro: 0.16, ui: 0.24, reveal: 0.8, hero: 1.1, photo: 1.6 };
const E = {
  out: 'expo.out', // entrances: fast start, long soft landing
  text: 'power4.out', // text lines out of a mask
  move: 'power2.inOut', // things already on screen moving
  swing: 'sine.inOut', // idle ornament
};
const ONCE = { start: 'top 82%', once: true } as const;

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function done() {
  // the pre-hide CSS (html.motion-ready) is no longer needed once GSAP owns the states
  root.classList.add('motion-on');
  (window as unknown as { __motion?: boolean }).__motion = true;
}

/* ---------- 1. first screen: the lead is the headline */
function hero() {
  const frame = document.querySelector<HTMLElement>('.lx-frame');
  if (!frame) return;
  const photo = frame.querySelector<HTMLElement>('.lx-photo img');
  const title = frame.querySelector<HTMLElement>('.lx-title');
  const lead = frame.querySelector<HTMLElement>('.lx-lead');
  const actions = frame.querySelectorAll<HTMLElement>('.lx-actions > *');
  const cards = frame.querySelectorAll<HTMLElement>('.lx-card');
  const header = document.querySelector<HTMLElement>('.hdr');

  const tl = gsap.timeline({ defaults: { ease: E.out } });
  if (header) tl.from(header, { y: -16, autoAlpha: 0, duration: 0.7 }, 0);
  if (photo) tl.fromTo(photo, { scale: 1.14 }, { scale: 1, duration: D.photo, ease: 'expo.out' }, 0);
  tl.fromTo(
    frame,
    { clipPath: 'inset(3% 2% 3% 2% round 40px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.2, clearProps: 'clipPath' },
    0,
  );
  if (title) {
    gsap.set(title, { autoAlpha: 1 });
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'm-line' });
    tl.from(split.lines, { yPercent: 105, duration: D.hero, ease: E.text, stagger: { each: 0.11, ease: 'power1.in' } }, 0.18);
  }
  if (lead) tl.fromTo(lead, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: D.reveal }, 0.5);
  if (actions.length) tl.fromTo(actions, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: D.reveal, stagger: 0.08 }, 0.6);
  if (cards.length) tl.fromTo(cards, { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: { each: 0.09, ease: 'power1.in' } }, 0.72);

  // scroll: the photo sinks slower than the page (depth), the copy lifts away a little faster
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    const st = { trigger: frame, start: 'top top', end: 'bottom top', scrub: 0.6 };
    if (photo) gsap.to(photo, { yPercent: 10, ease: 'none', scrollTrigger: st });
    const copy = frame.querySelector('.lx-copy');
    if (copy) gsap.to(copy, { y: -70, autoAlpha: 0.15, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
  });

  // magnetic main button (fine pointers only): follows the cursor a few pixels
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const btn = frame.querySelector<HTMLElement>('.lx-btn-main');
    if (!btn) return;
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
    const move = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      xTo(((e.clientX - r.left) / r.width - 0.5) * 10);
      yTo(((e.clientY - r.top) / r.height - 0.5) * 8);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    btn.addEventListener('pointermove', move);
    btn.addEventListener('pointerleave', leave);
    return () => {
      btn.removeEventListener('pointermove', move);
      btn.removeEventListener('pointerleave', leave);
    };
  });
}

/* ---------- 2. section transitions: dark panels rise into place, headings come out of a mask */
function sections() {
  // dark rounded panels: grow from 94% as they enter (one signature move between sections)
  gsap.utils.toArray<HTMLElement>('.band-ink, .hny').forEach((panel) => {
    gsap.fromTo(
      panel,
      { scale: 0.94, transformOrigin: '50% 0%' },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 45%', scrub: 0.5 } },
    );
  });

  // section headings: eyebrow slides in, the h2 lines rise out of a mask — the lead of each section
  gsap.utils.toArray<HTMLElement>('main h2').forEach((h) => {
    if (h.closest('.lx-frame, .lx-card')) return;
    const box = h.closest('.section-head, .cats-side, .about-text, .hb-head, div') ?? h.parentElement!;
    const eyebrow = box.querySelector('.eyebrow, .hny-kicker');
    const split = SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'm-line' });
    const tl = gsap.timeline({ scrollTrigger: { trigger: h, ...ONCE } });
    if (eyebrow) tl.from(eyebrow, { x: -16, autoAlpha: 0, duration: 0.6, ease: E.out }, 0);
    tl.from(split.lines, { yPercent: 105, duration: 0.9, ease: E.text, stagger: 0.09 }, 0.05);
  });
}

/* ---------- 3. catalogue: cards arrive in importance order, the photo settles inside its card */
function catalogue() {
  const cards = gsap.utils.toArray<HTMLElement>('.pcards .pc');
  if (!cards.length) return;
  gsap.set(cards, { autoAlpha: 0, y: 40 });
  cards.forEach((c) => gsap.set(c.querySelector('img'), { scale: 1.16 }));
  ScrollTrigger.batch(cards, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: D.reveal, ease: E.out, stagger: { each: 0.08, ease: 'power1.in' } });
      gsap.to(
        batch.map((c) => (c as HTMLElement).querySelector('img')),
        { scale: 1, duration: D.photo, ease: E.out, stagger: { each: 0.08, ease: 'power1.in' } },
      );
    },
  });

  // photos react to the pointer: a slight drift towards the cursor + zoom (fine pointers only)
  gsap.matchMedia().add('(hover: hover) and (pointer: fine)', () => {
    const off: (() => void)[] = [];
    cards.forEach((card) => {
      const img = card.querySelector<HTMLElement>('img');
      if (!img) return;
      const xTo = gsap.quickTo(img, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(img, 'y', { duration: 0.6, ease: 'power3' });
      const enter = () => gsap.to(img, { scale: 1.07, duration: 0.6, ease: E.out, overwrite: 'auto' });
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        xTo(((e.clientX - r.left) / r.width - 0.5) * -14);
        yTo(((e.clientY - r.top) / r.height - 0.5) * -10);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
        gsap.to(img, { scale: 1, duration: 0.6, ease: E.out, overwrite: 'auto' });
      };
      card.addEventListener('pointerenter', enter);
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
      off.push(() => {
        card.removeEventListener('pointerenter', enter);
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', leave);
      });
    });
    return () => off.forEach((f) => f());
  });
}

/* ---------- 4. photo reveals: a curtain opens upward, the photo settles (holidays, works, collage) */
function photos() {
  const reveal = (items: HTMLElement[], frameSel: string) => {
    if (!items.length) return;
    items.forEach((it) => {
      const frame = it.querySelector<HTMLElement>(frameSel) ?? it;
      gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(frame.querySelector('img'), { scale: 1.2 });
      gsap.set(it, { y: 30 });
    });
    ScrollTrigger.batch(items, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => {
        const els = batch as HTMLElement[];
        gsap.to(els, { y: 0, duration: 1, ease: E.out, stagger: { each: 0.09, ease: 'power1.in' } });
        gsap.to(
          els.map((it) => it.querySelector(frameSel) ?? it),
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut', stagger: { each: 0.09, ease: 'power1.in' }, clearProps: 'clipPath' },
        );
        // clearProps hands the photo back to the CSS hover zoom once it has settled
        gsap.to(
          els.map((it) => (it.querySelector(frameSel) ?? it).querySelector('img')),
          { scale: 1, duration: 1.6, ease: E.out, stagger: { each: 0.09, ease: 'power1.in' }, clearProps: 'transform' },
        );
      },
    });
  };
  reveal(gsap.utils.toArray<HTMLElement>('.occ'), '.occ-media');
  reveal(gsap.utils.toArray<HTMLElement>('.work'), '.work-frame');

  // depth: collage photos and company photos drift at different speeds (desktop)
  gsap.matchMedia().add('(min-width: 761px)', () => {
    const drift = (sel: string, amounts: number[]) =>
      gsap.utils.toArray<HTMLElement>(sel).forEach((el, i) => {
        const y = amounts[i % amounts.length];
        gsap.fromTo(el, { y: y }, { y: -y, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
      });
    drift('.about-collage .ab', [40, 80, 20]);
    drift('.hb-shot', [30, 60, 15]);
  });
}

/* ---------- 5. supporting content: one quiet rise per group, no stagger on everyday UI */
function support() {
  const rise = (sel: string, each = 0.06) => {
    const items = gsap.utils.toArray<HTMLElement>(sel);
    if (!items.length) return;
    gsap.set(items, { autoAlpha: 0, y: 24 });
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: D.reveal, ease: E.out, stagger: { each, ease: 'power1.in' } }),
    });
  };
  rise('.rev-ratings a');
  rise('.rev', 0.05);
  rise('.how-step', 0.08);
  rise('.hb-points li', 0.06);
  rise('.hs-card', 0.06);
  rise('.contact-card, .contact-map', 0.1);
  // clients: decoration — fade only, together
  const logos = gsap.utils.toArray<HTMLElement>('.lx-clients li');
  if (logos.length) gsap.from(logos, { autoAlpha: 0, duration: 0.8, ease: 'none', scrollTrigger: { trigger: '.lx-clients', ...ONCE, start: 'top 95%' } });
}

/* ---------- 6. New Year strip: the ornament swings slowly while it is on screen */
function newYear() {
  const orn = document.querySelector<HTMLElement>('[data-m-swing]');
  if (!orn) return;
  const swing = gsap.fromTo(orn, { rotation: -4 }, { rotation: 4, duration: 3.2, ease: E.swing, yoyo: true, repeat: -1, paused: true });
  ScrollTrigger.create({ trigger: orn, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? swing.play() : swing.pause()) });
}

function start() {
  if (reduce) {
    root.classList.remove('motion-ready');
    return;
  }
  hero();
  sections();
  catalogue();
  photos();
  support();
  newYear();
  done();
  // fonts and lazy images change heights — recalculate trigger positions once they settle
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

// split headlines only after the webfont is in, so lines don't re-wrap after splitting (max wait 700ms)
Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(start);
