// Rule 10 (DESIGN.md): base.css's reduced-motion rule reaches every
// transition and animation in the root stylesheets, so a component
// carries no reduced-motion rule of its own. Its selector list, `*,
// ::before, ::after, ::backdrop`, matches every element and the
// pseudo-elements it names, and no other: a transition on a pseudo-element
// it doesn't name (a ::placeholder, a ::marker) would run on under
// prefers-reduced-motion. So every pseudo-element a root stylesheet
// transitions or animates must be one the rule names.
//
//   node test/motion.mjs
//
// Exits 1, naming each pseudo-element the rule misses.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(ROOT, file), 'utf8');

const rule = read('base.css').match(/@media \(prefers-reduced-motion: reduce\) \{\s*([^{]+)\{/);
if (!rule) throw new Error('base.css has no prefers-reduced-motion rule');
const named = new Set(rule[1].split(',').map((s) => s.trim()).filter((s) => s.startsWith('::')));

const failures = [];
let checked = 0;
for (const file of readdirSync(ROOT).filter((f) => f.endsWith('.css')).sort()) {
  // every innermost block: its selector and its declarations
  for (const m of read(file).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const [, selector, body] = m;
    if (!/(^|[\s;])(transition|animation)(-[a-z]+)?\s*:/.test(body)) continue;
    for (const pseudo of new Set([...selector.matchAll(/::[a-z-]+/g)].map((p) => p[0]))) {
      checked++;
      if (!named.has(pseudo)) failures.push(`${file}: ${selector.trim()} transitions or animates, and base.css's reduced-motion rule doesn't name ${pseudo}`);
    }
  }
}

for (const f of failures) console.log(`FAIL  ${f}`);
console.log(`base.css's reduced-motion rule (${[...named].join(', ')}) against the root stylesheets' moving pseudo-elements: ${checked} checked, ${failures.length} missed`);
process.exit(failures.length ? 1 : 0);
