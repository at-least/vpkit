// The Rust crate (rust/), every feature on: formatted, clippy-clean with warnings as errors,
// its tests and documentation examples passing, and its documentation
// building with no warning (a broken intra-doc link, an undocumented public
// item). The documentation lands in rust/target/doc, where test/docs.mjs
// takes it to check the site's links into it and docs.yml publishes it
// under the site's /rust/. The target directory is the crate's own: the
// shared one an environment may export could hold another checkout's build.

import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, 'rust/Cargo.toml');
const env = { ...process.env, CARGO_TARGET_DIR: join(ROOT, 'rust/target'), RUSTDOCFLAGS: '-D warnings' };

for (const args of [
  ['fmt', '--manifest-path', MANIFEST, '--check'],
  ['clippy', '--manifest-path', MANIFEST, '--all-targets', '--all-features', '--', '-D', 'warnings'],
  ['test', '--manifest-path', MANIFEST, '--all-features'],
  ['doc', '--manifest-path', MANIFEST, '--no-deps', '--all-features'],
]) {
  execFileSync('cargo', args, { env, stdio: 'inherit' });
}
console.log('rust: fmt, clippy, tests and documentation clean');
