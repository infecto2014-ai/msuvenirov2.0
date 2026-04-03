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
      // Convert any <link rel="stylesheet" ...> pointing to /assets/*.css to non-blocking
      return html.replace(
        /<link\s+([^>]*?)rel="stylesheet"([^>]*?)href="(\/assets\/[^"]+\.css)"([^>]*?)\s*\/?>/g,
        (_, before, mid, href, after) =>
          `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">\n` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`
      );
    },
  };
}
