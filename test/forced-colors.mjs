// Forced colors (Windows' contrast themes): the browser replaces background
// colors and drops box shadows, so a component that shows its state only
// with those shows nothing. Each pair below must render differently with
// forced colors on, as it does with them off.
//
//   node test/forced-colors.mjs
//
// Chromium's emulation of `forced-colors: active`, compiled the way
// compare.mjs compiles vpkit. Exits 1, naming each pair that renders the
// same.

import { chromium } from 'playwright-chromium';

import { compileCss } from './compile.mjs';

const toggle = (checked) =>
  `<button class="vp-toggle" type="button" role="switch" aria-checked="${checked}"><span class="vp-toggle-check"></span></button>`;
const bar = (percent) =>
  `<span class="vp-progress" style="width:7rem"><span class="vp-progress-bar" style="width:${percent}%"></span></span>`;
const hamburger = (open) =>
  `<button class="vp-hamburger" type="button" aria-label="Menu" aria-expanded="${open}"><span class="vp-hamburger-box"><span></span><span></span><span></span></span></button>`;
// a vpi-* icon is a mask over its background color, which forced colors
// replace with the page's: against an empty box of its size it must show
const icon = '<span class="vpi-sun" aria-hidden="true" style="font-size:1.5rem"></span>';
const noIcon = '<span style="display:inline-block;width:1.5rem;height:1.5rem"></span>';
// the vertical divider is a background too: against an empty box its size
const vertical = '<hr class="vp-divider vp-divider-vertical" aria-orientation="vertical" style="margin:0">';
const noVertical = '<span style="display:inline-block;width:1px;height:1.5rem"></span>';
// the drawer's edge is its ground against the page's, which forced colors
// paint the same: against a bare dialog of its box (both in flow, since
// a pair is shot where it stands)
const drawer = '<dialog class="vp-drawer" open style="position:static">Menu</dialog>';
const noDrawer = '<dialog open style="position:static;padding:2rem 2rem 6rem;width:calc(100vw - 4rem);max-width:20rem">Menu</dialog>';
const PAIRS = [
  ['a checked and an unchecked toggle', toggle(true), toggle(false)],
  ['a progress bar at 40% and at 0%', bar(40), bar(0)],
  ['an open and a closed hamburger', hamburger(true), hamburger(false)],
  ['an icon and an empty box its size', icon, noIcon],
  ['a vertical divider and an empty box its size', vertical, noVertical],
  ['an open drawer and a bare dialog its size', drawer, noDrawer],
];

const css = compileCss('test/entry.css');
const browser = await chromium.launch();
const failures = [];
try {
  const page = await browser.newPage();
  for (const [name, a, b] of PAIRS) {
    await page.setContent(
      `<!doctype html><html><head><style>${css}</style></head>` +
        `<body style="color:var(--vp-c-text-1);background-color:var(--vp-c-bg);padding:8px">` +
        `<div data-t="a" style="display:inline-block;padding:4px">${a}</div><br>` +
        `<div data-t="b" style="display:inline-block;padding:4px">${b}</div></body></html>`,
    );
    for (const forced of ['none', 'active']) {
      await page.emulateMedia({ forcedColors: forced });
      const [shotA, shotB] = [await page.locator('[data-t="a"]').screenshot(), await page.locator('[data-t="b"]').screenshot()];
      const differ = !shotA.equals(shotB);
      console.log(`${differ ? 'ok  ' : 'SAME'} ${name}, forced colors ${forced}`);
      if (!differ) failures.push(`${name} render the same with forced colors ${forced}`);
    }
  }
} finally {
  await browser.close();
}
for (const f of failures) console.log(`FAIL  ${f}`);
process.exit(failures.length ? 1 : 0);
