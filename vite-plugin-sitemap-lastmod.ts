import { Plugin } from 'vite';

/**
 * Vite plugin that auto-updates <lastmod> dates in sitemap.xml during build.
 */
export default function sitemapLastmod(): Plugin {
  return {
    name: 'sitemap-lastmod',
    apply: 'build',
    generateBundle(_, bundle) {
      const asset = bundle['sitemap.xml'];
      if (!asset || asset.type !== 'asset') return;

      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const xml = typeof asset.source === 'string'
        ? asset.source
        : new TextDecoder().decode(asset.source);

      asset.source = xml.replace(
        /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
        `<lastmod>${today}</lastmod>`
      );
    },
  };
}
