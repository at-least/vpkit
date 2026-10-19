// vp-panel: vpkit's own, so golden: the box (the example's), flush around
// rows, as a form row, in a grid track and a flex row, around a float, and
// its header with a group title and a quiet link. vpkit against vpkit: a
// panel nested in a flush one against one alone, and the box and the
// header inside a vp-doc against themselves outside one.

import { BORDER, BORDER_COLOR, MARGIN, PADDING, RADIUS, TRANSITION, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const in24 = (html) => `<div style="width:24rem">${html}</div>`;
const BOXP = ['display', ...BORDER, ...BORDER_COLOR, ...RADIUS, ...PADDING, 'overflow-x', 'overflow-y', 'background-color', 'color', ...TRANSITION, 'height', 'width'];
const HEADING = ['font-size', 'line-height', 'letter-spacing', 'font-weight', 'color', 'height'];
const HEAD = ['display', 'align-items', 'justify-content', 'column-gap', ...PADDING, 'border-bottom-width', 'border-bottom-style', 'border-bottom-color', 'color', 'font-size', 'height'];
const PLACE = ['offset-left', 'offset-top'];

// the box, a heading and a paragraph inside, in a 24rem column
cases.push({
  name: 'panel',
  html: in24(ex('basic')),
  checks: [{ target: '.vp-panel', props: BOXP }, { target: '.vp-panel > :first-child', props: PLACE }],
});

// flush, around rows: no padding of its own, the first row at the border
cases.push({
  name: 'panel flush',
  html: in24(ex('flush')),
  checks: [{ target: '.vp-panel', props: BOXP }, { target: '.vp-row', props: [...PLACE, 'width'] }],
});

// a form row: a layout utility on the panel wins
cases.push({
  name: 'panel as a form row',
  html: `<div style="width:30rem">${ex('form')}</div>`,
  checks: [
    { target: '.vp-panel', props: [...BOXP, 'flex-wrap', 'align-items', 'column-gap'] },
    { target: '.vp-field', props: PLACE },
    { target: '.vp-btn', props: [...PLACE, 'height'] },
  ],
});

// overflow: hidden makes the box a scroll container, whose automatic
// minimum width as a grid or flex item is zero, so a line that doesn't
// wrap stays in a track narrower than it, clipped
const LINE = '<p style="white-space:nowrap">Releases this project has seen, newest first, each with its crash-free sessions.</p>';
cases.push({
  name: 'panel in a grid track and a flex row',
  html:
    `<div style="display:grid;width:20rem"><section data-t="grid" class="vp-panel">${LINE}</section></div>` +
    `<div style="display:flex;width:20rem"><section data-t="flex" class="vp-panel">${LINE}</section></div>`,
  checks: ['grid', 'flex'].map((t) => ({ target: `[data-t="${t}"]`, props: ['width', 'height'] })),
});

// hidden makes a formatting context too, so a float inside is contained:
// the panel is as tall as a float taller than its text
const BODY = '<p>Releases this project has seen, newest first.</p>';
cases.push({
  name: 'panel around a float',
  html: in24(`<section class="vp-panel"><div style="float:left;width:4rem;height:8rem"></div>${BODY}</section>`),
  checks: [{ target: '.vp-panel', props: ['height'] }],
});

// the header: its group title and its quiet link at either end on one
// baseline, over the rows
cases.push({
  name: 'panel header',
  html: in24(ex('header')),
  checks: [
    { target: '.vp-panel-header', props: HEAD },
    { target: '.vp-group-title', props: [...HEADING, ...PLACE] },
    { target: '.vp-link', props: ['color', 'font-size', 'font-weight', 'text-decoration-line', ...PLACE] },
    { target: '.vp-link', state: ['hover'], props: ['color'] },
    { target: '.vp-row', props: PLACE },
  ],
});
// inside a vp-doc, whose rules for an h2 (a rule above, padding, margins)
// and for a link are in play: each as it is outside one
cases.push({
  name: 'panel header in a doc',
  html: inDoc(in24(ex('header'))),
  reference: `<div>${in24(ex('header'))}</div>`,
  checks: [
    { target: '.vp-panel-header', props: HEAD },
    { target: '.vp-group-title', props: [...HEADING, ...MARGIN, 'border-top-width', 'padding-top', 'offset-top'] },
    { target: '.vp-link', props: ['color', 'font-size', 'font-weight', 'text-decoration-line'] },
  ],
});

// a panel inside a flush panel keeps its own padding, the local each
// vp-panel declares, against a panel alone
const PANEL = `<section data-t="box" class="vp-panel">${BODY}</section>`;
cases.push({
  name: 'panel nested in a flush panel',
  html: in24(`<div class="vp-panel vp-panel-flush">${PANEL}</div>`),
  reference: in24(PANEL),
  checks: [{ target: '[data-t="box"]', props: PADDING }, { target: 'p', props: PLACE }],
});

// inside a vp-doc: the box's own look; its height follows the markdown's
// paragraph, its 28px line and its margins
cases.push({
  name: 'panel in a doc',
  html: inDoc(PANEL),
  reference: `<div>${PANEL}</div>`,
  checks: [{ target: '[data-t="box"]', props: BOXP.filter((p) => p !== 'height') }],
});
