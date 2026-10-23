// tokens.css's colors: VitePress's own palette (vars.css at the tag in
// test/upstream/SOURCE) on the contract's names, with its contrast
// shortfalls fitted: a hovered link (brand-hover as text and dimmed to 0.75
// in its container, the roles' hovers dimmed in theirs) at 4.5:1, as
// test/themes.mjs holds every theme to; and, beyond the test's minimums
// (3:1, 1.1), the brand button's white label at 4.5:1 at rest, hovered and
// pressed, and a control's border at 3:1 on the page. The fits are
// gen-themes.mjs's steps toward black (light) or white (dark), from the
// color math the generators and the test share (scripts/color.mjs).
//
//   node scripts/fit-stock.mjs            # writes the block into tokens.css
//   node scripts/fit-stock.mjs --check    # exits 1 if tokens.css differs
//
// VitePress's -1, -2, -3 and -soft are read as the jobs they do in its
// stylesheets: -1 is text, -2 a hovered link, -3 the brand button's ground,
// -soft the tint; the gray ramp's -3, -2 and -1 are the alt button's rest,
// hover and active grounds. tip and note are brand's; caution is its own
// (danger's colors in VitePress's stock).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { black, fitAll, mix, solid, white } from './color.mjs';
import { FROM, contractLines } from './contract.mjs';
import { modeValues, resolve } from './css.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const BEGIN = '  /* fit-stock: begin */';
const END = '  /* fit-stock: end */';

const vars = readFileSync(join(ROOT, 'test/upstream/vars.css'), 'utf8');
const root = modeValues(vars, ':root');
const stock = { light: root, dark: new Map([...root, ...modeValues(vars, '.dark')]) };

// the contract's names, in tokens.css's order, each from VitePress's name
const fitted = {};
for (const mode of ['light', 'dark']) {
  const get = (name) => resolve(stock[mode], stock[mode].get(`--vp-c-${name}`));
  const v = Object.fromEntries(Object.entries(FROM).map(([to, from]) => [to, get(from)]));
  const [bg, elv] = [v.bg, v['bg-elv']];
  const gray = solid(v['gray-soft'], bg);
  const gray2 = solid(v['gray-soft'], gray);
  // a hovered link: as text on the page, the elevated surface and code's
  // tint, and dimmed to 0.75 in the gray containers and on their code
  v['brand-hover'] = fitAll(v['brand-hover'], mode, { text: [bg, elv, gray], dimmed: [gray, gray2] });
  // each role's hovered link, dimmed in its own container and on code's tint there
  for (const role of ['important', 'warning', 'danger', 'caution']) {
    const tint = solid(v[`${role}-soft`], bg);
    const tint2 = solid(v[`${role}-soft`], tint);
    v[`${role}-hover`] = fitAll(v[`${role}-hover`], mode, { dimmed: [tint, tint2] });
  }
  // the brand button's white label: 4.5 at rest, hovered and pressed
  v['brand-fill'] = fitAll(v['brand-fill'], 'light', { text: [white] });
  const rest = v['brand-fill'];
  // dark: from the fitted rest, not brand-2 and brand-1, a hovered link's and
  // the text's colors, too light under white
  v['brand-fill-hover'] = fitAll(mode === 'light' ? v['brand-fill-hover'] : mix(rest, black, 0.15), 'light', { text: [white] });
  v['brand-fill-active'] = fitAll(mode === 'light' ? v['brand-fill-active'] : mix(rest, black, 0.25), 'light', { text: [white] });
  // a control's boundary: 3:1 against the page (WCAG 1.4.11)
  v.border = fitAll(v.border, mode, { text: [bg], target: 3.0 });
  fitted[mode] = v;
}

let block = `${contractLines(fitted.light, fitted.dark).join('\n')}\n\n`;
for (let i = 1; i <= 5; i++) block += `  --vp-shadow-${i}: ${root.get(`--vp-shadow-${i}`).replace(/\s+/g, ' ')};\n`;

const path = join(ROOT, 'tokens.css');
const tokens = readFileSync(path, 'utf8');
const [begin, end] = [tokens.indexOf(BEGIN), tokens.indexOf(END)];
if (begin === -1 || end === -1) throw new Error('tokens.css has no fit-stock markers');
const next = `${tokens.slice(0, begin + BEGIN.length)}\n${block}${tokens.slice(end)}`;
if (check) {
  if (next !== tokens) {
    console.error("tokens.css's colors are not scripts/fit-stock.mjs's output: run it");
    process.exit(1);
  }
  console.log("tokens.css's colors are fit-stock.mjs's output");
} else {
  writeFileSync(path, next);
  console.log('tokens.css written');
}
