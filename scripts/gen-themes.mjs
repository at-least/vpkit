// Generate vpkit's color themes from the vendored Helix palettes.
//
// Reads helix/*.toml [palette] tables, following a file's `inherits` as
// Helix does (mergeThemes below), maps each scheme onto the design-token
// contract (hand-written slot maps below), derives monotonic text/border
// ramps and the neutral ramp, auto-fits accents for WCAG AA (the same
// ratios test/themes.mjs enforces, by the math it shares with the test,
// scripts/color.mjs), and emits themes/<name>.css. A -hover (brand,
// important, warning, danger, caution; a slot map's brand2) is a hovered
// link's color, VitePress's -2 as every vpkit and VitePress stylesheet uses
// it: the base color stepped toward black in light and toward white in
// dark until it reads at AA where it is drawn, dimmed to 0.75 in a
// container as custom-block.css and alert.css dim a hovered link. vars.css
// also makes -2 the brand button's hover ground; that one is emitted as
// its own --vp-c-brand-fill-hover, since in dark mode no one color can be
// both (measured over the 222 themes of 2026-10-10).
//
// The emitted files are the source of truth once committed: rerun after
// editing the slot maps, rebuild the documentation's theme gallery index
// from them (node scripts/build-docs.mjs), then pass `npm test`. The four
// hand-tuned themes (github, catppuccin, nord, rose-pine) are NOT
// regenerated here; edit them directly. Nor is the stock, tokens.css's
// colors, which scripts/fit-stock.mjs writes from VitePress's vars.css.
//
//   node scripts/gen-themes.mjs
//
// Importing this module runs nothing (test/gen-themes.mjs imports it).
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'smol-toml';
import { EPS, black, composite, contrast, fit, fitAll, fitOnTint, luminance as lum, mix, normHex, rgb, stepTo, white } from './color.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HELIX = join(ROOT, 'helix');

const isHex = (v) => typeof v === 'string' && v.startsWith('#') && [4, 7].includes(v.length);

// A palette entry must be #rgb/#rrggbb: anything else would flow into
// parseInt(..., 16) and silently produce garbage across the ramp.
const checkedHex = (v, stem, k) => {
  if (!isHex(v)) {
    throw new Error(`${stem}.toml: palette[${JSON.stringify(k)}] = ${JSON.stringify(v)} is not a #rgb/#rrggbb hex color`);
  }
  return normHex(v);
};

const isTable = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// A theme that `inherits` another, merged as Helix merges them
// (helix-view/src/theme.rs, merge_themes): the child's top-level keys
// replace the parent's whole, a scope's table included, and the two
// palettes merge entry by entry, the child's entries winning.
export function mergeThemes(parent, child) {
  const theme = { ...parent, ...child };
  theme.palette = { ...(parent.palette ?? {}), ...(child.palette ?? {}) };
  return theme;
}

// A vendored Helix theme with its `inherits` chain followed.
function load(stem) {
  const data = parse(readFileSync(join(HELIX, `${stem}.toml`), 'utf8'));
  if ('inherits' in data) return mergeThemes(load(data.inherits), data);
  return data;
}

// a loaded theme's [palette], each entry checked and normalized (none: empty)
const paletteOf = (data, stem) => Object.fromEntries(Object.entries(data.palette ?? {}).map(([k, v]) => [k, checkedHex(v, stem, k)]));
const pal = (stem) => paletteOf(load(stem), stem);

