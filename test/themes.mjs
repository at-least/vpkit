// The color-theme contract: every themes/*.css is a complete design.
//
//   node test/themes.mjs
//
// The required tokens are derived from the stylesheets themselves: every
// --vp-c-* that any of vpkit's root stylesheets references (index.css with
// its parts, the components, the layout, the markdown, the icons), minus
// the color ramps and the absolutes. Each theme must define all of them in
// :root and in .dark, plus --vp-shadow-1…5 in :root, and meet the WCAG
// contrast minimums of the role each token plays (body text, links,
// buttons, badge text, alert link hovers) in both modes. Ported from
// rustpress's tests/theme_contract.rs, check for check. Exits 1, listing
// every failure.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAMPS = ['gray', 'indigo', 'purple', 'green', 'yellow', 'orange', 'red'];
// absolute colors, defined once in the base and never themed
const ABSOLUTES = ['white', 'black'];

const read = (file) => readFileSync(join(ROOT, file), 'utf8');

// every stylesheet vpkit ships, the root *.css files: index.css's parts,
// the components (button.css, …), layout.css, content.css, icons.css.
// index.css itself only imports; fonts.css references no token
function baseCss() {
  return readdirSync(ROOT)
    .filter((f) => f.endsWith('.css'))
    .sort()
    .map(read)
    .join('\n');
}

// VitePress's own slip, carried verbatim by the port: VPSidebar.vue sets
// `box-shadow: var(--vp-c-shadow-3)` on the phone's open sidebar, and
// nothing defines that name (the shadows are --vp-shadow-*), so it never
// paints upstream either. Not a token a theme can define.
const UPSTREAM_SLIPS = ['shadow-3'];

const stripComments = (css) => css.replace(/\/\*[\s\S]*?(\*\/|$)/g, '');

// top-level `selector { decl; decl; }` blocks; theme files and the token
// layer of the base are flat, which is all this needs to read
function parseBlocks(css) {
  css = stripComments(css);
  const blocks = [];
  let rest = css;
  for (let open = rest.indexOf('{'); open !== -1; open = rest.indexOf('{')) {
    const selector = rest.slice(0, open).trim().split(/\s+/).join(' ');
    let depth = 1;
    let close = open + 1;
    for (; close < rest.length && depth > 0; close++) {
      if (rest[close] === '{') depth++;
      else if (rest[close] === '}') depth--;
    }
    const body = rest.slice(open + 1, Math.max(close - 1, open + 1));
    const declarations = body
      .split(';')
      .map((decl) => {
        const colon = decl.indexOf(':');
        return colon === -1 ? null : [decl.slice(0, colon).trim(), decl.slice(colon + 1).trim()];
      })
      .filter((decl) => decl && decl[0] !== '');
    blocks.push({ selector, declarations });
    rest = rest.slice(close);
  }
  return blocks;
}

const isRamp = (token) => RAMPS.some((ramp) => token === ramp || token.startsWith(`${ramp}-`));

// Shortfalls the generator cannot fit, each with its cause; a failure that
// matches one is reported instead of failing, and an entry that matches
// nothing fails the run, so none outlives its cause.
const SHORTFALLS = [];

const failures = [];
const expected = [];
const fail = (message) => {
  const s = SHORTFALLS.find((x) => message.startsWith(`theme ${x.theme} ${x.selector}:`) && x.pattern.test(message));
  if (!s) return failures.push(message);
  s.hits = (s.hits ?? 0) + 1;
  expected.push(message);
};

// every --vp-c-* token the base references, minus ramps and absolutes:
// derived, not hand-maintained, so it cannot drift from what the
// structure consumes
function requiredTokens(css) {
  const refs = [];
  for (const part of stripComments(css).split(/[;{}]/)) {
    const colon = part.indexOf(':');
    if (colon === -1) continue;
    const property = part.slice(0, colon).trim();
    let value = part.slice(colon + 1).trim();
    for (let start = value.indexOf('var(--vp-c-'); start !== -1; start = value.indexOf('var(--vp-c-')) {
      value = value.slice(start + 'var(--vp-c-'.length);
      const end = value.indexOf(')') === -1 ? value.length : value.indexOf(')');
      const name = value.slice(0, end).trim();
      value = value.slice(end);
      // a ramp token may only appear inside a token-layer definition
      // (`--vp-c-success-1: var(--vp-c-green-1)`), never in a structural
      // rule, or themes that don't define ramps leak stock colors
      if (isRamp(name) && !property.startsWith('--vp-c-')) {
        fail(`ramp token --vp-c-${name} referenced by structural rule \`${property}\` in the base`);
      }
      refs.push(name);
    }
  }
  const tokens = [
    ...new Set(refs.filter((t) => !isRamp(t) && !ABSOLUTES.includes(t) && !UPSTREAM_SLIPS.includes(t))),
  ].sort();
  if (tokens.length < 30) fail(`contract implausibly small: ${tokens.join(', ')}`);
  return tokens;
}

