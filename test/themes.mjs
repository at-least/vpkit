// The color-theme contract: every themes/*.css is a complete design, and
// the stylesheets read only what a theme defines.
//
//   node test/themes.mjs
//
// The contract is tokens.css's: every --vp-c-* it defines (34) and the five
// shadows. Every stylesheet of the app kit (tokens, theme, base, prose, the
// components) may read only those; the docs theme (docs-theme/) may read
// its own vars.css's too. Each theme defines all of them in one :root block,
// each color a light-dark() pair, and meets the WCAG contrast minimums of
// the job each token does (body text, links, buttons, badge text, alert link
// hovers) on both sides. Exits 1, listing every failure.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
// the luminance and contrast the generators fit with: one implementation
import { composite, contrast, luminance, white } from '../scripts/color.mjs';
import { hasPair, modeValues, parseBlocks, stripComments } from '../scripts/css.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(ROOT, file), 'utf8');

const failures = [];
const fail = (message) => failures.push(message);
let checks = 0;

// the contract: tokens.css's colors and shadows
const stock = modeValues(read('tokens.css'), ':root');
const COLORS = [...stock.keys()].filter((k) => k.startsWith('--vp-c-')).map((k) => k.slice('--vp-c-'.length));
const SHADOWS = [1, 2, 3, 4, 5].map((i) => `--vp-shadow-${i}`);
if (COLORS.length < 30) fail(`contract implausibly small: ${COLORS.join(', ')}`);
for (const token of COLORS) {
  checks++;
  if (!hasPair(stock.get(`--vp-c-${token}`))) fail(`tokens.css: --vp-c-${token} is not a light-dark() pair`);
}
for (const shadow of SHADOWS) {
  checks++;
  if (!stock.has(shadow)) fail(`tokens.css: no ${shadow}`);
}

// every .css file under a directory, recursively
function cssFiles(dir) {
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir), { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.css'))
    .map((e) => join(e.parentPath, e.name).slice(ROOT.length + 1))
    .sort();
}

// every --vp-c-* a stylesheet reads
function reads(css) {
  const names = new Set();
  for (const m of stripComments(css).matchAll(/var\(--vp-c-([a-z0-9-]+)/g)) names.add(m[1]);
  return names;
}

// the app kit reads the contract and nothing else
const appKit = [...['tokens.css', 'theme.css', 'base.css', 'prose.css', 'fonts.css'].filter((f) => existsSync(join(ROOT, f))), ...cssFiles('components')];
for (const file of appKit) {
  for (const name of reads(read(file))) {
    checks++;
    if (!COLORS.includes(name)) fail(`${file} reads --vp-c-${name}, which tokens.css does not define`);
  }
}
// the docs theme reads the contract and its own variables
const docsVars = existsSync(join(ROOT, 'docs-theme/vars.css'))
  ? [...modeValues(read('docs-theme/vars.css'), ':root').keys()].filter((k) => k.startsWith('--vp-c-')).map((k) => k.slice('--vp-c-'.length))
  : [];
for (const file of cssFiles('docs-theme')) {
  for (const name of reads(read(file))) {
    checks++;
    if (!COLORS.includes(name) && !docsVars.includes(name)) fail(`${file} reads --vp-c-${name}, which neither tokens.css nor docs-theme/vars.css defines`);
  }
}

// a token as a solid color: a 6-digit hex, or rgba() composited over the
// backdrop (when one is given)
function color(values, token, backdrop) {
  const value = values.get(`--vp-c-${token}`);
  if (value === undefined) throw new Error(`token --vp-c-${token} not defined`);
  if (value.startsWith('#')) {
    if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`--vp-c-${token} = ${value}: expected 6-digit hex`);
    return value.toLowerCase();
  }
  const rgba = value.match(/^rgba\((.*)\)$/);
  if (!backdrop || !rgba) throw new Error(`--vp-c-${token} = ${value}: expected a hex literal${backdrop ? ' or rgba()' : ''}`);
  const parts = rgba[1].split(',').map((n) => (n.trim() === '' ? NaN : Number(n.trim())));
  if (parts.length !== 4 || parts.some(Number.isNaN)) throw new Error(`--vp-c-${token} = ${value}`);
  const [r, g, b, a] = parts;
  return composite([r, g, b], a, backdrop);
}

const names = readdirSync(join(ROOT, 'themes'))
  .filter((f) => f.endsWith('.css'))
  .map((f) => f.slice(0, -4))
  .sort();
if (!names.length) fail('no themes found');

