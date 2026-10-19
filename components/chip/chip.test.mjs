// vp-chip: vpkit's own, so golden: the pill, its key and value, the remove
// control at rest and hovered and its icon, the focus ring, the hit area
// on a touch screen, a chip that is a link. vpkit against vpkit: a touch
// screen's hover at rest, the remove control inside a vp-doc, a link chip
// inside a vp-doc, whose rules for links match bare links only
// (alert.test.mjs holds one inside an alert).

import { MARGIN, OUTLINE, PADDING, RADIUS, TRANSITION, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const BOXP = ['display', 'align-items', 'column-gap', ...PADDING, ...RADIUS, 'font-size', 'font-weight', 'color', 'background-color', 'text-decoration-line', 'height'];
const LOOK = ['color', 'text-decoration-line', 'font-weight'];
const REMOVE = ['display', ...PADDING, ...MARGIN, 'color', 'cursor', 'text-decoration-line', ...TRANSITION, 'offset-left', 'height'];

// the crate's example: the pill, its key and value, the remove control at
// rest and hovered, its icon
cases.push({
  name: 'chip',
  html: ex('basic'),
  checks: [
    { target: '.vp-chip', props: BOXP },
    { target: '.vp-chip-key', props: ['color', 'font-weight', 'font-size'] },
    { target: '.vp-chip-value', props: ['color', 'font-weight', 'font-size'] },
    { target: '.vp-chip-remove', props: REMOVE },
    { target: '.vp-chip-remove', state: ['hover'], props: ['color'] },
    { target: '.vp-chip-remove > svg', props: ['width', 'height'] },
  ],
});

// the focus ring: base.css's outline on the remove control
cases.push({
  name: 'chip remove focused',
  html: ex('basic'),
  checks: [{ target: '.vp-chip-remove', state: ['focus-visible'], props: OUTLINE }],
});

// on a touch screen a hovered remove control looks as it does at rest
cases.push({
  name: 'chip on a touch screen',
  touch: true,
  html: ex('basic'),
  reference: ex('basic'),
  checks: [{ target: '.vp-chip-remove', state: ['hover'], refState: [], props: ['color'] }],
});

// on a coarse pointer the remove control's hit area grows, its margin
// cancelling it, so the chip keeps its size
cases.push({
  name: 'chip remove on a touch screen, the hit area',
  touch: true,
  html: ex('basic'),
  checks: [
    { target: '.vp-chip-remove', props: [...MARGIN, ...PADDING, 'height'] },
    { target: '.vp-chip', props: ['height'] },
  ],
});

// inside a vp-doc (prose.css, compiled last, as an app imports it), whose
// rule for a link underlines, recolors and weights any <a>: the remove
// control keeps its look and its hover
{
  const chip = `<p>${ex('basic')}</p>`;
  cases.push({
    name: 'chip in a doc',
    html: `<div class="vp-doc">${chip}</div>`,
    reference: chip,
    checks: [
      { target: '.vp-chip-remove', props: ['color', 'text-decoration-line', ...PADDING, ...MARGIN] },
      { target: '.vp-chip-remove', state: ['hover'], props: ['color'] },
    ],
  });
}

// a chip that is a link as a whole: the pill, with the link's pointer, and
// its key, whose weight it inherits, at rest and hovered
cases.push({
  name: 'chip link',
  html: ex('link'),
  checks: [
    { target: '.vp-chip', props: [...BOXP, 'cursor'] },
    { target: '.vp-chip', state: ['hover'], props: LOOK },
    { target: '.vp-chip-key', props: LOOK },
    { target: '.vp-chip-value', props: LOOK },
  ],
});

// the link chip inside a vp-doc, whose rules for links match bare links
// only: its look and its hover, not dimmed (alert.test.mjs holds it inside
// an alert)
cases.push({
  name: 'chip link in a doc',
  html: inDoc(ex('link')),
  reference: `<div>${ex('link')}</div>`,
  checks: [
    { target: '.vp-chip', props: LOOK },
    { target: '.vp-chip', state: ['hover'], props: ['color', 'opacity'] },
    { target: '.vp-chip-key', props: LOOK },
    { target: '.vp-chip-value', props: LOOK },
  ],
});
