// Build what the documentation (docs/) generates, into docs/static/:
//
// - example.css, the stylesheet of the example frames, from
//   docs/css/example.css: vpkit with every component, and the utilities the
//   examples use. The examples are collected from the pages' vp_example
//   blocks into node_modules/.cache/vpkit-docs/examples.html, the file of
//   them Tailwind scans. Left unminified, as vpkit-zola leaves the
//   stylesheet around it.
// - themes.json, the theme gallery's index: each color theme's name, where
//   it comes from (its header comment) and the colors a card draws, light
//   and dark, after the stock colors of tokens.css.
//
//   node scripts/build-docs.mjs           write them
//   node scripts/build-docs.mjs --check   fail if the committed ones differ

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'docs/content');
const CACHE = join(ROOT, 'node_modules/.cache/vpkit-docs');
const OUT = join(ROOT, 'docs/static');

// every vp_example's markup, page by page in the order of their paths (a
// title in its opening tag may hold a %)
function examples() {
  const pages = readdirSync(CONTENT, { recursive: true }).filter((f) => f.endsWith('.md')).sort();
  return pages.flatMap((f) =>
    [...readFileSync(join(CONTENT, f), 'utf8').matchAll(/\{% <vp_example\b(?:[^%"]|"[^"]*")*%\}([\s\S]*?)\{% <\/vp_example> %\}/g)].map((m) => m[1].trim()),
  );
}

// the colors a gallery card draws
const CARD = ['bg', 'bg-alt', 'divider', 'text-1', 'text-2', 'brand-1', 'success-1', 'warning-1', 'danger-1'];

// a stylesheet's card colors in light and dark: its :root blocks, and its
// .dark blocks over them, with var() resolved; the other blocks (graded
// containers, a language's fonts) are no mode's
function modes(css) {
  const blocks = { ':root': {}, '.dark': {} };
  for (const [, selector, body] of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const into = blocks[selector.trim()];
    if (!into) continue;
    for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) into[name] = value.trim();
  }
  const resolve = (vars, value) => value.replace(/var\((--[\w-]+)\)/g, (_, name) => resolve(vars, vars[name]));
  const card = (vars) => Object.fromEntries(CARD.map((c) => [c, resolve(vars, vars[`--vp-c-${c}`])]));
  return { light: card(blocks[':root']), dark: card({ ...blocks[':root'], ...blocks['.dark'] }) };
}

// stock first, then every theme in the order of its file's name; a theme's
// header comment is `Built-in theme: <name> — <about>`
function themes() {
  const stock = { name: '', source: 'stock', about: "VitePress's own colors, with no theme", ...modes(readFileSync(join(ROOT, 'tokens.css'), 'utf8')) };
  const files = readdirSync(join(ROOT, 'themes')).filter((f) => f.endsWith('.css')).sort();
  return [
    stock,
    ...files.map((f) => {
      const css = readFileSync(join(ROOT, 'themes', f), 'utf8');
      const [, name, about] = /^\/\* Built-in theme: (\S+) — ([\s\S]*?)\s*\*\//.exec(css);
      if (`${name}.css` !== f) throw new Error(`themes/${f} names itself ${name}`);
      const source = about.includes('auto-mapped from the vendored Helix palette') ? 'helix' : 'curated';
      return { name, source, about: about.replace(/\s*\n\s*\*\s*/g, ' '), ...modes(css) };
    }),
  ];
}

function build(out) {
  mkdirSync(CACHE, { recursive: true });
  writeFileSync(join(CACHE, 'examples.html'), `${examples().join('\n')}\n`);
  execFileSync(join(ROOT, 'node_modules/.bin/tailwindcss'), ['-i', join(ROOT, 'docs/css/example.css'), '-o', join(out, 'example.css')], { stdio: 'pipe' });
  writeFileSync(join(out, 'themes.json'), `[\n${themes().map((t) => JSON.stringify(t)).join(',\n')}\n]\n`);
}

const FILES = ['example.css', 'themes.json'];
if (process.argv[2] === '--check') {
  const dir = mkdtempSync(join(tmpdir(), 'vpkit-docs-'));
  let stale;
  try {
    build(dir);
    stale = FILES.filter((f) => !readFileSync(join(dir, f)).equals(readFileSync(join(OUT, f))));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  for (const f of stale) console.log(`docs/static/${f} is stale`);
  console.log(stale.length ? 'docs/static/ is stale: node scripts/build-docs.mjs' : `docs/static/ is up to date (${FILES.join(', ')})`);
  process.exit(stale.length ? 1 : 0);
} else {
  build(OUT);
}
