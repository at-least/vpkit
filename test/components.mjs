// The components, each against its proof: every components/<name>/
// <name>.test.mjs (and docs-theme/components/<name>/<name>.test.mjs) exports
// cases (test/harness.mjs says what one is), and this renders them in
// headless Chromium, light and dark, with `:hover`, `:active` and the other
// states forced where a case has them, and compares computed styles:
// - source `upstream`: with VitePress's component at the tag in
//   test/upstream/SOURCE, rendered from its own sources on vpkit's fitted
//   palette (tokens.css's values written onto VitePress's names), so what
//   is meant to be VitePress's is held to it
// - source `reference`: with another rendering of vpkit (a component nested
//   in another against the same one alone, a touch screen's hover against
//   rest)
// - source `golden`: with the values in golden.json beside the test file,
//   vpkit's own: a component VitePress has no original for, or a named
//   departure from one (the check says why). UPDATE_GOLDEN=1 rewrites them.
// Lengths match within 1/32px (the minified build prints numbers to six
// digits). vpkit is compiled minified, as the apps ship it, from an entry
// that imports every component; the docs theme's components compile with
// docs-theme/vars.css, VitePress's own palette.
//
//   node test/components.mjs
//   CASES='^button' node test/components.mjs        only the cases it matches
//   UPDATE_GOLDEN=1 node test/components.mjs        write the golden values
//
// Exits 1, listing every differing property, when any case differs.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-chromium';

import { componentDirs } from '../scripts/components.mjs';
import { ONTO } from '../scripts/contract.mjs';
import { modeValues } from '../scripts/css.mjs';
import { unwrapDeep } from '../scripts/vitepress-port.mjs';
import { compileCss } from './compile.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UPDATE = Boolean(process.env.UPDATE_GOLDEN);
const only = process.env.CASES ? new RegExp(process.env.CASES) : null;

const PRODUCTS = { app: componentDirs(''), docs: componentDirs('docs-theme') };

// the entry a product's tests compile: Tailwind, the examples and tests
// scanned for the utilities they use, vpkit, every component, the markdown
// last (an app compiles it below the components); the docs theme's with its
// own variables. Written under node_modules/.cache, where Tailwind resolves
// its own import
function entry(product) {
  const cache = join(ROOT, 'node_modules/.cache/vpkit');
  mkdirSync(cache, { recursive: true });
  const rel = (p) => relative(cache, p).split(sep).join('/');
  const lines = ['@import "tailwindcss" source(none);'];
  for (const dir of ['components', 'docs-theme/components']) if (existsSync(join(ROOT, dir))) lines.push(`@source "${rel(join(ROOT, dir))}";`);
  lines.push(`@import "${rel(join(ROOT, 'index.css'))}";`);
  if (product === 'docs') for (const f of ['docs-theme/vars.css', 'docs-theme/icons.css']) if (existsSync(join(ROOT, f))) lines.push(`@import "${rel(join(ROOT, f))}";`);
  for (const dir of [...PRODUCTS.app, ...(product === 'docs' ? PRODUCTS.docs : [])]) lines.push(`@import "${rel(join(dir, `${basename(dir)}.css`))}";`);
  if (existsSync(join(ROOT, 'prose.css'))) lines.push(`@import "${rel(join(ROOT, 'prose.css'))}";`);
  const file = join(cache, `${product}.css`);
  writeFileSync(file, `${lines.join('\n')}\n`);
  return relative(ROOT, file);
}

// VitePress's stylesheets every upstream page loads, in its order
const UPSTREAM = ['vars.css', 'base.css', 'icons.css'];

// a .vue file contributes its <style> block: `scoped` only adds an
// attribute selector, which an isolated page doesn't need, and a
// `:deep(x)` is unwrapped to `x` as the layout port does (a browser drops
// a selector with :deep() in it, and with it the rule)
function upstreamCss(files) {
  return files.map((file) => {
    const src = readFileSync(join(ROOT, 'test/upstream', file), 'utf8');
    if (!file.endsWith('.vue')) return src;
    const style = src.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    if (!style) throw new Error(`no <style> block in ${file}`);
    return unwrapDeep(style[1]);
  }).join('\n');
}

// vpkit's fitted palette on VitePress's names, for the upstream side of an
// app kit case: tokens.css's values are VitePress's with the contrast fits,
// and the originals must render on the same colors to be compared on
// anything but the fits. The docs theme's cases need none: docs-theme/
// vars.css is VitePress's palette verbatim
function fittedPalette() {
  const tokens = readFileSync(join(ROOT, 'tokens.css'), 'utf8');
  return ['light', 'dark']
    .map((mode) => {
      const values = modeValues(tokens, ':root', mode);
      const decls = Object.entries(ONTO).map(([from, to]) => `--vp-${to}: ${values.get(`--vp-c-${from}`)};`);
      return `${mode === 'light' ? ':root' : '.dark'} { ${decls.join(' ')} }`;
    })
    .join('\n');
}

