// Compiles a vpkit entry stylesheet through the Tailwind CLI, the way a
// consumer compiles it, into a temp dir nothing else sees. Minified by
// default, as an app may ship it (totality does); { minify: false } gives the unminified
// build a docs theme should ship: the minifier rounds numbers to six
// digits, and VitePress's line-height 1.3333333 as 1.33333 makes every h2
// 1/64px shorter, 0.375px down the markdown page.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function compileCss(entry, { minify = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'vpkit-test-'));
  try {
    const out = join(dir, 'vpkit.css');
    execFileSync(
      join(ROOT, 'node_modules/.bin/tailwindcss'),
      ['-i', join(ROOT, entry), '-o', out, ...(minify ? ['--minify'] : [])],
      { stdio: 'pipe' },
    );
    return readFileSync(out, 'utf8');
  } finally {
    rmSync(dir, { recursive: true });
  }
}
