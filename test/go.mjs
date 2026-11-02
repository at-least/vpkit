// The Go module (go.mod at the root; the root package and the packages under
// go/ and internal/): formatted (gofmt), vetted, every struct literal of the
// module's types writing every field (exhaustruct: a component's field left
// out of a call is a default nobody chose), and its tests, examples included,
// passing.

import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// the module's package directories, not `.`: gofmt would walk node_modules,
// which go.mod's ignore keeps from go's own commands
const dirs = execFileSync('go', ['list', '-f', '{{.Dir}}', './...'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n');
const unformatted = execFileSync('gofmt', ['-l', ...dirs], { cwd: ROOT, encoding: 'utf8' }).trim();
if (unformatted) throw new Error(`not gofmt'd (gofmt -w <file>):\n${unformatted}`);
for (const args of [
  ['vet', './...'],
  ['tool', 'exhaustruct', '-i', 'github.com/at-least/vpkit[./].*', './...'],
  ['test', './...'],
]) {
  execFileSync('go', args, { cwd: ROOT, stdio: 'inherit' });
}
console.log('go: gofmt, vet, exhaustruct and tests clean');
