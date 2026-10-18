// vp-input: vpkit's own, so golden: the box, its colors at rest, hovered,
// focused and invalid, the placeholder, the focus ring, the small size, a
// select and a textarea in the same box. vpkit against vpkit: a select
// against the input, and a touch screen's hover at rest.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, COLORS, OUTLINE, PADDING, RADIUS, TRANSITION, TYPE, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const BOXP = ['display', 'height', 'width', ...BORDER, ...RADIUS, ...PADDING, ...TYPE, ...COLORS, ...TRANSITION];
const STATES = [
  { target: '[data-t]', props: BOXP },
  { target: '[data-t]', state: ['hover'], props: COLORS },
  { target: '[data-t]', state: ['focus', 'focus-visible'], props: [...COLORS, ...OUTLINE] },
];

cases.push({ name: 'input', html: '<input data-t class="vp-input" placeholder="Coupon code">', checks: [...STATES, { target: '[data-t]', pseudo: '::placeholder', props: ['color'] }] });
cases.push({ name: 'input w-full', html: '<input data-t class="vp-input w-full">', checks: [{ target: '[data-t]', props: ['width'] }] });
for (const value of ['true', 'false']) {
  cases.push({ name: `input aria-invalid="${value}"`, html: `<input data-t class="vp-input" aria-invalid="${value}">`, checks: STATES });
}
cases.push({ name: 'input small', html: '<input data-t class="vp-input" data-size="sm">', checks: STATES });
cases.push({ name: 'select', html: '<select data-t class="vp-input"><option>7 days</option></select>', checks: STATES });
cases.push({ name: 'textarea one row', html: '<textarea data-t class="vp-input" rows="1"></textarea>', checks: STATES });
cases.push({ name: 'textarea three rows', html: '<textarea data-t class="vp-input" rows="3"></textarea>', checks: [{ target: '[data-t]', props: ['height', 'min-height', 'padding-top', 'padding-bottom'] }] });

// the example page: the three controls, one under another
cases.push({
  name: 'input examples',
  html: ex('controls'),
  checks: [
    { target: 'input.vp-input', props: ['height', 'width'] },
    { target: 'select.vp-input', props: ['height'] },
    { target: 'textarea.vp-input', props: ['height'] },
  ],
});

// a select takes the input's box: against the input in the same stylesheet
cases.push({
  name: 'select against the input',
  html: '<select data-t class="vp-input"><option>7 days</option></select>',
  reference: '<input data-t class="vp-input">',
  checks: [
    { target: '[data-t]', props: ['height', ...BORDER, ...RADIUS, ...PADDING, 'font-size', ...COLORS] },
    { target: '[data-t]', state: ['hover'], props: COLORS },
    { target: '[data-t]', state: ['focus', 'focus-visible'], props: [...COLORS, ...OUTLINE] },
  ],
});

// on a touch screen a hovered input looks as it does at rest
cases.push({
  name: 'input on a touch screen',
  touch: true,
  html: '<input data-t class="vp-input">',
  reference: '<input data-t class="vp-input">',
  checks: [{ target: '[data-t]', state: ['hover'], refState: [], props: COLORS }],
});
