// vp-spinner against VitePress's loading ring (test/upstream/components/
// VPLocalSearchBox.vue, `.search-loading.active`), in a flex row as the
// search bar holds it, turning and under reduced motion. vpkit's own,
// golden: the ring in a line of text, and the examples. vpkit against
// vpkit: in a button, against the label's color written out.
//
// The original's margin is placement and is left out; the keyframes'
// names differ, so the animation is compared by its duration, timing and
// count. The height is `block-size`, the style's: the harness's `height`
// is the bounding box, which the turning ring widens past 18px at most
// angles.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, BORDER_COLOR, RADIUS, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const UPSTREAM = { files: ['components/VPLocalSearchBox.vue'] };
const RING = [
  'display', 'width', 'block-size', 'box-sizing', ...BORDER, ...BORDER_COLOR, ...RADIUS,
  'visibility', 'flex-grow', 'flex-shrink', 'flex-basis',
  'animation-duration', 'animation-timing-function', 'animation-iteration-count',
];
const ORIGINAL = '<div class="search-actions"><span class="search-loading active"></span></div>';
const IN_A_ROW = '<div style="display:flex"><span class="vp-spinner"></span></div>';

cases.push({
  name: 'spinner',
  upstream: { ...UPSTREAM, html: ORIGINAL },
  html: IN_A_ROW,
  checks: [{ target: '.vp-spinner', refTarget: '.search-loading', props: RING }],
});

// under reduced motion both stand still: VitePress's own rule, carried
// with the ring, and base.css's on every animation
cases.push({
  name: 'spinner under reduced motion',
  reducedMotion: true,
  upstream: { ...UPSTREAM, html: ORIGINAL },
  html: IN_A_ROW,
  checks: [{ target: '.vp-spinner', refTarget: '.search-loading', props: ['animation-name', 'animation-duration', 'animation-iteration-count'] }],
});

// in a line of text: inline-block, where the original is a flex item of
// the search bar
cases.push({
  name: 'spinner in a line of text',
  html: '<p>Loading <span class="vp-spinner" role="status" aria-label="Loading"></span></p>',
  checks: [{ target: '.vp-spinner', props: ['display', 'width', 'block-size', ...BORDER_COLOR] }],
});

// in a button, vpkit's addition: the label's color, a 30% ring of it with
// the full color turning (the reference writes that out inline)
const IN_BUTTON = 'border-color:color-mix(in srgb, currentColor 30%, transparent);border-top-color:currentColor';
for (const [variant, attr] of [['alt', ''], ['brand', ' data-variant="brand"'], ['danger', ' data-variant="danger"'], ['ghost', ' data-variant="ghost"']]) {
  cases.push({
    name: `spinner in a ${variant} button`,
    reference: `<button class="vp-btn"${attr} disabled><span class="vp-spinner" style="${IN_BUTTON}"></span>Paying</button>`,
    html: `<button class="vp-btn"${attr} disabled><span class="vp-spinner"></span>Paying</button>`,
    checks: [{ target: '.vp-spinner', props: BORDER_COLOR }],
  });
}

// the examples: the ring alone and in a button, and in each button variant
cases.push({
  name: 'spinner examples',
  html: ex('basic'),
  checks: [
    { target: 'span.vp-spinner[role="status"]', props: ['display', 'width', 'block-size', ...BORDER_COLOR] },
    { target: '.vp-btn > .vp-spinner', props: ['width', 'block-size', ...BORDER_COLOR] },
  ],
});
cases.push({
  name: 'spinner in each button variant',
  html: ex('buttons'),
  checks: ['.vp-btn:not([data-variant])', '.vp-btn[data-variant="brand"]', '.vp-btn[data-variant="danger"]', '.vp-btn[data-variant="ghost"]'].map((b) => ({ target: `${b} > .vp-spinner`, props: BORDER_COLOR })),
});
