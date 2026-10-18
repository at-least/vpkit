// The semantic color utilities: each name compiles to the --vp-* variable it
// stands for. The text colors are text-body, text-secondary and text-muted
// (--text-color-*, which Tailwind reads for a text- utility before
// --color-*, so they make text- classes and nothing else) and the grounds
// bg-alt, bg-soft and bg-elv (--background-color-*, bg- classes only); the
// first names, text-text-1 and bg-bg-alt and the rest, still compile for
// every color utility, since the apps' sources and test/recipes.mjs
// (verbatim) carry them.
//
//   node test/utilities.mjs
//
// Compiled through the Tailwind CLI as a consumer compiles vpkit, minified.
// Exits 1, listing every name that compiles to the wrong thing.

import { compileCss } from './compile.mjs';

const css = compileCss('test/utilities-entry.css');

// the declarations a class's rule holds, or null when Tailwind made none;
// a class with a variant is found by its escaped selector
function rule(cls) {
  const sel = '.' + cls.replace(/[:/]/g, (m) => '\\' + m);
  for (let at = css.indexOf(sel); at >= 0; at = css.indexOf(sel, at + 1)) {
    const next = css[at + sel.length];
    if (next !== '{' && next !== ':' && next !== ',') continue;
    const open = css.indexOf('{', at);
    const inner = css.slice(open + 1, css.indexOf('}', open));
    return inner.slice(inner.lastIndexOf('{') + 1);
  }
  return null;
}

const want = {
  'text-body': 'color:var(--vp-c-text-1)',
  'text-secondary': 'color:var(--vp-c-text-2)',
  'text-muted': 'color:var(--vp-c-text-3)',
  'hover:text-secondary': 'color:var(--vp-c-text-2)',
  'placeholder:text-muted': 'color:var(--vp-c-text-3)',
  'bg-bg': 'background-color:var(--vp-c-bg)',
  'bg-alt': 'background-color:var(--vp-c-bg-alt)',
  'bg-soft': 'background-color:var(--vp-c-bg-soft)',
  'bg-elv': 'background-color:var(--vp-c-bg-elv)',
  'hover:bg-soft': 'background-color:var(--vp-c-bg-soft)',
  // the first names
  'text-text-1': 'color:var(--vp-c-text-1)',
  'text-text-2': 'color:var(--vp-c-text-2)',
  'text-text-3': 'color:var(--vp-c-text-3)',
  'bg-bg-alt': 'background-color:var(--vp-c-bg-alt)',
  'bg-bg-soft': 'background-color:var(--vp-c-bg-soft)',
  'bg-bg-elv': 'background-color:var(--vp-c-bg-elv)',
  'fill-text-2': 'fill:var(--vp-c-text-2)',
  'border-bg-soft': 'border-color:var(--vp-c-bg-soft)',
  // the three kinds the apps write in color, the tone and the soft tint
  'text-success-1': 'color:var(--vp-c-success-1)',
  'text-warning-1': 'color:var(--vp-c-warning-1)',
  'text-danger-1': 'color:var(--vp-c-danger-1)',
  'bg-success-soft': 'background-color:var(--vp-c-success-soft)',
  'bg-warning-soft': 'background-color:var(--vp-c-warning-soft)',
  'bg-danger-soft': 'background-color:var(--vp-c-danger-soft)',
  // Tailwind's font sizes, untouched by the text colors' namespace
  'text-sm': 'font-size:var(--text-sm)',
  'text-2xl': 'font-size:var(--text-2xl)',
};
// the new names make their own utility and no other
const none = ['bg-body', 'bg-secondary', 'bg-muted', 'border-secondary', 'fill-muted', 'text-alt', 'text-soft', 'text-elv', 'border-alt', 'fill-soft'];

let failed = 0;
for (const [cls, decl] of Object.entries(want)) {
  const got = rule(cls);
  if (got === null || !got.replace(/\s+/g, '').includes(decl.replace(/\s+/g, ''))) {
    console.log(`FAIL ${cls}: want ${decl}, got ${got}`);
    failed++;
  }
}
for (const cls of none) {
  const got = rule(cls);
  if (got !== null) {
    console.log(`FAIL ${cls}: want no rule, got ${got}`);
    failed++;
  }
}
// an opacity modifier: Tailwind writes the plain color as a fallback, then
// the mix under @supports
const flat = css.replace(/\s+/g, '');
const mix = '.text-secondary\\/50{color:color-mix(inoklab,var(--vp-c-text-2)50%,transparent)}';
if (!flat.includes(mix)) {
  console.log(`FAIL text-secondary/50: want ${mix} under @supports`);
  failed++;
}
const total = Object.keys(want).length + none.length + 1;
console.log(`semantic color utilities: ${total} checks, ${failed} failed`);
process.exit(failed ? 1 : 0);
