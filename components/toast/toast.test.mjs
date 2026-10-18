// vp-toast: vpkit's own, so golden: the surface (its border, radius,
// padding, colors and shadow) on the example fixed at the bottom of the
// page, and the text's color in the error and success states.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, COLORS, PADDING, RADIUS, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const SURFACE = [...BORDER, ...RADIUS, ...PADDING, ...COLORS, 'box-shadow'];

// the surface; its placement is the page's utilities
cases.push({
  name: 'toast',
  html: ex('bottom'),
  checks: [{ target: '.vp-toast', props: [...SURFACE, 'position'] }],
});

// the states: the text's color, the surface kept
for (const state of ['error', 'success']) {
  cases.push({
    name: `toast ${state}`,
    html: ex('states'),
    checks: [{ target: `.vp-toast[data-state="${state}"]`, props: SURFACE }],
  });
}
