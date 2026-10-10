// The documentation (docs/): it builds with zola, it has a page for each
// component the component tests compile (test/entry.css), and its examples
// work. Each example frame (docs/templates/vp-example.html) must load the
// example stylesheet, which must style every class the example's markup
// uses; it must be as tall as its content, so it never scrolls, and no
// wider than the page at a phone's width; and it must take the page's
// appearance, and keep it when the navbar's switch changes it. The theme
// gallery's index (docs/static/themes.json) must hold the stock colors and
// then every theme of themes/, and a pick must recolor the page and its
// example frame in both modes, and the next pages the session opens from
// their first frame, until the stock card takes it back.
//
//   node test/docs.mjs
//
// Needs zola, and vpkit-zola, the theme the site is built with, as a
// sibling checkout: docs/themes/vpkit-zola links to ../vpkit-zola. The
// site is built under a path, as GitHub Pages serves it (/vpkit/), and
// served from its build through a Playwright route, which answers nothing
// outside that path. Exits 1, listing what fails.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-chromium';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
const ORIGIN = 'http://docs.test';
const BASE = `${ORIGIN}/vpkit`;
const TYPES = { '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.html': 'text/html', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain' };
const WIDTHS = [1280, 375];
const failures = [];

// the components: what the component tests compile, less the base and the icons
const components = [...readFileSync(join(ROOT, 'test/entry.css'), 'utf8').matchAll(/^@import "\.\.\/([a-z-]+)\.css";/gm)]
  .map((m) => m[1])
  .filter((name) => name !== 'index' && name !== 'icons');
const imported = [...readFileSync(join(DOCS, 'css/example.css'), 'utf8').matchAll(/^@import "\.\.\/\.\.\/([a-z-]+)\.css";/gm)].map((m) => m[1]);
const pages = readdirSync(join(DOCS, 'content/components')).filter((f) => f !== '_index.md').map((f) => f.replace(/\.md$/, ''));
for (const name of components) {
  if (!imported.includes(name)) failures.push(`docs/css/example.css does not import ${name}.css`);
  if (!pages.includes(name)) failures.push(`${name}.css has no page: docs/content/components/${name}.md`);
}
for (const name of pages.filter((p) => !components.includes(p))) failures.push(`docs/content/components/${name}.md: test/entry.css compiles no ${name}.css`);

const index = JSON.parse(readFileSync(join(DOCS, 'static/themes.json'), 'utf8'));
// in the order of the files' names, as the index has them
const stems = readdirSync(join(ROOT, 'themes')).filter((f) => f.endsWith('.css')).sort().map((f) => f.slice(0, -'.css'.length));
if (JSON.stringify(index.map((t) => t.name)) !== JSON.stringify(['', ...stems])) failures.push('docs/static/themes.json: not the stock colors and then every theme of themes/');

const dir = mkdtempSync(join(tmpdir(), 'vpkit-docs-'));
const site = join(dir, 'site');
let frames = 0;
try {
  execFileSync('zola', ['--root', DOCS, 'build', '--base-url', BASE, '--output-dir', site], { stdio: 'pipe' });
  const css = readFileSync(join(site, 'example.css'), 'utf8');
  const withExamples = readdirSync(site, { recursive: true })
    .filter((f) => f.endsWith('index.html') && readFileSync(join(site, f), 'utf8').includes('<iframe class="vp-example"'))
    .map((f) => `/${f.slice(0, -'index.html'.length)}`)
    .sort();
  // after the frames' fonts, two frames for their ResizeObservers
  const settle = (page) =>
    page.evaluate(async () => {
      for (const f of document.querySelectorAll('iframe.vp-example')) await f.contentDocument.fonts.ready;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });
  const serve = (route) => {
    const path = decodeURIComponent(new URL(route.request().url()).pathname);
    if (!path.startsWith('/vpkit/')) return route.fulfill({ status: 404, body: '' });
    let file = join(site, path.slice('/vpkit'.length));
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ contentType: TYPES[extname(file)] ?? 'application/octet-stream', body: readFileSync(file) });
  };
  const browser = await chromium.launch();
  try {
    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      await context.route(`${ORIGIN}/**`, serve);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      for (const path of withExamples) {
        errors.length = 0;
        await page.goto(`${BASE}${path}`);
        const where = `${path} at ${width}px`;
        await settle(page);
        const report = () =>
          page.evaluate((css) => {
            const dark = document.documentElement.classList.contains('dark');
            return [...document.querySelectorAll('iframe.vp-example')].map((f) => {
              const doc = f.contentDocument;
              const root = doc.documentElement;
              const sheets = [...doc.styleSheets];
              const classes = [...new Set([doc.body, ...doc.body.querySelectorAll('*')].flatMap((e) => [...e.classList]))];
              const unstyled = classes.filter((c) => !new RegExp(`\\.${CSS.escape(c).replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}(?![-\\w\\\\])`).test(css));
              const content = Math.ceil(root.getBoundingClientRect().height);
              const minHeight = parseFloat(getComputedStyle(f).minHeight) || 0;
              return {
                title: f.title,
                // example.css, then the session's theme as the page links it (the vitepress theme until a pick; none after the stock card)
                stylesheet:
                  sheets.length >= 1 &&
                  new URL(sheets[0].href).pathname === '/vpkit/example.css' &&
                  sheets[0].cssRules.length > 0 &&
                  sheets.slice(1).every((s) => /^\/vpkit\/themes\/[^/]+\.css$/.test(new URL(s.href).pathname)) &&
                  sheets.slice(1).map((s) => new URL(s.href).pathname) .join() === [...document.head.querySelectorAll('link[data-theme]')].map((l) => new URL(l.href).pathname).join(),
                unstyled,
                fits: f.clientHeight === Math.max(content, minHeight) && root.scrollHeight <= root.clientHeight,
                height: `${f.clientHeight}px for ${content}px of content${minHeight ? `, at least ${minHeight}px` : ''}`,
                overflow: root.scrollWidth > root.clientWidth ? `${root.scrollWidth}px of content in ${root.clientWidth}px` : '',
                dark: root.classList.contains('dark') === dark,
              };
            });
          }, css);
        for (const f of await report()) {
          frames++;
          const frame = `${where}, "${f.title}"`;
          if (!f.stylesheet) failures.push(`${frame}: the frame has not loaded example.css and then the page's theme`);
          for (const c of f.unstyled) failures.push(`${frame}: example.css has no rule for .${c}`);
          if (!f.fits) failures.push(`${frame}: ${f.height}`);
          if (width < 640 && f.overflow) failures.push(`${frame}: ${f.overflow}`);
          if (!f.dark) failures.push(`${frame}: not in the page's appearance`);
        }
        if (width >= 960) {
          // the navbar's switch, both ways
          for (let i = 0; i < 2; i++) {
            await page.click('.vp-nav-bar__appearance .vp-switch-appearance');
            await settle(page);
            for (const f of await report()) {
              if (!f.dark) failures.push(`${where}, "${f.title}": not in the page's appearance after the switch`);
              if (!f.fits) failures.push(`${where}, "${f.title}": after the switch, ${f.height}`);
            }
          }
        }
        for (const e of errors) failures.push(`${where}: ${e}`);
      }
      await context.close();
    }

    // the theme gallery: a card for each theme of the index, and a pick in
    // the page and its frame, light and dark, then in the next pages the
    // session opens, until the stock card. A theme's stylesheet answers
    // 300ms late, so a page that painted before it arrived would show it:
    // each page records its --vp-c-bg at its first frame.
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await context.route(`${ORIGIN}/**`, async (route) => {
      if (/\/vpkit\/themes\/[^/]+\.css$/.test(new URL(route.request().url()).pathname)) await new Promise((r) => setTimeout(r, 300));
      return serve(route);
    });
    await context.addInitScript(() => {
      requestAnimationFrame(() => {
        const style = getComputedStyle(document.documentElement);
        window.firstFrameBackground = style.getPropertyValue('--vp-c-bg').trim().toLowerCase();
        window.firstFrameBrand2 = style.getPropertyValue('--vp-c-brand-2').trim().toLowerCase();
      });
    });
    const page = await context.newPage();
    // the site is on the vitepress theme (docs/static/theme-pick.js) until a
    // pick: its brand-2 (the hovered link's color, which the theme fits)
    // from the first frame, and its card pressed
    const declared = (css, selector, name) => {
      const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      for (const m of css.matchAll(new RegExp(`(?:^|\\n)${esc(selector)}\\s*\\{([^}]*)\\}`, 'g'))) {
        const d = new RegExp(`${esc(name)}:\\s*([^;]+);`).exec(m[1]);
        if (d) return d[1].trim().toLowerCase();
      }
      throw new Error(`${name} is not declared under ${selector}`);
    };
    const vitepress = declared(readFileSync(join(ROOT, 'themes/vitepress.css'), 'utf8'), ':root', '--vp-c-brand-2');
    const tokens = readFileSync(join(ROOT, 'tokens.css'), 'utf8');
    const stockBrand2 = declared(tokens, ':root', declared(tokens, ':root', '--vp-c-brand-2').replace(/^var\((.*)\)$/, '$1'));
    await page.goto(`${BASE}/components/button/`);
    await settle(page);
    const firstBrand2 = await page.evaluate(() => window.firstFrameBrand2);
    if (firstBrand2 !== vitepress) failures.push(`/components/button/ with no pick: --vp-c-brand-2 ${firstBrand2} at the first frame, not the vitepress theme's ${vitepress}`);
    await page.goto(`${BASE}/themes/`);
    await page.waitForSelector('.theme-gallery__card');
    const cards = await page.locator('.theme-gallery__card').count();
    if (cards !== index.length) failures.push(`/themes/: ${cards} cards for the ${index.length} entries of themes.json`);
    const values = (prop) =>
      [document.documentElement, ...[...document.querySelectorAll('iframe.vp-example')].map((f) => f.contentDocument.documentElement)].map((e) =>
        getComputedStyle(e).getPropertyValue(prop).trim().toLowerCase(),
      );
    const expectToken = async (what, prop, value, where = '/themes/') => {
      try {
        await page.waitForFunction(([f, prop, value]) => new Function('prop', `return (${f})(prop)`)(prop).every((b) => b === value), [values.toString(), prop, value], { timeout: 5000 });
      } catch {
        failures.push(`${where}, ${what}: ${prop} ${(await page.evaluate(values, prop)).join(', ')} in the page and its frames, not ${value}`);
      }
    };
    const expect = (what, bg, where) => expectToken(what, '--vp-c-bg', bg, where);
    await expectToken('no pick', '--vp-c-brand-2', vitepress);
    const initial = await page.locator('.theme-gallery__card[aria-pressed="true"]').evaluateAll((els) => els.map((e) => e.dataset.theme));
    if (initial.join() !== 'vitepress') failures.push(`/themes/ with no pick: the pressed cards are [${initial}], not vitepress`);
    const nord = index.find((t) => t.name === 'nord');
    await page.click('.theme-gallery__card[data-theme="nord"]');
    await expect('nord picked', nord.light.bg);
    const pressed = await page.locator('.theme-gallery__card[aria-pressed="true"]').evaluateAll((els) => els.map((e) => e.dataset.theme));
    if (pressed.join() !== 'nord') failures.push(`/themes/, nord picked: the pressed cards are [${pressed}]`);
    await page.click('.vp-nav-bar__appearance .vp-switch-appearance');
    await expect('nord picked, dark', nord.dark.bg);
    await page.click('.vp-nav-bar__appearance .vp-switch-appearance');
    await expect('nord picked, light again', nord.light.bg);
    // a page the session opens next, with frames, from its first frame
    await page.goto(`${BASE}/components/button/`);
    await settle(page);
    const first = await page.evaluate(() => window.firstFrameBackground);
    if (first !== nord.light.bg) failures.push(`/components/button/ after nord was picked: --vp-c-bg ${first} at the first frame, not ${nord.light.bg}`);
    await expect('nord picked, on /components/button/', nord.light.bg, '/components/button/');
    await page.goto(`${BASE}/themes/`);
    await page.waitForSelector('.theme-gallery__card');
    const kept = await page.locator('.theme-gallery__card[aria-pressed="true"]').evaluateAll((els) => els.map((e) => e.dataset.theme));
    if (kept.join() !== 'nord') failures.push(`/themes/ opened again after nord was picked: the pressed cards are [${kept}]`);
    await page.click('.theme-gallery__card[data-theme=""]');
    await expect('the stock card picked', index[0].light.bg);
    await expectToken('the stock card picked', '--vp-c-brand-2', stockBrand2);
    await page.goto(`${BASE}/components/button/`);
    await settle(page);
    await expect('the stock card picked, on /components/button/', index[0].light.bg, '/components/button/');
    await expectToken('the stock card picked, on /components/button/', '--vp-c-brand-2', stockBrand2, '/components/button/');
    await context.close();
  } finally {
    await browser.close();
  }
} catch (e) {
  failures.push(`${e.stderr ?? e.stack ?? e.message}`.trim());
} finally {
  rmSync(dir, { recursive: true, force: true });
}
for (const f of failures) console.log(`FAIL  ${f}`);
console.log(`docs: ${components.length} components, ${frames} example frames checked, ${failures.length} failures`);
process.exit(failures.length ? 1 : 0);
