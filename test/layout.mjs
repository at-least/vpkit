// Layout components against VitePress's originals.
//
//   node test/layout.mjs
//
// A case takes one VitePress component from a page VitePress
// v2.0.0-alpha.20 rendered (test/upstream/pages, from vitepress.dev): the
// component's own elements, which Vue's data-v scope attribute marks, with
// every child component reduced to its root and only the classes this
// component gives it, so neither side needs another component's rules.
// Upstream renders that tree with VitePress's vars, fonts (the :root rule),
// base, utils and icons stylesheets plus the component's <style>, Vue's
// scoping stripped as in the other tests; vpkit renders the same tree with
// its classes renamed by test/layout-map.mjs, vpkit compiled through
// Tailwind. Every element's computed style, its ::before and ::after, and its
// box are compared at each viewport, and in dark mode at one.
//
// Exits 1, listing every differing value, when any case differs.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-chromium';

import { FILES, cssClasses, fileText, rootStates, styleOf, unwrapDeep } from '../scripts/vitepress-port.mjs';
import { blockOf, isGlobal, rootOf } from './layout-map.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(ROOT, file), 'utf8');

// widths on both sides of VitePress's breakpoints (40, 48, 60, 80, 90rem)
const VIEWPORTS = [375, 768, 960, 1280, 1440, 1600];
const DARK_AT = 1280;

// page: a test/upstream/pages file to take the component from; markup:
// upstream markup written out instead, for what no page renders; toggle:
// root classes to add (true) or remove (false) on both sides; states:
// pseudo-classes to force on the root, one run each. A case without a
// component (global styles) names its selector and its upstream
// stylesheets, and takes the whole subtree as it is: no scope, no renaming;
// drop removes elements first; widths replaces the default widths.
const cases = [
  { component: 'Layout', page: 'guide_getting-started.html' },
  { component: 'VPContent', name: 'doc page', page: 'guide_getting-started.html' },
  { component: 'VPContent', name: 'home page', page: 'home.html' },
  { component: 'VPDoc', name: 'with sidebar', page: 'guide_getting-started.html' },
  { component: 'VPDoc', name: 'without sidebar', page: 'guide_getting-started.html', toggle: { 'has-sidebar': false } },
  { component: 'VPSkipLink', page: 'guide_getting-started.html', states: [[], ['focus']] },
  // rendered only while the sidebar is open
  { component: 'VPBackdrop', markup: '<div class="VPBackdrop"></div>' },
  // the markdown page: every block VitePress's markdown renders. Its code
  // blocks with a title bar and its MathJax formulas come from vitepress.dev's
  // plugins, which bring their own styles, not VitePress's.
  {
    name: 'markdown content',
    page: 'guide_markdown.html',
    selector: '.vp-doc',
    upstream: ['vp-doc.css', 'custom-block.css', 'vp-code-group.css', 'vp-code.css'],
    drop: '.vp-code-block-title, mjx-container',
    widths: [375, 1280],
  },
];

// intentional differences: { case: /name/, element: /path/, prop, reason }
const known = [];

const SIDES = ['top', 'right', 'bottom', 'left'];
const PROPS = [
  'display', 'position', ...SIDES, 'z-index', 'box-sizing',
  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  ...SIDES.map((s) => `margin-${s}`), ...SIDES.map((s) => `padding-${s}`),
  ...SIDES.flatMap((s) => [`border-${s}-width`, `border-${s}-style`, `border-${s}-color`]),
  ...['top-left', 'top-right', 'bottom-right', 'bottom-left'].map((c) => `border-${c}-radius`),
  'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis', 'order',
  'justify-content', 'align-items', 'align-self', 'row-gap', 'column-gap',
  'grid-template-columns', 'grid-template-rows',
  'overflow-x', 'overflow-y', 'visibility', 'opacity', 'transform', 'clip', 'clip-path',
  'color', 'background-color', 'background-image', 'box-shadow',
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing',
  'text-align', 'text-decoration-line', 'text-transform', 'white-space', 'text-overflow', 'vertical-align',
  'cursor', 'pointer-events', 'outline-style', 'outline-width', 'outline-offset',
  'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay',
  'mask-image', 'list-style-type', 'scrollbar-width',
];
const PSEUDO_PROPS = [
  'content', 'display', 'position', ...SIDES, 'width', 'height', 'color', 'background-color',
  'background-image', 'opacity', 'transform', 'mask-image',
];

