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
// Lengths match within 1/32px (the app kit's minified build prints numbers
// to six digits). Each product is compiled as it ships, from an entry that
// imports every component: the app kit minified, as an app may build it; the
// docs theme unminified, as vpkit-zola builds it, with docs-theme/vars.css,
// VitePress's own palette. Each side loads its own
// fonts.css (vpkit's; VitePress's, which also names Inter in its base
// stack), the Inter files served from fonts/, so a width that depends on
// text is Inter's wherever the test runs, not the machine's fallback
// font's.
//
//   node test/components.mjs
//   CASES='^button' node test/components.mjs        only the cases it matches
//   UPDATE_GOLDEN=1 node test/components.mjs        write the golden values
//
// Exits 1, listing every differing property, when any case differs.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-chromium';
import { ROOT, componentDirs } from '../scripts/components.mjs';
import { ONTO } from '../scripts/contract.mjs';
import { modeValues } from '../scripts/css.mjs';
import { unscope } from '../scripts/vitepress-port.mjs';
import { BOX_GEOMETRY, GEOMETRY, nodeId, productCss } from './harness.mjs';
import { pool } from './pool.mjs';

const UPDATE = Boolean(process.env.UPDATE_GOLDEN);
const only = process.env.CASES ? new RegExp(process.env.CASES) : null;

const PRODUCTS = { app: componentDirs(''), docs: componentDirs('docs-theme') };
// and the page's own suite (test/page: base.css's rules on the body, a bare placeholder, the focus ring), with the app kit's
PRODUCTS.app.push(join(ROOT, 'test/page'));

// VitePress's stylesheets every upstream page loads, in its order
const UPSTREAM = ['vars.css', 'base.css', 'icons.css'];

