// What a component's test file (components/<name>/<name>.test.mjs) builds
// its cases from: the property lists the checks share, and the component's
// examples (components/<name>/examples/<id>.html), the markup its docs
// page shows and the crate's tests render.
//
// A case:
//   name       what it is; CASES=<regex> picks cases by it
//   html       vpkit's markup (an example, or markup written here)
//   upstream   { files, html }: VitePress's markup and the originals
//              (test/upstream/…) its page loads; the case's checks compare
//              computed styles with it, as the source `upstream`
//   reference  vpkit's own markup to compare with (a component nested in
//              another against the same one alone, a touch screen's hover
//              against rest): the source `reference`
//   neither    the checks compare with golden.json beside the test file:
//              the source `golden`; UPDATE_GOLDEN=1 rewrites it
//   width, touch, reducedMotion, forcedColors   the viewport, a touch
//              screen, the preference, Windows' contrast themes (Chromium's
//              emulation), on both sides
// A check: target (a selector in vpkit's markup), props, state (the
// pseudo-classes forced on it, or on `on`), pseudo (the pseudo-element
// read), refTarget/refState/refPseudo (the reference's, when different),
// tolerance (px, 1/32 by default), source (`golden` on a case that has an
// upstream or a reference: a departure from the original, which `why`
// must name).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, relative, sep } from 'node:path';
import { ROOT, componentDirs } from '../scripts/components.mjs';

export const SIDES = ['top', 'right', 'bottom', 'left'];
export const BORDER = SIDES.flatMap((s) => [`border-${s}-width`, `border-${s}-style`]);
export const RADIUS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'].map((c) => `border-${c}-radius`);
export const PADDING = SIDES.map((s) => `padding-${s}`);
export const MARGIN = SIDES.map((s) => `margin-${s}`);
export const BORDER_COLOR = SIDES.map((s) => `border-${s}-color`);
export const COLORS = ['color', 'background-color', ...BORDER_COLOR];
export const TRANSITION = ['transition-property', 'transition-duration'];
export const TYPE = ['font-size', 'line-height', 'font-weight', 'font-family', 'letter-spacing'];
export const OUTLINE = ['outline-width', 'outline-style', 'outline-color', 'outline-offset'];
// geometry the runner reads off the box: its height, and its offset inside its parent
export const BOX = ['height', 'offset-top', 'offset-left'];

// the markup of a component's example: dir is the test file's directory
export const example = (dir, id) => readFileSync(join(dir, 'examples', `${id}.html`), 'utf8').trim();

// the entry a product's tests compile: Tailwind, the examples and tests
// scanned for the utilities they use, vpkit, every component, the markdown
// last (an app compiles it below the components); the docs theme's with its
// own variables and icons. Written under node_modules/.cache, where
// Tailwind resolves its own import; the path is relative to the root, as
// compileCss takes it
export function entry(product) {
  const cache = join(ROOT, 'node_modules/.cache/vpkit');
  mkdirSync(cache, { recursive: true });
  const rel = (p) => relative(cache, p).split(sep).join('/');
  const lines = ['@import "tailwindcss" source(none);'];
  for (const dir of ['components', 'docs-theme/components']) if (existsSync(join(ROOT, dir))) lines.push(`@source "${rel(join(ROOT, dir))}";`);
  lines.push(`@import "${rel(join(ROOT, 'index.css'))}";`);
  if (product === 'docs') for (const f of ['docs-theme/vars.css', 'docs-theme/icons.css']) if (existsSync(join(ROOT, f))) lines.push(`@import "${rel(join(ROOT, f))}";`);
  for (const dir of [...componentDirs(''), ...(product === 'docs' ? componentDirs('docs-theme') : [])]) lines.push(`@import "${rel(join(dir, `${basename(dir)}.css`))}";`);
  if (existsSync(join(ROOT, 'prose.css'))) lines.push(`@import "${rel(join(ROOT, 'prose.css'))}";`);
  const file = join(cache, `${product}.css`);
  writeFileSync(file, `${lines.join('\n')}\n`);
  return relative(ROOT, file);
}