// --- theme spec -----------------------------------------------------------
// slot keys: bg bg_alt bg_elv text1 border brand1 brand2 brand3 success
//            warning danger important sponsor (text2 and text3 derive
//            from text1 in buildMode)
// light: 'derived' → build a light half from the dark palette (for schemes
// that publish no light mode; stated in the header).
const SPECS = [
  { name: 'tokyonight', desc: 'calm blue-violet, day and storm',
    light: { f: 'tokyonight_day', m: { bg: 'bg', bg_alt: 'bg-selection', bg_elv: 'bg-menu',
      text1: 'fg', border: 'border',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'magenta' } },
    dark: { f: 'tokyonight_storm', p2: 'tokyonight', m: { bg: 'bg', bg_alt: 'bg-menu', bg_elv: 'bg-selection',
      text1: '#c0caf5', border: 'border',
      brand1: 'p2:blue', success: 'p2:green', warning: 'p2:yellow', danger: 'p2:red', important: 'p2:purple', sponsor: 'p2:magenta' } } },
  { name: 'gruvbox', desc: 'retro groove, warm cream and charcoal',
    light: { f: 'gruvbox_light', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg0',
      text1: 'fg0', border: 'bg3',
      brand1: 'blue1', success: 'green1', warning: 'yellow1', danger: 'red1', important: 'purple1', sponsor: 'purple1' } },
    dark: { f: 'gruvbox', m: { bg: 'bg0', bg_alt: 'bg0_s', bg_elv: 'bg1',
      text1: 'fg1', border: 'bg2',
      brand1: 'blue1', success: 'green1', warning: 'yellow1', danger: 'red1', important: 'purple1', sponsor: 'purple1' } } },
  { name: 'gruvbox-material', desc: 'the material take on gruvbox, softer and calmer',
    light: { f: 'gruvbox_material_light_medium', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg0',
      text1: 'fg1', border: 'bg3',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'purple' } },
    dark: { f: 'gruvbox_material_dark_medium', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg2',
      text1: 'fg1', border: 'bg3',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'purple' } } },
  { name: 'onedark', desc: "Atom's One: grey-blue surfaces, saturated accents",
    light: { f: 'onelight', m: { bg: 'white', bg_alt: 'grey-100', bg_elv: 'white',
      text1: 'black', border: 'grey-300',
      brand1: 'blue', success: 'green', warning: 'gold', danger: 'red', important: 'purple', sponsor: 'pink' } },
    dark: { f: 'onedark', m: { bg: 'black', bg_alt: 'light-black', bg_elv: 'gray',
      text1: 'white', border: 'gray',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'purple' } } },
  { name: 'everforest', desc: 'green, calm and low-noise by design',
    light: { f: 'everforest_light', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg0',
      text1: 'fg', border: 'bg3',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'purple' } },
    dark: { f: 'everforest_dark', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg2',
      text1: 'fg', border: 'bg3',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'orange' } } },
  { name: 'ayu', desc: 'subtle, elegant, one bright accent set',
    light: { f: 'ayu_light', m: { bg: 'background', bg_alt: 'black', bg_elv: 'white',
      text1: 'foreground', border: 'dark_gray',
      brand1: 'blue', success: 'green', warning: 'orange', danger: 'red', important: 'magenta', sponsor: 'red' } },
    dark: { f: 'ayu_dark', m: { bg: 'background', bg_alt: '#0b0f14', bg_elv: 'dark_gray',
      text1: 'foreground', border: 'dark_gray',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'magenta', sponsor: 'magenta' } } },
  { name: 'solarized', desc: 'the classic: selective contrast, warm and marine',
    light: { f: 'solarized_light', m: { bg: 'base03', bg_alt: 'base02', bg_elv: 'base03',
      text1: 'base01', border: 'base015',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'violet', sponsor: 'magenta' } },
    dark: { f: 'solarized_dark', m: { bg: 'base03', bg_alt: 'base025', bg_elv: 'base015',
      text1: 'base2', border: 'base01',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'violet', sponsor: 'magenta' } } },
  { name: 'kanagawa', desc: 'wave and lotus: ink, sumi and ukiyo-e color',
    light: { f: 'kanagawa-lotus', m: { bg: 'lotusWhite0', bg_alt: 'lotusWhite1', bg_elv: 'lotusWhite0',
      text1: 'lotusInk0', border: 'lotusBlue1',
      brand1: 'lotusBlue2', success: 'lotusSuperGreen', warning: 'lotusYellow2', danger: 'lotusAutumnRed',
      important: 'lotusSuperViolet', sponsor: 'lotusSuperPink' } },
    dark: { f: 'kanagawa', m: { bg: 'sumiInk3', bg_alt: 'sumiInk4', bg_elv: 'sumiInk5',
      text1: 'fujiWhite', border: 'sumiInk6',
      brand1: 'crystalBlue', success: 'springGreen', warning: 'carpYellow', danger: 'waveRed',
      important: 'oniViolet', sponsor: 'sakuraPink' } } },
  { name: 'papercolor', desc: 'plain paper, high legibility, 16-color spirit',
    light: { f: 'papercolor-light', m: { bg: 'background', bg_alt: '#e0e0e0', bg_elv: 'background',
      text1: 'foreground', border: 'matchparen_bg',
      brand1: 'regular4', success: 'regular2', warning: 'cursorlinenr_fg', danger: 'regular1',
      important: 'bright3', sponsor: 'bright2' } },
    dark: { f: 'papercolor-dark', m: { bg: 'background', bg_alt: 'cursorline_secondary_bg', bg_elv: 'popupmenu_bg',
      text1: 'foreground', border: 'matchparen_bg',
      brand1: 'regular4', success: 'regular2', warning: 'bright4', danger: 'regular1',
      important: 'bright3', sponsor: 'bright5' } } },
  { name: 'seoul256', desc: 'low-contrast seoul nights, paper days derived',
    light: 'derived',
    dark: { f: 'seoul256-dark', m: { bg: 'black1', bg_alt: 'gray1', bg_elv: 'gray3',
      text1: 'white', border: 'gray4',
      brand1: 'blue1', success: 'green3', warning: 'yellow5', danger: 'salmon1',
      important: 'magenta1', sponsor: 'mauve' } } },
  { name: 'modus', desc: "Emacs' accessible flagship: maximum legibility",
    light: { f: 'modus_operandi', m: { bg: 'bg-main', bg_alt: 'bg-dim', bg_elv: 'bg-main',
      text1: 'fg-main', border: 'bg-active',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'magenta', sponsor: 'magenta-warmer' } },
    dark: { f: 'modus_vivendi', m: { bg: 'bg-main', bg_alt: 'bg-dim', bg_elv: 'bg-inactive',
      text1: 'fg-main', border: 'bg-inactive',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'magenta', sponsor: 'magenta-warmer' } } },
  { name: 'flexoki', desc: "ink on paper: Step's warm absolute palette",
    light: { f: 'flexoki_light', m: { bg: 'bg', bg_alt: 'bg-2', bg_elv: '#ffffff',
      text1: 'tx', border: 'ui-3',
      brand1: 'bl', success: 'gr', warning: 'ye', danger: 're', important: 'pu', sponsor: 'ma' } },
    dark: { f: 'flexoki_dark', m: { bg: 'bg', bg_alt: 'bg-2', bg_elv: 'ui-2',
      text1: 'tx', border: 'ui-3',
      brand1: 'bl', success: 'gr', warning: 'ye', danger: 're', important: 'pu', sponsor: 'ma' } } },
  { name: 'iceberg', desc: 'cool navy-blue calm, light and dark',
    light: { f: 'iceberg-light', m: { bg: 'background_bg', bg_alt: 'sel_bg', bg_elv: 'background_bg',
      text1: 'background_fg', border: 'matchparen_bg',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'magenta', sponsor: 'light-red' } },
    dark: { f: 'iceberg-dark', m: { bg: 'background_bg', bg_alt: 'linenr_bg', bg_elv: 'cursorlinenr_bg',
      text1: 'background_fg', border: 'matchparen_bg',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'magenta', sponsor: 'light-red' } } },
  { name: 'adwaita', desc: "GNOME's own: libadwaita light and dark",
    light: { f: 'adwaita-dark', m: { bg: 'light_1', bg_alt: 'light_3', bg_elv: 'light_1',
      text1: 'dark_5', border: 'light_4',
      brand1: 'blue_5', success: 'green_6', warning: 'yellow_6', danger: 'red_5',
      important: 'purple_5', sponsor: 'red_5' } },
    dark: { f: 'adwaita-dark', m: { bg: 'libadwaita_dark', bg_alt: 'libadwaita_dark_alt', bg_elv: 'libadwaita_popup',
      text1: 'light_2', border: 'split_and_borders',
      brand1: 'blue_2', success: 'green_3', warning: 'yellow_4', danger: 'red_3',
      important: 'purple_2', sponsor: 'red_2' } } },
  { name: 'dracula', desc: 'the famous dark purple, light derived from its palette',
    light: 'derived',
    dark: { f: 'dracula', m: { bg: 'background', bg_alt: 'black', bg_elv: 'current_line',
      text1: 'foreground', border: 'indent',
      brand1: 'purple', success: 'green', warning: 'yellow', danger: 'red',
      important: 'pink', sponsor: 'pink' } } },
  { name: 'monokai', desc: 'the classic that colored a decade of editors',
    light: 'derived',
    dark: { f: 'monokai', p2: 'monokai_pro', m: { bg: 'background', bg_alt: 'widget', bg_elv: 'selection',
      text1: 'text', border: '#3b3c35',
      brand1: '#66d9ef', success: '#a6e22e', warning: '#e6db74', danger: '#f92672',
      important: '#ae81ff', sponsor: '#fd971f' } } },
  { name: 'material', desc: "Google's material ocean, light derived from its palette",
    light: 'derived',
    dark: { f: 'material_oceanic', m: { bg: 'bg', bg_alt: 'active', bg_elv: 'highlight',
      text1: 'text', border: 'disabled',
      brand1: 'accent', success: '#c3e88d', warning: '#ffcb6b', danger: '#f07178',
      important: '#c792ea', sponsor: '#ff5370' } } },
  { name: 'night-owl', desc: 'deep navy, bright primaries; light derived from its palette',
    light: 'derived',
    dark: { f: 'night_owl', m: { bg: 'background', bg_alt: 'background2', bg_elv: 'selection',
      text1: 'foreground', border: 'grey4',
      brand1: 'blue', success: 'green', warning: 'gold', danger: 'red',
      important: 'pink', sponsor: 'pink' } } },
  { name: 'sonokai', desc: "high-contrast, saturated, EdenEast's flavor",
    light: 'derived',
    dark: { f: 'sonokai', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg2',
      text1: 'fg', border: 'bg3',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red',
      important: 'purple', sponsor: 'red' } } },
  { name: 'darcula', desc: "JetBrains' default: warm greys, muted accents",
    light: 'derived',
    dark: { f: 'darcula', m: { bg: 'grey00', bg_alt: 'grey01', bg_elv: 'grey02',
      text1: 'grey05', border: 'grey02',
      brand1: 'lightblue', success: 'darkgreen', warning: 'yellow', danger: 'darkred',
      important: 'purple', sponsor: 'rainbow_purple' } } },
];