// Lengths match within 1/32 px. The minified build prints numbers to six
// significant digits (2.7142857 -> 2.71429), which moves a line box by
// 0.0001px and can tip layout's 1/64 px rounding. A check's `tolerance`
// widens that for a stack of such lines. Everything else compares exactly.
const PX = /^-?\d+(\.\d+)?px$/;
// A transparent shadow with no offset, blur or spread paints nothing;
// Tailwind's shadow utilities put four of them before the real one.
const NO_SHADOW = /rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?/g;
function same(a, b, prop, tolerance = 1 / 32) {
  if (a === undefined || b === undefined) return false;
  if (prop === 'box-shadow') [a, b] = [a.replace(NO_SHADOW, ''), b.replace(NO_SHADOW, '')];
  if (a === b) return true;
  return PX.test(a) && PX.test(b) && Math.abs(parseFloat(a) - parseFloat(b)) <= tolerance;
}

async function open(browser, css, body, { dark, touch, width, reducedMotion }) {
  const page = await browser.newPage();
  if (width) await page.setViewportSize({ width, height: 720 });
  if (reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' });
  const cdp = await page.context().newCDPSession(page);
  // Emulation.setEmulatedMedia takes a `hover` feature but Chromium
  // ignores it; touch emulation is what makes (hover: none) match
  if (touch) await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await page.setContent(
    // the page's colors come from each side's base.css; `body` lets a case
    // measure the page itself
    `<!doctype html><html${dark ? ' class="dark"' : ''}><head><style>${css}</style></head><body>${body}</body></html>`,
  );
  const hover = await page.evaluate(() => matchMedia('(hover: hover)').matches);
  if (hover === Boolean(touch)) throw new Error(`(hover: hover) is ${hover} on a ${touch ? 'touch' : 'desktop'} page`);
  const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduced !== Boolean(reducedMotion)) throw new Error(`(prefers-reduced-motion: reduce) is ${reduced} on a page ${reducedMotion ? 'under' : 'without'} reduced motion`);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  return { page, cdp };
}

async function nodeId(cdp, selector) {
  const { root } = await cdp.send('DOM.getDocument');
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
  if (!nodeId) throw new Error(`no ${selector} to force a state on`);
  return nodeId;
}

async function measure({ page, cdp }, { target, on, state, pseudo, props }) {
  const node = state?.length ? await nodeId(cdp, on ?? target) : null;
  if (node) await cdp.send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses: state });
  const values = await page.evaluate(
    ([target, pseudo, props]) => {
      // getAnimations() flushes the style change the forced state just
      // made, so its transitions exist here; finish() jumps them to their
      // end values instead of reading a color halfway through. Only the
      // transitions: an infinite animation (a spinner) has no end to jump
      // to, and finish() throws on one
      for (const animation of document.getAnimations()) {
        if (animation instanceof CSSTransition) animation.finish();
      }
      const el = document.querySelector(target);
      if (!el) return { error: `no ${target}` };
      const style = getComputedStyle(el, pseudo ?? null);
      const box = el.getBoundingClientRect();
      const parent = (el.parentElement ?? document.documentElement).getBoundingClientRect();
      const geometry = { height: box.height, 'offset-top': box.top - parent.top, 'offset-left': box.left - parent.left };
      return Object.fromEntries(props.map((p) => [p, p in geometry ? `${geometry[p]}px` : style.getPropertyValue(p)]));
    },
    [target, pseudo, props],
  );
  if (node) await cdp.send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses: [] });
  if (values.error) throw new Error(values.error);
  return values;
}

// the test files, each with its product and its golden file
const suites = [];
for (const [product, dirs] of Object.entries(PRODUCTS)) {
  for (const dir of dirs) {
    const file = join(dir, `${basename(dir)}.test.mjs`);
    if (!existsSync(file)) continue;
    const { cases } = await import(pathToFileURL(file).href);
    const goldenFile = join(dir, 'golden.json');
    const golden = existsSync(goldenFile) ? JSON.parse(readFileSync(goldenFile, 'utf8')) : {};
    suites.push({ product, dir, cases, goldenFile, golden, next: {} });
  }
}
const selected = suites.flatMap((s) => s.cases.filter((c) => !only || only.test(c.name)).map((c) => ({ suite: s, c })));
if (!selected.length) throw new Error(only ? `CASES=${process.env.CASES} matches no case` : 'no cases');
for (const { c } of selected) {
  if (c.upstream && c.reference) throw new Error(`${c.name}: a case has an upstream or a reference, not both`);
}

const css = { app: compileCss(entry('app')), docs: PRODUCTS.docs.length ? compileCss(entry('docs')) : null };
const upstreamBase = upstreamCss(UPSTREAM);
const fitted = fittedPalette();
const key = (check) => `${check.target}${check.pseudo ?? ''}${check.state?.length ? ` :${check.state.join(':')}` : ''}`;