function modeValues(css, selector) {
  const values = new Map();
  for (const block of parseBlocks(css)) {
    if (block.selector !== selector) continue;
    for (const [prop, value] of block.declarations) values.set(prop, value);
  }
  return values;
}

const parseHex = (hex) => {
  const n = parseInt(hex, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
};

// a token as a solid color: a 6-digit hex, or rgba() composited over the
// backdrop (when one is given)
function color(values, token, backdrop) {
  const value = values.get(`--vp-c-${token}`);
  if (value === undefined) throw new Error(`token --vp-c-${token} not defined`);
  if (value.startsWith('#')) {
    if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`--vp-c-${token} = ${value}: expected 6-digit hex`);
    return parseHex(value.slice(1));
  }
  const rgba = value.match(/^rgba\((.*)\)$/);
  if (!backdrop || !rgba) throw new Error(`--vp-c-${token} = ${value}: expected a hex literal${backdrop ? ' or rgba()' : ''}`);
  const parts = rgba[1].split(',').map((n) => (n.trim() === '' ? NaN : Number(n.trim())));
  if (parts.length !== 4 || parts.some(Number.isNaN)) throw new Error(`--vp-c-${token} = ${value}`);
  const [r, g, b, a] = parts;
  const mix = (fg, bg) => Math.round(fg * a + bg * (1 - a));
  return [mix(r, backdrop[0]), mix(g, backdrop[1]), mix(b, backdrop[2])];
}