function vpkitCss() {
  const dir = mkdtempSync(join(tmpdir(), 'vpkit-layout-'));
  try {
    const out = join(dir, 'vpkit.css');
    execFileSync(
      join(ROOT, 'node_modules/.bin/tailwindcss'),
      // unminified, as a docs theme should ship it: the minifier rounds
      // numbers to six digits, and VitePress's line-height 1.3333333 as
      // 1.33333 makes every h2 1/64px shorter, 0.375px down the markdown page
      ['-i', join(ROOT, 'test/layout-entry.css'), '-o', out],
      { stdio: 'pipe' },
    );
    return readFileSync(out, 'utf8');
  } finally {
    rmSync(dir, { recursive: true });
  }
}

// VitePress's global stylesheets, as its theme loads them; of fonts.css
// only the :root rule that puts Inter first (the rest fetches webfonts)
function upstreamGlobals() {
  const fontsRoot = read('test/upstream/fonts.css').match(/\n:root \{[^}]*\}/g).at(-1);
  return [read('test/upstream/vars.css'), fontsRoot, read('test/upstream/base.css'),
    read('test/upstream/utils.css'), read('test/upstream/icons.css')].join('\n');
}

// What a case renders, upstream and vpkit, from the same tree. In the
// page: the component's root, its own elements (they carry its scope id),
// child component roots with only this component's classes, text.
function trees(browser, c) {
  const html = c.markup ?? read(`test/upstream/pages/${c.page}`);
  if (!c.component) {
    return browser.newPage().then(async (page) => {
      const tree = await page.evaluate(
        ([html, selector, drop]) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const root = doc.body.querySelector(selector);
          if (!root) throw new Error(`no ${selector} in the page`);
          if (drop) for (const el of root.querySelectorAll(drop)) el.remove();
          for (const el of [root, ...root.querySelectorAll('*')]) {
            for (const a of el.getAttributeNames()) if (a.startsWith('data-v-')) el.removeAttribute(a);
          }
          return root.outerHTML;
        },
        [html, c.selector, c.drop],
      );
      await page.close();
      return { upstream: tree, vpkit: tree };
    });
  }
  const css = unwrapDeep(styleOf(c.component));
  const names = {
    root: rootOf(c.component),
    block: blockOf(c.component),
    own: [...cssClasses(css)],
    states: [...rootStates(c.component, css)],
  };
  return browser.newPage().then(async (page) => {
    const result = await page.evaluate(
      ([html, names, toggle, fromPage, globals]) => {
        const isGlobal = (n) => globals.includes(n) || n.startsWith('vpi-');
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const root = doc.body.querySelector(`.${names.root}`);
        if (!root) throw new Error(`no .${names.root} in the page`);
        const scopes = (el) => el.getAttributeNames().filter((a) => a.startsWith('data-v-'));
        const scope = fromPage ? scopes(root).at(-1) : null;
        if (fromPage && !scope) throw new Error(`.${names.root} has no scope id`);
        for (const [cls, on] of Object.entries(toggle ?? {})) root.classList.toggle(cls, on);

        // keep: the root's own block and states, an element's own classes,
        // global classes; on a child component's root, only ours
        const keep = (el, isRoot) =>
          [...el.classList].filter((n) =>
            isRoot ? n === names.root || names.states.includes(n) || isGlobal(n) : names.own.includes(n) || isGlobal(n),
          );
        function copy(el, isRoot) {
          const out = doc.createElement(el.tagName.toLowerCase());
          for (const a of el.getAttributeNames()) {
            if (a !== 'class' && !a.startsWith('data-v-')) out.setAttribute(a, el.getAttribute(a));
          }
          const classes = keep(el, isRoot);
          if (classes.length) out.setAttribute('class', classes.join(' '));
          const childRoot = !isRoot && fromPage && scopes(el).some((s) => s !== scope);
          if (childRoot) return out;
          for (const node of el.childNodes) {
            if (node.nodeType === 3) out.append(node.textContent);
            else if (node.nodeType === 1 && (!fromPage || scopes(node).includes(scope))) out.append(copy(node, false));
          }
          return out;
        }
        const tree = copy(root, true);
        const upstream = tree.outerHTML;
        const rename = (n) =>
          n === names.root ? names.block
            : isGlobal(n) ? n
              : names.states.includes(n) ? `${names.block}--${n}`
                : `${names.block}__${n}`;
        for (const el of [tree, ...tree.querySelectorAll('[class]')]) {
          el.setAttribute('class', [...el.classList].map(rename).join(' '));
        }
        return { upstream, vpkit: tree.outerHTML };
      },
      [html, names, c.toggle, !c.markup, ['dark', 'vp-doc', 'visually-hidden']],
    );
    await page.close();
    return result;
  });
}

