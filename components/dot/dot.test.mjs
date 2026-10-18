// vp-dot: vpkit's own, so golden: the circle in each kind, in a color the
// page sets through --vp-dot-color, and in the text's color of a secondary
// line; the example's legend, each dot centered on its word's line.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RADIUS, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const DOT = ['display', 'width', 'height', ...RADIUS, 'background-color', 'flex-shrink'];

// each kind, beside its word
for (const kind of ['success', 'warning', 'danger', 'tip']) {
  cases.push({
    name: `dot ${kind}`,
    html: `<span><span class="vp-dot" data-variant="${kind}"></span> 99% and up</span>`,
    checks: [{ target: '.vp-dot', props: DOT }],
  });
}

// a color of the page's own, through the variable
cases.push({
  name: "dot in the page's color",
  html: '<span><span class="vp-dot" style="--vp-dot-color:var(--vp-c-brand)"></span> stored</span>',
  checks: [{ target: '.vp-dot', props: DOT }],
});

// no kind: the text's color, here a secondary line's
cases.push({
  name: "dot in the text's color",
  html: '<span class="text-secondary"><span class="vp-dot"></span> dropped</span>',
  checks: [{ target: '.vp-dot', props: DOT }],
});

// the example's legend: the dots in their kinds and the text's color,
// each centered on its line by the page's flex row
cases.push({
  name: 'dot legend',
  html: ex('legend'),
  checks: [
    { target: '.vp-dot[data-variant="success"]', props: [...DOT, 'offset-top'] },
    { target: '.vp-dot[data-variant="warning"]', props: ['background-color'] },
    { target: '.vp-dot[data-variant="danger"]', props: ['background-color'] },
    { target: '.text-secondary > .vp-dot', props: ['background-color', 'offset-top'] },
  ],
});
