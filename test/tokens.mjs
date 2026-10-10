// The theme against its source: tokens.css holds every custom property of
// VitePress's vars.css and fonts.css (fonts.css after vars.css, as
// VitePress's index.ts imports them), in the same scope (selector and
// enclosing @media), with the same value; and theme.css's breakpoints are
// the lengths of upstream's `min-width` media queries, unit included (a
// utility in another unit would part from layout.css and the components
// at a browser font size other than the default).
//
//   node test/tokens.mjs
//
// Both sides are read from source (test/upstream/, verbatim at the tag in
// SOURCE). A difference is a failure unless `known` lists it with its
// reason; a `known` entry that matches nothing fails too, so none
// outlives its cause. Exits 1, listing every difference.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(ROOT, file), 'utf8');

// Intentional differences from upstream, by the key `scope :: property`
export const known = [
  {
    key: /graded-containers/,
    reason:
      "the graded containers' palette is literal and on `:root:has()`, not `:root:where(:has())` with var(--vp-c-orange-*): the opt-in beats any color theme's warning and caution (tokens.css says why); the literals are held to upstream's orange and yellow of the same mode below",
  },
];

// every `--x: value` declaration, keyed by its scope: the selectors and
// at-rules around it, outermost first. Later declarations of a key win,
// as in the cascade
function collect(css, into = new Map()) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
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
      into.set(`${stack.join(' > ')} :: ${text.slice(0, colon).trim()}`, text.slice(colon + 1).replace(/\s+/g, ' ').trim());
    }
    i = next + 1;
  }
  return into;
}

const upstream = collect(read('test/upstream/fonts.css'), collect(read('test/upstream/vars.css')));
const vpkit = collect(read('tokens.css'));

const failures = [];
const hits = new Map(known.map((k) => [k, 0]));
let compared = 0;
function differ(line) {
  const entry = known.find((k) => k.key.test(line));
  if (entry) hits.set(entry, hits.get(entry) + 1);
  else failures.push(line);
}
for (const [key, value] of upstream) {
  compared++;
  if (!vpkit.has(key)) differ(`missing  ${key} = ${value}`);
  else if (vpkit.get(key) !== value) differ(`differs  ${key}\n    upstream: ${value}\n    vpkit:    ${vpkit.get(key)}`);
}
for (const [key, value] of vpkit) if (!upstream.has(key)) differ(`added    ${key} = ${value}`);

// the graded palette: each literal is upstream's orange (warning) or
// yellow (caution) of that mode
const ramp = { warning: 'orange', caution: 'yellow' };
for (const [scope, mode] of [[':root:has(.vp-graded-containers)', ':root'], [':root.dark:has(.vp-graded-containers)', '.dark']]) {
  for (const role of Object.keys(ramp)) {
    for (const step of ['1', '2', '3', 'soft']) {
      compared++;
      const got = vpkit.get(`${scope} :: --vp-c-${role}-${step}`);
      const want = upstream.get(`${mode} :: --vp-c-${ramp[role]}-${step}`);
      if (got !== want) failures.push(`graded   ${scope} --vp-c-${role}-${step}: ${got}, upstream's ${mode} --vp-c-${ramp[role]}-${step} is ${want}`);
    }
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

for (const [entry, n] of hits) {
  if (n) console.log(`KNOWN ${n}× ${entry.key}: ${entry.reason}`);
  else failures.push(`known difference no longer occurs, remove it: ${entry.key}`);
}
for (const f of failures) console.log(`FAIL  ${f}`);
console.log(
  `tokens.css against vars.css and fonts.css, the graded palette and ${breakpoints.length} breakpoints: ` +
    `${compared} checks, ${failures.length} failed, ${[...hits.values()].reduce((a, b) => a + b, 0)} known`,
);
process.exit(failures.length ? 1 : 0);