const browser = await chromium.launch();
const failures = [];
const compared = { upstream: 0, reference: 0, golden: 0 };
try {
  for (const { suite, c } of selected) {
    const vpkitCss = css[suite.product];
    const kind = c.upstream ? 'upstream' : c.reference ? 'reference' : 'golden';
    const refCss = kind === 'upstream' ? `${upstreamBase}\n${suite.product === 'app' ? fitted : ''}\n${upstreamCss(c.upstream.files ?? [])}` : vpkitCss;
    const refBody = kind === 'upstream' ? c.upstream.html : c.reference;
    suite.next[c.name] = {};
    for (const dark of [false, true]) {
      const mode = dark ? 'dark' : 'light';
      const vpkit = await open(browser, vpkitCss, c.html, { ...c, dark });
      const ref = kind === 'golden' ? null : await open(browser, refCss, refBody, { ...c, dark });
      const got = (suite.next[c.name][mode] = {});
      for (const check of c.checks) {
        const source = check.source ?? kind;
        if (source === 'golden' && kind !== 'golden' && !check.why) {
          failures.push(`${c.name}: a golden check on a case with a${kind === 'upstream' ? 'n upstream' : ' reference'} must say why`);
          break;
        }
        if (source !== 'golden' && kind === 'golden') {
          failures.push(`${c.name}: a check sourced ${source} on a case without one`);
          break;
        }
        const where = `${c.name} [${mode}${check.state ? ` :${check.state.join(':')}` : ''}] ${check.target}${check.pseudo ?? ''}`;
        let values;
        try {
          values = await measure(vpkit, check);
        } catch (e) {
          failures.push(`${where}: ${e.message}`);
          continue;
        }
        if (source === 'golden') {
          got[key(check)] = { ...got[key(check)], ...values };
          const have = suite.golden[c.name]?.[mode]?.[key(check)];
          for (const prop of check.props) {
            compared.golden++;
            if (same(have?.[prop], values[prop], prop, check.tolerance)) continue;
            if (UPDATE) continue;
            failures.push(`${where} ${prop}: golden ${have?.[prop] ?? '(none)'} | vpkit ${values[prop]}`);
          }
          continue;
        }
        let reference;
        try {
          reference = await measure(ref, {
            ...check,
            target: check.refTarget ?? check.target,
            on: check.refOn ?? check.on,
            state: 'refState' in check ? check.refState : check.state,
            pseudo: 'refPseudo' in check ? check.refPseudo : check.pseudo,
          });
        } catch (e) {
          failures.push(`${where}: ${source}: ${e.message}`);
          continue;
        }
        for (const prop of check.props) {
          compared[source]++;
          if (same(reference[prop], values[prop], prop, check.tolerance)) continue;
          failures.push(`${where} ${prop}: ${source} ${reference[prop]} | vpkit ${values[prop]}`);
        }
      }
      await vpkit.page.close();
      if (ref) await ref.page.close();
    }
  }
} finally {
  await browser.close();
}

// the golden files: rewritten with what ran under UPDATE_GOLDEN (a case
// that ran replaces its entry; with every case run, a case that no longer
// exists goes); otherwise an entry for a case the test file no longer has
// fails, so none outlives its case
for (const suite of suites) {
  const names = new Set(suite.cases.map((c) => c.name));
  const stale = Object.keys(suite.golden).filter((name) => !names.has(name));
  const ran = suite.cases.filter((c) => !only || only.test(c.name)).map((c) => c.name);
  if (UPDATE) {
    const merged = { ...suite.golden };
    for (const name of ran) {
      const entry = suite.next[name];
      const empty = Object.values(entry).every((m) => Object.keys(m).length === 0);
      if (empty) delete merged[name];
      else merged[name] = entry;
    }
    if (!only) for (const name of stale) delete merged[name];
    const ordered = Object.fromEntries(suite.cases.map((c) => c.name).filter((n) => n in merged).map((n) => [n, merged[n]]));
    if (Object.keys(ordered).length) writeFileSync(suite.goldenFile, `${JSON.stringify(ordered, null, 2)}\n`);
  } else if (!only) {
    for (const name of stale) failures.push(`${relative(ROOT, suite.goldenFile)}: a golden entry for a case that no longer exists, remove it: ${name}`);
  }
}

for (const f of failures) console.log(`DIFF  ${f}`);
const total = compared.upstream + compared.reference + compared.golden;
console.log(
  `${selected.length} cases × light/dark: ${total} computed values compared ` +
    `(${compared.upstream} against VitePress, ${compared.reference} against vpkit, ${compared.golden} golden), ${failures.length} differ${UPDATE ? ', golden files written' : ''}`,
);
process.exit(failures.length ? 1 : 0);
