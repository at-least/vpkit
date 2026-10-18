// The component directories, as the tests and the docs build find them:
// components/<name>/ for the app kit, docs-theme/components/<name>/ for the
// docs theme, each holding <name>.css (and examples/, <name>.test.mjs,
// golden.json).
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// product: '' (the app kit) or 'docs-theme'; the directories, sorted
export function componentDirs(product) {
  const base = join(ROOT, product, 'components');
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(base, e.name, `${e.name}.css`)))
    .map((e) => join(base, e.name))
    .sort();
}

// every example of a product's components: its component, its id, its file
export function examples(product) {
  return componentDirs(product).flatMap((dir) => {
    const name = dir.slice(dir.lastIndexOf('/') + 1);
    const at = join(dir, 'examples');
    if (!existsSync(at)) return [];
    return readdirSync(at)
      .filter((f) => f.endsWith('.html'))
      .sort()
      .map((f) => ({ name, id: f.slice(0, -'.html'.length), file: join(at, f) }));
  });
}