// a half's slot colors: its map's refs looked up in its palette file f (a
// literal #hex as is, p2:<key> in its second file)
function resolve({ f, p2, m }) {
  const [palette, palette2] = [pal(f), p2 ? pal(p2) : {}];
  const out = {};
  for (const [slot, ref] of Object.entries(m)) {
    const v = ref.startsWith('#') ? ref : ref.startsWith('p2:') ? palette2[ref.slice(3)] : palette[ref];
    if (v === undefined) throw new Error(`slot ${slot}: no palette entry ${JSON.stringify(ref)}`);
    out[slot] = v;
  }
  return out;
}

// the first element with the least key (ties keep the earlier one), or
// the greatest
const minBy = (items, key) => items.reduce((best, x) => (key(x) < key(best) ? x : best));
const maxBy = (items, key) => items.reduce((best, x) => (key(x) > key(best) ? x : best));
const round2 = (x) => Math.round(x * 100) / 100;

// mode: 'light'|'dark'; m: resolved slot colors (mutated by AA fits);
// adjusted: the set the report names what changed by, when one is kept
function buildMode(mode, m, adjusted = new Set()) {
  // a slot the fits moved is counted under its tag
  const set = (slot, next, tag) => {
    if (next !== m[slot]) adjusted.add(tag);
    m[slot] = next;
  };
  let [bg, bgAlt, bgElv] = [m.bg, m.bg_alt, m.bg_elv];
  // the elevated surface leaves room for body text: a dark half whose
  // menus and dialogs are mid-tone (voxed's olive, a misread light
  // palette's red) moves them toward the page until white reaches 7:1
  if (mode === 'dark' && contrast(white, bgElv) < 7.0 + EPS) {
    bgElv = stepTo(bgElv, bg, 20, (x) => contrast(white, x) >= 7.0 + EPS);
    adjusted.add('surfaces');
  }
  // body text on the page and on the elevated surface (menus, dialogs)
  set('text1', fitAll(m.text1, mode, { text: [bg, bgElv], target: 7.0 }), 'text');
  // derive the rest of the text ramp from the fitted text-1 so the
  // hierarchy is monotonic by construction (source secondaries can
  // converge or invert once contrast-fitted)
  const worst2 = minBy([bg, bgAlt, bgElv], (s) => contrast(mix(m.text1, bg, 0.22), s));
  m.text2 = fit(mix(m.text1, bg, 0.22), worst2, 4.5, mode);
  m.text3 = fit(mix(m.text2, bg, 0.45), bg, 3.0, mode);
  // border: keep the scheme's own if it separates from the bg, else
  // derive one from the text hue (borders must not vanish)
  if (contrast(m.border, bg) < 1.15) {
    m.border = mix(m.text1, bg, mode === 'light' ? 0.78 : 0.68);
    adjusted.add('border');
  }
  // brand + semantics: fit on their own tint (composite), which the
  // contract test measures; a margin over bg keeps the tint passing
  const alpha = mode === 'light' ? 0.1 : 0.14;
  const sAlpha = mode === 'light' ? 0.12 : 0.15;
  for (const slot of ['brand1', 'success', 'warning', 'danger', 'important']) {
    set(slot, fitOnTint(m[slot], bg, slot === 'brand1' ? alpha : sAlpha, 4.5, mode), 'accents');
  }
  // the gray wash (gray-soft, VitePress's default-soft) over a ground: a hovered menu item, the
  // info, note and details containers, inline code
  const neutral = mix(m.text1, bg, 0.55);
  // a tint leaves room for a hovered link: at the extreme (black in light,
  // white in dark) the link, dimmed to 0.75, must reach AA on the tint and
  // on the tint of code inside it, or the tint is thinned by 0.01 until it
  // does (a mid-tone dark half, where twice-tinted grounds turn mid-gray).
  // Not below 0.06, where a container would lose its color; a tint that
  // can't make room by then stays as it was (test/themes.mjs fails the
  // theme there)
  const room = (color, a) => {
    const end = mode === 'light' ? black : white;
    const fits = (x) => [composite(color, x, bg), composite(color, x, composite(color, x, bg))].every((g) => contrast(composite(end, 0.75, g), g) >= 4.5 + EPS);
    for (let k = 0; k < Math.round(a * 100) - 5; k++) {
      const x = round2(a - k / 100);
      if (fits(x)) return x;
    }
    return a;
  };
  const dsAlpha = room(neutral, mode === 'light' ? 0.22 : 0.18);
  const grayOn = (ground) => composite(neutral, dsAlpha, ground);
  // brand-1 also as a menu's current item, on the elevated surface and
  // under its hover wash
  set('brand1', fitAll(m.brand1, mode, { text: [bgElv, grayOn(bgElv)] }), 'accents');
  // the brand button's grounds, white text on both >= 3.0: brand-3 at
  // rest, and the hover ground (VitePress's brand-2 job) as its own token
  const buttonHover = m.brand2 ?? mix(m.brand1, mode === 'dark' ? white : black, 0.15);
  const brand3 = m.brand3 ?? mix(m.brand1, black, 0.22);
  m.button_hover = fit(buttonHover, white, 3.0, 'light'); // always darken toward black
  m.brand3 = fit(brand3, white, 3.0, 'light');
  // the pressed ground: a quarter toward black from the rest ground
  m.button_active = fit(mix(m.brand3, black, 0.25), white, 3.0, 'light');
  // brand-2, a hovered link: on the page, the elevated surface and inline
  // code as text, and dimmed in the gray containers and on their code
  const gray = grayOn(bg);
  m.brand2 = fitAll(m.brand1, mode, { text: [bg, bgElv, gray], dimmed: [gray, grayOn(gray)] });
  // a role's -2, the hovered link in its container: dimmed, on the
  // container's tint and on the tint of code inside it
  const hover = (base, a) => {
    const tint = composite(base, a, bg);
    return fitAll(base, mode, { dimmed: [tint, composite(base, a, tint)] });
  };
  const roleA = Object.fromEntries(['important', 'warning', 'danger'].map((r) => [r, room(m[r], sAlpha)]));
  // the alt button's grounds: active, hover, rest (the lightest in light
  // mode is the rest ground)
  const dflt = mode === 'light'
    ? [mix(neutral, bg, 0.25), mix(neutral, bg, 0.45), mix(neutral, bg, 0.65)]
    : [mix(neutral, bg, 0.05), mix(neutral, bg, 0.28), mix(neutral, bg, 0.48)];
  const danger2 = hover(m.danger, roleA.danger);
  return {
    bg, bg_alt: bgAlt, bg_elv: bgElv, bg_soft: bgAlt,
    text1: m.text1, text2: m.text2, text3: m.text3,
    border: m.border, divider: m.border, gutter: m.border,
    brand: m.brand1, brand_hover: m.brand2, brand_fill: m.brand3,
    brand_fill_hover: m.button_hover, brand_fill_active: m.button_active,
    brand_soft: rgba(m.brand1, alpha),
    gray_fill: dflt[2], gray_fill_hover: dflt[1], gray_fill_active: dflt[0],
    gray_soft: rgba(neutral, dsAlpha),
    success: m.success, success_soft: rgba(m.success, sAlpha),
    warning: m.warning, warning_hover: hover(m.warning, roleA.warning),
    warning_soft: rgba(m.warning, roleA.warning),
    danger: m.danger, danger_hover: danger2,
    danger_soft: rgba(m.danger, roleA.danger),
    caution: m.danger, caution_hover: danger2,
    caution_soft: rgba(m.danger, roleA.danger),
    important: m.important, important_hover: hover(m.important, roleA.important),
    important_soft: rgba(m.important, roleA.important),
  };
}

