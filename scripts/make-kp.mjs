// Makes the commercial offer PDF for companies: public/kp-msuvenirov.pdf from the /kp page.
// Run after changing src/data/corporate.ts:  npm run build && npm run kp
// Needs Playwright with Chromium (installed in the dev environment; not needed on the server).
import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import { createRequire } from 'node:module';

// require() also finds a globally installed Playwright (dev machines often have it outside the project)
const require = createRequire(import.meta.url);

const port = 4390;
const server = spawn('npx', ['astro', 'preview', '--port', String(port)], { stdio: 'ignore' });
try {
  let ok = false;
  for (let i = 0; i < 40 && !ok; i++) {
    await wait(250);
    ok = await fetch(`http://localhost:${port}/kp`).then((r) => r.ok, () => false);
  }
  if (!ok) throw new Error('preview server did not start — run `npm run build` first');
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/kp`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: 'public/kp-msuvenirov.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('public/kp-msuvenirov.pdf — готово');
} finally {
  server.kill();
}
