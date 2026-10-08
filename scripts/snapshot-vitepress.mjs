// Hydrated snapshots of vitepress.dev for the layout tests: what VitePress
// renders in the browser, where test/upstream/pages holds the server render.
// Some markup exists only there: the outline (filled on mount), the local
// nav's open dropdown, the open sidebar.
//
//   node scripts/snapshot-vitepress.mjs
//
// Fails unless the site still runs the VitePress version test/upstream/SOURCE
// pins. Writes test/upstream/pages/hydrated/<name>.html: the document after
// the snapshot's steps, scope ids (data-v-*) included. Requests to other
// hosts (ads, search) are blocked, so their markup stays out.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-chromium';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://vitepress.dev';
const VERSION = /vuejs\/vitepress (v[\w.-]+)/.exec(readFileSync(join(ROOT, 'test/upstream/SOURCE'), 'utf8'))[1];
const OUT = join(ROOT, 'test/upstream/pages/hydrated');

// let Vue's transitions finish: no element still carries a *-enter-active or
// *-leave-active class, and no animation runs
async function settle(page) {
  await page.waitForFunction(
    () => !document.querySelector('[class*="-enter-active"], [class*="-leave-active"]') &&
      document.getAnimations().every((a) => a.playState !== 'running'),
  );
}

// name: the file; path, width: what to load at which viewport width;
// steps: what to do before the snapshot
const SNAPSHOTS = [
  // the aside's outline, filled with the page's headers
  { name: 'guide_getting-started.1280', path: '/guide/getting-started', width: 1280 },
  // a deep outline: the markdown guide's h3s nest under its h2s
  { name: 'guide_markdown.1280', path: '/guide/markdown', width: 1280 },
  // the local nav's outline dropdown, open
  {
    name: 'guide_getting-started.375.outline-open',
    path: '/guide/getting-started',
    width: 375,
    steps: async (page) => page.click('.VPLocalNavOutlineDropdown > button'),
  },
  // the sidebar, open over the page with its backdrop
  {
    name: 'guide_getting-started.375.sidebar-open',
    path: '/guide/getting-started',
    width: 375,
    steps: async (page) => page.click('.VPLocalNav .menu'),
  },
];

const browser = await chromium.launch();
try {
  mkdirSync(OUT, { recursive: true });
  for (const s of SNAPSHOTS) {
    const context = await browser.newContext({ viewport: { width: s.width, height: 900 }, colorScheme: 'light' });
    await context.route('**/*', (route) =>
      new URL(route.request().url()).origin === SITE ? route.continue() : route.abort(),
    );
    const page = await context.newPage();
    await page.goto(`${SITE}${s.path}`, { waitUntil: 'networkidle' });
    const generator = await page.getAttribute('meta[name="generator"]', 'content');
    if (generator !== `VitePress ${VERSION}`) throw new Error(`${SITE} runs ${generator}, test/upstream pins ${VERSION}`);
    await settle(page);
    if (s.steps) {
      await s.steps(page);
      await settle(page);
    }
    const html = await page.evaluate(() => `<!doctype html>\n${document.documentElement.outerHTML}\n`);
    writeFileSync(join(OUT, `${s.name}.html`), html);
    console.log(`${s.name}: ${html.length} bytes`);
    await context.close();
  }
} finally {
  await browser.close();
}
