// Does scripts/gen-themes.mjs read an inheriting Helix palette as Helix
// does? Imports the generator (importing runs none of its loops, which
// write themes/) and checks two palettes against values computed here from
// the raw TOML by Helix's rule (helix-view/src/theme.rs, merge_themes, at
// ba40e547426b): the child's top-level keys replace the parent's whole, and
// the palettes merge entry by entry, the child's winning.
//
//   node test/gen-themes.mjs    (part of npm test)
//
// Exits 1 when a check fails.
import { ok as assert } from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { parse } from 'smol-toml';
import { luminance, normHex } from '../scripts/color.mjs';
import { autoSlots, mergeThemes } from '../scripts/gen-themes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = (stem) => parse(readFileSync(join(ROOT, 'helix', `${stem}.toml`), 'utf8'));

let failed = 0;
const check = (label, got, want) => {
  const ok = isDeepStrictEqual(got, want);
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}: ${JSON.stringify(got)} ${ok ? '==' : '!='} ${JSON.stringify(want)}`);
};

// wolf-alabaster-light-mono has no background of its own: the parent's
// "ui.background" names palette key "bg", resolved in the merged palette
{
  const [parent, child] = [raw('wolf-alabaster-light'), raw('wolf-alabaster-light-mono')];
  assert(!('ui.background' in child) && child.inherits === 'wolf-alabaster-light', 'wolf-alabaster-light-mono inherits wolf-alabaster-light without a background');
  const wantBg = normHex({ ...parent.palette, ...(child.palette ?? {}) }[parent['ui.background'].bg]);
  const got = autoSlots('wolf-alabaster-light-mono');
  check('wolf-alabaster-light-mono maps', got !== null, true);
  if (got) {
    check('wolf-alabaster-light-mono mode', got[0], luminance(wantBg) > 0.5 ? 'light' : 'dark');
    check('wolf-alabaster-light-mono page color', got[1].bg, wantBg);
  }
}

// gruvbox_dark_hard has one palette entry of its own, the background's,
// which must win over gruvbox's entry of the same name
{
  const [parent, child] = [raw('gruvbox'), raw('gruvbox_dark_hard')];
  const key = parent['ui.background'].bg;
  assert(child.inherits === 'gruvbox' && isDeepStrictEqual(Object.keys(child.palette), [key]), 'gruvbox_dark_hard inherits gruvbox with the background entry alone');
  const wantBg = normHex(child.palette[key]);
  assert(wantBg !== normHex(parent.palette[key]), "gruvbox_dark_hard's background differs from gruvbox's");
  const got = autoSlots('gruvbox_dark_hard');
  check('gruvbox_dark_hard maps', got !== null, true);
  if (got) check('gruvbox_dark_hard page color', got[1].bg, wantBg);
}

// the merge itself, on synthetic tables
{
  const p = { 'ui.background': { bg: 'a', fg: 'b' }, 'ui.text': 'x', palette: { x: '#111111', y: '#222222' } };
  const c = { inherits: 'p', 'ui.background': { bg: 'c' }, palette: { y: '#333333' } };
  const m = mergeThemes(p, c);
  check('a child scope replaces the parent scope whole', m['ui.background'], { bg: 'c' });
  check('a parent-only scope stays', m['ui.text'], 'x');
  check('palettes merge, the child winning', m.palette, { x: '#111111', y: '#333333' });
}

console.log(failed ? `gen-themes: ${failed} failed` : 'gen-themes: inherits read as Helix reads it');
process.exit(failed ? 1 : 0);
