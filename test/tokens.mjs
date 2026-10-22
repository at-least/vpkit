// The variables against their source. docs-theme/vars.css holds every
// variable of VitePress's vars.css (test/upstream/, verbatim at the tag in
// SOURCE): on each side, light and dark, each resolves through its var()
// chain to what it resolves to upstream (the contract names it aliases
// VitePress's onto resolve to VitePress's palette; the font families are
// tokens.css's, fonts.css's after vars.css as VitePress's index.ts imports
// them); the graded containers' colors too; the sidebar's z-index and the
// hidden navbar's heights in the same scopes. A token's fallback written
// into a stylesheet is the token's value, so the copy can't go stale. And
// theme.css's breakpoints are the lengths of upstream's `min-width` media
// queries, unit included.
//
//   node test/tokens.mjs
//
// Exits 1, listing every difference.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ALIAS, UNMAPPED } from '../scripts/contract.mjs';
import { modeValues, parseBlocks, resolve, stripComments } from '../scripts/css.mjs';
import { ROOT, cssFiles } from '../scripts/components.mjs';
import { blockOf } from './layout-map.mjs';

const read = (file) => readFileSync(join(ROOT, file), 'utf8');
const squash = (value) => value.replace(/\s+/g, ' ').trim();

const failures = [];
let compared = 0;

const vars = read('test/upstream/vars.css');
const fonts = read('test/upstream/fonts.css');
const docs = read('docs-theme/vars.css');
const tokens = read('tokens.css');

// :root and .dark: every VitePress variable, resolved, on each side
const upLight = new Map([...modeValues(vars, ':root'), ...modeValues(fonts, ':root')]);
const upDark = new Map([...upLight, ...modeValues(vars, '.dark')]);
const ours = (mode) => new Map([...modeValues(tokens, ':root', mode), ...modeValues(docs, ':root', mode)]);
for (const [mode, up] of [['light', upLight], ['dark', upDark]]) {
  const have = ours(mode);
  for (const [name, value] of up) {
    compared++;
    const want = squash(resolve(up, value));
    const got = have.has(name) ? squash(resolve(have, have.get(name))) : undefined;
    if (want !== got) failures.push(`${mode} ${name}: upstream ${want}, docs theme ${got}`);
  }
}

// the graded containers: each color VitePress grades, on the contract's
// name, resolves to the same orange or yellow on each side
const upGraded = parseBlocks(vars).find((b) => b.selector.includes('.vp-graded-containers'));
const ourGraded = parseBlocks(docs).find((b) => b.selector === ':root:has(.vp-graded-containers)');
if (!upGraded || !ourGraded) failures.push('a graded containers block is missing');
else {
  for (const [mode, up] of [['light', upLight], ['dark', upDark]]) {
    const upAll = new Map([...up, ...upGraded.declarations]);
    const ourAll = new Map([...ours(mode), ...ourGraded.declarations]);
    for (const [name] of upGraded.declarations) {
      const color = name.match(/^--vp-c-(.+)$/)?.[1];
      if (UNMAPPED.includes(color)) continue;
      compared++;
      const want = squash(resolve(upAll, upAll.get(name)));
      const got = squash(resolve(ourAll, ourAll.get(`--vp-c-${ALIAS[color]}`) ?? '(none)'));
      if (want !== got) failures.push(`graded ${mode} ${name} as --vp-c-${ALIAS[color]}: upstream ${want}, docs theme ${got}`);
    }
  }
}

// the other scopes, by text: the sidebar's z-index from 60rem, the hidden
// navbar's heights (VitePress's .VPSidebar is the layout's .vp-sidebar),
// the CJK font families (tokens.css's)
function collect(css, into = new Map()) {
  const src = stripComments(css);
  const stack = [];
  let i = 0;
  while (i < src.length) {
    const open = src.indexOf('{', i);
    const close = src.indexOf('}', i);
    const semi = src.indexOf(';', i);
    const next = Math.min(...[open, close, semi].filter((n) => n >= 0));
    if (!Number.isFinite(next)) break;
    const text = src.slice(i, next).trim();
    if (next === open) stack.push(text.replace(/\s+/g, ' '));
    else if (next === close) stack.pop();
    else if (text.startsWith('--')) {
      const colon = text.indexOf(':');
      into.set(`${stack.join(' > ')} :: ${text.slice(0, colon).trim()}`, squash(text.slice(colon + 1)));
    }
    i = next + 1;
  }
  return into;
}
const upScoped = collect(fonts, collect(vars));
const ourScoped = collect(tokens, collect(docs));
for (const [key, value] of upScoped) {
  const [scope] = key.split(' :: ');
  if ([':root', '.dark'].includes(scope) || scope.includes('.vp-graded-containers')) continue;
  compared++;
  const ourKey = key.replace('.VPSidebar', `.${blockOf('VPSidebar')}`);
  if (ourScoped.get(ourKey) !== value) failures.push(`${key}: upstream ${value}, ours ${ourScoped.get(ourKey)}`);
}

// a token's fallback written into a stylesheet, `var(--vp-x, value)`, is
// the token's value, so the copy can't go stale; the tokens VitePress
// leaves to the page have no value to hold a fallback to
const UNDEFINED = ['--vp-layout-top-height', '--vp-doc-top-height', '--vp-vh', '--vp-extra-scroll-margin'];
const defined = new Map([...modeValues(tokens, ':root'), ...modeValues(docs, ':root')]);
let fallbacks = 0;
for (const file of ['prose.css', 'base.css', ...cssFiles('components'), ...cssFiles('docs-theme')].sort()) {
  for (const m of read(file).matchAll(/var\((--vp-[a-z0-9-]+),\s*((?:[^()]|\([^()]*\))+)\)/g)) {
    if (UNDEFINED.includes(m[1])) continue;
    compared++;
    fallbacks++;
    const want = defined.get(m[1]);
    const got = squash(m[2]);
    if (got !== want) failures.push(`fallback ${file}: var(${m[1]}, ${got}), the token's value is ${want}`);
  }
}

// the breakpoints: theme.css's values among upstream's min-width queries
const queries = new Set();
const upstreamFiles = [
  ...readdirSync(join(ROOT, 'test/upstream')).filter((f) => f.endsWith('.css')),
  ...readdirSync(join(ROOT, 'test/upstream/components')).map((f) => `components/${f}`),
];
for (const file of upstreamFiles) {
  for (const m of read(`test/upstream/${file}`).matchAll(/@media[^{]*min-width:\s*([\d.]+[a-z]+)/g)) queries.add(m[1]);
}
const breakpoints = [...read('theme.css').matchAll(/--breakpoint-(\w+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]);
for (const [name, value] of breakpoints) {
  compared++;
  if (!queries.has(value)) failures.push(`breakpoint ${name}: ${value} is not a min-width of upstream's media queries (${[...queries].sort().join(', ')})`);
}
if (breakpoints.length !== 5) failures.push(`theme.css defines ${breakpoints.length} breakpoints, not 5`);

for (const f of failures) console.log(`FAIL  ${f}`);
console.log(
  `docs-theme/vars.css and tokens.css against vars.css and fonts.css, the graded palette, ${fallbacks} fallbacks and ${breakpoints.length} breakpoints: ` +
    `${compared} checks, ${failures.length} failed`,
);
process.exit(failures.length ? 1 : 0);
