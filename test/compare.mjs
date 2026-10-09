// Differential test: every vpkit component against the VitePress
// component it ports. Both sides render in headless Chromium: upstream
// from its own sources (test/upstream/, verbatim at the tag in SOURCE),
// vpkit compiled through Tailwind the way a consumer compiles it. Each
// case compares computed styles in light and dark mode and, where the
// component has them, in forced :hover and :active states. A case with
// a `reference` instead of `upstream` compares two vpkit renderings
// (a component nested in another against the same one standalone). A
// case with `touch` renders both pages as a touch screen, where
// (hover: none) matches; with a check's `refState`, the reference gets
// a different forced state than vpkit (`[]`: none, at rest). A case's
// `upstreamFiles` are originals only that case's upstream page loads, for
// components whose stylesheets name generic classes (`.title`, `.link`)
// that the other cases' markup also uses.
//
//   npm test
//   CASES='^toggle' node test/compare.mjs   only the cases it matches
//
// Exits 1, listing every differing property, when any case differs.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-chromium';

import { unwrapDeep } from '../scripts/vitepress-port.mjs';
import { cases, known } from './cases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// vars before the components that read them; base.css is layered, so its
// position doesn't matter. VPSwitch and VPSwitchAppearance are read from
// the layout's copies in components/
const UPSTREAM = [
  'vars.css',
  'base.css',
  'icons.css',
  'VPButton.vue',
  'VPBadge.vue',
  'custom-block.css',
  'vp-doc.css',
  'VPFeature.vue',
  'components/VPSwitch.vue',
  'components/VPSwitchAppearance.vue',
];

function vpkitCss() {
  const dir = mkdtempSync(join(tmpdir(), 'vpkit-test-'));
  try {
    const out = join(dir, 'vpkit.css');
    execFileSync(
      join(ROOT, 'node_modules/.bin/tailwindcss'),
      // minified, as consumers ship it
      ['-i', join(ROOT, 'test/entry.css'), '-o', out, '--minify'],
      { stdio: 'pipe' },
    );
    return readFileSync(out, 'utf8');
  } finally {
    rmSync(dir, { recursive: true });
  }
}

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

// Lengths match within 1/32 px. The minified build prints numbers to six
// significant digits (2.7142857 -> 2.71429), which moves a line box by
// 0.0001px and can tip layout's 1/64 px rounding: a badge measured 24px
// upstream and 23.984375px from the minified build. A check's `tolerance`
// widens that for a stack of such lines, which sums their 1/64s (a menu
// of seven 32px rows, each 31.984375px from the minified 2.28571).
// Everything else compares exactly.
const PX = /^-?\d+(\.\d+)?px$/;
// A transparent shadow with no offset, blur or spread paints nothing;
// Tailwind's shadow utilities put four of them before the real one.
const NO_SHADOW = /rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?/g;
function same(a, b, prop, tolerance = 1 / 32) {
  if (prop === 'box-shadow') [a, b] = [a.replace(NO_SHADOW, ''), b.replace(NO_SHADOW, '')];
  if (a === b) return true;
  return PX.test(a) && PX.test(b) && Math.abs(parseFloat(a) - parseFloat(b)) <= tolerance;
}

// The page colors, on both sides: upstream's base.css sets them on body,
// a vpkit page through `bg-bg text-text-1` on <body> (as rustpress,
// totality and own-drive do), which these declarations stand in for.
const BODY = 'color:var(--vp-c-text-1);background-color:var(--vp-c-bg)';

async function open(browser, css, body, dark, touch) {
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  // Emulation.setEmulatedMedia takes a `hover` feature but Chromium
  // ignores it; touch emulation is what makes (hover: none) match
  if (touch) await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await page.setContent(
    `<!doctype html><html${dark ? ' class="dark"' : ''}><head><style>${css}</style></head><body style="${BODY}">${body}</body></html>`,
  );
  const hover = await page.evaluate(() => matchMedia('(hover: hover)').matches);
  if (hover === Boolean(touch)) throw new Error(`(hover: hover) is ${hover} on a ${touch ? 'touch' : 'desktop'} page`);
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
      const el = document.querySelector(`[data-t="${target}"]`);
      const style = getComputedStyle(el, pseudo ?? null);
      // geometry: the box's height, and its offset inside its parent's box
      const box = el.getBoundingClientRect();
      const parent = el.parentElement.getBoundingClientRect();
      const geometry = {
        height: box.height,
        'offset-top': box.top - parent.top,
        'offset-left': box.left - parent.left,
      };
      return Object.fromEntries(
        props.map((p) => [p, p in geometry ? `${geometry[p]}px` : style.getPropertyValue(p)]),
      );
    },
    [target, pseudo, props],
  );
  if (node) await cdp.send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses: [] });
  return values;
}

// CASES=<regex>: only the matching cases, for a quick loop while building
// a component; a known difference that none of them hits is then not
// required, since the case that hits it may not have run
const only = process.env.CASES ? new RegExp(process.env.CASES) : null;
const selected = only ? cases.filter((c) => only.test(c.name)) : cases;
if (!selected.length) throw new Error(`CASES=${process.env.CASES} matches no case`);

const sides = { upstream: upstreamCss(UPSTREAM), vpkit: vpkitCss() };
const browser = await chromium.launch();
const failures = [];
const expected = [];
let compared = 0;
try {
  for (const c of selected) {
    const [label, refCss, refBody] =
      c.upstream === undefined
        ? ['reference', sides.vpkit, c.reference]
        : ['upstream', `${sides.upstream}\n${upstreamCss(c.upstreamFiles ?? [])}`, c.upstream];
    for (const dark of [false, true]) {
      const pages = {
        ref: await open(browser, refCss, refBody, dark, c.touch),
        vpkit: await open(browser, sides.vpkit, c.vpkit, dark, c.touch),
      };
      for (const check of c.checks) {
        // refTarget: the reference's element when it isn't the same one
        // (VPFeature's padding lives on an inner box, vp-card's on itself)
        const ref = await measure(pages.ref, {
          ...check,
          target: check.refTarget ?? check.target,
          state: 'refState' in check ? check.refState : check.state,
        });
        const vpkit = await measure(pages.vpkit, check);
        const where = `${c.name} [${dark ? 'dark' : 'light'}${check.state ? ` :${check.state.join(':')}` : ''}] ${check.target}${check.pseudo ?? ''}`;
        for (const prop of check.props) {
          compared++;
          if (same(ref[prop], vpkit[prop], prop, check.tolerance)) continue;
          const line = `${where} ${prop}: ${label} ${ref[prop]} | vpkit ${vpkit[prop]}`;
          const delta = known.find(
            (k) => k.case.test(c.name) && k.target === check.target && k.prop === prop,
          );
          if (!delta) {
            failures.push(line);
            continue;
          }
          delta.hits = (delta.hits ?? 0) + 1;
          expected.push(line);
        }
      }
      for (const { page } of Object.values(pages)) await page.close();
    }
  }
} finally {
  await browser.close();
}

for (const k of known) {
  if (only && !k.hits) continue;
  if (k.hits) {
    console.log(`KNOWN ${k.hits}× ${k.case} ${k.target} ${k.prop}: ${k.reason}`);
  } else {
    failures.push(`known difference no longer occurs, remove it: ${k.case} ${k.target} ${k.prop}`);
  }
}
for (const f of failures) console.log(`DIFF  ${f}`);
console.log(
  `${selected.length} cases × light/dark: ${compared} computed values compared, ` +
    `${failures.length} differ, ${expected.length} known`,
);
process.exit(failures.length ? 1 : 0);
