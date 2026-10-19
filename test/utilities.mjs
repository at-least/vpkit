// The semantic utilities: each name compiles to the --vp-* variable it
// stands for. The text colors are text-body, text-secondary and text-muted
// (--text-color-*, which Tailwind reads for a text- utility before
// --color-*, so they make text- classes and nothing else), the grounds
// bg-page, bg-alt, bg-soft and bg-elv (--background-color-*, bg- classes
// only), and the lines, the brand, the gray and the roles are --color-*,
// for every color utility (border-divider, text-brand, bg-danger-soft,
// fill-brand).
//
//   node test/utilities.mjs
//
// Compiled through the Tailwind CLI as a consumer compiles vpkit, minified.
// Exits 1, listing every name that compiles to the wrong thing.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { ROOT } from '../scripts/components.mjs';
import { compileCss } from './compile.mjs';

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
  'bg-page': 'background-color:var(--vp-c-bg)',
  'bg-alt': 'background-color:var(--vp-c-bg-alt)',
  'bg-soft': 'background-color:var(--vp-c-bg-soft)',
  'bg-elv': 'background-color:var(--vp-c-bg-elv)',
  'hover:bg-soft': 'background-color:var(--vp-c-bg-soft)',
  // the lines, for any color utility
  'border-border': 'border-color:var(--vp-c-border)',
  'border-divider': 'border-color:var(--vp-c-divider)',
  'border-gutter': 'border-color:var(--vp-c-gutter)',
  'bg-divider': 'background-color:var(--vp-c-divider)',
  // the brand and the gray
  'text-brand': 'color:var(--vp-c-brand)',
  'text-brand-hover': 'color:var(--vp-c-brand-hover)',
  'border-brand': 'border-color:var(--vp-c-brand)',
  'fill-brand': 'fill:var(--vp-c-brand)',
  'bg-brand-fill': 'background-color:var(--vp-c-brand-fill)',
  'bg-brand-soft': 'background-color:var(--vp-c-brand-soft)',
  'bg-gray-soft': 'background-color:var(--vp-c-gray-soft)',
  'border-gray-fill': 'border-color:var(--vp-c-gray-fill)',
  // the roles: the tone and the soft tint
  'text-success': 'color:var(--vp-c-success)',
  'text-warning': 'color:var(--vp-c-warning)',
  'text-danger': 'color:var(--vp-c-danger)',
  'text-important': 'color:var(--vp-c-important)',
  'bg-success-soft': 'background-color:var(--vp-c-success-soft)',
  'bg-warning-soft': 'background-color:var(--vp-c-warning-soft)',
  'bg-danger-soft': 'background-color:var(--vp-c-danger-soft)',
  'bg-important-soft': 'background-color:var(--vp-c-important-soft)',
  // the shadows
  'shadow-1': 'var(--vp-shadow-1)',
  'shadow-4': 'var(--vp-shadow-4)',
  // Tailwind's font sizes, untouched by the text colors' namespace
  'text-sm': 'font-size:var(--text-sm)',
  'text-2xl': 'font-size:var(--text-2xl)',
};
// the names make their own utility and no other, and the first names are gone
const none = [
  'bg-body', 'bg-secondary', 'bg-muted', 'border-secondary', 'fill-muted', 'text-alt', 'text-soft', 'text-elv', 'text-page', 'border-alt', 'fill-soft',
  'text-text-1', 'bg-bg', 'bg-bg-alt', 'fill-text-2', 'text-brand-1', 'text-danger-1', 'bg-default-soft', 'border-default-1',
];

// the theme alone, with every name the checks read listed inline (no source
// file carries all of them), so a name is compiled exactly when it is checked
const entry = join(ROOT, 'node_modules/.cache/vpkit/utilities.css');
mkdirSync(dirname(entry), { recursive: true });
writeFileSync(entry, `@import "tailwindcss" source(none);\n@source inline("${[...Object.keys(want), ...none, 'text-secondary/50'].join(' ')}");\n@import "../../../index.css";\n`);
const css = compileCss(relative(ROOT, entry));

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
console.log(`semantic utilities: ${total} checks, ${failed} failed`);
process.exit(failed ? 1 : 0);
