// Build the stylesheet of the documentation's example frames,
// docs/static/example.css, from docs/css/example.css: vpkit with every
// component, and the utilities the examples use. The examples are
// collected from the pages' vp_example blocks into
// node_modules/.cache/vpkit-docs/examples.html, the file of them Tailwind
// scans.
//
//   node scripts/build-docs.mjs           write it
//   node scripts/build-docs.mjs --check   fail if the committed one differs
//
// Left unminified, as vpkit-zola leaves the stylesheet around it.

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'docs/content');
const CACHE = join(ROOT, 'node_modules/.cache/vpkit-docs');
const OUT = join(ROOT, 'docs/static/example.css');

// every vp_example's markup, page by page in the order of their paths (a
// title in its opening tag may hold a %)
function examples() {
  const pages = readdirSync(CONTENT, { recursive: true }).filter((f) => f.endsWith('.md')).sort();
  return pages.flatMap((f) =>
    [...readFileSync(join(CONTENT, f), 'utf8').matchAll(/\{% <vp_example\b(?:[^%"]|"[^"]*")*%\}([\s\S]*?)\{% <\/vp_example> %\}/g)].map((m) => m[1].trim()),
  );
}

function build(out) {
  mkdirSync(CACHE, { recursive: true });
  writeFileSync(join(CACHE, 'examples.html'), `${examples().join('\n')}\n`);
  execFileSync(join(ROOT, 'node_modules/.bin/tailwindcss'), ['-i', join(ROOT, 'docs/css/example.css'), '-o', out], { stdio: 'pipe' });
}

if (process.argv[2] === '--check') {
  const dir = mkdtempSync(join(tmpdir(), 'vpkit-docs-'));
  let same;
  try {
    build(join(dir, 'example.css'));
    same = readFileSync(join(dir, 'example.css')).equals(readFileSync(OUT));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(same ? 'docs/static/example.css is up to date' : 'docs/static/example.css is stale: node scripts/build-docs.mjs');
  process.exit(same ? 0 : 1);
} else {
  build(OUT);
}
