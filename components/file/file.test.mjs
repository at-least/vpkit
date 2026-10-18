// vp-file: vpkit's own, so golden: the element and its
// ::file-selector-button at rest, hovered and focused from the keyboard,
// base.css's ring on the element, the small size, and the examples' rows,
// the chooser and the button beside it at the one control height. vpkit
// against vpkit: a touch screen's hover at rest.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, COLORS, OUTLINE, PADDING, RADIUS, TRANSITION, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

// the chooser is a pseudo-element: its height is read as block-size
const BUTTON = [...BORDER, ...RADIUS, ...PADDING, 'block-size', 'margin-right', 'font-size', 'cursor', ...COLORS, 'box-shadow', ...TRANSITION];
const FILE = '<input class="vp-file" type="file">';
const button = (check) => ({ target: '.vp-file', pseudo: '::file-selector-button', ...check });

// the element and its button at rest, hovered and focused from the keyboard
cases.push({
  name: 'file input',
  html: FILE,
  checks: [
    { target: '.vp-file', props: ['font-size', 'color', 'height', 'width'] },
    button({ props: BUTTON }),
    button({ state: ['hover'], props: [...COLORS, 'box-shadow'] }),
    button({ state: ['focus-visible'], props: [...COLORS, 'box-shadow'] }),
    { target: '.vp-file', state: ['focus-visible'], props: OUTLINE },
  ],
});

// the small size: the button at the small control height
cases.push({
  name: 'file input small',
  html: '<input class="vp-file" type="file" data-size="sm">',
  checks: [
    { target: '.vp-file', props: ['font-size', 'height'] },
    button({ props: ['block-size', ...PADDING, 'font-size', ...COLORS] }),
  ],
});

// the examples: the chooser beside a button, both at the control height
for (const [id, size] of [['upload', ''], ['small', ' small']]) {
  cases.push({
    name: `file input${size} beside a button`,
    html: ex(id),
    checks: [button({ props: ['block-size'] }), { target: '.vp-btn', props: ['height'] }],
  });
}

// on a touch screen a hovered input's button looks as it does at rest
cases.push({
  name: 'file input on a touch screen',
  touch: true,
  html: FILE,
  reference: FILE,
  checks: [button({ state: ['hover'], refState: [], props: COLORS })],
});
