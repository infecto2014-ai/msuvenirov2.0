/**
 * Calm photos for service cards on the «Ink» pages (owner, 14.11.2026): the old showcase images are neon pink/purple
 * and fall out of the navy/white look. Products — the calm studio shots from public/img/products, the rest — real work.
 * Slugs not listed keep their services.ts image.
 */
const map: Record<string, string> = {
  '/pechat-na-futbolkah': '/img/products/tshirts-640.webp',
  '/pechat-na-kruzhkah': '/img/products/mugs-640.webp',
  '/znachki': '/img/products/badges-640.webp',
  '/pechat-na-kepkah': '/img/products/caps-640.webp',
  '/fotopodarki': '/img/products/pillow-640.webp',
  '/nakleyki': '/img/products/stickers-640.webp',
  '/vizitki': '/img/products/business-cards-640.webp',
  '/kalendari': '/img/products/calendar-640.webp',
  '/pechat-na-shopperah': '/portfolio/shopper-bags.webp',
  '/pechat-na-hudi': '/portfolio/portfolio-5.webp',
  '/pechat-na-odezhde': '/portfolio/portfolio-20.webp',
};
export const calmPhoto = (slug: string, fallback: string) => map[slug] ?? fallback;