for (const name of names) {
  const css = read(`themes/${name}.css`);

  // a complete design: one :root block, the whole contract as pairs, the shadows
  for (const block of parseBlocks(css)) {
    checks++;
    if (block.selector !== ':root') fail(`theme ${name}: a \`${block.selector}\` block; a theme is one :root of light-dark() pairs`);
  }
  const raw = modeValues(css, ':root');
  const missing = COLORS.filter((token) => !raw.has(`--vp-c-${token}`));
  checks++;
  if (missing.length) fail(`theme ${name}: missing tokens ${missing.join(', ')} — a theme must define the whole contract`);
  for (const token of COLORS) {
    if (!raw.has(`--vp-c-${token}`)) continue;
    checks++;
    if (!hasPair(raw.get(`--vp-c-${token}`))) fail(`theme ${name}: --vp-c-${token} = ${raw.get(`--vp-c-${token}`)} is not a light-dark() pair`);
  }
  for (const shadow of SHADOWS) {
    checks++;
    if (!raw.has(shadow)) fail(`theme ${name}: missing ${shadow}`);
  }

  for (const mode of ['light', 'dark']) {
    const values = modeValues(css, ':root', mode);
    const label = `theme ${name} ${mode}`;
    try {
      const hex = (token) => color(values, token);
      const bg = hex('bg');
      const minimum = (token, against, min) => {
        checks++;
        const ratio = contrast(hex(token), against);
        if (ratio < min - 1e-9) {
          fail(`${label}: --vp-c-${token} ${hex(token)} has contrast ${ratio.toFixed(2)} < ${min} against ${against}`);
        }
      };
      const holds = (ok, message) => {
        checks++;
        if (!ok) fail(`${label}: ${message}`);
      };

      // the elevated surface: menus, dialogs, toasts
      const elv = hex('bg-elv');

      // body text, on the page and on the elevated surface
      minimum('text-1', bg, 7.0);
      minimum('text-1', elv, 7.0);
      // secondary text also sits on the alternate and soft surfaces, and on
      // the elevated one (a menu's group title)
      minimum('text-2', bg, 4.5);
      minimum('text-2', hex('bg-alt'), 4.5);
      minimum('text-2', hex('bg-soft'), 4.5);
      minimum('text-2', elv, 4.5);
      // muted text
      minimum('text-3', bg, 3.0);

      // the text ramp is monotonic: body ≥ secondary ≥ muted against the
      // page; fitting tokens independently can converge or invert it
      const [c1, c2, c3] = ['text-1', 'text-2', 'text-3'].map((t) => contrast(hex(t), bg));
      holds(c1 >= c2, `text-1 (${c1.toFixed(2)}) does not outrank text-2 (${c2.toFixed(2)})`);
      holds(c2 >= c3, `text-2 (${c2.toFixed(2)}) does not outrank text-3 (${c3.toFixed(2)})`);

      // a border separates from the page, or controls vanish
      holds(contrast(hex('border'), bg) >= 1.1, `border ${hex('border')} vanishes on bg ${bg}`);

      // the elevated surface is never darker than the page
      holds(luminance(elv) >= luminance(bg) - 1e-9, `bg-elv ${elv} is darker than bg ${bg}`);

      // the roles stay distinguishable, and the brand is not the body text
      const sems = ['success', 'warning', 'danger'].map(hex);
      holds(new Set(sems).size === sems.length, 'semantic colors collapsed');
      holds(hex('brand') !== hex('text-1'), 'brand equals text-1 — links would be invisible as emphasis');

      // the brand as text: links, icons and inline code on the page and the
      // elevated surface, and a menu's current item under its hover wash
      minimum('brand', bg, 4.5);
      minimum('brand', elv, 4.5);
      minimum('brand', color(values, 'gray-soft', elv), 4.5);

      // the brand button: white text on its ground at rest, hovered and pressed
      for (const fill of ['brand-fill', 'brand-fill-hover', 'brand-fill-active']) {
        checks++;
        const ratio = contrast(white, hex(fill));
        if (ratio < 3 - 1e-9) fail(`${label}: --vp-c-${fill} ${hex(fill)} has contrast ${ratio.toFixed(2)} < 3 with white`);
      }

      // a hovered link, as text, and dimmed to 0.75 in a container
      // (prose.css's custom blocks and the alert dim a hovered link), on
      // the container's tint and on the tint of code inside it
      const dimmed = (token, ground) => {
        checks++;
        const painted = composite(hex(token), 0.75, ground);
        const ratio = contrast(painted, ground);
        if (ratio < 4.5 - 1e-9) {
          fail(`${label}: --vp-c-${token} ${hex(token)} hovered in a container paints ${ratio.toFixed(2)} < 4.5 against ${ground}`);
        }
      };
      // brand-hover: the page's links, code in them, and the info, note and
      // details containers, whose tint and code tint are the gray wash
      const codeBg = color(values, 'gray-soft', bg);
      minimum('brand-hover', bg, 4.5);
      minimum('brand-hover', elv, 4.5);
      minimum('brand-hover', codeBg, 4.5);
      dimmed('brand-hover', codeBg);
      dimmed('brand-hover', color(values, 'gray-soft', codeBg));

      // a role's text on its own tint, composited over the page; its hover
      // dimmed on the tint and on code's tint inside it
      for (const kind of ['success', 'important', 'warning', 'danger', 'caution']) {
        const tint = color(values, `${kind}-soft`, bg);
        minimum(kind, tint, 4.5);
        if (COLORS.includes(`${kind}-hover`)) {
          dimmed(`${kind}-hover`, tint);
          dimmed(`${kind}-hover`, color(values, `${kind}-soft`, tint));
        }
      }
    } catch (error) {
      fail(`${label}: ${error.message}`);
    }
  }
}

for (const f of failures) console.log(`FAIL  ${f}`);
console.log(
  `${names.length} themes × light/dark against a contract of ${COLORS.length} colors and ${SHADOWS.length} shadows, ` +
    `${appKit.length} app kit stylesheets held to it: ${checks} checks, ${failures.length} failed`,
);
process.exit(failures.length ? 1 : 0);
