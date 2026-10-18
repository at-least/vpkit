// vp-skip against VitePress's VPSkipLink (test/upstream/components/
// VPSkipLink.vue, with VitePress's visually-hidden from utils.css loaded
// before it, so that the component's position wins as its scoped rules
// do): hidden at rest and shown while focused, at the default 1280px,
// where the corner is 0.875rem down and 1rem in, and under 80rem, where
// it is 0.5rem each way. vpkit's, golden: the focus ring on the shown
// link.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OUTLINE, PADDING, RADIUS, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const UPSTREAM = {
  files: ['utils.css', 'components/VPSkipLink.vue'],
  html: '<a class="VPSkipLink visually-hidden" href="#main">Skip to content</a><main id="main"></main>',
};
const BOXP = [
  'position', 'top', 'left', 'width', 'height', ...PADDING, 'z-index', ...RADIUS, 'font-size', 'font-weight',
  'white-space', 'text-decoration-line', 'color', 'box-shadow', 'background-color', 'clip', 'clip-path', 'overflow-x', 'overflow-y',
];
const STATES = [
  { target: '.vp-skip', refTarget: '.VPSkipLink', props: BOXP },
  { target: '.vp-skip', refTarget: '.VPSkipLink', state: ['focus'], props: BOXP },
];

cases.push({
  name: 'skip link',
  upstream: UPSTREAM,
  html: ex('link'),
  checks: [
    ...STATES,
    {
      target: '.vp-skip',
      source: 'golden',
      state: ['focus', 'focus-visible'],
      props: OUTLINE,
      why: "base.css's ring, 2px in the brand color 2px out, on the shown link; VitePress leaves the browser's own ring on a link",
    },
  ],
});

// under 80rem the corner is 0.5rem each way
cases.push({
  name: 'skip link under 80rem',
  width: 1024,
  upstream: UPSTREAM,
  html: ex('link'),
  checks: STATES,
});
