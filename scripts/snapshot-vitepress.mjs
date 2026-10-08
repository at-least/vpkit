// Hydrated snapshots of vitepress.dev for the layout tests: what VitePress
// renders in the browser, where test/upstream/pages holds the server render.
// Some markup exists only there: the outline (filled on mount), the local
// nav's open dropdown, the open sidebar.
//
//   node scripts/snapshot-vitepress.mjs
//
// Fails unless the site still runs the VitePress version test/upstream/SOURCE
// pins. Writes test/upstream/pages/hydrated/<name>.html: the document after
// the snapshot's steps, scope ids (data-v-*) included; and in assets/ the
// stylesheets those pages link, from the same deploy, for whoever renders
// the snapshots as the site does (vpkit-zola's checks). Requests to other
// hosts (ads, search) are blocked, so their markup stays out.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
  // the navbar at rest where its layout changes: VitePress moves menu items
  // into the extra menu (…) as the bar narrows, so its markup differs by width
  { name: 'guide_getting-started.375', path: '/guide/getting-started', width: 375 },
  { name: 'guide_getting-started.768', path: '/guide/getting-started', width: 768 },
  { name: 'guide_getting-started.960', path: '/guide/getting-started', width: 960 },
  // a flyout open under the pointer: the version menu
  {
    name: 'guide_getting-started.1280.flyout-open',
    path: '/guide/getting-started',
    width: 1280,
    steps: async (page) => page.hover('.VPNavBar .VPNavMenuGroup > .button'),
  },
  // the extra menu (…) open where the bar has one
  {
    name: 'guide_getting-started.768.extra-open',
    path: '/guide/getting-started',
    width: 768,
    steps: async (page) => page.click('.VPNavBarExtra > .button'),
  },
  // the nav screen on a phone, and with its groups open
  {
    name: 'guide_getting-started.375.screen-open',
    path: '/guide/getting-started',
    width: 375,
    steps: async (page) => page.click('.VPNavBarHamburger'),
  },
  {
    name: 'guide_getting-started.375.screen-groups-open',
    path: '/guide/getting-started',
    width: 375,
    steps: async (page) => {
      await page.click('.VPNavBarHamburger');
      await settle(page);
      for (const button of await page.$$('.VPNavScreen .VPNavScreenMenuGroup > .button, .VPNavScreen .VPNavScreenTranslations > .title')) {
        await button.click();
      }
    },
  },
];

const browser = await chromium.launch();
const stylesheets = new Set();
try {
  rmSync(join(OUT, 'assets'), { recursive: true, force: true });
  mkdirSync(join(OUT, 'assets'), { recursive: true });
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
    for (const href of await page.$$eval('link[rel~="stylesheet"]', (links) => links.map((l) => l.href))) {
      if (new URL(href).origin !== SITE || stylesheets.has(href)) continue;
      stylesheets.add(href);
      const response = await context.request.get(href);
      if (!response.ok()) throw new Error(`${href}: ${response.status()}`);
      const file = new URL(href).pathname.split('/').at(-1);
      writeFileSync(join(OUT, 'assets', file), await response.body());
      console.log(`  assets/${file}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
