// vp-checkbox: vpkit's own, so golden: the control's box, accent and
// cursor and the label around it, on a desktop and on a touch screen
// (where the label is a touch target over the cell's padding and the
// control keeps its size); the focus ring; the example's select column.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARGIN, OUTLINE, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const cell = '<table class="vp-table"><tbody><tr><td><label class="vp-checkbox-label"><input class="vp-checkbox" type="checkbox" aria-label="Select"></label></td><td>shop</td></tr></tbody></table>';
const CONTROL = ['display', 'width', 'height', 'accent-color', 'cursor'];
const LABEL = ['display', 'align-items', 'justify-content', 'cursor', 'width', 'height', ...MARGIN];

// in a table's cell, on a desktop and on a touch screen: the control, the
// label, and the cell's height, which the label's hit area barely moves
for (const touch of [false, true]) {
  cases.push({
    name: `checkbox${touch ? ' on a touch screen' : ''}`,
    touch,
    html: cell,
    checks: [
      { target: '.vp-checkbox', props: CONTROL },
      { target: '.vp-checkbox-label', props: LABEL },
      { target: 'td', props: ['height'] },
    ],
  });
}

// the focus ring: base.css's outline on the control
cases.push({
  name: 'checkbox focused',
  html: cell,
  checks: [{ target: '.vp-checkbox', state: ['focus-visible'], props: OUTLINE }],
});

// the example: a select column, its checked row selected by the table
cases.push({
  name: 'checkbox column',
  html: ex('column'),
  checks: [
    { target: 'thead .vp-checkbox', props: CONTROL },
    { target: 'tbody .vp-checkbox:checked', props: CONTROL },
    { target: 'tbody tr:first-child', props: ['background-color', 'height'] },
    { target: 'tbody tr:last-child', props: ['background-color'] },
  ],
});
