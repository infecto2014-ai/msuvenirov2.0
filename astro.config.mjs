import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// Static site: every page is a ready HTML file (/price -> price.html),
// served by nginx with `try_files $uri $uri.html`.
export default defineConfig({
  site: 'https://msuvenirov.ru',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  integrations: [preact()],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  // `npm run dev`: the chat API (server/chat) runs separately on 127.0.0.1:8787; on the server nginx proxies /api/.
  vite: { server: { proxy: { '/api': 'http://127.0.0.1:8787' } } },
});
