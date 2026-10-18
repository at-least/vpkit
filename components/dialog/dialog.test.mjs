// vp-dialog: vpkit's own, so golden: the box as a modal (the crate's
// example, which starts open in place, closed and opened with showModal()
// by the case's script, as the docs page's button does), centered in the
// top layer under its backdrop, which getComputedStyle resolves on an open
// modal dialog; the title and the row of actions; closed; open in place,
// the crate's markup and the docs' form; at a phone's width the 92vw cap;
// and the title inside a vp-doc against itself alone.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, COLORS, MARGIN, PADDING, RADIUS, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

// the example is open in place; as a modal it is closed first, then opened
const MODAL = "<script>const d = document.getElementById('rename'); d.close(); d.showModal()</script>";
// and the example without its `open`: a dialog the page has not opened
const CLOSED = ex('basic').replace(' open>', '>');
const BOXP = ['display', 'position', ...MARGIN, ...BORDER, ...RADIUS, ...PADDING, ...COLORS, 'width', 'max-width', 'box-shadow', 'height', 'offset-top', 'offset-left'];
const TITLE = ['margin-top', 'margin-bottom', 'border-top-width', 'padding-top', 'letter-spacing', 'line-height', 'font-size', 'font-weight', 'color'];
const ACTIONS = ['display', 'justify-content', 'column-gap', 'margin-top'];

// the crate's example, opened as a modal: the box, its backdrop, its parts
cases.push({
  name: 'dialog modal',
  html: ex('basic') + MODAL,
  checks: [
    { target: '.vp-dialog', props: BOXP },
    { target: '.vp-dialog', pseudo: '::backdrop', props: ['background-color', 'position'] },
    { target: '.vp-dialog-title', props: TITLE },
    { target: '.vp-dialog-actions', props: ACTIONS },
    { target: '.vp-dialog-actions .vp-btn[data-variant="brand"]', props: ['height', 'offset-top'] },
  ],
});

// closed, it is not rendered
cases.push({
  name: 'dialog closed',
  html: CLOSED,
  checks: [{ target: '.vp-dialog', props: ['display'] }],
});

// the crate's example as it is: open in place, with no backdrop
cases.push({
  name: "dialog open in place, the crate's markup",
  html: ex('basic'),
  checks: [
    { target: '.vp-dialog', props: BOXP },
    { target: '.vp-dialog-title', props: TITLE },
    { target: '.vp-dialog-actions', props: ACTIONS },
  ],
});

// the docs' form example: open in place, below its button, with no backdrop
cases.push({
  name: 'dialog open in place',
  html: ex('open'),
  checks: [
    { target: '.vp-dialog', props: BOXP },
    { target: '.vp-dialog-title', props: TITLE },
    { target: '.vp-btn:first-child', props: ['height', 'offset-top', 'offset-left'] },
  ],
});

// at a phone's width the 92vw cap holds the box inside the screen
cases.push({
  name: 'dialog modal at 375px',
  width: 375,
  html: ex('basic') + MODAL,
  checks: [{ target: '.vp-dialog', props: ['width', 'max-width', 'offset-left'] }],
});

// inside a vp-doc (prose.css, compiled last, as an app imports it), whose
// rules for a heading set what the title leaves to the page: the same
// title as alone
{
  const title = '<h2 class="vp-dialog-title">Rename</h2>';
  cases.push({
    name: 'dialog title in a doc',
    html: `<div class="vp-doc">${title}</div>`,
    reference: title,
    checks: [{ target: '.vp-dialog-title', props: TITLE }],
  });
}
