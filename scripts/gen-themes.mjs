// Generate vpkit's color themes from the vendored Helix palettes.
//
// Reads helix/*.toml [palette] tables, following a file's `inherits` as
// Helix does (mergeThemes below), maps each scheme onto the design-token
// contract (hand-written slot maps below), derives monotonic text/border
// ramps and the neutral ramp, auto-fits accents for WCAG AA (the same
// ratios test/themes.mjs enforces, by the math it shares with the test,
// scripts/color.mjs), and emits themes/<name>.css. A -2 (brand, tip,
// important, warning, danger, caution) is a hovered link's color, as every
// vpkit and VitePress stylesheet uses it: the -1 stepped toward black in
// light and toward white in dark until it reads at AA where it is drawn,
// dimmed to 0.75 in a container as custom-block.css and alert.css dim a
// hovered link. vars.css describes -2 as the button's hover ground; the
// brand button's is emitted as its own --vp-button-brand-hover-bg instead,
// since in dark mode no one color can be both (measured over all 222
// themes).
//
// The emitted files are the source of truth once committed: rerun after
// editing the slot maps, rebuild the documentation's theme gallery index
// from them (node scripts/build-docs.mjs), then pass `npm test` (rustpress
// regenerates its docs gallery index from these files too: node
// scripts/gen-theme-index.mjs there). The four hand-tuned themes (github,
// catppuccin, nord, rose-pine) are NOT regenerated here; edit them
// directly. Nor is vitepress, which scripts/fit-vitepress.mjs writes from
// tokens.css.
//
//   node scripts/gen-themes.mjs
//
// Importing this module runs nothing (test/gen-themes.mjs imports it).
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'smol-toml';
import { EPS, black, composite, contrast, fit, fitAll, fitOnTint, luminance as lum, mix, rgb, white } from './color.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const HELIX = join(ROOT, 'helix');

const normHex = (v) => {
  v = v.toLowerCase();
  if (v.length === 4) v = `#${[...v.slice(1)].map((ch) => ch + ch).join('')}`; // #abc → #aabbcc
  return v;
};

