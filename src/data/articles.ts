// Articles section «Статьи» (owner, 06.11.2026): gift ideas and similar SEO material, no calculators.
// Each article has its own page in src/pages/stati/; this list feeds /stati, the sitemap and the Article schema.

export interface Article {
  slug: string;
  title: string;
  /** <meta description> and the card text on /stati */
  description: string;
  cover: string;
  /** short label on the card, e.g. «Новый год» */
  tag: string;
  published: string; // YYYY-MM-DD
  updated?: string;
  readMinutes: number;
}

export const articles: Article[] = [
  {
    slug: '/stati/novogodnie-podarki',
    title: 'Что подарить на Новый год: идеи подарков с фото и логотипом',
    description:
      'Идеи новогодних подарков с фото, надписью и логотипом: семье, детям, друзьям, коллегам и партнёрам. Цены, сроки, как заказать в Калининграде.',
    cover: '/portfolio/portfolio-6.webp',
    tag: 'Новый год',
    published: '2026-11-06',
    readMinutes: 5,
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);

/** «6 ноября 2026» */
export const ruDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(' г.', '');
