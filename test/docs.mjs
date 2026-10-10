// The documentation (docs/): it builds with zola, it has a page for each
// component the component tests compile (test/entry.css), and its examples
// work. Each example frame (docs/templates/vp-example.html) must load the
// example stylesheet, which must style every class the example's markup
// uses; it must be as tall as its content, so it never scrolls, and no
// wider than the page at a phone's width; and it must take the page's
// appearance, and keep it when the navbar's switch changes it.
//
//   node test/docs.mjs
//
// Needs zola, and vpkit-zola, the theme the site is built with, as a
// sibling checkout: docs/themes/vpkit-zola links to ../vpkit-zola. The
// site is served from its build through a Playwright route. Exits 1,
// listing what fails.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-chromium';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
const ORIGIN = 'http://docs.test';
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

const dir = mkdtempSync(join(tmpdir(), 'vpkit-docs-'));
const site = join(dir, 'site');
let frames = 0;
try {
  execFileSync('zola', ['--root', DOCS, 'build', '--base-url', ORIGIN, '--output-dir', site], { stdio: 'pipe' });
  const css = readFileSync(join(site, 'example.css'), 'utf8');
  const withExamples = readdirSync(site, { recursive: true })
    .filter((f) => f.endsWith('index.html') && readFileSync(join(site, f), 'utf8').includes('<iframe class="vp-example"'))
    .map((f) => `/${f.slice(0, -'index.html'.length)}`)
    .sort();
  const browser = await chromium.launch();
  try {
    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      await context.route(`${ORIGIN}/**`, (route) => {
        let file = join(site, decodeURIComponent(new URL(route.request().url()).pathname));
        if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
        if (!existsSync(file)) return route.fulfill({ status: 404, body: '' });
        return route.fulfill({ contentType: TYPES[extname(file)] ?? 'application/octet-stream', body: readFileSync(file) });
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      for (const path of withExamples) {
        errors.length = 0;
        await page.goto(`${ORIGIN}${path}`);
        const where = `${path} at ${width}px`;
        // after the frames' fonts, two frames for their ResizeObservers
        const settle = () =>
          page.evaluate(async () => {
            for (const f of document.querySelectorAll('iframe.vp-example')) await f.contentDocument.fonts.ready;
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          });
        await settle();
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
                stylesheet: sheets.length === 1 && new URL(sheets[0].href).pathname === '/example.css' && sheets[0].cssRules.length > 0,
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
          if (!f.stylesheet) failures.push(`${frame}: the frame has not loaded example.css alone`);
          for (const c of f.unstyled) failures.push(`${frame}: example.css has no rule for .${c}`);
          if (!f.fits) failures.push(`${frame}: ${f.height}`);
          if (width < 640 && f.overflow) failures.push(`${frame}: ${f.overflow}`);
          if (!f.dark) failures.push(`${frame}: not in the page's appearance`);
        }
        if (width >= 960) {
          // the navbar's switch, both ways
          for (let i = 0; i < 2; i++) {
            await page.click('.vp-nav-bar__appearance .vp-switch-appearance');
            await settle();
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