// A palette entry must be #rgb/#rrggbb: anything else would flow into
// parseInt(..., 16) and silently produce garbage across the ramp.
const checkedHex = (v, stem, k) => {
  if (typeof v !== 'string' || !v.startsWith('#') || ![4, 7].includes(v.length)) {
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
export function load(stem) {
  const data = parse(readFileSync(join(HELIX, `${stem}.toml`), 'utf8'));
  if ('inherits' in data) return mergeThemes(load(data.inherits), data);
  return data;
}

function pal(file) {
  const data = load(file);
  const p = data.palette;
  if (p && Object.keys(p).length) return Object.fromEntries(Object.entries(p).map(([k, v]) => [k, checkedHex(v, file, k)]));
  const out = {};
  const walk = (d, prefix = '') => {
    for (const [k, v] of Object.entries(d)) {
      if (typeof v === 'string' && v.startsWith('#') && [4, 7].includes(v.length)) out[`${prefix}${k}`] = normHex(v);
      else if (isTable(v)) walk(v, `${prefix}${k}.`);
    }
  };
  walk(data);
  return out;
}

// --- theme spec -----------------------------------------------------------
// slot keys: bg bg_alt bg_elv text1 text2 text3 border brand1 brand2 brand3
//            success warning danger important sponsor
// light: 'derived' → build a light half from the dark palette (for schemes
// that publish no light mode; stated in the header).
const SPECS = [
  { name: 'tokyonight', desc: 'calm blue-violet, day and storm',
    light: { f: 'tokyonight_day', m: { bg: 'bg', bg_alt: 'bg-selection', bg_elv: 'bg-menu',
      text1: 'fg', text2: 'fg-dark', text3: 'fg-linenr', border: 'border',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'magenta' } },
    dark: { f: 'tokyonight_storm', p2: 'tokyonight', m: { bg: 'bg', bg_alt: 'bg-menu', bg_elv: 'bg-selection',
      text1: '#c0caf5', text2: '#9d9dbb', text3: '#565f89', border: 'border',
      brand1: 'p2:blue', success: 'p2:green', warning: 'p2:yellow', danger: 'p2:red', important: 'p2:purple', sponsor: 'p2:magenta' } } },
  { name: 'gruvbox', desc: 'retro groove, warm cream and charcoal',
    light: { f: 'gruvbox_light', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg0',
      text1: 'fg0', text2: 'fg1', text3: 'fg4', border: 'bg3',
      brand1: 'blue1', success: 'green1', warning: 'yellow1', danger: 'red1', important: 'purple1', sponsor: 'purple1' } },
    dark: { f: 'gruvbox', m: { bg: 'bg0', bg_alt: 'bg0_s', bg_elv: 'bg1',
      text1: 'fg1', text2: 'fg0', text3: 'fg4', border: 'bg2',
      brand1: 'blue1', success: 'green1', warning: 'yellow1', danger: 'red1', important: 'purple1', sponsor: 'purple1' } } },
  { name: 'gruvbox-material', desc: 'the material take on gruvbox, softer and calmer',
    light: { f: 'gruvbox_material_light_medium', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg0',
      text1: 'fg1', text2: 'fg0', text3: 'grey0', border: 'bg3',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'purple' } },
    dark: { f: 'gruvbox_material_dark_medium', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg2',
      text1: 'fg1', text2: 'fg0', text3: 'grey1', border: 'bg3',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'purple' } } },
  { name: 'onedark', desc: "Atom's One: grey-blue surfaces, saturated accents",
    light: { f: 'onelight', m: { bg: 'white', bg_alt: 'grey-100', bg_elv: 'white',
      text1: 'black', text2: 'grey', text3: 'grey-500', border: 'grey-300',
      brand1: 'blue', success: 'green', warning: 'gold', danger: 'red', important: 'purple', sponsor: 'pink' } },
    dark: { f: 'onedark', m: { bg: 'black', bg_alt: 'light-black', bg_elv: 'gray',
      text1: 'white', text2: 'light-gray', text3: 'linenr', border: 'gray',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'purple' } } },
  { name: 'everforest', desc: 'green, calm and low-noise by design',
    light: { f: 'everforest_light', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg0',
      text1: 'fg', text2: 'statusline2', text3: 'grey0', border: 'bg3',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'purple' } },
    dark: { f: 'everforest_dark', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg2',
      text1: 'fg', text2: 'statusline2', text3: 'grey0', border: 'bg3',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'purple', sponsor: 'orange' } } },
  { name: 'ayu', desc: 'subtle, elegant, one bright accent set',
    light: { f: 'ayu_light', m: { bg: 'background', bg_alt: 'black', bg_elv: 'white',
      text1: 'foreground', text2: '#54595f', text3: 'gray', border: 'dark_gray',
      brand1: 'blue', success: 'green', warning: 'orange', danger: 'red', important: 'magenta', sponsor: 'red' } },
    dark: { f: 'ayu_dark', m: { bg: 'background', bg_alt: 'black', bg_elv: 'dark_gray',
      text1: 'foreground', text2: 'gray', text3: '#454f58', border: 'dark_gray',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'magenta', sponsor: 'magenta' } },
    dark_alt: { bg_alt: '#0b0f14' } },
  { name: 'solarized', desc: 'the classic: selective contrast, warm and marine',
    light: { f: 'solarized_light', m: { bg: 'base03', bg_alt: 'base02', bg_elv: 'base03',
      text1: 'base01', text2: 'base0', text3: 'base00', border: 'base015',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'violet', sponsor: 'magenta' } },
    dark: { f: 'solarized_dark', m: { bg: 'base03', bg_alt: 'base025', bg_elv: 'base015',
      text1: 'base2', text2: 'base1', text3: 'base00', border: 'base01',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'violet', sponsor: 'magenta' } } },
  { name: 'kanagawa', desc: 'wave and lotus: ink, sumi and ukiyo-e color',
    light: { f: 'kanagawa-lotus', m: { bg: 'lotusWhite0', bg_alt: 'lotusWhite1', bg_elv: 'lotusWhite0',
      text1: 'lotusInk0', text2: 'lotusPunctuation', text3: 'lotusInk1', border: 'lotusBlue1',
      brand1: 'lotusBlue2', success: 'lotusSuperGreen', warning: 'lotusYellow2', danger: 'lotusAutumnRed',
      important: 'lotusSuperViolet', sponsor: 'lotusSuperPink' } },
    dark: { f: 'kanagawa', m: { bg: 'sumiInk3', bg_alt: 'sumiInk4', bg_elv: 'sumiInk5',
      text1: 'fujiWhite', text2: 'oldWhite', text3: 'fujiGray', border: 'sumiInk6',
      brand1: 'crystalBlue', success: 'springGreen', warning: 'carpYellow', danger: 'waveRed',
      important: 'oniViolet', sponsor: 'sakuraPink' } } },
  { name: 'papercolor', desc: 'plain paper, high legibility, 16-color spirit',
    light: { f: 'papercolor-light', m: { bg: 'background', bg_alt: '#e0e0e0', bg_elv: 'background',
      text1: 'foreground', text2: 'regular5', text3: 'linenumber_fg', border: 'matchparen_bg',
      brand1: 'regular4', success: 'regular2', warning: 'cursorlinenr_fg', danger: 'regular1',
      important: 'bright3', sponsor: 'bright2' } },
    dark: { f: 'papercolor-dark', m: { bg: 'background', bg_alt: 'cursorline_secondary_bg', bg_elv: 'popupmenu_bg',
      text1: 'foreground', text2: 'bright0', text3: 'linenumber_fg', border: 'matchparen_bg',
      brand1: 'regular4', success: 'regular2', warning: 'bright4', danger: 'regular1',
      important: 'bright3', sponsor: 'bright5' } } },
  { name: 'seoul256', desc: 'low-contrast seoul nights, paper days derived',
    light: 'derived',
    dark: { f: 'seoul256-dark', m: { bg: 'black1', bg_alt: 'gray1', bg_elv: 'gray3',
      text1: 'white', text2: 'gray13', text3: 'gray6', border: 'gray4',
      brand1: 'blue1', success: 'green3', warning: 'yellow5', danger: 'salmon1',
      important: 'magenta1', sponsor: 'mauve' } } },
  { name: 'modus', desc: "Emacs' accessible flagship: maximum legibility",
    light: { f: 'modus_operandi', m: { bg: 'bg-main', bg_alt: 'bg-dim', bg_elv: 'bg-main',
      text1: 'fg-main', text2: 'fg-dim', text3: '#6f6f6f', border: 'bg-active',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'magenta', sponsor: 'magenta-warmer' } },
    dark: { f: 'modus_vivendi', m: { bg: 'bg-main', bg_alt: 'bg-dim', bg_elv: 'bg-inactive',
      text1: 'fg-main', text2: 'fg-dim', text3: '#a8a8a8', border: 'bg-inactive',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'magenta', sponsor: 'magenta-warmer' } } },
  { name: 'flexoki', desc: "ink on paper: Step's warm absolute palette",
    light: { f: 'flexoki_light', m: { bg: 'bg', bg_alt: 'bg-2', bg_elv: '#ffffff',
      text1: 'tx', text2: 'tx-2', text3: 'tx-3', border: 'ui-3',
      brand1: 'bl', success: 'gr', warning: 'ye', danger: 're', important: 'pu', sponsor: 'ma' } },
    dark: { f: 'flexoki_dark', m: { bg: 'bg', bg_alt: 'bg-2', bg_elv: 'ui-2',
      text1: 'tx', text2: 'tx-2', text3: 'tx-3', border: 'ui-3',
      brand1: 'bl', success: 'gr', warning: 'ye', danger: 're', important: 'pu', sponsor: 'ma' } } },
  { name: 'iceberg', desc: 'cool navy-blue calm, light and dark',
    light: { f: 'iceberg-light', m: { bg: 'background_bg', bg_alt: 'sel_bg', bg_elv: 'background_bg',
      text1: 'background_fg', text2: 'statusline_fg', text3: 'comment_fg', border: 'matchparen_bg',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'magenta', sponsor: 'light-red' } },
    dark: { f: 'iceberg-dark', m: { bg: 'background_bg', bg_alt: 'linenr_bg', bg_elv: 'cursorlinenr_bg',
      text1: 'background_fg', text2: 'pale', text3: 'comment_fg', border: 'matchparen_bg',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red', important: 'magenta', sponsor: 'light-red' } } },
  { name: 'adwaita', desc: "GNOME's own: libadwaita light and dark",
    light: { f: 'adwaita-dark', m: { bg: 'light_1', bg_alt: 'light_3', bg_elv: 'light_1',
      text1: 'dark_5', text2: 'dark_2', text3: 'dark_1', border: 'light_4',
      brand1: 'blue_5', success: 'green_6', warning: 'yellow_6', danger: 'red_5',
      important: 'purple_5', sponsor: 'red_5' } },
    dark: { f: 'adwaita-dark', m: { bg: 'libadwaita_dark', bg_alt: 'libadwaita_dark_alt', bg_elv: 'libadwaita_popup',
      text1: 'light_2', text2: 'light_5', text3: 'dark_1', border: 'split_and_borders',
      brand1: 'blue_2', success: 'green_3', warning: 'yellow_4', danger: 'red_3',
      important: 'purple_2', sponsor: 'red_2' } } },
  { name: 'dracula', desc: 'the famous dark purple, light derived from its palette',
    light: 'derived',
    dark: { f: 'dracula', m: { bg: 'background', bg_alt: 'black', bg_elv: 'current_line',
      text1: 'foreground', text2: 'comment', text3: 'grey', border: 'indent',
      brand1: 'purple', success: 'green', warning: 'yellow', danger: 'red',
      important: 'pink', sponsor: 'pink' } } },
  { name: 'monokai', desc: 'the classic that colored a decade of editors',
    light: 'derived',
    dark: { f: 'monokai', p2: 'monokai_pro', m: { bg: 'background', bg_alt: 'widget', bg_elv: 'selection',
      text1: 'text', text2: '#a8aa95', text3: '#75715d', border: '#3b3c35',
      brand1: '#66d9ef', success: '#a6e22e', warning: '#e6db74', danger: '#f92672',
      important: '#ae81ff', sponsor: '#fd971f' } } },
  { name: 'material', desc: "Google's material ocean, light derived from its palette",
    light: 'derived',
    dark: { f: 'material_oceanic', m: { bg: 'bg', bg_alt: 'active', bg_elv: 'highlight',
      text1: 'text', text2: 'gray', text3: 'disabled', border: 'disabled',
      brand1: 'accent', success: '#c3e88d', warning: '#ffcb6b', danger: '#f07178',
      important: '#c792ea', sponsor: '#ff5370' } } },
  { name: 'night-owl', desc: 'deep navy, bright primaries; light derived from its palette',
    light: 'derived',
    dark: { f: 'night_owl', m: { bg: 'background', bg_alt: 'background2', bg_elv: 'selection',
      text1: 'foreground', text2: 'slate', text3: 'grey7', border: 'grey4',
      brand1: 'blue', success: 'green', warning: 'gold', danger: 'red',
      important: 'pink', sponsor: 'pink' } } },
  { name: 'sonokai', desc: "high-contrast, saturated, EdenEast's flavor",
    light: 'derived',
    dark: { f: 'sonokai', m: { bg: 'bg0', bg_alt: 'bg1', bg_elv: 'bg2',
      text1: 'fg', text2: 'grey', text3: 'grey_dim', border: 'bg3',
      brand1: 'blue', success: 'green', warning: 'yellow', danger: 'red',
      important: 'purple', sponsor: 'red' } } },
  { name: 'darcula', desc: "JetBrains' default: warm greys, muted accents",
    light: 'derived',
    dark: { f: 'darcula', m: { bg: 'grey00', bg_alt: 'grey01', bg_elv: 'grey02',
      text1: 'grey05', text2: 'grey04', text3: 'grey03', border: 'grey02',
      brand1: 'lightblue', success: 'darkgreen', warning: 'yellow', danger: 'darkred',
      important: 'purple', sponsor: 'rainbow_purple' } } },
];

function resolve(specMap, palette, palette2) {
  const out = {};
  for (const [slot, ref] of Object.entries(specMap)) {
    const v = ref.startsWith('#') ? ref : ref.startsWith('p2:') ? palette2[ref.slice(3)] : palette[ref];
    if (v === undefined) throw new Error(`slot ${slot}: no palette entry ${JSON.stringify(ref)}`);
    out[slot] = v;
  }
  return out;
}

// the first element with the least key (ties keep the earlier one, as
// Python's min does), or the greatest
const minBy = (items, key) => items.reduce((best, x) => (key(x) < key(best) ? x : best));
const maxBy = (items, key) => items.reduce((best, x) => (key(x) > key(best) ? x : best));
const round2 = (x) => Math.round(x * 100) / 100;
const roundHalfEven = (x) => (Math.abs(x % 1) === 0.5 ? 2 * Math.round(x / 2) : Math.round(x));

// mode: 'light'|'dark'; m: resolved slot colors (mutated by AA fits).
function buildMode(mode, m, adjusted) {
  const orig = { ...m };
  let [bg, bgAlt, bgElv] = [m.bg, m.bg_alt, m.bg_elv];
  const bgSoft = bgAlt;
  // the elevated surface leaves room for body text: a dark half whose
  // menus and dialogs are mid-tone (voxed's olive, a misread light
  // palette's red) moves them toward the page until white reaches 7:1
  if (mode === 'dark' && contrast(white, bgElv) < 7.0 + EPS) {
    const before = bgElv;
    bgElv = bg;
    for (let k = 0; k <= 20; k++) {
      const x = mix(before, bg, k / 20);
      if (contrast(white, x) >= 7.0 + EPS) {
        bgElv = x;
        break;
      }
    }
    adjusted.add('surfaces');
  }
  // body text on the page and on the elevated surface (menus, dialogs)
  const text1 = fitAll(m.text1, mode, { text: [bg, bgElv], target: 7.0 });
  if (text1 !== orig.text1) adjusted.add('text');
  m.text1 = text1;
  // derive the rest of the text ramp from the fitted text-1 so the
  // hierarchy is monotonic by construction (source secondaries can
  // converge or invert once contrast-fitted)
  const worst2 = minBy([bg, bgAlt, bgSoft, bgElv], (s) => contrast(mix(m.text1, bg, 0.22), s));
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
    const a = slot === 'brand1' ? alpha : sAlpha;
    const before = m[slot];
    m[slot] = fitOnTint(m[slot], bg, a, 4.5, mode);
    if (m[slot] !== before) adjusted.add('accents');
  }
  // the gray wash (default-soft) over a ground: a hovered menu item, the
  // info, note and details containers, inline code
  const neutral = mix(m.text1, bg, 0.55);
  // a tint leaves room for a hovered link: at the extreme (black in light,
  // white in dark) the link, dimmed to 0.75, must reach AA on the tint and
  // on the tint of code inside it, or the tint is thinned by 0.01 until it
  // does (a mid-tone dark half, where twice-tinted grounds turn mid-gray).
  // Not below 0.06, where a container would lose its color; a tint that
  // can't make room by then stays as it was (test/themes.mjs lists those)
  const room = (color, a) => {
    const end = mode === 'light' ? black : white;
    const fits = (x) => [composite(color, x, bg), composite(color, x, composite(color, x, bg))].every((g) => contrast(composite(end, 0.75, g), g) >= 4.5 + EPS);
    for (let k = 0; k < roundHalfEven(a * 100) - 5; k++) {
      const x = round2(a - k / 100);
      if (fits(x)) return x;
    }
    return a;
  };
  const dsAlpha = room(neutral, mode === 'light' ? 0.22 : 0.18);
  const grayOn = (ground) => composite(neutral, dsAlpha, ground);
  // brand-1 also as a menu's current item, on the elevated surface and
  // under its hover wash
  const before = m.brand1;
  m.brand1 = fitAll(m.brand1, mode, { text: [bgElv, grayOn(bgElv)] });
  if (m.brand1 !== before) adjusted.add('accents');
  // the brand button's grounds, white text on both >= 3.0: brand-3 at
  // rest, and the hover ground (VitePress's brand-2 job) as its own token
  const buttonHover = m.brand2 ?? mix(m.brand1, mode === 'dark' ? white : black, 0.15);
  const brand3 = m.brand3 ?? mix(m.brand1, black, 0.22);
  m.button_hover = fit(buttonHover, white, 3.0, 'light'); // always darken toward black
  m.brand3 = fit(brand3, white, 3.0, 'light');
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
  const tipA = room(m.brand1, alpha);
  const roleA = Object.fromEntries(['important', 'warning', 'danger'].map((r) => [r, room(m[r], sAlpha)]));
  const dflt = mode === 'light'
    ? [mix(neutral, bg, 0.25), mix(neutral, bg, 0.45), mix(neutral, bg, 0.65)]
    : [mix(neutral, bg, 0.05), mix(neutral, bg, 0.28), mix(neutral, bg, 0.48)];
  return {
    neutral_inverse: mode === 'light' ? '#ffffff' : '#000000',
    bg, bg_alt: bgAlt, bg_elv: bgElv, bg_soft: bgSoft,
    text1: m.text1, text2: m.text2, text3: m.text3,
    border: m.border, divider: m.border, gutter: m.border,
    brand1: m.brand1, brand2: m.brand2, brand3: m.brand3, button_hover: m.button_hover,
    brand_soft: rgba(m.brand1, alpha),
    default1: dflt[0], default2: dflt[1], default3: dflt[2],
    default_soft: rgba(neutral, dsAlpha),
    tip1: m.brand1, tip2: hover(m.brand1, tipA), tip_soft: rgba(m.brand1, tipA),
    note1: m.brand1, note_soft: rgba(m.brand1, alpha),
    success1: m.success, success_soft: rgba(m.success, sAlpha),
    important1: m.important, important2: hover(m.important, roleA.important),
    important_soft: rgba(m.important, roleA.important),
    warning1: m.warning, warning2: hover(m.warning, roleA.warning),
    warning_soft: rgba(m.warning, roleA.warning),
    danger1: m.danger, danger2: hover(m.danger, roleA.danger),
    danger_soft: rgba(m.danger, roleA.danger),
    caution1: m.danger, caution2: hover(m.danger, roleA.danger),
    caution_soft: rgba(m.danger, roleA.danger),
    sponsor: m.sponsor,
  };
}

function rgba(c, a) {
  const [r, g, b] = rgb(c);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const TOKENS = [
  ['neutral_inverse', '--vp-c-neutral-inverse'], ['bg', '--vp-c-bg'], ['bg_alt', '--vp-c-bg-alt'],
  ['bg_elv', '--vp-c-bg-elv'], ['bg_soft', '--vp-c-bg-soft'],
  ['text1', '--vp-c-text-1'], ['text2', '--vp-c-text-2'], ['text3', '--vp-c-text-3'],
  ['border', '--vp-c-border'], ['divider', '--vp-c-divider'], ['gutter', '--vp-c-gutter'],
  ['brand1', '--vp-c-brand-1'], ['brand2', '--vp-c-brand-2'], ['brand3', '--vp-c-brand-3'],
  ['brand_soft', '--vp-c-brand-soft'],
  ['default1', '--vp-c-default-1'], ['default2', '--vp-c-default-2'], ['default3', '--vp-c-default-3'],
  ['default_soft', '--vp-c-default-soft'],
  ['tip1', '--vp-c-tip-1'], ['tip2', '--vp-c-tip-2'], ['tip_soft', '--vp-c-tip-soft'],
  ['note1', '--vp-c-note-1'], ['note_soft', '--vp-c-note-soft'],
  ['success1', '--vp-c-success-1'], ['success_soft', '--vp-c-success-soft'],
  ['important1', '--vp-c-important-1'], ['important2', '--vp-c-important-2'],
  ['important_soft', '--vp-c-important-soft'],
  ['warning1', '--vp-c-warning-1'], ['warning2', '--vp-c-warning-2'], ['warning_soft', '--vp-c-warning-soft'],
  ['danger1', '--vp-c-danger-1'], ['danger2', '--vp-c-danger-2'], ['danger_soft', '--vp-c-danger-soft'],
  ['caution1', '--vp-c-caution-1'], ['caution2', '--vp-c-caution-2'], ['caution_soft', '--vp-c-caution-soft'],
  ['sponsor', '--vp-c-sponsor'],
  ['button_hover', '--vp-button-brand-hover-bg'],
];

function emitCss(name, desc, note, light, dark) {
  const block = (vals) => TOKENS.map(([k, css]) => `  ${css}: ${vals[k]};`).join('\n');
  const shadows = [
    `0 1px 2px ${rgba(light.text1, 0.05)}, 0 1px 2px ${rgba(light.text1, 0.07)}`,
    `0 3px 12px ${rgba(light.text1, 0.09)}, 0 1px 4px ${rgba(light.text1, 0.09)}`,
    `0 12px 32px ${rgba(light.text1, 0.12)}, 0 2px 6px ${rgba(light.text1, 0.1)}`,
    `0 14px 44px ${rgba(light.text1, 0.14)}, 0 3px 9px ${rgba(light.text1, 0.14)}`,
    `0 18px 56px ${rgba(light.text1, 0.18)}, 0 4px 12px ${rgba(light.text1, 0.18)}`,
  ].map((s, i) => `  --vp-shadow-${i + 1}: ${s};`).join('\n');
  return `/* Built-in theme: ${name} — ${desc}. ${note} */
:root {
${block(light)}

${shadows}
}

.dark {
${block(dark)}
}
`;
}

// the light half a dark palette derives, and the dark half a light one
const derivedLight = (bg, text1, brand1, rest) => ({
  bg: mix(bg, white, 0.94), bg_alt: mix(bg, white, 0.9),
  bg_elv: mix(bg, white, 0.955),
  text1: mix(text1, black, 0.75), text2: mix(text1, black, 0.55),
  text3: mix(text1, black, 0.35), border: mix(bg, white, 0.84),
  brand1, brand2: mix(brand1, black, 0.15), brand3: mix(brand1, black, 0.28),
  ...rest,
});

export function curated() {
  const report = [];
  for (const spec of SPECS) {
    const adjusted = new Set();
    const darkSpec = spec.dark;
    const pd = pal(darkSpec.f);
    const pd2 = darkSpec.p2 ? pal(darkSpec.p2) : {};
    const dm = resolve(darkSpec.m, pd, pd2);
    if (spec.dark_alt) Object.assign(dm, spec.dark_alt); // per-theme literal fixes
    const dark = buildMode('dark', dm, adjusted);

    let lightMap, note;
    if (spec.light === 'derived') {
      note = `Dark half from the ${spec.name} palette; the scheme publishes no light mode, so the light half is derived from the same hues. Accents auto-adjusted for WCAG AA where the published colors fell short.`;
      lightMap = derivedLight(dm.bg, dm.text1, dm.brand1, { success: dm.success, warning: dm.warning, danger: dm.danger, important: dm.important, sponsor: dm.sponsor });
    } else {
      const ls = spec.light;
      const pl = pal(ls.f);
      const pl2 = ls.p2 ? pal(ls.p2) : {};
      lightMap = resolve(ls.m, pl, pl2);
      note = "Both halves from the published palettes (vendored in vpkit's helix/). Accents auto-adjusted for WCAG AA where the published colors fell short.";
    }
    const light = buildMode('light', lightMap, adjusted);

    writeFileSync(join(ROOT, 'themes', `${spec.name}.css`), emitCss(spec.name, spec.desc, note, light, dark));
    report.push([spec.name, [...adjusted].sort()]);
  }
  for (const [name, adj] of report) console.log(`${name.padEnd(18)} adjusted: ${adj.length ? adj.join(', ') : 'none'}`);
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
  const p = Object.fromEntries(Object.entries(data.palette ?? {}).map(([k, v]) => [k, checkedHex(v, stem, k)]));
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
  const bgNamed = Object.entries(p).filter(([k]) => BG_RE.test(k) && !SURFACE_SKIP.test(k));
  const fgNamed = Object.entries(p).filter(([k]) => FG_RE.test(k) && !NEUTRAL_RE.test(k) && !BG_RE.test(k));
  const uiBg = uiHint('background', 'bg');
  const uiFg = uiHint('text', 'fg');

  const fgOf = (colors, bg, lightPalette) => {
    if (uiFg !== null && contrast(uiFg, bg) > 1.5) return uiFg;
    if (fgNamed.length) return (lightPalette ? minBy : maxBy)(fgNamed.map(([, v]) => v), lum);
    const rest = colors.filter((c) => c !== bg);
    return lightPalette ? minBy(rest, lum) : maxBy(rest, lum);
  };

  // direction from the theme's declared background when there is one:
  // accents are bright in dark themes too, so a whole-palette vote lies
  let lightPalette;
  if (uiBg !== null) lightPalette = lum(uiBg) > 0.5;
  else if (bgNamed.length) {
    const mid = bgNamed.map(([, v]) => lum(v)).sort((a, b) => a - b)[Math.floor(bgNamed.length / 2)];
    lightPalette = mid > 0.5;
  } else lightPalette = colors.filter((c) => lum(c) > 0.5).length > colors.length / 2;

  let bg, alt, elv;
  if (uiBg !== null) {
    bg = uiBg;
    alt = elv = null;
  } else if (bgNamed.length) {
    bg = (lightPalette ? maxBy : minBy)(bgNamed.map(([, v]) => v), lum);
    const surfaces = bgNamed.map(([, v]) => v).filter((v) => v !== bg).sort((a, b) => lum(a) - lum(b));
    if (surfaces.length) {
      const towardFg = lightPalette ? [...surfaces].reverse() : surfaces;
      [alt, elv] = [towardFg[0], towardFg[Math.min(1, towardFg.length - 1)]];
    } else {
      [alt, elv] = [mix(bg, fgOf(colors, bg, lightPalette), 0.1), null];
    }
  } else {
    bg = lightPalette ? maxBy(colors, lum) : minBy(colors, lum);
    alt = elv = null;
  }

  const fg = fgOf(colors, bg, lightPalette);
  if (alt === null) alt = mix(bg, fg, !lightPalette ? 0.1 : 0.06);
  if (elv === null) elv = mix(bg, fg, !lightPalette ? 0.18 : 0.03);
  // elevation convention (matches the stock look): elevated surfaces are
  // never darker than the page bg
  if (lum(elv) < lum(bg)) elv = lightPalette ? bg : mix(bg, fg, 0.16);

  const buckets = {};
  for (const [k, v] of Object.entries(p)) {
    if ([bg, alt, elv, fg].includes(v) || NEUTRAL_RE.test(k) || BG_RE.test(k)) continue;
    const [r, g, b] = rgb(v);
    const [h, l, sat] = rgbToHls(r / 255, g / 255, b / 255);
    if (sat < 0.15 || l < 0.06 || l > 0.96) continue;
    const bk = bucketOf(h * 360);
    const score = sat * (1 - Math.abs(l - (!lightPalette ? 0.4 : 0.55)));
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

  const slots = {
    bg, bg_alt: alt, bg_elv: elv, text1: fg, text2: fg, text3: fg,
    border: mix(fg, bg, 0.32),
    brand1: roles.brand1, success: roles.success, warning: roles.warning,
    danger: roles.danger, important: roles.important, sponsor: roles.sponsor,
  };
  // surface guard: body text must be ABLE to reach 7:1: mid-tone "dark"
  // backgrounds get nudged toward black (and vice versa), or the text fit
  // exhausts at white/black and still fails
  const toward = (c, t, stop) => {
    while (t === black ? lum(c) > stop : lum(c) < stop) c = mix(c, t, 0.03);
    return c;
  };
  if (!lightPalette) {
    if (lum(bg) > 0.082) bg = toward(bg, black, 0.082);
    // and a hovered link in a container must be able to reach AA: white
    // dimmed to 0.75 on the thinnest tint the room rule leaves (0.06, here
    // of white, the lightest a tint can be) and on code's tint inside it.
    // A mid-gray "soft" page (seoul256-dark-soft's #4e4e4e) moves toward
    // black until it can; the lightest gray that can is #484848
    const leavesRoom = (page) => {
      const tint = composite(white, 0.06, page);
      return [tint, composite(white, 0.06, tint)].every((g) => contrast(composite(white, 0.75, g), g) >= 4.5 + EPS);
    };
    if (!leavesRoom(bg)) {
      const start = bg;
      let found = null;
      for (let k = 0; k <= 100; k++) {
        const x = mix(start, black, k / 100);
        if (leavesRoom(x)) {
          found = x;
          break;
        }
      }
      if (found === null) throw new Error(`${stem}: no page toward black leaves room for a hovered link`);
      bg = found;
    }
  } else if (lum(bg) < 0.3) bg = toward(bg, white, 0.3);
  elv = mix(bg, fg, !lightPalette ? 0.18 : 0.03);
  slots.bg = bg;
  slots.bg_alt = mix(bg, fg, !lightPalette ? 0.1 : 0.06);
  slots.bg_elv = lum(elv) >= lum(bg) ? elv : bg;
  slots.border = mix(fg, bg, 0.32);

  return [!lightPalette ? 'dark' : 'light', slots];
}

export function auto() {
  const regenerated = new Set();
  const stems = readdirSync(HELIX).filter((f) => f.endsWith('.toml')).sort().map((f) => f.slice(0, -5));

  // stems are unique, but two stems can normalize to one name (foo_bar +
  // foo-bar): that would silently clobber; refuse both
  const norm = {};
  for (const stem of stems) (norm[stem.replaceAll('_', '-')] ??= []).push(stem);
  const colliding = new Set(Object.entries(norm).filter(([, srcs]) => srcs.length > 1).map(([n]) => n));

  const skipped = [];
  let mapped = 0;
  for (const stem of stems) {
    const name = stem.replaceAll('_', '-');
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
    const adjusted = new Set();
    const roles = { success: slots.success, warning: slots.warning, danger: slots.danger, important: slots.important, sponsor: slots.sponsor };
    let light, dark, note;
    if (mode === 'dark') {
      dark = buildMode('dark', { ...slots }, adjusted);
      light = buildMode('light', derivedLight(slots.bg, slots.text1, slots.brand1, roles), adjusted);
      note = 'The scheme publishes no light mode, so the light half is derived from the same hues. Accents auto-fitted for WCAG AA.';
    } else {
      light = buildMode('light', { ...slots }, adjusted);
      dark = buildMode('dark', {
        bg: mix(slots.bg, black, 0.9), bg_alt: mix(slots.bg, black, 0.86),
        bg_elv: mix(slots.bg, black, 0.82),
        text1: mix(slots.text1, white, 0.78), text2: mix(slots.text1, white, 0.58),
        text3: mix(slots.text1, white, 0.38), border: mix(slots.bg, black, 0.72),
        brand1: slots.brand1, brand2: mix(slots.brand1, white, 0.15),
        brand3: mix(slots.brand1, white, 0.08),
        ...roles,
      }, adjusted);
      note = 'The scheme publishes no dark mode, so the dark half is derived from the same hues. Accents auto-fitted for WCAG AA.';
    }
    const desc = `auto-mapped from the vendored Helix palette <${stem}>`;
    writeFileSync(join(ROOT, 'themes', `${name}.css`), emitCss(name, desc, note, light, dark));
    regenerated.add(name);
    mapped++;
  }

  // drop auto-generated files whose source no longer maps (stale runs)
  const marker = 'auto-mapped from the vendored Helix palette';
  for (const f of readdirSync(join(ROOT, 'themes'))) {
    if (!f.endsWith('.css') || regenerated.has(f.slice(0, -4))) continue;
    const path = join(ROOT, 'themes', f);
    if (readFileSync(path, 'utf8').slice(0, 200).includes(marker)) unlinkSync(path);
  }
  console.log(`auto-mapped: ${mapped} themes; skipped (no usable palette): ${skipped.length}`);
  if (skipped.length) console.log(`  skipped: ${skipped.sort().join(', ')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  curated();
  auto();
}
