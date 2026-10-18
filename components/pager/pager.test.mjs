// vp-pager: vpkit's own, so golden: the row, its summary and its actions
// (the crate's example), a first page with a disabled button, and a pager
// with no summary, whose actions keep the far end; vpkit against vpkit,
// the summary inside a vp-doc against itself outside one.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARGIN, PADDING, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const inDoc = (html) => `<div class="vp-doc">${html}</div>`;
const ROW = ['display', 'align-items', 'justify-content', 'column-gap', ...PADDING, 'height'];
const LINE = ['font-size', 'color', ...MARGIN, 'line-height', 'offset-left', 'offset-top', 'height'];
const ACTIONS = ['display', 'column-gap', 'margin-left', 'offset-left', 'offset-top'];
const BTN = ['offset-left', 'offset-top', 'height', 'opacity'];
const NEWER = '.vp-pager-actions > :first-child';
const OLDER = '.vp-pager-actions > :last-child';

// the crate's example: the summary at the row's start, the buttons at its end
cases.push({
  name: 'pager',
  html: ex('basic'),
  checks: [
    { target: '.vp-pager', props: ROW },
    { target: '.vp-pager-summary', props: LINE },
    { target: '.vp-pager-actions', props: ACTIONS },
    { target: NEWER, props: BTN },
    { target: OLDER, props: BTN },
  ],
});

// the first page: nothing newer, a disabled button keeping the row's shape
cases.push({
  name: 'pager first page',
  html: ex('first'),
  checks: [
    { target: '.vp-pager', props: ROW },
    { target: '.vp-pager-summary', props: LINE },
    { target: NEWER, props: BTN },
    { target: OLDER, props: BTN },
  ],
});

// no summary: the actions keep the far end of a 30rem row
cases.push({
  name: 'pager without a summary',
  html: `<div style="width:30rem">${ex('bare')}</div>`,
  checks: [
    { target: '.vp-pager', props: ROW },
    { target: '.vp-pager-actions', props: ACTIONS },
    { target: OLDER, props: BTN },
  ],
});

// inside a vp-doc, whose rule for a paragraph is in play: the summary as
// it is outside one
cases.push({
  name: 'pager in a doc',
  html: inDoc(ex('basic')),
  reference: `<div>${ex('basic')}</div>`,
  checks: [
    { target: '.vp-pager', props: ['height'] },
    { target: '.vp-pager-summary', props: LINE },
  ],
});
