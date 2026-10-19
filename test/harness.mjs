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

import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, writeEntry } from '../scripts/components.mjs';
import { compileCss } from './compile.mjs';

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

// a component's examples, read by its test file's URL (`const ex =
// examples(import.meta.url)`): ex(id) is examples/<id>.html's markup
export const examples = (url) => (id) => readFileSync(new URL(`examples/${id}.html`, url), 'utf8').trim();

// markup inside a vp-doc, as a page's markdown wraps it
export const inDoc = (html) => `<div class="vp-doc">${html}</div>`;

// a product as its tests compile it, as it ships: the app kit minified, as
// the apps build it, the docs theme unminified, as vpkit-zola builds it;
// from an entry (scripts/components.mjs's writeEntry) whose sources are the
// component directories, whose examples and tests carry the utilities they
// use
export function productCss(product) {
  const file = writeEntry(join(ROOT, 'node_modules/.cache/vpkit', `${product}.css`), product === 'docs' ? 'docs-theme' : '', (rel) =>
    ['components', 'docs-theme/components'].map((dir) => `@source "${rel(join(ROOT, dir))}";`),
  );
  return compileCss(relative(ROOT, file), { minify: product === 'app' });
}
