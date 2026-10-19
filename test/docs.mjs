// The documentation (docs/): it builds with zola, it has a page for each
// component (the app kit's and the docs theme's), with an entry in its
// product's group of the sidebar; each page shows every example file of
// its component's directory (the markup the crate's tests render, so none
// is held by a test and shown by no page), and its examples work.
// Each example frame (docs/templates/vp-example.html) must load its example
// stylesheet, which must style every class the example's markup uses; it
// must be as tall as its content, so it never scrolls, and no wider than
// the page at a phone's width; and it must take the page's appearance, and
// keep it when the navbar's switch changes it. The theme gallery's index
// (docs/static/themes.json) must hold the stock colors and then every theme
// of themes/; the site must be on the stock colors from a page's first
// frame until the session picks a theme (the page and the docs theme's
// frames on docs-theme/vars.css's, VitePress's palette; the app kit's
// frames on tokens.css's, the fitted one); a pick must recolor the page
// and its example frame in both modes, and the next pages the session
// opens from their first frame; and the stock card must take the page
// back to the stock colors, on the next pages too. Also held: the
// theme counts the prose states against the index; a pick's card pressed
// again on the next visit, an encoded name's too; two picks back to back
// never through the stock colors; the stock card pressed while a pick loads
// leaves no theme linked; a pick with no stylesheet is forgotten; with
// JavaScript off the stock colors; and no page error.
//
//   node test/docs.mjs
//
// Needs zola, and vpkit-zola, the theme the site is built with, as a
// sibling checkout: docs/themes/vpkit-zola links to ../vpkit-zola. The
// site is built under a path, as GitHub Pages serves it (/vpkit/), and
// served from its build through a Playwright route, which answers nothing
// outside that path. Exits 1, listing what fails.

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join } from 'node:path';
import { chromium } from 'playwright-chromium';
import { parse } from 'smol-toml';
import { ROOT, componentDirs, examples } from '../scripts/components.mjs';
import { modeValues, side } from '../scripts/css.mjs';