// a .vue file contributes its <style> block: `scoped` only adds an
// attribute selector, which an isolated page doesn't need, and a
// `:deep(x)` or a `:slotted(x)` is unwrapped to `x`, as the layout port
// unwraps :deep() (a browser drops a selector with either in it, and with
// it the rule)
function upstreamCss(files) {
  return files.map((file) => {
    const src = readFileSync(join(ROOT, 'test/upstream', file), 'utf8');
    if (!file.endsWith('.vue')) return src;
    const style = src.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    if (!style) throw new Error(`no <style> block in ${file}`);
    return unscope(style[1]);
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

// Lengths match within 1/32 px. The app kit's minified build prints
// numbers to six significant digits (2.7142857 -> 2.71429), which moves a
// line box by 0.0001px and can tip layout's 1/64 px rounding. A check's
// `tolerance` widens that for a stack of such lines. Everything else
// compares exactly.
const PX = /^-?\d+(\.\d+)?px$/;
function same(a, b, tolerance = 1 / 32) {
  if (a === undefined || b === undefined) return false;
  if (a === b) return true;
  return PX.test(a) && PX.test(b) && Math.abs(parseFloat(a) - parseFloat(b)) <= tolerance;
}

// each side's fonts: vpkit's fonts.css (its @font-face rules; tokens.css
// names Inter) and VitePress's (its rules and the :root that names Inter,
// without its Google Fonts import: the test is offline and the files are
// the same); both read the files as url("…fonts/…"), which the page's base
// URL points at the route below
const FONTS = {
  vpkit: readFileSync(join(ROOT, 'fonts.css'), 'utf8'),
  upstream: readFileSync(join(ROOT, 'test/upstream/fonts.css'), 'utf8').replace(/^@import url\('https:\/\/fonts\.googleapis\.com[^\n]*\n/m, ''),
};
const ORIGIN = 'http://vpkit.test';

async function open(browser, css, body, { dark, touch, width, reducedMotion, forcedColors }) {
  const page = await browser.newPage();
  if (width) await page.setViewportSize({ width, height: 720 });
  if (reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' });
  if (forcedColors) await page.emulateMedia({ forcedColors: 'active' });
  await page.route(`${ORIGIN}/fonts/*`, (route) => {
    const file = join(ROOT, 'fonts', basename(new URL(route.request().url()).pathname));
    return existsSync(file) ? route.fulfill({ body: readFileSync(file), contentType: 'font/woff2' }) : route.fulfill({ status: 404 });
  });
  // a case's own script (one that opens a dialog) failing would measure
  // the state it never reached
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const cdp = await page.context().newCDPSession(page);
  // Emulation.setEmulatedMedia takes a `hover` feature but Chromium
  // ignores it; touch emulation is what makes (hover: none) match
  if (touch) await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await page.setContent(
    // the page's colors come from each side's base.css; `body` lets a case
    // measure the page itself
    `<!doctype html><html${dark ? ' class="dark"' : ''}><head><base href="${ORIGIN}/"><style>${css}</style></head><body>${body}</body></html>`,
  );
  if (errors.length) throw new Error(`the page's script failed: ${errors.join('; ')}`);
  const { inter, hover, reduced, forced } = await page.evaluate(async () => ({
    inter: (await document.fonts.load('1em Inter')).filter((f) => f.status === 'loaded').length,
    hover: matchMedia('(hover: hover)').matches,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    forced: matchMedia('(forced-colors: active)').matches,
  }));
  if (!inter) throw new Error('Inter did not load from fonts/');
  if (hover === Boolean(touch)) throw new Error(`(hover: hover) is ${hover} on a ${touch ? 'touch' : 'desktop'} page`);
  if (reduced !== Boolean(reducedMotion)) throw new Error(`(prefers-reduced-motion: reduce) is ${reduced} on a page ${reducedMotion ? 'under' : 'without'} reduced motion`);
  if (forced !== Boolean(forcedColors)) throw new Error(`(forced-colors: active) is ${forced} on a page ${forcedColors ? 'under' : 'without'} forced colors`);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  // the document's root, fetched once: every node a check resolves comes
  // from it (harness.mjs's nodeId)
  const { root } = await cdp.send('DOM.getDocument');
  return { page, cdp, root };
}

// fn between a setup and its undo: the undo runs whatever fn throws, so
// the case's next check, on the same page, starts from the page as it
// was; fn's error is the one reported, with the undo's when that fails
// too (its node gone with the page), which would otherwise replace it
async function around(setup, fn, undo) {
  await setup();
  let result;
  try {
    result = await fn();
  } catch (e) {
    await undo().catch((u) => {
      e.message += ` (and undoing what it set up failed: ${u.message})`;
    });
    throw e;
  }
  await undo();
  return result;
}

async function measure(handle, { target, on, state, pseudo, props }) {
  const { cdp, root } = handle;
  const pseudoBox = Boolean(pseudo) && props.some((p) => BOX_GEOMETRY.includes(p));
  let read = () => readValues(handle, { target, pseudo, pseudoBox, props });
  if (pseudoBox) {
    // a pseudo-element's box is read through the protocol after the
    // evaluate reads its originating element's: the page's animations are
    // held still across the two (a spinner beside it, or an animation on
    // it, would move one and not the other)
    const rate = (playbackRate) => () => cdp.send('Animation.setPlaybackRate', { playbackRate });
    const moving = read;
    read = () => around(rate(0), moving, rate(1));
  }
  if (!state?.length) return read();
  const node = await nodeId(cdp, root, on ?? target);
  const force = (forcedPseudoClasses) => () => cdp.send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses });
  return around(force(state), read, force([]));
}

async function readValues({ page, cdp, root }, { target, pseudo, pseudoBox, props }) {
  const read = await page.evaluate(
    ([target, pseudo, props, GEOMETRY]) => {
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
      // a pseudo-element's box is the protocol's, read below (none here);
      // its offsets are from its originating element's
      const box = el.getBoundingClientRect();
      const parent = pseudo ? box : (el.parentElement ?? document.documentElement).getBoundingClientRect();
      const viewport = document.documentElement.clientWidth;
      const values = Object.fromEntries(props.filter((p) => !GEOMETRY.includes(p)).map((p) => [p, style.getPropertyValue(p)]));
      if (props.includes('scroll-width')) values['scroll-width'] = `${el.scrollWidth}px`;
      return { values, box: pseudo ? null : { top: box.top, left: box.left, right: box.right, height: box.height }, parent: { top: parent.top, left: parent.left }, viewport };
    },
    [target, pseudo, props, GEOMETRY],
  );
  if (read.error) throw new Error(read.error);
  if (pseudoBox) {
    // the target's own pseudo-element, whatever element a state is forced
    // on; its border box's bounds, as getBoundingClientRect gives an
    // element's (the quad's corners, which a rotation or a skew moves off
    // the axes)
    const { node: described } = await cdp.send('DOM.describeNode', { nodeId: await nodeId(cdp, root, target), depth: 1 });
    const own = (described.pseudoElements ?? []).find((p) => p.pseudoType === pseudo.replace(/^::/, ''));
    if (!own) throw new Error(`the protocol lists no ${target}${pseudo} (none is drawn, or the protocol lists none of its kind, as ::file-selector-button)`);
    const { model } = await cdp.send('DOM.getBoxModel', { backendNodeId: own.backendNodeId });
    const xs = model.border.filter((_, i) => i % 2 === 0);
    const ys = model.border.filter((_, i) => i % 2 === 1);
    read.box = { top: Math.min(...ys), left: Math.min(...xs), right: Math.max(...xs), height: Math.max(...ys) - Math.min(...ys) };
  }
  if (read.box) {
    const { box, parent, viewport } = read;
    const geometry = {
      height: box.height,
      'offset-top': box.top - parent.top,
      'offset-left': box.left - parent.left,
      'viewport-left': box.left,
      'viewport-right': viewport - box.right,
    };
    for (const p of props) if (p in geometry) read.values[p] = `${geometry[p]}px`;
  }
  return read.values;
}

// the test files, each with its product and its golden file
const suites = [];
for (const [product, dirs] of Object.entries(PRODUCTS)) {
  for (const dir of dirs) {
    const file = join(dir, `${basename(dir)}.test.mjs`);
    const { cases } = await import(pathToFileURL(file).href);
    const goldenFile = join(dir, 'golden.json');
    const golden = existsSync(goldenFile) ? JSON.parse(readFileSync(goldenFile, 'utf8')) : {};
    suites.push({ product, dir, cases, goldenFile, golden, next: {} });
  }
}
const selected = suites.flatMap((s) => s.cases.filter((c) => !only || only.test(c.name)).map((c) => ({ suite: s, c })));
if (!selected.length) throw new Error(only ? `CASES=${process.env.CASES} matches no case` : 'no cases');
// a case's kind is its source; a check may name another only as a golden
// departure, which says why
const kindOf = (c) => (c.upstream ? 'upstream' : c.reference ? 'reference' : 'golden');
for (const { c } of selected) {
  if (c.upstream && c.reference) throw new Error(`${c.name}: a case has an upstream or a reference, not both`);
  const kind = kindOf(c);
  for (const check of c.checks) {
    const source = check.source ?? kind;
    if (source === 'golden' && kind !== 'golden' && !check.why) throw new Error(`${c.name}: a golden check on a case with a${kind === 'upstream' ? 'n upstream' : ' reference'} must say why`);
    if (source !== 'golden' && source !== kind) throw new Error(`${c.name}: a check sourced ${source} on a case ${kind === 'golden' ? 'without one' : `with a${kind === 'upstream' ? 'n upstream' : ' reference'}`}`);
  }
}

// the products the selected cases render, each compiled once
const css = Object.fromEntries([...new Set(selected.map(({ suite }) => suite.product))].map((product) => [product, `${FONTS.vpkit}\n${productCss(product)}`]));
// VitePress imports fonts.css after its vars.css, so its Inter stack wins
const upstreamBase = `${upstreamCss(UPSTREAM)}\n${FONTS.upstream}`;
const fitted = fittedPalette();
const key = (check) => `${check.target}${check.pseudo ?? ''}${check.state?.length ? ` :${check.state.join(':')}` : ''}`;

const browser = await chromium.launch();
const failures = [];
const compared = { upstream: 0, reference: 0, golden: 0 };

// one case, both modes: its failures, in check order
async function runCase({ suite, c }) {
  const failures = [];
  const vpkitCss = css[suite.product];
  const kind = kindOf(c);
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
          if (same(have?.[prop], values[prop], check.tolerance)) continue;
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
        if (same(reference[prop], values[prop], check.tolerance)) continue;
        failures.push(`${where} ${prop}: ${source} ${reference[prop]} | vpkit ${values[prop]}`);
      }
    }
    await vpkit.page.close();
    if (ref) await ref.page.close();
  }
  return failures;
}

// four cases at a time (the run is mostly page opens, which wait), their
// failures kept in case order
try {
  const byCase = await pool(selected, 4, (s) =>
    runCase(s).catch((e) => {
      throw new Error(`${s.c.name}: ${e.message}`);
    }),
  );
  failures.push(...byCase.flat());
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
    // a suite none of whose cases ran is left alone (another agent may be
    // mid-edit on it)
    if (!ran.length) continue;
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