// lengths match within 1/32px: layout rounds to 1/64px
const PX = /^-?\d+(\.\d+)?px$/;
const NO_SHADOW = /rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?/g;
function same(a, b, prop) {
  if (prop.endsWith('box-shadow')) [a, b] = [a.replace(NO_SHADOW, ''), b.replace(NO_SHADOW, '')];
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1 / 32;
  return PX.test(a) && PX.test(b) && Math.abs(parseFloat(a) - parseFloat(b)) <= 1 / 32;
}

const BODY = 'color:var(--vp-c-text-1);background-color:var(--vp-c-bg);margin:0';

async function render(browser, css, body, width, dark, states) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.setContent(
    `<!doctype html><html${dark ? ' class="dark"' : ''}><head><style>${css}</style></head><body style="${BODY}">${body}</body></html>`,
  );
  if (states.length) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'body > *' });
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: states });
  }
  const values = await page.evaluate(
    ([props, pseudoProps]) => {
      for (const animation of document.getAnimations()) animation.finish();
      return [...document.body.querySelectorAll('*')].map((el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const v = { 'box x': r.x, 'box y': r.y, 'box width': r.width, 'box height': r.height };
        for (const p of props) v[p] = s.getPropertyValue(p);
        for (const pseudo of ['::before', '::after']) {
          const ps = getComputedStyle(el, pseudo);
          v[`${pseudo} content`] = ps.content;
          if (ps.content === 'none' || ps.content === 'normal') continue;
          for (const p of pseudoProps) v[`${pseudo} ${p}`] = ps.getPropertyValue(p);
        }
        return v;
      });
    },
    [PROPS, PSEUDO_PROPS],
  );
  await page.close();
  return values;
}

// an element's place, for the report: its tag and upstream classes
function paths(html) {
  const out = [];
  for (const m of html.matchAll(/<([a-z0-9]+)((?:\s[^>]*?)?)>/g)) {
    const cls = m[2].match(/class="([^"]*)"/)?.[1];
    out.push(`${m[1]}${cls ? '.' + cls.trim().split(/\s+/).join('.') : ''}`);
  }
  return out;
}

// the layout files are the port's output, so every declaration is
// VitePress's: a hand edit belongs in scripts/vitepress-port.mjs
const failures = [];
for (const name of Object.keys(FILES)) {
  if (read(name) !== fileText(name)) failures.push(`${name} is not the port's output: node scripts/vitepress-port.mjs --write`);
}

const upstreamBase = upstreamGlobals();
const vpkit = vpkitCss();
const browser = await chromium.launch();
const expected = [];
let compared = 0;
let renders = 0;
try {
  for (const c of cases) {
    const label = [c.component, c.name].filter(Boolean).join(' ');
    const tree = await trees(browser, c);
    const where = paths(tree.upstream);
    const own = c.component ? [unwrapDeep(styleOf(c.component))] : c.upstream.map((f) => read(`test/upstream/${f}`));
    const upstreamCss = [upstreamBase, ...own].join('\n');
    const runs = (c.widths ?? VIEWPORTS).map((w) => [w, false]).concat([[DARK_AT, true]]);
    for (const states of c.states ?? [[]]) {
      for (const [width, dark] of runs) {
        const up = await render(browser, upstreamCss, tree.upstream, width, dark, states);
        const vp = await render(browser, vpkit, tree.vpkit, width, dark, states);
        if (up.length !== vp.length) throw new Error(`${label}: ${up.length} elements upstream, ${vp.length} in vpkit`);
        renders++;
        const run = `${label} [${width}px${dark ? ' dark' : ''}${states.length ? ' :' + states.join(':') : ''}]`;
        up.forEach((u, i) => {
          for (const prop of Object.keys(u)) {
            compared++;
            if (same(u[prop], vp[i][prop], prop)) continue;
            const line = `${run} ${where[i]} ${prop}: upstream ${u[prop]} | vpkit ${vp[i][prop]}`;
            const delta = known.find((k) => k.case.test(label) && k.element.test(where[i]) && k.prop === prop);
            if (!delta) {
              failures.push(line);
              continue;
            }
            delta.hits = (delta.hits ?? 0) + 1;
            expected.push(line);
          }
        });
      }
    }
  }
} finally {
  await browser.close();
}

for (const k of known) {
  if (k.hits) console.log(`KNOWN ${k.hits}× ${k.case} ${k.element} ${k.prop}: ${k.reason}`);
  else failures.push(`known difference no longer occurs, remove it: ${k.case} ${k.element} ${k.prop}`);
}
for (const f of failures) console.log(`DIFF  ${f}`);
console.log(
  `${cases.length} layout cases in ${renders} renders (widths, dark, states): ${compared} values compared, ` +
    `${failures.length} differ, ${expected.length} known`,
);
process.exit(failures.length ? 1 : 0);
