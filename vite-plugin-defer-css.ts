import type { Plugin } from 'vite';

/**
 * Vite plugin that converts render-blocking CSS <link> tags
 * to non-blocking by using the media="print" onload pattern.
 * Only applies during build (production).
 */
export default function deferCss(): Plugin {
  return {
    name: 'defer-css',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html) {
      // Match any <link> with rel="stylesheet" and href="/assets/*.css" regardless of attribute order
      return html.replace(
        /<link\s+[^>]*?href="(\/assets\/[^"]+\.css)"[^>]*?\/?>/g,
        (match, href) => {
          if (!match.includes('rel="stylesheet"')) return match;
          return (
            `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">\n` +
            `<noscript><link rel="stylesheet" href="${href}"></noscript>`
          );
        }
      );
    },
  };
}
