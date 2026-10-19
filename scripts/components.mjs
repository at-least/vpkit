// The component directories, as the tests and the docs build find them:
// components/<name>/ for the app kit, docs-theme/components/<name>/ for the
// docs theme, each holding <name>.css, examples/, <name>.test.mjs (and a
// golden.json); and the entry both compile the kit from.
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// product: '' (the app kit) or 'docs-theme'; the directories, sorted
export function componentDirs(product) {
  const base = join(ROOT, product, 'components');
  return readdirSync(base, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => join(base, e.name))
    .sort();
}

// every example of a product's components: its component, its id, its file
export function examples(product) {
  return componentDirs(product).flatMap((dir) => {
    const at = join(dir, 'examples');
    return readdirSync(at)
      .filter((f) => f.endsWith('.html'))
      .sort()
      .map((f) => ({ name: basename(dir), id: f.slice(0, -'.html'.length), file: join(at, f) }));
  });
}

// every .css file under a directory, recursively, sorted, as a path from
// the root
export function cssFiles(dir) {
  return readdirSync(join(ROOT, dir), { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.css'))
    .map((e) => join(e.parentPath, e.name).slice(ROOT.length + 1))
    .sort();
}

// a Tailwind entry for a product's kit, written at file under
// node_modules/.cache, where Tailwind resolves its own import: Tailwind,
// the caller's head (its @source lines, given the path maker), vpkit, the
// docs theme's variables and icons for its product, every component, and
// the markdown last (an app compiles it below the components)
export function writeEntry(file, product, head) {
  mkdirSync(dirname(file), { recursive: true });
  const rel = (p) => relative(dirname(file), p).split(sep).join('/');
  const lines = ['@import "tailwindcss" source(none);', ...head(rel), `@import "${rel(join(ROOT, 'index.css'))}";`];
  if (product === 'docs-theme') for (const f of ['docs-theme/vars.css', 'docs-theme/icons.css']) lines.push(`@import "${rel(join(ROOT, f))}";`);
  for (const dir of [...componentDirs(''), ...(product === 'docs-theme' ? componentDirs('docs-theme') : [])]) lines.push(`@import "${rel(join(dir, `${basename(dir)}.css`))}";`);
  lines.push(`@import "${rel(join(ROOT, 'prose.css'))}";`);
  writeFileSync(file, `${lines.join('\n')}\n`);
  return file;
}
