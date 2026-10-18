// Build what the documentation (docs/) generates:
//
// - docs/examples/<name>/<id>.html: a copy of every component's example
//   (components/<name>/examples/, the docs theme's too), for the page's
//   vp_example component (templates/vp-example.html), since zola's
//   load_data reads only inside the site. Committed, like the rest, so the
//   site builds with zola alone. docs/examples/pages/ is not generated: the
//   examples a guide page writes itself, kept there so the same component
//   shows them.
// - docs/static/example.css, the stylesheet of the app kit's example
//   frames: vpkit with every component and the utilities the examples use,
//   and docs/static/example-docs-theme.css, the docs theme's frames' (its
//   variables, icons and components over the kit). Tailwind scans the
//   examples alone. Left unminified, as vpkit-zola leaves the stylesheet
//   around them.
// - docs/static/themes.json, the theme gallery's index: the stock colors of
//   tokens.css, then each color theme's name, where it comes from (its
//   header comment) and the colors a card draws, light and dark.
//
//   node scripts/build-docs.mjs           write them
//   node scripts/build-docs.mjs --check   fail if the committed ones differ

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, relative, sep } from 'node:path';
import { ROOT, componentDirs, examples } from './components.mjs';
import { modeValues, resolve } from './css.mjs';

const DOCS = join(ROOT, 'docs');
const CACHE = join(ROOT, 'node_modules/.cache/vpkit-docs');

// the example copies, by their path under docs/examples
function exampleFiles() {
  const out = new Map();
  for (const product of ['', 'docs-theme']) {
    for (const { name, id, file } of examples(product)) out.set(`${name}/${id}.html`, readFileSync(file, 'utf8'));
  }
  return out;
}

// the entry of a product's example stylesheet, written into the cache,
// where Tailwind resolves its own import; its sources are the example
// copies and the frame's template
function entry(product, examplesDir) {
  mkdirSync(CACHE, { recursive: true });
  const rel = (p) => relative(CACHE, p).split(sep).join('/');
  const lines = [
    '@import "tailwindcss" source(none);',
    `@source "${rel(examplesDir)}";`,
    `@source "${rel(join(DOCS, 'templates/vp-example.html'))}";`,
    `@import "${rel(join(ROOT, 'fonts.css'))}";`,
    `@import "${rel(join(ROOT, 'index.css'))}";`,
  ];
  if (product === 'docs-theme') for (const f of ['docs-theme/vars.css', 'docs-theme/icons.css']) lines.push(`@import "${rel(join(ROOT, f))}";`);
  for (const dir of [...componentDirs(''), ...(product === 'docs-theme' ? componentDirs('docs-theme') : [])]) lines.push(`@import "${rel(join(dir, `${basename(dir)}.css`))}";`);
  lines.push(`@import "${rel(join(ROOT, 'prose.css'))}";`);
  const file = join(CACHE, `${product || 'app'}.css`);
  writeFileSync(file, `${lines.join('\n')}\n`);
  return file;
}

// the colors a gallery card draws (brand-hover, the hovered link's color,
// is what the docs test reads a theme by)
const CARD = ['bg', 'bg-alt', 'divider', 'text-1', 'text-2', 'brand', 'brand-hover', 'success', 'warning', 'danger'];

// a stylesheet's card colors on each side of its light-dark() pairs
function modes(css) {
  const card = (mode) => {
    const vars = modeValues(css, ':root', mode);
    return Object.fromEntries(CARD.map((c) => [c, resolve(vars, vars.get(`--vp-c-${c}`))]));
  };
  return { light: card('light'), dark: card('dark') };
}

// stock first, then every theme in the order of its file's name; a theme's
// header comment is `Built-in theme: <name> — <about>`
function themes() {
  const stock = { name: '', source: 'stock', about: "VitePress's palette with its contrast fitted, tokens.css's defaults: no theme", ...modes(readFileSync(join(ROOT, 'tokens.css'), 'utf8')) };
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

// writes everything under out: examples/ and static/
function build(out) {
  const examplesDir = join(out, 'examples');
  if (existsSync(examplesDir)) {
    for (const e of readdirSync(examplesDir)) if (e !== 'pages') rmSync(join(examplesDir, e), { recursive: true, force: true });
  }
  // the pages' own examples count as sources too: when building elsewhere
  // (--check), they are read from docs/
  if (out !== DOCS && existsSync(join(DOCS, 'examples/pages'))) {
    mkdirSync(examplesDir, { recursive: true });
    cpSync(join(DOCS, 'examples/pages'), join(examplesDir, 'pages'), { recursive: true });
  }
  for (const [path, html] of exampleFiles()) {
    mkdirSync(join(examplesDir, path, '..'), { recursive: true });
    writeFileSync(join(examplesDir, path), html);
  }
  mkdirSync(join(out, 'static'), { recursive: true });
  for (const [product, name] of [['', 'example.css'], ['docs-theme', 'example-docs-theme.css']]) {
    execFileSync(join(ROOT, 'node_modules/.bin/tailwindcss'), ['-i', entry(product, examplesDir), '-o', join(out, 'static', name)], { stdio: 'pipe' });
  }
  writeFileSync(join(out, 'static/themes.json'), `[\n${themes().map((t) => JSON.stringify(t)).join(',\n')}\n]\n`);
}

// every generated file under a root, relative
function generated(root) {
  const out = [];
  for (const dir of ['examples', 'static']) {
    if (!existsSync(join(root, dir))) continue;
    for (const e of readdirSync(join(root, dir), { recursive: true, withFileTypes: true })) {
      if (e.isFile()) out.push(relative(root, join(e.parentPath, e.name)));
    }
  }
  return out.filter((f) => (f.startsWith('examples/') && !f.startsWith('examples/pages/')) || ['static/example.css', 'static/example-docs-theme.css', 'static/themes.json'].includes(f)).sort();
}

if (process.argv[2] === '--check') {
  const dir = mkdtempSync(join(tmpdir(), 'vpkit-docs-'));
  let stale;
  try {
    build(dir);
    const want = generated(dir);
    const have = generated(DOCS);
    stale = [
      ...want.filter((f) => !have.includes(f)).map((f) => `missing docs/${f}`),
      ...have.filter((f) => !want.includes(f)).map((f) => `extra docs/${f}`),
      ...want.filter((f) => have.includes(f) && !readFileSync(join(dir, f)).equals(readFileSync(join(DOCS, f)))).map((f) => `stale docs/${f}`),
    ];
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  for (const s of stale) console.log(s);
  console.log(stale.length ? 'docs/ is stale: node scripts/build-docs.mjs' : 'docs/examples and docs/static are up to date');
  process.exit(stale.length ? 1 : 0);
} else {
  build(DOCS);
}