function luminance([r, g, b]) {
  const channel = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const base = baseCss();
const required = requiredTokens(base);

// gradedContainers opts into GitHub-style severity colors; the rule must
// carry its own literals with :has() specificity so it beats any theme's
// :root/.dark warning/caution (which load later)
for (const selector of [':root:has(.vp-graded-containers)', ':root.dark:has(.vp-graded-containers)']) {
  const block = parseBlocks(base).find((b) => b.selector === selector);
  if (!block) {
    fail(`missing \`${selector}\` rule`);
    continue;
  }
  for (const token of ['--vp-c-warning-1', '--vp-c-caution-1']) {
    const decl = block.declarations.find(([prop]) => prop === token);
    if (!decl) fail(`\`${selector}\` does not define ${token}`);
    else if (!decl[1].startsWith('#') && !decl[1].startsWith('rgba(')) {
      fail(`\`${selector}\` ${token} = ${decl[1]}: expected a literal, not a stock ramp reference`);
    }
  }
}

const names = readdirSync(join(ROOT, 'themes'))
  .filter((f) => f.endsWith('.css'))
  .map((f) => f.slice(0, -4))
  .sort();
if (!names.length) fail('no themes found');

const WHITE = [0xff, 0xff, 0xff];
let checks = 0;
for (const name of names) {
  const css = read(`themes/${name}.css`);

  // a complete design: the whole contract in both modes, the shadows once
  for (const selector of [':root', '.dark']) {
    const values = modeValues(css, selector);
    const missing = required.filter((token) => !values.has(`--vp-c-${token}`));
    checks++;
    if (missing.length) fail(`theme ${name}, ${selector}: missing tokens ${missing.join(', ')} — a theme must define the whole contract`);
  }
  const root = modeValues(css, ':root');
  for (let i = 1; i <= 5; i++) {
    checks++;
    if (!root.has(`--vp-shadow-${i}`)) fail(`theme ${name}: missing --vp-shadow-${i}`);
  }

  for (const selector of [':root', '.dark']) {
    const values = modeValues(css, selector);
    const label = `theme ${name} ${selector}`;
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

      // the elevated surface: menus, dialogs, toasts (vp-dropdown,
      // vp-dialog, vp-toast; VPMenu and the flyouts in layout.css)
      const elv = hex('bg-elv');

      // body text, on the page and on the elevated surface
      minimum('text-1', bg, 7.0);
      minimum('text-1', elv, 7.0);
      // secondary text also sits on the sidebar / code-block surfaces, and
      // on the elevated one (a menu's group title)
      minimum('text-2', bg, 4.5);
      minimum('text-2', hex('bg-alt'), 4.5);
      minimum('text-2', hex('bg-soft'), 4.5);
      minimum('text-2', elv, 4.5);
      // muted text
      minimum('text-3', bg, 3.0);

      // the text ramp is monotonic: primary ≥ secondary ≥ muted (contrast
      // against the page bg); fitting tokens independently can converge or
      // invert it, and headings would lose hierarchy against body text
      const [c1, c2, c3] = ['text-1', 'text-2', 'text-3'].map((t) => contrast(hex(t), bg));
      holds(c1 >= c2, `text-1 (${c1.toFixed(2)}) does not outrank text-2 (${c2.toFixed(2)})`);
      holds(c2 >= c3, `text-2 (${c2.toFixed(2)}) does not outrank text-3 (${c3.toFixed(2)})`);

      // borders and dividers separate from the page bg, or rules and
      // surfaces vanish
      holds(contrast(hex('border'), bg) >= 1.1, `border ${hex('border')} vanishes on bg ${bg}`);

      // elevated surfaces (dropdowns, popovers) are never darker than the
      // page bg: the stock look's convention
      holds(luminance(hex('bg-elv')) >= luminance(bg) - 1e-9, `bg-elv ${hex('bg-elv')} is darker than bg ${bg}`);

      // container semantics stay distinguishable: distinct hues per role,
      // and the brand is not the body text color
      const sems = ['success-1', 'warning-1', 'danger-1'].map((t) => hex(t).join());
      holds(new Set(sems).size === sems.length, 'semantic colors collapsed');
      holds(hex('brand-1').join() !== hex('text-1').join(), 'brand-1 equals text-1 — links would be invisible as emphasis');

      // links and inline code, on the page and on the elevated surface, and
      // a menu's current item hovered (the gray wash over the elevated one)
      minimum('brand-1', bg, 4.5);
      minimum('brand-1', elv, 4.5);
      minimum('brand-1', color(values, 'default-soft', elv), 4.5);

      // the brand button: white text on its ground at rest (brand-3) and
      // hovered (--vp-button-brand-hover-bg, which a theme sets itself:
      // brand-2 is the hovered link's color, and in dark mode no one color
      // can be both)
      minimum('brand-3', WHITE, 3.0);
      const hoverBg = values.get('--vp-button-brand-hover-bg');
      checks++;
      if (!hoverBg) fail(`${label}: --vp-button-brand-hover-bg not defined`);
      else if (!/^#[0-9a-f]{6}$/i.test(hoverBg)) fail(`${label}: --vp-button-brand-hover-bg = ${hoverBg}: expected 6-digit hex`);
      else {
        const ratio = contrast(WHITE, parseHex(hoverBg.slice(1)));
        if (ratio < 3 - 1e-9) fail(`${label}: --vp-button-brand-hover-bg ${hoverBg} has contrast ${ratio.toFixed(2)} < 3 with white`);
      }

      // a hovered link: a -2, as text. The containers dim a hovered link to
      // 0.75 (custom-block.css, alert.css), so there it is checked as it
      // paints, over the container's tint and over the tint of code inside
      // it (tokens.css's --vp-custom-block-*-bg and -code-bg)
      const dimmed = (token, ground) => {
        checks++;
        const painted = hex(token).map((c, i) => Math.round(c * 0.75 + ground[i] * 0.25));
        const ratio = contrast(painted, ground);
        if (ratio < 4.5 - 1e-9) {
          fail(`${label}: --vp-c-${token} ${hex(token)} hovered in a container paints ${ratio.toFixed(2)} < 4.5 against ${ground}`);
        }
      };
      // brand-2: the page's links (vp-doc.css, layout.css, vp-link), code in
      // them (--vp-code-link-hover-color), and the info, note and details
      // containers, whose tint and code tint are the default-soft
      const codeBg = color(values, 'default-soft', bg);
      const grayTint = color(values, 'default-soft', bg);
      minimum('brand-2', bg, 4.5);
      minimum('brand-2', elv, 4.5);
      minimum('brand-2', codeBg, 4.5);
      dimmed('brand-2', grayTint);
      dimmed('brand-2', color(values, 'default-soft', grayTint));

      // badge / container foregrounds, against their own soft background
      // (composited over the page bg when rgba); a role's -2 is the hovered
      // link in its container, dimmed, on the tint and on code's tint
      for (const kind of ['tip', 'note', 'success', 'important', 'warning', 'danger', 'caution']) {
        const tint = color(values, `${kind}-soft`, bg);
        minimum(`${kind}-1`, tint, 4.5);
        if (required.includes(`${kind}-2`)) {
          dimmed(`${kind}-2`, tint);
          dimmed(`${kind}-2`, color(values, `${kind}-soft`, tint));
        }
      }
    } catch (error) {
      fail(`${label}: ${error.message}`);
    }
  }
}

for (const s of SHORTFALLS) {
  if (s.hits) console.log(`KNOWN ${s.hits}× ${s.theme} ${s.selector} ${s.pattern}: ${s.reason}`);
  else failures.push(`shortfall no longer occurs, remove it: ${s.theme} ${s.selector} ${s.pattern}`);
}
for (const e of expected) console.log(`  known  ${e}`);
for (const f of failures) console.log(`FAIL  ${f}`);
console.log(
  `${names.length} themes × :root/.dark against a contract of ${required.length} tokens: ` +
    `${checks} checks, ${failures.length} failed, ${expected.length} known shortfalls`,
);
process.exit(failures.length ? 1 : 0);
