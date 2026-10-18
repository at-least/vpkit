// vp-thumb: vpkit's own, so golden: the frame, its border at rest and, as
// a link, hovered; the focus ring on a link; the example's two frames.
// vpkit against vpkit: a frame that is no link hovered against the link
// at rest, a touch screen's hover at rest, the frame inside a vp-doc
// against itself alone.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, BORDER_COLOR, MARGIN, OUTLINE, RADIUS, TRANSITION, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const COVER = '<img class="aspect-square w-full object-contain" alt="" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 4 4%22/%3E">';
const link = `<div style="width:10rem"><a class="vp-thumb" href="#">${COVER}</a></div>`;
const plain = `<div style="width:10rem"><div class="vp-thumb">${COVER}</div></div>`;
const FRAME = ['display', 'overflow-x', 'overflow-y', ...BORDER, ...BORDER_COLOR, ...RADIUS, 'color', 'text-decoration-line', 'background-color', ...TRANSITION, 'width', 'height'];

// the frame as a link: at rest and hovered, its image with no margin
cases.push({
  name: 'thumb',
  html: link,
  checks: [
    { target: '.vp-thumb', props: FRAME },
    { target: '.vp-thumb', state: ['hover'], props: BORDER_COLOR },
    { target: 'img', props: [...MARGIN, 'width', 'height'] },
  ],
});

// a frame that is no link: the link's frame, its border kept while hovered
cases.push({
  name: 'thumb not a link',
  html: plain,
  reference: link,
  checks: [
    { target: '.vp-thumb', props: FRAME },
    { target: '.vp-thumb', state: ['hover'], refState: [], props: BORDER_COLOR },
  ],
});

// the focus ring: base.css's outline on the link
cases.push({
  name: 'thumb focused',
  html: link,
  checks: [{ target: '.vp-thumb', state: ['focus-visible'], props: OUTLINE }],
});

// on a touch screen a hovered link looks as it does at rest
cases.push({
  name: 'thumb on a touch screen',
  touch: true,
  html: link,
  reference: link,
  checks: [{ target: '.vp-thumb', state: ['hover'], refState: [], props: BORDER_COLOR }],
});

// inside a vp-doc (prose.css, compiled last, as an app imports it), whose
// rules for a link and an image are in play: the frame keeps its color,
// its underline's absence and its hover, the image its margin
cases.push({
  name: 'thumb in a doc',
  html: `<div class="vp-doc">${link}</div>`,
  reference: link,
  checks: [
    { target: '.vp-thumb', props: FRAME },
    { target: '.vp-thumb', state: ['hover'], props: [...BORDER_COLOR, 'color', 'text-decoration-line'] },
    { target: 'img', props: [...MARGIN, 'height'] },
  ],
});

// the example: a cover as a link and a preview alone, one under the other
cases.push({
  name: 'thumb covers',
  html: ex('covers'),
  checks: [
    { target: 'a.vp-thumb', props: ['width', 'height', ...BORDER_COLOR] },
    { target: 'div.vp-thumb', props: ['width', 'height', ...BORDER_COLOR] },
    { target: 'a.vp-thumb > img', props: ['width', 'height', ...MARGIN] },
  ],
});
