// Differential test: every vpkit component against the VitePress
// component it ports. Both sides render in headless Chromium: upstream
// from its own sources (test/upstream/, verbatim at the tag in SOURCE),
// vpkit compiled through Tailwind the way a consumer compiles it. Each
// case compares computed styles in light and dark mode and, where the
// component has them, in forced :hover and :active states.
//
//   npm test
//
// Exits 1, listing every differing property, when any case differs.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-chromium';

import { cases } from './cases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// vars before the components that read them; base.css is layered, so its
// position doesn't matter
const UPSTREAM = ['vars.css', 'base.css', 'VPButton.vue', 'VPBadge.vue'];

function vpkitCss() {
  const dir = mkdtempSync(join(tmpdir(), 'vpkit-test-'));
  try {
    const out = join(dir, 'vpkit.css');
    execFileSync(
      join(ROOT, 'node_modules/.bin/tailwindcss'),
      ['-i', join(ROOT, 'test/entry.css'), '-o', out],
      { stdio: 'pipe' },
    );
    return readFileSync(out, 'utf8');
  } finally {
    rmSync(dir, { recursive: true });
  }
}

// a .vue file contributes its <style> block: `scoped` only adds an
// attribute selector, which an isolated page doesn't need
function upstreamCss() {
  return UPSTREAM.map((file) => {
    const src = readFileSync(join(ROOT, 'test/upstream', file), 'utf8');
    if (!file.endsWith('.vue')) return src;
    const style = src.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    if (!style) throw new Error(`no <style> block in ${file}`);
    return style[1];
  }).join('\n');
}

async function open(browser, css, body, dark) {
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html${dark ? ' class="dark"' : ''}><head><style>${css}</style></head><body>${body}</body></html>`,
  );
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  return { page, cdp };
}

async function nodeId(cdp, t) {
  const { root } = await cdp.send('DOM.getDocument');
  const { nodeId } = await cdp.send('DOM.querySelector', {
    nodeId: root.nodeId,
    selector: `[data-t="${t}"]`,
  });
  if (!nodeId) throw new Error(`no [data-t="${t}"] to force a state on`);
  return nodeId;
}

async function measure({ page, cdp }, { target, on, state, props }) {
  const node = state ? await nodeId(cdp, on ?? target) : null;
  if (node) await cdp.send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses: state });
  const values = await page.evaluate(
    ([target, props]) => {
      // getAnimations() flushes the style change the forced state just
      // made, so its transitions exist here; finish() jumps them to their
      // end values instead of reading a color halfway through
      for (const animation of document.getAnimations()) animation.finish();
      const el = document.querySelector(`[data-t="${target}"]`);
      const style = getComputedStyle(el);
      return Object.fromEntries(
        props.map((p) => [
          p,
          p === 'height' ? `${el.getBoundingClientRect().height}px` : style.getPropertyValue(p),
        ]),
      );
    },
    [target, props],
  );
  if (node) await cdp.send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses: [] });
  return values;
}

const sides = { upstream: upstreamCss(), vpkit: vpkitCss() };
const browser = await chromium.launch();
const failures = [];
let compared = 0;
try {
  for (const c of cases) {
    for (const dark of [false, true]) {
      const pages = {};
      for (const side of ['upstream', 'vpkit']) {
        pages[side] = await open(browser, sides[side], c[side], dark);
      }
      for (const check of c.checks) {
        const upstream = await measure(pages.upstream, check);
        const vpkit = await measure(pages.vpkit, check);
        const where = `${c.name} [${dark ? 'dark' : 'light'}${check.state ? ` :${check.state.join(':')}` : ''}] ${check.target}`;
        for (const prop of check.props) {
          compared++;
          if (upstream[prop] !== vpkit[prop]) {
            failures.push(`${where} ${prop}: upstream ${upstream[prop]} | vpkit ${vpkit[prop]}`);
          }
        }
      }
      for (const { page } of Object.values(pages)) await page.close();
    }
  }
} finally {
  await browser.close();
}

for (const f of failures) console.log(`DIFF  ${f}`);
console.log(
  `${cases.length} cases × light/dark: ${compared} computed values compared, ${failures.length} differ`,
);
process.exit(failures.length ? 1 : 0);