function rgba(c, a) {
  const [r, g, b] = rgb(c);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// the contract (tokens.css), slot by slot, in its order; a blank line
// between the groups
export const TOKENS = [
  ['bg', '--vp-c-bg'], ['bg_alt', '--vp-c-bg-alt'], ['bg_elv', '--vp-c-bg-elv'], ['bg_soft', '--vp-c-bg-soft'],
  ['text1', '--vp-c-text-1'], ['text2', '--vp-c-text-2'], ['text3', '--vp-c-text-3'],
  ['border', '--vp-c-border'], ['divider', '--vp-c-divider'], ['gutter', '--vp-c-gutter'],
  ['brand', '--vp-c-brand'], ['brand_hover', '--vp-c-brand-hover'], ['brand_fill', '--vp-c-brand-fill'],
  ['brand_fill_hover', '--vp-c-brand-fill-hover'], ['brand_fill_active', '--vp-c-brand-fill-active'],
  ['brand_soft', '--vp-c-brand-soft'],
  ['gray_fill', '--vp-c-gray-fill'], ['gray_fill_hover', '--vp-c-gray-fill-hover'],
  ['gray_fill_active', '--vp-c-gray-fill-active'], ['gray_soft', '--vp-c-gray-soft'],
  ['success', '--vp-c-success'], ['success_soft', '--vp-c-success-soft'],
  ['warning', '--vp-c-warning'], ['warning_hover', '--vp-c-warning-hover'], ['warning_soft', '--vp-c-warning-soft'],
  ['danger', '--vp-c-danger'], ['danger_hover', '--vp-c-danger-hover'], ['danger_soft', '--vp-c-danger-soft'],
  ['caution', '--vp-c-caution'], ['caution_hover', '--vp-c-caution-hover'], ['caution_soft', '--vp-c-caution-soft'],
  ['important', '--vp-c-important'], ['important_hover', '--vp-c-important-hover'], ['important_soft', '--vp-c-important-soft'],
];

// a theme's one block: every token a light-dark() pair, the shadows from
// the light text color
export function emitBlock(light, dark) {
  let out = ':root {\n';
  let group = null;
  for (const [k, css] of TOKENS) {
    const g = css.replace(/^--vp-c-/, '').split('-')[0];
    if (group && g !== group) out += '\n';
    group = g;
    out += `  ${css}: light-dark(${light[k]}, ${dark[k]});\n`;
  }
  const shadows = [
    `0 1px 2px ${rgba(light.text1, 0.05)}, 0 1px 2px ${rgba(light.text1, 0.07)}`,
    `0 3px 12px ${rgba(light.text1, 0.09)}, 0 1px 4px ${rgba(light.text1, 0.09)}`,
    `0 12px 32px ${rgba(light.text1, 0.12)}, 0 2px 6px ${rgba(light.text1, 0.1)}`,
    `0 14px 44px ${rgba(light.text1, 0.14)}, 0 3px 9px ${rgba(light.text1, 0.14)}`,
    `0 18px 56px ${rgba(light.text1, 0.18)}, 0 4px 12px ${rgba(light.text1, 0.18)}`,
  ].map((s, i) => `  --vp-shadow-${i + 1}: ${s};`).join('\n');
  return `${out}\n${shadows}\n}\n`;
}

export function emitCss(name, desc, note, light, dark) {
  return `/* Built-in theme: ${name} — ${desc}. ${note} */\n${emitBlock(light, dark)}`;
}

// the half a palette does not publish, from the map of the one it does:
// its page and text-1 moved toward the other half's extremes, brand-1 and
// its roles as they are, brand-2/3 mixed from brand-1 (the map's other
// keys, surfaces, text-2/3, border, a fitted brand-2/3, are not carried)
const derivedLight = ({ bg, text1, brand1, success, warning, danger, important, sponsor }) => ({
  bg: mix(bg, white, 0.94), bg_alt: mix(bg, white, 0.9), bg_elv: mix(bg, white, 0.955),
  text1: mix(text1, black, 0.75),
  border: mix(bg, white, 0.84),
  brand1, brand2: mix(brand1, black, 0.15), brand3: mix(brand1, black, 0.28),
  success, warning, danger, important, sponsor,
});
const derivedDark = ({ bg, text1, brand1, success, warning, danger, important, sponsor }) => ({
  bg: mix(bg, black, 0.9), bg_alt: mix(bg, black, 0.86), bg_elv: mix(bg, black, 0.82),
  text1: mix(text1, white, 0.78),
  border: mix(bg, black, 0.72),
  brand1, brand2: mix(brand1, white, 0.15), brand3: mix(brand1, white, 0.08),
  success, warning, danger, important, sponsor,
});

function curated() {
  for (const spec of SPECS) {
    const adjusted = new Set();
    const dm = resolve(spec.dark);
    const dark = buildMode('dark', dm, adjusted);
    // the light half: the palette's own, or derived from dm as the dark build fitted it
    const [lightMap, note] = spec.light === 'derived'
      ? [derivedLight(dm), `Dark half from the ${spec.name} palette; the light half is derived from the same hues. Accents auto-adjusted for WCAG AA where the published colors fell short.`]
      : [resolve(spec.light), "Both halves from the published palettes (vendored in vpkit's helix/). Accents auto-adjusted for WCAG AA where the published colors fell short."];
    const light = buildMode('light', lightMap, adjusted);

    writeFileSync(join(ROOT, 'themes', `${spec.name}.css`), emitCss(spec.name, spec.desc, note, light, dark));
    console.log(`${spec.name.padEnd(18)} adjusted: ${adjusted.size ? [...adjusted].sort().join(', ') : 'none'}`);
  }
}

// --- auto-mapping pass ----------------------------------------------------
// Every remaining vendored Helix TOML with a [palette] becomes a theme:
// slots are inferred from key names and hue classification, the other
// mode is derived from the palette's own hues. Curated names above win.

const CURATED = new Set([...SPECS.map((s) => s.name), 'github', 'catppuccin', 'nord', 'rose-pine', 'vitepress']);

const BG_RE = /^(bg|background|base|canvas)/i;
const SURFACE_SKIP = /red|green|blue|yellow|magenta|cyan|visual|selection|menu|focus|inlay|popup|highlight|status|diff|dim|alt|current|hl|line|added|changed|removed|gutter|contrast|search|fg/i;
const FG_RE = /^(fg|foreground|text)/i;
const NEUTRAL_RE = /gray|grey|black|white|comment|linenr|border|ui|selection|cursor|whitespace|indent|none|gutter|dark|disabled|widget|faint|muted|dim/i;

const bucketOf = (h) => {
  if (h >= 345 || h < 12) return 'red';
  if (h < 40) return 'orange';
  if (h < 70) return 'yellow';
  if (h < 165) return 'green';
  if (h < 200) return 'cyan';
  if (h < 252) return 'blue';
  if (h < 292) return 'purple';
  return 'magenta';
};

// Python's colorsys.rgb_to_hls (3.14), which the committed themes were
// classified with
function rgbToHls(r, g, b) {
  const maxc = Math.max(r, g, b);
  const minc = Math.min(r, g, b);
  const sumc = maxc + minc;
  const rangec = maxc - minc;
  const l = sumc / 2.0;
  if (minc === maxc) return [0.0, l, 0.0];
  const s = l <= 0.5 ? rangec / sumc : rangec / (2.0 - maxc - minc);
  const rc = (maxc - r) / rangec;
  const gc = (maxc - g) / rangec;
  const bc = (maxc - b) / rangec;
  let h;
  if (r === maxc) h = bc - gc;
  else if (g === maxc) h = 2.0 + rc - bc;
  else h = 4.0 + gc - rc;
  h = (((h / 6.0) % 1.0) + 1.0) % 1.0;
  return [h, l, s];
}

// Infer the contract slots from a palette table. Returns [mode, slots]
// where mode is the palette's own half, or null.
export function autoSlots(stem) {
  const data = load(stem);
  const p = paletteOf(data, stem);
  if (Object.keys(p).length < 6) return null;

  // Resolve `ui.<entry> = { <field> = "palette-key or #hex" }`. Helix
  // writes the key quoted, `"ui.background"`, a top-level key with a dot
  // in it, not a `ui` table; both are read.
  const uiHint = (entry, field) => {
    const node = data[`ui.${entry}`] ?? data.ui?.[entry];
    if (isTable(node)) {
      const v = node[field];
      if (typeof v === 'string') {
        if (v.startsWith('#')) return normHex(v);
        if (v in p) return p[v];
      }
    }
    return null;
  };

  const colors = Object.values(p);
  const bgNamed = Object.keys(p).filter((k) => BG_RE.test(k) && !SURFACE_SKIP.test(k)).map((k) => p[k]);
  const fgNamed = Object.keys(p).filter((k) => FG_RE.test(k) && !NEUTRAL_RE.test(k) && !BG_RE.test(k)).map((k) => p[k]);
  const uiBg = uiHint('background', 'bg');
  const uiFg = uiHint('text', 'fg');

  // direction from the theme's declared background when there is one:
  // accents are bright in dark themes too, so a whole-palette vote lies
  let lightPalette;
  if (uiBg !== null) lightPalette = lum(uiBg) > 0.5;
  else if (bgNamed.length) lightPalette = bgNamed.map(lum).sort((a, b) => a - b)[Math.floor(bgNamed.length / 2)] > 0.5;
  else lightPalette = colors.filter((c) => lum(c) > 0.5).length > colors.length / 2;

  // the text on a page: the declared one if it reads at all, else the
  // extreme of the named texts, else of the palette
  const fgOf = (bg) => {
    if (uiFg !== null && contrast(uiFg, bg) > 1.5) return uiFg;
    const pool = fgNamed.length ? fgNamed : colors.filter((c) => c !== bg);
    return (lightPalette ? minBy : maxBy)(pool, lum);
  };

  let bg;
  if (uiBg !== null) bg = uiBg;
  else if (bgNamed.length) bg = (lightPalette ? maxBy : minBy)(bgNamed, lum);
  else bg = (lightPalette ? maxBy : minBy)(colors, lum);

  const fg = fgOf(bg);

  const buckets = {};
  for (const [k, v] of Object.entries(p)) {
    if ([bg, fg].includes(v) || NEUTRAL_RE.test(k) || BG_RE.test(k)) continue;
    const [r, g, b] = rgb(v);
    const [h, l, sat] = rgbToHls(r / 255, g / 255, b / 255);
    if (sat < 0.15 || l < 0.06 || l > 0.96) continue;
    const bk = bucketOf(h * 360);
    const score = sat * (1 - Math.abs(l - (lightPalette ? 0.55 : 0.4)));
    if (!(bk in buckets) || score > buckets[bk][1]) buckets[bk] = [v, score];
  }

  const pick = (...names) => {
    for (const n of names) if (n in buckets) return buckets[n][0];
    return null;
  };

  // muted/monochrome palettes carry no distinct hues: fall back to
  // canonical seeds (such a scheme has no hue to preserve anyway); the
  // contrast fitter restyles them per mode
  const seeds = { brand1: '#2050a8', success: '#2f7d1f', warning: '#8f640d', danger: '#a3443f', important: '#7048a8', sponsor: '#a02f6f' };
  const order = {
    brand1: ['blue', 'cyan', 'purple', 'magenta', 'orange', 'green', 'red'],
    success: ['green', 'cyan', 'yellow'],
    warning: ['yellow', 'orange'],
    danger: ['red', 'orange', 'magenta'],
    important: ['purple', 'magenta', 'blue'],
    sponsor: ['magenta', 'red', 'purple'],
  };
  // assign the discriminating roles first so the signature accents (brand)
  // never steal a hue a container needs
  const roles = {};
  const taken = new Set([bg, fg]);
  for (const role of ['danger', 'warning', 'success', 'important', 'brand1', 'sponsor']) {
    let c = pick(...order[role]);
    if (c === null || taken.has(c)) c = seeds[role];
    roles[role] = c;
    taken.add(c);
  }

  if (!lightPalette) {
    // a hovered link in a container must be able to reach AA: white
    // dimmed to 0.75 on the thinnest tint the room rule leaves (0.06, here
    // of white, the lightest a tint can be) and on code's tint inside it.
    // A mid-gray "soft" page (seoul256-dark-soft's #4e4e4e) moves toward
    // black until it can; the lightest gray that can is #484848 (black
    // itself always can)
    const leavesRoom = (page) => {
      const tint = composite(white, 0.06, page);
      return [tint, composite(white, 0.06, tint)].every((g) => contrast(composite(white, 0.75, g), g) >= 4.5 + EPS);
    };
    bg = stepTo(bg, black, 100, leavesRoom);
  }
  // the surfaces over the page; the elevated one never darker than it
  const elv = mix(bg, fg, lightPalette ? 0.03 : 0.18);
  return [lightPalette ? 'light' : 'dark', {
    bg, bg_alt: mix(bg, fg, lightPalette ? 0.06 : 0.1), bg_elv: lum(elv) >= lum(bg) ? elv : bg,
    text1: fg, border: mix(fg, bg, 0.32),
    ...roles,
  }];
}

function auto() {
  const regenerated = new Set();
  const stems = readdirSync(HELIX).filter((f) => f.endsWith('.toml')).sort().map((f) => f.slice(0, -5));

  // stems are unique, but two stems can normalize to one name (foo_bar +
  // foo-bar): that would silently clobber; refuse both
  const names = stems.map((stem) => stem.replaceAll('_', '-'));
  const colliding = new Set(names.filter((n, i) => names.indexOf(n) !== i));

  const skipped = [];
  for (const [i, stem] of stems.entries()) {
    const name = names[i];
    if (CURATED.has(name)) continue;
    if (colliding.has(name)) {
      skipped.push(`${stem} (name collision)`);
      continue;
    }
    const got = autoSlots(stem);
    if (!got) {
      skipped.push(stem);
      continue;
    }
    const [mode, slots] = got;
    // the palette's own half, and the other one derived from its unfitted map
    const other = mode === 'dark' ? 'light' : 'dark';
    const own = buildMode(mode, { ...slots });
    const derived = buildMode(other, (other === 'light' ? derivedLight : derivedDark)(slots));
    const [light, dark] = mode === 'dark' ? [derived, own] : [own, derived];
    const note = `A Helix palette is one mode, this one ${mode}: the ${other} half is derived from the same hues. Accents auto-fitted for WCAG AA.`;
    const desc = `auto-mapped from the vendored Helix palette <${stem}>`;
    writeFileSync(join(ROOT, 'themes', `${name}.css`), emitCss(name, desc, note, light, dark));
    regenerated.add(name);
  }

  // drop auto-generated files whose source no longer maps (stale runs)
  const marker = 'auto-mapped from the vendored Helix palette';
  for (const f of readdirSync(join(ROOT, 'themes'))) {
    if (!f.endsWith('.css') || regenerated.has(f.slice(0, -4))) continue;
    const path = join(ROOT, 'themes', f);
    if (readFileSync(path, 'utf8').slice(0, 200).includes(marker)) unlinkSync(path);
  }
  console.log(`auto-mapped: ${regenerated.size} themes; skipped (no usable palette): ${skipped.length}`);
  if (skipped.length) console.log(`  skipped: ${skipped.sort().join(', ')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  curated();
  auto();
}
