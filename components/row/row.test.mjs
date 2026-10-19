// vp-row: vpkit's own, so golden: three rows in a flush panel (the
// example's board), a row's title and description, a row that is a link
// at rest, hovered and focused (its ring inset, the panel clipping outside
// it), a muted row. vpkit against vpkit: the parts inside
// a vp-doc against themselves outside one, as <span> and as <p>, a link
// row in a vp-doc, and a touch screen's hover at rest.

import { MARGIN, OUTLINE, PADDING, TRANSITION, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const ROW = [...PADDING, 'border-bottom-width', 'border-bottom-style', 'border-bottom-color', 'height', 'offset-top'];
const TEXT = ['display', 'line-height', 'font-size', 'font-weight', 'color', 'overflow-wrap', ...MARGIN, 'height'];
const LINK = ['display', 'color', 'font-weight', 'text-decoration-line', 'background-color', ...TRANSITION];
const TITLE = '[data-t="title"]';
const DESC = '[data-t="desc"]';

// the board: three rows in a flush panel, each ruled off but the last
cases.push({
  name: 'row',
  html: ex('board'),
  checks: [
    { target: '.vp-row:nth-child(1)', props: ROW },
    { target: '.vp-row:nth-child(2)', props: ROW },
    { target: '.vp-row:nth-child(3)', props: ROW },
    { target: '.vp-panel', props: ['height'] },
  ],
});

// the title and the line under it, in a 16rem column, the address breaking
const text = (tag = 'span') =>
  `<span class="min-w-0"><${tag} data-t="title" class="vp-row-title">Google</${tag}>` +
  `<${tag} data-t="desc" class="vp-row-desc">someone.with.a.long.address@example.com</${tag}></span>`;
cases.push({
  name: 'row title and description',
  html: `<div style="width:16rem">${text()}</div>`,
  checks: [{ target: TITLE, props: TEXT }, { target: DESC, props: TEXT }],
});
// the example: the rows list items, the address breaking in the second
cases.push({
  name: 'row titles example',
  html: `<div style="width:16rem">${ex('titles')}</div>`,
  checks: [
    { target: '.vp-row:last-child > .vp-row-title', props: TEXT },
    { target: '.vp-row:last-child > .vp-row-desc', props: TEXT },
    { target: '.vp-row:last-child', props: ROW },
  ],
});
// inside a vp-doc, the rows list items (the doc's space between list
// items, and a paragraph's margins, not reaching them): each as it is
// outside one
const list = (tag) => `<ul class="m-0 list-none p-0">${[1, 2].map(() => `<li class="vp-row">${text(tag)}</li>`).join('')}</ul>`;
for (const tag of ['span', 'p']) {
  cases.push({
    name: `row title and description in a doc, as <${tag}>`,
    html: `<div style="width:16rem">${inDoc(list(tag))}</div>`,
    reference: `<div style="width:16rem">${list(tag)}</div>`,
    checks: [
      { target: '.vp-row + .vp-row', props: [...MARGIN, ...PADDING, 'offset-top'] },
      { target: TITLE, props: TEXT },
      { target: DESC, props: TEXT },
    ],
  });
}

// a row that is a link: a block in the text's color and weight with no
// underline, the gray wash while hovered; then the example's two, which
// the page lays out as flex rows
const LINK_ROW = '<div class="vp-panel vp-panel-flush"><a data-t="row" class="vp-row" href="#">shop · panic in send_digest</a></div>';
cases.push({
  name: 'row as a link',
  html: LINK_ROW,
  checks: [
    { target: '[data-t="row"]', props: [...LINK, ...PADDING, 'height'] },
    { target: '[data-t="row"]', state: ['hover'], props: LINK },
  ],
});
cases.push({
  name: 'row links example',
  html: ex('links'),
  checks: [
    { target: 'a.vp-row', props: [...LINK, ...PADDING, 'height'] },
    { target: 'a.vp-row', state: ['hover'], props: LINK },
    { target: 'a.vp-row + a.vp-row', props: ['border-bottom-width', 'height', 'offset-top'] },
    { target: 'a.vp-row > .vp-row-title', props: TEXT },
    { target: 'a.vp-row > .vp-row-desc', props: TEXT },
  ],
});
cases.push({
  name: 'row as a link in a doc',
  html: inDoc(LINK_ROW),
  reference: `<div>${LINK_ROW}</div>`,
  checks: [
    { target: '[data-t="row"]', props: LINK },
    { target: '[data-t="row"]', state: ['hover'], props: LINK },
  ],
});
// on a touch screen a hovered link row looks as it does at rest
cases.push({
  name: 'row as a link on a touch screen',
  touch: true,
  html: LINK_ROW,
  reference: LINK_ROW,
  checks: [{ target: '[data-t="row"]', state: ['hover'], refState: [], props: ['background-color'] }],
});

// a link row focused: base.css's ring, inset 2px, since the panel clips
// outside the row (overflow: hidden, for its corners)
cases.push({
  name: 'row as a link focused',
  html: LINK_ROW,
  checks: [{ target: '[data-t="row"]', state: ['focus-visible'], props: OUTLINE }],
});

// a muted row, dimmed beside one that is not
cases.push({
  name: 'row muted',
  html: ex('muted'),
  checks: [
    { target: '.vp-row[data-state="muted"]', props: ['opacity'] },
    { target: '.vp-row:first-child', props: ['opacity'] },
  ],
});
