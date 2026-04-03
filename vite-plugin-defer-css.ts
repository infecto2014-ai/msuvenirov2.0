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
      // Convert <link rel="stylesheet" href="..."> to non-blocking
      return html.replace(
        /<link\s+rel="stylesheet"\s+crossorigin\s+href="(\/assets\/[^"]+\.css)"\s*\/?>/g,
        (_, href) =>
          `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">\n` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`
      );
    },
  };
}
