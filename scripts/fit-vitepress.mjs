// themes/vitepress.css: VitePress's stock palette (tokens.css) with its
// contrast shortfalls fitted to the contract test/themes.mjs holds every
// theme to, and to what the owner asked for on 2026-10-11 (the apps gave
// up their own AA fixes, so vpkit carries them for all of them). The
// property list is themes/github.css's; the fits are gen-themes.mjs's, from
// the color math the two scripts share (scripts/color.mjs).
//
//   node scripts/fit-vitepress.mjs            # writes themes/vitepress.css
//   node scripts/fit-vitepress.mjs --check    # exits 1 if it would differ
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { black, composite, fitAll, hexs, mix, white } from './color.mjs';
import { modeValues, resolve } from './css.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');

// an rgba() token composited over bg, or a hex as is
function over(value, bg) {
  const m = value.match(/^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/);
  if (!m) return value;
  return composite(hexs([Number(m[1]), Number(m[2]), Number(m[3])]), Number(m[4]), bg);
}

const tokens = readFileSync(join(ROOT, 'tokens.css'), 'utf8');
const root = modeValues(tokens, ':root');
const stock = { ':root': root, '.dark': new Map([...root, ...modeValues(tokens, '.dark')]) };
// the property list: themes/github.css's, and the brand button's pressed
// ground right after its hovered one (github.css leaves it to tokens.css)
const template = readFileSync(join(ROOT, 'themes/github.css'), 'utf8');
const blocks = {};
const changes = [];
for (const [sel, mode] of [[':root', 'light'], ['.dark', 'dark']]) {
  const keys = [...modeValues(template, sel).keys()];
  keys.splice(keys.indexOf('--vp-button-brand-hover-bg') + 1, 0, '--vp-button-brand-active-bg');
  const v = (blocks[sel] = Object.fromEntries(keys.map((k) => [k, resolve(stock[sel], stock[sel].get(k))])));
  const [bg, elv] = [v['--vp-c-bg'], v['--vp-c-bg-elv']];
  const gray = over(v['--vp-c-default-soft'], bg);
  const gray2 = over(v['--vp-c-default-soft'], gray);
  const change = (k, next, why) => {
    if (next !== v[k]) {
      changes.push([sel, k, v[k], next, why]);
      v[k] = next;
    }
  };
  // a hovered link: brand-2 as text on the page, the elevated surface and
  // code's tint, and dimmed to 0.75 in the gray containers
  change('--vp-c-brand-2', fitAll(v['--vp-c-brand-2'], mode, { text: [bg, elv, gray], dimmed: [gray, gray2] }), 'a hovered link as text, and dimmed in a container');
  // each role's -2, dimmed in its own container and on code's tint there
  for (const role of ['tip', 'important', 'warning', 'danger', 'caution']) {
    const tint = over(v[`--vp-c-${role}-soft`], bg);
    const tint2 = over(v[`--vp-c-${role}-soft`], tint);
    change(`--vp-c-${role}-2`, fitAll(v[`--vp-c-${role}-2`], mode, { dimmed: [tint, tint2] }), `a hovered link dimmed in a ${role} container`);
  }
  // the brand button's white label: 4.5 at rest (brand-3), hovered and pressed
  change('--vp-c-brand-3', fitAll(v['--vp-c-brand-3'], 'light', { text: [white] }), "the brand button's white label at rest");
  const rest = v['--vp-c-brand-3'];
  change('--vp-button-brand-hover-bg', fitAll(mode === 'light' ? v['--vp-c-brand-2'] : mix(rest, black, 0.15), 'light', { text: [white] }), "the brand button's white label hovered");
  change('--vp-button-brand-active-bg', fitAll(mode === 'light' ? v['--vp-c-brand-1'] : mix(rest, black, 0.25), 'light', { text: [white] }), "the brand button's white label pressed");
  // a control's boundary: 3:1 against the page (WCAG 1.4.11)
  change('--vp-c-border', fitAll(v['--vp-c-border'], mode, { text: [bg], target: 3.0 }), "a control's boundary at 3:1 on the page");
}

const HEADER = `/* Built-in theme: vitepress — VitePress's own palette, its contrast
 * shortfalls fitted. Every value is tokens.css's stock one (vars.css at
 * the tag in test/upstream/SOURCE) except what the contract and the owner
 * asked for (2026-10-11, after the apps gave up their own AA fixes): a
 * hovered link's -2, as text and dimmed to 0.75 in its container, at 4.5:1
 * (brand, tip, important, warning, danger, caution, both modes: stock
 * paints 2.2 to 4.1); the brand button's white label at 4.5:1 at rest
 * (light brand-3 4.48 to 4.5), hovered (dark: a deeper ground than stock's
 * lighter brand-2 at 4.15) and pressed (dark: a deeper ground than stock's
 * brand-1 at 1.6); a control's border at 3:1 on the page (stock 2.2 light,
 * 1.6 dark). Fitted by gen-themes.mjs's steps toward black (light) or white
 * (dark); \`node scripts/fit-vitepress.mjs\` reproduces it from tokens.css
 * and npm test checks that it does. Import after vpkit, as the apps do. */
`;
let out = HEADER;
for (const sel of [':root', '.dark']) {
  out += `${sel} {\n`;
  let prev = null;
  for (const [k, val] of Object.entries(blocks[sel])) {
    const group = k.replace(/^--vp-(c-)?/, '').split('-')[0];
    if (prev && group !== prev) out += '\n';
    prev = group;
    out += `  ${k}: ${val};\n`;
  }
  out += '}\n' + (sel === ':root' ? '\n' : '');
}
const path = join(ROOT, 'themes/vitepress.css');
if (check) {
  if (readFileSync(path, 'utf8') !== out) {
    console.error("themes/vitepress.css is not scripts/fit-vitepress.mjs's output: run it");
    process.exit(1);
  }
  console.log("themes/vitepress.css is fit-vitepress.mjs's output");
} else {
  for (const [sel, k, old, next, why] of changes) console.log(`${sel.padEnd(6)} ${k.padEnd(30)} ${old.padStart(18)} -> ${next}  ${why}`);
  writeFileSync(path, out);
}
