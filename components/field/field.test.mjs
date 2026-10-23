// vp-field, vp-label, vp-field-hint and vp-field-error: vpkit's own, so
// golden: the box's grid and gap, each part's type and color, the margins
// inside a field and outside one, a narrow box, a row of fields; and,
// vpkit against vpkit, the field and the bare parts inside a vp-doc
// against themselves outside one.

import { COLORS, MARGIN, TYPE, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const PART = [...TYPE, 'color', 'display', ...MARGIN];

// the field with every part: the grid, and each part's type, color and margins
cases.push({
  name: 'field with a hint and an error',
  html: ex('field'),
  checks: [
    { target: '.vp-field', props: ['display', 'grid-template-columns', 'row-gap', 'column-gap', 'min-width'] },
    { target: '.vp-label', props: PART },
    { target: '.vp-input', props: ['width', 'offset-top'] },
    { target: '.vp-field-hint', props: [...PART, 'offset-top'] },
    { target: '.vp-field-error', props: [...PART, 'offset-top'] },
  ],
});

// a label and an error line outside a field keep their own spacing
cases.push({
  name: 'label and error outside a field',
  html: ex('bare'),
  checks: [
    { target: '.vp-label', props: PART },
    { target: '.vp-field-error', props: PART },
  ],
});

// a narrow box: the control takes the box's width instead of overflowing it
cases.push({
  name: 'field in a 9rem box',
  html: `<div style="width:9rem">${ex('field')}</div>`,
  checks: [{ target: '.vp-input', props: ['width'] }, { target: '.vp-field', props: ['width'] }],
});

// fields side by side with a button, aligned at their ends
cases.push({
  name: 'fields in a row',
  html: ex('row'),
  checks: [
    { target: '.vp-field', props: ['width', 'offset-left'] },
    { target: '.vp-field + .vp-field', props: ['offset-left'] },
    { target: '.vp-btn', props: ['offset-top', 'height'] },
    { target: '.vp-input', props: ['offset-top', 'height'] },
  ],
});

// the control's colors inside the field are vp-input's, unchanged by the box
cases.push({
  name: 'field keeps the control',
  html: ex('field'),
  reference: '<input class="vp-input w-full" aria-invalid="true">',
  checks: [{ target: '.vp-input', props: [...COLORS, 'height'] }],
});

// inside a vp-doc, whose rule for a paragraph gives a line margins: the
// field and the bare parts as they are outside one
cases.push({
  name: 'field in a doc',
  html: inDoc(ex('field')),
  reference: `<div>${ex('field')}</div>`,
  checks: [
    { target: '.vp-label', props: PART },
    { target: '.vp-field-hint', props: [...PART, 'offset-top'] },
    { target: '.vp-field-error', props: [...PART, 'offset-top'] },
  ],
});
cases.push({
  name: 'label and error outside a field in a doc',
  html: inDoc(ex('bare')),
  reference: `<div>${ex('bare')}</div>`,
  checks: [
    { target: '.vp-label', props: PART },
    { target: '.vp-field-error', props: PART },
  ],
});
