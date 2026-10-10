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

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-chromium';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function vpkitCss() {
  const dir = mkdtempSync(join(tmpdir(), 'vpkit-test-'));
  try {
    const out = join(dir, 'vpkit.css');
    execFileSync(join(ROOT, 'node_modules/.bin/tailwindcss'), ['-i', join(ROOT, 'test/entry.css'), '-o', out, '--minify'], {
      stdio: 'pipe',
    });
    return readFileSync(out, 'utf8');
  } finally {
    rmSync(dir, { recursive: true });
  }
}

const toggle = (checked) =>
  `<button class="vp-toggle" type="button" role="switch" aria-checked="${checked}"><span class="vp-toggle-check"></span></button>`;
const bar = (percent) =>
  `<span class="vp-progress" style="width:7rem"><span class="vp-progress-bar" style="width:${percent}%"></span></span>`;
const hamburger = (open) =>
  `<button class="vp-hamburger" type="button" aria-label="Menu" aria-expanded="${open}"><span class="vp-hamburger-box"><span></span><span></span><span></span></span></button>`;
const PAIRS = [
  ['a checked and an unchecked toggle', toggle(true), toggle(false)],
  ['a progress bar at 40% and at 0%', bar(40), bar(0)],
  ['an open and a closed hamburger', hamburger(true), hamburger(false)],
];

const css = vpkitCss();
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