const DOCS = join(ROOT, 'docs');
const ORIGIN = 'http://docs.test';
const BASE = `${ORIGIN}/vpkit`;
const TYPES = { '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.html': 'text/html', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain' };
const WIDTHS = [1280, 375];
const failures = [];

// the components: every directory of the app kit and the docs theme; a
// page for each, and no page without one
const components = [...componentDirs(''), ...componentDirs('docs-theme')].map((d) => basename(d));
const pages = readdirSync(join(DOCS, 'content/components')).filter((f) => f !== '_index.md' && f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
for (const name of components) if (!pages.includes(name)) failures.push(`${name} has no page: docs/content/components/${name}.md`);
for (const name of pages.filter((p) => !components.includes(p))) failures.push(`docs/content/components/${name}.md: no component directory is named ${name}`);

// the sidebar (config.toml's extra.sidebar): an entry for every component's
// page in its product's group, the app kit's under Components and the docs
// theme's under Docs theme, its text the page's title, and none for a page
// another group's or no component's
const sidebar = parse(readFileSync(join(DOCS, 'config.toml'), 'utf8')).extra.sidebar;
for (const [group, product] of [['Components', ''], ['Docs theme', 'docs-theme']]) {
  const names = componentDirs(product).map((d) => basename(d));
  const entries = new Map(sidebar.find((g) => g.text === group).items.map((i) => [i.link.match(/^@\/components\/(.+)\.md$/)[1], i.text]));
  for (const name of names.filter((n) => pages.includes(n))) {
    const [, title] = readFileSync(join(DOCS, 'content/components', `${name}.md`), 'utf8').match(/^title = "(.*)"$/m);
    if (!entries.has(name)) failures.push(`docs/config.toml: the ${group} sidebar has no entry for ${name}.md, "${title}"`);
    else if (entries.get(name) !== title) failures.push(`docs/config.toml: the ${group} sidebar calls ${name}.md "${entries.get(name)}", its title is "${title}"`);
  }
  for (const name of [...entries.keys()].filter((n) => !names.includes(n))) failures.push(`docs/config.toml: the ${group} sidebar links ${name}.md, which is not one of its components`);
}

// a component VitePress has no original for (its description says
// "vpkit's own") carries a vpkit badge after its page's heading, as
// VitePress writes a badge in a heading, with the heading's id written
// out so the badge's text stays out of it; a port of an original carries
// none. The page's <title> and its sidebar entry are the title alone.
const BADGE = '<span class="vp-badge" data-variant="tip">vpkit</span>';
for (const name of pages) {
  const md = readFileSync(join(DOCS, 'content/components', `${name}.md`), 'utf8');
  const own = /^description = .*vpkit's own/m.test(md);
  const [h1] = md.match(/^# .*$/m);
  if (own && !(h1.includes(` ${BADGE} {#`) && /\{#[a-z-]+\}$/.test(h1))) failures.push(`docs/content/components/${name}.md: vpkit's own, but its heading has no vpkit badge and id: ${h1}`);
  if (!own && h1.includes(BADGE)) failures.push(`docs/content/components/${name}.md: a VitePress original's port, but its heading has the vpkit badge: ${h1}`);
}

// every example file of a component's directory (components/<name>/
// examples/<id>.html, the markup the crate's tests render too) is shown by
// the component's page, as `vp_example file="<name>/<id>"`
for (const product of ['', 'docs-theme']) {
  for (const { name, id } of examples(product)) {
    if (!pages.includes(name)) continue;
    const md = readFileSync(join(DOCS, 'content/components', `${name}.md`), 'utf8');
    if (!md.includes(`<vp_example file="${name}/${id}"`)) failures.push(`docs/content/components/${name}.md: components/${name}/examples/${id}.html is shown by no vp_example on the page`);
  }
}

// the Rust crate: every component it exports (rust/src/lib.rs, one module
// per component) is linked from the component's page, into the crate's
// documentation, which test/rust.mjs builds into rust/target/doc and the
// site serves under /rust/ (docs.yml copies it there; below, the links are
// followed into it)
const RUSTDOC = join(ROOT, 'rust/target/doc');
for (const [, module, items] of readFileSync(join(ROOT, 'rust/src/lib.rs'), 'utf8').matchAll(/^pub use (\w+)::\{?([^};]+)\}?;/gm)) {
  const page = readFileSync(join(DOCS, 'content/components', `${module}.md`), 'utf8');
  for (const item of items.split(',').map((i) => i.trim()).filter((i) => /^[A-Z]/.test(i))) {
    if (!page.includes(`(../../rust/vpkit/struct.${item}.html)`)) failures.push(`docs/content/components/${module}.md: no link to the crate's ${item}`);
  }
}

const index = JSON.parse(readFileSync(join(DOCS, 'static/themes.json'), 'utf8'));
// in the order of the files' names, as the index has them
const stems = readdirSync(join(ROOT, 'themes')).filter((f) => f.endsWith('.css')).sort().map((f) => f.slice(0, -'.css'.length));
if (JSON.stringify(index.map((t) => t.name)) !== JSON.stringify(['', ...stems])) failures.push('docs/static/themes.json: not the stock colors and then every theme of themes/');
// every theme count the pages and the README state is the index's: the
// total, the curated and the Helix-mapped
{
  const total = index.length - 1;
  const curated = index.filter((t) => t.source === 'curated').length;
  const helix = index.filter((t) => t.source === 'helix').length;
  const content = join(DOCS, 'content');
  for (const file of [join(ROOT, 'README.md'), ...readdirSync(content, { recursive: true }).filter((f) => f.endsWith('.md')).map((f) => join(content, f))]) {
    const text = readFileSync(file, 'utf8');
    for (const [pattern, want, what] of [
      [/\b(\d+) (?:ready-made )?color themes\b/g, total, 'color themes'],
      [/\b(\d+) of them\b/g, total, 'of them'],
      [/\b(\d+) are curated\b/g, curated, 'curated'],
      [/\b(\d+) are mapped automatically\b/g, helix, 'Helix-mapped'],
      [/\bthe other (\d+) are mapped\b/g, helix, 'Helix-mapped'],
    ]) {
      for (const m of text.matchAll(pattern)) {
        if (Number(m[1]) !== want) failures.push(`${file.slice(ROOT.length + 1)}: says ${m[0]}, the index has ${want} ${what}`);
      }
    }
  }
}

const dir = mkdtempSync(join(tmpdir(), 'vpkit-docs-'));
const site = join(dir, 'site');
let frames = 0;
try {
  execFileSync('zola', ['--root', DOCS, 'build', '--base-url', BASE, '--output-dir', site], { stdio: 'pipe' });
  // the crate's documentation where docs.yml publishes it, and every link
  // into it resolving to a file
  if (!existsSync(join(RUSTDOC, 'vpkit/index.html'))) throw new Error('no rust/target/doc: run node test/rust.mjs first');
  cpSync(RUSTDOC, join(site, 'rust'), { recursive: true });
  // the file a URL's path serves, as the route below serves it; null for none
  const fileFor = (pathname) => {
    const path = decodeURIComponent(pathname);
    if (!path.startsWith('/vpkit/')) return null;
    let file = join(site, path.slice('/vpkit'.length));
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    return existsSync(file) ? file : null;
  };
  // the site's own pages, the crate's documentation aside, read once
  const built = readdirSync(site, { recursive: true })
    .filter((f) => f.endsWith('index.html') && !f.startsWith('rust/'))
    .map((f) => ({ path: `/${f.slice(0, -'index.html'.length)}`, html: readFileSync(join(site, f), 'utf8') }));
  for (const { path, html } of built) {
    const at = new URL(`/vpkit${path}`, ORIGIN);
    for (const [, href] of html.matchAll(/href="([^"#]*rust\/[^"#]*)"/g)) {
      const url = new URL(href, at);
      if (url.origin === ORIGIN && !fileFor(url.pathname)) failures.push(`/vpkit${path}: the link ${href} leads to no file`);
    }
  }
  const stylesheets = {
    '/vpkit/example.css': readFileSync(join(site, 'example.css'), 'utf8'),
    '/vpkit/example-docs-theme.css': readFileSync(join(site, 'example-docs-theme.css'), 'utf8'),
  };
  const withExamples = built
    .filter((p) => p.html.includes('<iframe class="vp-example"'))
    .map((p) => p.path)
    .sort();
  // after the frames' fonts, two frames for their ResizeObservers
  const settle = (page) =>
    page.evaluate(async () => {
      for (const f of document.querySelectorAll('iframe.vp-example')) {
        await f.contentDocument.fonts.ready;
        // the page's theme links, cloned into the frame by example.js, until they have loaded (or failed)
        for (const l of f.contentDocument.querySelectorAll('link[data-theme]')) {
          if (!l.sheet) await new Promise((r) => { l.addEventListener('load', r, { once: true }); l.addEventListener('error', r, { once: true }); });
        }
      }
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });
  const serve = (route) => {
    const file = fileFor(new URL(route.request().url()).pathname);
    if (!file) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ contentType: TYPES[extname(file)] ?? 'application/octet-stream', body: readFileSync(file) });
  };
  const browser = await chromium.launch();
  try {
    const runWidth = async (width, paths) => {
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      await context.route(`${ORIGIN}/**`, serve);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      for (const path of paths) {
        errors.length = 0;
        await page.goto(`${BASE}${path}`);
        const where = `${path} at ${width}px`;
        await settle(page);
        const report = () =>
          page.evaluate((stylesheets) => {
            const dark = document.documentElement.classList.contains('dark');
            return [...document.querySelectorAll('iframe.vp-example')].map((f) => {
              const doc = f.contentDocument;
              const root = doc.documentElement;
              const sheets = [...doc.styleSheets];
              const own = sheets[0]?.href ? new URL(sheets[0].href).pathname : '';
              const css = stylesheets[own] ?? '';
              const classes = [...new Set([doc.body, ...doc.body.querySelectorAll('*')].flatMap((e) => [...e.classList]))];
              const unstyled = classes.filter((c) => !new RegExp(`\\.${CSS.escape(c).replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}(?![-\\w\\\\])`).test(css));
              const content = Math.ceil(root.getBoundingClientRect().height);
              const minHeight = parseFloat(getComputedStyle(f).minHeight) || 0;
              return {
                title: f.title,
                // its example stylesheet with rules, then exactly the page's theme links (none until a pick); an
                // inline <style> has no href and fails the frame, not the run
                stylesheet:
                  sheets.every((s) => s.href) &&
                  own in stylesheets &&
                  sheets.map((s) => new URL(s.href).pathname).join() ===
                    [own, ...[...document.head.querySelectorAll('link[data-theme]')].map((l) => new URL(l.href).pathname)].join() &&
                  sheets[0].cssRules.length > 0,
                unstyled,
                fits: f.clientHeight === Math.max(content, minHeight) && root.scrollHeight <= root.clientHeight,
                height: `${f.clientHeight}px for ${content}px of content${minHeight ? `, at least ${minHeight}px` : ''}`,
                overflow: root.scrollWidth > root.clientWidth ? `${root.scrollWidth}px of content in ${root.clientWidth}px` : '',
                dark: root.classList.contains('dark') === dark,
              };
            });
          }, stylesheets);
        for (const f of await report()) {
          frames++;
          const frame = `${where}, "${f.title}"`;
          if (!f.stylesheet) failures.push(`${frame}: the frame has not loaded its example stylesheet and then the page's theme`);
          for (const c of f.unstyled) failures.push(`${frame}: the example stylesheet has no rule for .${c}`);
          if (!f.fits) failures.push(`${frame}: ${f.height}`);
          if (width < 640 && f.overflow) failures.push(`${frame}: ${f.overflow}`);
          if (!f.dark) failures.push(`${frame}: not in the page's appearance`);
        }
        // a link to nowhere (`href="#"`) in a frame stays put (example.js): the
        // browser would otherwise take `#` as the page and load it into the frame
        const navigated = await page.evaluate(async () => {
          const out = [];
          for (const f of document.querySelectorAll('iframe.vp-example')) {
            const doc = f.contentDocument;
            const a = doc.querySelector('a[href="#"]');
            if (!a) continue;
            a.click();
            await new Promise((r) => setTimeout(r, 50));
            if (f.contentDocument !== doc || f.contentWindow.location.href !== 'about:srcdoc') out.push(f.title);
          }
          return out;
        });
        for (const title of navigated) failures.push(`${where}, "${title}": a link to # navigated the frame`);
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
    };
    // the theme gallery: a card for each theme of the index; the stock
    // colors until a pick, then the pick in the page and its frame, light
    // and dark, then in the next pages the session opens, then the stock
    // card's colors again. A theme is read by its --vp-c-brand-hover, the
    // hovered link's color, which every theme fits for itself. A theme's
    // stylesheet answers 300ms late, so a page that painted before it
    // arrived would show it: each page records it at its first frame.
    const runGallery = async () => {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await context.route(`${ORIGIN}/**`, async (route) => {
        if (/\/vpkit\/themes\/[^/]+\.css$/.test(new URL(route.request().url()).pathname)) await new Promise((r) => setTimeout(r, 300));
        return serve(route);
      });
      // in every window, the page's and its frames': its --vp-c-brand-hover's
      // light side (a light-dark() pair's computed value is the pair itself),
      // the page's with its frames', and its own at its first frame
      await context.addInitScript(() => {
        window.brandHover = (root = document.documentElement) =>
          getComputedStyle(root).getPropertyValue('--vp-c-brand-hover').trim().toLowerCase().replace(/^light-dark\(\s*([^,]+),.*$/, '$1').trim();
        // each window's value, and whether it is the docs theme's (the page, or a frame on the docs theme's stylesheet)
        window.brandHoverAll = () => [document, ...[...document.querySelectorAll('iframe.vp-example')].map((f) => f.contentDocument)].map((d, i) => ({ value: brandHover(d.documentElement), docs: i === 0 || !!d.querySelector('link[href*="example-docs-theme"]') }));
        requestAnimationFrame(() => { window.firstFrameBrandHover = brandHover(); });
      });
      const page = await context.newPage();
      page.on('pageerror', (e) => failures.push(`the gallery's pages: ${e.message}`));
      const KEY = 'vpkit-docs-theme';
      const theme = (name) => index.find((t) => t.name === name);
      // what a window must show: a theme's brand-hover everywhere, or the
      // stock's, which is the docs theme's in the page and its frames and
      // the app kit's in the app kit's frames
      const wanted = (value, docs) => (typeof value === 'string' ? value : docs ? value.docs : value.app);
      const name = (value) => (typeof value === 'string' ? value : `${value.docs} (the docs theme) / ${value.app} (the app kit)`);
      // the page and its frames on a theme's brand-hover, within 5s
      const expect = async (what, value, where = '/themes/') => {
        try {
          await page.waitForFunction(
            (value) => brandHoverAll().every((b) => b.value === (typeof value === 'string' ? value : b.docs ? value.docs : value.app)),
            value,
            { timeout: 5000 },
          );
        } catch (e) {
          if (e.name !== 'TimeoutError') throw e;
          failures.push(`${where}, ${what}: --vp-c-brand-hover ${(await page.evaluate(() => brandHoverAll().map((b) => b.value))).join(', ')} in the page and its frames, not ${name(value)}`);
        }
      };
      // the page and its frames on a theme's brand-hover at their first frame
      const expectFirst = async (what, value, where = '/themes/') => {
        const first = await page.evaluate(() => [window, ...[...document.querySelectorAll('iframe.vp-example')].map((f) => f.contentWindow)].map((w, i) => [w.firstFrameBrandHover, i === 0 || !!w.document.querySelector('link[href*="example-docs-theme"]')]));
        for (const [i, [got, docs]] of first.entries()) {
          if (got !== wanted(value, docs)) failures.push(`${where}, ${what}${i ? `, frame ${i}` : ''}: --vp-c-brand-hover ${got} at the first frame, not ${wanted(value, docs)}`);
        }
      };
      const expectPressed = async (what, name) => {
        const pressed = (await page.locator('.theme-gallery__card[aria-pressed="true"]').evaluateAll((els) => els.map((e) => e.dataset.theme))).join();
        if (pressed !== name) failures.push(`/themes/, ${what}: the pressed cards are [${pressed}], not ${name}`);
      };
      // the site is on the stock colors until a pick, from the first frame:
      // the docs theme's brand-hover (docs-theme/vars.css's, VitePress's
      // palette) in the page and the docs theme's frames, tokens.css's
      // (themes.json's stock entry) in the app kit's frames, which write
      // the page's theme links into their own heads as they are parsed; and
      // the stock card pressed
      const docsStock = modeValues(readFileSync(join(ROOT, 'docs-theme/vars.css'), 'utf8'), ':root', 'light').get('--vp-c-brand-hover').toLowerCase();
      const stock = { docs: docsStock, app: index[0].light['brand-hover'] };
      await page.goto(`${BASE}/themes/`);
      await page.waitForSelector('.theme-gallery__card');
      await expectFirst('no pick', stock);
      const cards = await page.locator('.theme-gallery__card').count();
      if (cards !== index.length) failures.push(`/themes/: ${cards} cards for the ${index.length} entries of themes.json`);
      await expect('no pick', stock);
      await expectPressed('no pick', '');
      const nord = theme('nord');
      await page.click('.theme-gallery__card[data-theme="nord"]');
      await expect('nord picked', nord.light['brand-hover']);
      await expectPressed('nord picked', 'nord');
      await page.click('.vp-nav-bar__appearance .vp-switch-appearance');
      await expect('nord picked, dark', nord.light['brand-hover']);
      await page.click('.vp-nav-bar__appearance .vp-switch-appearance');
      await expect('nord picked, light again', nord.light['brand-hover']);
      // a page the session opens next, with frames, from its first frame
      await page.goto(`${BASE}/components/button/`);
      await settle(page);
      await expectFirst('nord picked', nord.light['brand-hover'], '/components/button/');
      await expect('nord picked, on /components/button/', nord.light['brand-hover'], '/components/button/');
      await page.goto(`${BASE}/themes/`);
      await page.waitForSelector('.theme-gallery__card');
      await expectPressed('opened again after nord was picked', 'nord');
      // a name with a character the URL encodes keeps its card pressed on
      // the next visit (the link carries the name, only the URL is encoded)
      const plus = index.find((t) => t.name.includes('+'));
      await page.click(`.theme-gallery__card[data-theme="${plus.name}"]`);
      await expect(`${plus.name} picked`, plus.light['brand-hover']);
      await page.goto(`${BASE}/themes/`);
      await page.waitForSelector('.theme-gallery__card');
      await expectPressed(`opened again after ${plus.name} was picked`, plus.name);
      // two picks back to back: the page goes from the theme it had to the
      // second pick's, never through the stock colors (an earlier pick's
      // load must not unlink a later one's)
      const github = theme('github');
      // the sampler runs in the page from before the clicks, every 10ms,
      // until github's color arrives
      await page.evaluate((until) => {
        window.sampled = (async () => {
          const seen = new Set();
          const start = performance.now();
          while (performance.now() - start < 3000) {
            const now = brandHover();
            seen.add(now);
            if (now === until) break;
            await new Promise((r) => setTimeout(r, 10));
          }
          return [...seen];
        })();
      }, github.light['brand-hover']);
      await page.click('.theme-gallery__card[data-theme="nord"]');
      await page.click('.theme-gallery__card[data-theme="github"]');
      const seen = await page.evaluate(() => window.sampled);
      if (seen.includes(stock.app) || seen.includes(stock.docs)) failures.push(`/themes/, nord then github picked back to back: the page passed through the stock colors (${seen.join(' > ')})`);
      await expect('github picked after nord', github.light['brand-hover']);
      // the stock card pressed while a pick's stylesheet is still on its way
      // (300ms here) leaves no theme linked
      await page.click('.theme-gallery__card[data-theme="nord"]');
      await page.click('.theme-gallery__card[data-theme=""]');
      await expect('the stock card picked', stock);
      await page.waitForTimeout(400);
      const linked = await page.evaluate(() => [...document.head.querySelectorAll('link[data-theme]')].map((l) => l.dataset.theme));
      if (linked.length) failures.push(`/themes/, the stock card picked while nord was loading: [${linked}] still linked`);
      await expect('the stock card picked, after nord arrived', stock);
      await page.goto(`${BASE}/components/button/`);
      await settle(page);
      await expect('the stock card picked, on /components/button/', stock, '/components/button/');
      // a pick whose stylesheet no longer exists is forgotten, and the page
      // is on the stock colors
      await page.evaluate((key) => sessionStorage.setItem(key, 'no-such-theme'), KEY);
      await page.goto(`${BASE}/components/button/`);
      await settle(page);
      await expect('a pick with no stylesheet', stock, '/components/button/');
      const stored = await page.evaluate((key) => sessionStorage.getItem(key), KEY);
      if (stored !== null) failures.push(`/components/button/ after a pick with no stylesheet: the session still stores ${JSON.stringify(stored)}`);
      // with JavaScript off, the stock colors
      const noScript = await browser.newContext({ javaScriptEnabled: false });
      await noScript.route(`${ORIGIN}/**`, serve);
      const plain = await noScript.newPage();
      await plain.goto(`${BASE}/components/button/`);
      const plainBrandHover = side(await plain.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--vp-c-brand-hover').trim().toLowerCase()), 'light');
      if (plainBrandHover !== stock.docs) failures.push(`/components/button/ with JavaScript off: --vp-c-brand-hover ${plainBrandHover}, not the docs theme's stock ${stock.docs}`);
      await noScript.close();
      await context.close();
    };
    // the widths, each one's pages in three slices, and the gallery share
    // nothing but the failures, so they run at once
    const slices = [0, 1, 2].map((k) => withExamples.filter((_, i) => i % 3 === k));
    await Promise.all([...WIDTHS.flatMap((width) => slices.map((paths) => runWidth(width, paths))), runGallery()]);
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
