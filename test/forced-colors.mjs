// Forced colors (Windows' contrast themes): the browser replaces background
// colors and drops box shadows, and paints every border in the system's
// text color, so a component that shows its state only with those shows
// nothing. Each pair below must render differently with forced colors on,
// as it does with them off.
//
//   node test/forced-colors.mjs
//
// Chromium's emulation of `forced-colors: active`, on each product compiled
// the way the component tests compile it: the app kit for its components,
// the docs theme for its icons. A pair's two sides are shot in wrappers of
// the same box, asserted before the shots are compared, and once nothing
// on the page moves: wrappers of different sizes could never shoot the
// same, and a side shot mid-motion (the drawer sliding in from its
// starting style) differs from the other by the motion alone, so such a
// pair would hold nothing. Exits 1, naming each pair whose boxes differ or
// that renders the same.

import { chromium } from 'playwright-chromium';

import { compileCss } from './compile.mjs';
import { entry } from './harness.mjs';

const toggle = (checked) =>
  `<button class="vp-toggle" type="button" role="switch" aria-checked="${checked}"><span class="vp-toggle-check"></span></button>`;
const bar = (percent) =>
  `<span class="vp-progress" style="width:7rem"><span class="vp-progress-bar" style="width:${percent}%"></span></span>`;
const hamburger = (open) =>
  `<button class="vp-hamburger" type="button" aria-label="Menu" aria-expanded="${open}"><span class="vp-hamburger-box"><span></span><span></span><span></span></span></button>`;
// the vertical divider is a background: against an empty block of its box
// (the hr is a block; an inline-block span would sit in a taller line box)
const vertical = '<hr class="vp-divider" aria-orientation="vertical" style="margin:0">';
const noVertical = '<div style="width:1px;height:1.5rem"></div>';
// the drawer's edge is its ground against the page's, which forced colors
// paint the same: against a bare dialog of its box (both in flow, since
// a pair is shot where it stands)
const drawer = '<dialog class="vp-drawer" open style="position:static">Menu</dialog>';
const noDrawer = '<dialog open style="position:static;padding:2rem 2rem 6rem;width:calc(100vw - 4rem);max-width:20rem">Menu</dialog>';
// a badge's dot is a background in the word's color: against an empty box
// its size
const dot = '<span class="vp-badge-dot"></span>';
const noDot = '<span style="display:inline-block;width:0.5rem;height:0.5rem"></span>';
// a dot is a background too: against an empty box its size
const lone = '<span class="vp-dot" data-variant="success"></span>';
// the table's cursor row is marked by a shadow on its first cell: against
// the same table with the row plain
const row = (attrs) => `<table class="vp-table" style="margin:0"><tbody><tr${attrs}><td>notes.txt</td><td>12 KB</td></tr></tbody></table>`;
// the spinner's head is told from its ring by border colors: against a
// full circle its size. Still: a turn never ends, so it cannot be waited
// for, and a turning ring shot at any angle rasterizes unlike a still
// circle, so the two shots would differ anyway
const spinner = '<span class="vp-spinner" role="status" aria-label="Loading" style="animation:none"></span>';
const circle = '<span style="display:inline-block;width:1.125rem;height:1.125rem;border:2px solid currentColor;border-radius:50%"></span>';
// the docs theme's icons are masks over a background: against an empty
// box an icon's size
const sun = '<span class="vpi-sun" aria-hidden="true"></span>';
const noSun = '<span style="display:inline-block;width:1em;height:1em"></span>';
const PAIRS = {
  app: [
    ['a checked and an unchecked toggle', toggle(true), toggle(false)],
    ['a progress bar at 40% and at 0%', bar(40), bar(0)],
    ['an open and a closed hamburger', hamburger(true), hamburger(false)],
    ['a vertical divider and an empty box its size', vertical, noVertical],
    ['a badge dot and an empty box its size', dot, noDot],
    ['a dot and an empty box its size', lone, noDot],
    ['an open drawer and a bare dialog its size', drawer, noDrawer],
    ["a table's current row and a plain row", row(' aria-current="true"'), row('')],
    ['a still spinner and a full circle its size', spinner, circle],
  ],
  docs: [['a sun icon and an empty box its size', sun, noSun]],
};

const CSS = Object.fromEntries(Object.keys(PAIRS).map((product) => [product, compileCss(entry(product))]));
const browser = await chromium.launch();
const failures = [];
try {
  const page = await browser.newPage();
  const size = async (t) => {
    const { width, height } = await page.locator(`[data-t="${t}"]`).boundingBox();
    return `${width}×${height}`;
  };
  for (const [product, pairs] of Object.entries(PAIRS)) {
    for (const [name, a, b] of pairs) {
      await page.setContent(
        `<!doctype html><html><head><style>${CSS[product]}</style></head>` +
          `<body style="padding:8px">` +
          `<div data-t="a" style="display:inline-block;padding:4px">${a}</div><br>` +
          `<div data-t="b" style="display:inline-block;padding:4px">${b}</div></body></html>`,
      );
      for (const forced of ['none', 'active']) {
        await page.emulateMedia({ forcedColors: forced });
        // shot still: every transition and animation run to its end; one
        // that never ends cannot be, and the pair's markup stills it
        await page.evaluate(() => {
          const endless = document.getAnimations().filter((a) => a.effect.getTiming().iterations === Infinity);
          if (endless.length) throw new Error(`${endless.length} animation(s) never end: the pair's markup must still them`);
          return Promise.all(document.getAnimations().map((a) => a.finished));
        });
        const [boxA, boxB] = [await size('a'), await size('b')];
        if (boxA !== boxB) {
          console.log(`BOX  ${name}, forced colors ${forced}: ${boxA} against ${boxB}`);
          failures.push(`${name}: the boxes differ with forced colors ${forced} (${boxA} against ${boxB}), so the shots hold nothing`);
          continue;
        }
        const [shotA, shotB] = [await page.locator('[data-t="a"]').screenshot(), await page.locator('[data-t="b"]').screenshot()];
        const differ = !shotA.equals(shotB);
        console.log(`${differ ? 'ok  ' : 'SAME'} ${name}, forced colors ${forced}`);
        if (!differ) failures.push(`${name} render the same with forced colors ${forced}`);
      }
    }
  }
} finally {
  await browser.close();
}
for (const f of failures) console.log(`FAIL  ${f}`);
process.exit(failures.length ? 1 : 0);
