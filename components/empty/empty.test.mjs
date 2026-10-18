// vp-empty: vpkit's own, so golden: the box and its two lines (the
// crate's example), a title alone, a line of text with neither class;
// and, vpkit against vpkit, the lines inside a vp-doc against themselves
// outside one.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COLORS, PADDING, RADIUS, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const BOX = ['display', 'flex-direction', 'align-items', 'justify-content', 'row-gap', ...PADDING, ...RADIUS, 'text-align', ...COLORS, 'height'];
const LINE = ['margin-top', 'margin-bottom', 'line-height', 'font-size', 'font-weight', 'color', 'max-width'];
const inDoc = (html) => `<div class="vp-doc">${html}</div>`;

// the crate's example: the box, the title, the line under it
cases.push({
  name: 'empty',
  html: ex('basic'),
  checks: [
    { target: '.vp-empty', props: BOX },
    { target: '.vp-empty-title', props: [...LINE, 'offset-top'] },
    { target: '.vp-empty-desc', props: [...LINE, 'offset-top'] },
  ],
});

// a title alone, as the crate renders one without a description
cases.push({
  name: 'empty title alone',
  html: '<div class="vp-empty"><p class="vp-empty-title">No jobs yet</p></div>',
  checks: [{ target: '.vp-empty', props: BOX }, { target: '.vp-empty-title', props: LINE }],
});

// a line of text with neither class: the box's color and centering
cases.push({
  name: 'empty a line of text',
  html: ex('line'),
  checks: [{ target: '.vp-empty', props: BOX }],
});

// inside a vp-doc, whose rule for a paragraph is in play: each line as
// it is outside one
cases.push({
  name: 'empty in a doc',
  html: inDoc(ex('basic')),
  reference: `<div>${ex('basic')}</div>`,
  checks: [
    { target: '.vp-empty-title', props: LINE },
    { target: '.vp-empty-desc', props: LINE },
    { target: '.vp-empty', props: ['height'] },
  ],
});
