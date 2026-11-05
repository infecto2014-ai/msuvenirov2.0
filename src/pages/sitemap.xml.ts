import type { APIRoute } from 'astro';
import { services } from '@/data/services';
import { site } from '@/data/site';

// Every indexable page. lastmod is omitted on purpose: a fake "build date" lastmod misleads crawlers.
// own pages that are not in services.ts (src/pages/*.astro) are listed here
const staticPages = ['/', '/price', '/uslugi', '/sublimacionnaya-pechat', '/portfolio', '/otzyvy', '/kontakty', '/o-nas', '/faq', '/trebovaniya-k-maketam', '/public-offer', '/privacy-policy'];

export const GET: APIRoute = () => {
  const urls = [...new Set([...staticPages, ...services.map((s) => s.slug)])];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.url}${u === '/' ? '/' : u}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
