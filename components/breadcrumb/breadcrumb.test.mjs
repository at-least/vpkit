// vp-breadcrumb: vpkit's own, so golden: the list, a crumb at rest and
// hovered, the current one, the slash the list draws before every item
// but the first, a current crumb that is a span and a long name in a
// narrow box, the focus ring. vpkit against vpkit: a touch screen's hover
// at rest and the list inside a vp-doc (alert.test.mjs holds a crumb
// inside an alert).

import { MARGIN, OUTLINE, PADDING, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const CRUMB = ['color', 'text-decoration-line', 'font-weight', 'font-size'];
const HOVER = ['color', 'text-decoration-line'];
const LOOK = ['color', 'text-decoration-line', 'font-weight'];
const ITEM = '.vp-breadcrumb-item:not([aria-current])';
const CURRENT = '.vp-breadcrumb-item[aria-current="page"]';

// the path: the list, a crumb at rest and hovered, the current one, which
// a hover leaves as it is, and the slash on every item but the first
cases.push({
  name: 'breadcrumb',
  html: ex('path'),
  checks: [
    { target: '.vp-breadcrumb', props: ['display', 'flex-wrap', 'align-items', 'min-width', 'font-size', 'overflow-wrap', 'height'] },
    { target: ITEM, props: CRUMB },
    { target: ITEM, state: ['hover'], props: HOVER },
    { target: CURRENT, props: CRUMB },
    { target: CURRENT, state: ['hover'], props: HOVER },
    { target: '.vp-breadcrumb > li + li', pseudo: '::before', props: ['content', 'color', 'padding-left', 'padding-right'] },
    { target: '.vp-breadcrumb > li:first-child', pseudo: '::before', props: ['content'] },
  ],
});

// the current page as a span, and a long name in a 20rem box, which
// breaks inside the word onto more lines instead of overflowing
cases.push({
  name: 'breadcrumb with a span and a long name',
  html: ex('span'),
  checks: [
    { target: CURRENT, props: [...CRUMB, 'cursor'] },
    { target: CURRENT, state: ['hover'], props: HOVER },
    { target: '.vp-breadcrumb', props: ['width', 'height'] },
    { target: '.vp-breadcrumb > li:last-child', props: ['width', 'height'] },
  ],
});

// the focus ring: base.css's outline on a crumb
cases.push({
  name: 'breadcrumb item focused',
  html: ex('path'),
  checks: [{ target: ITEM, state: ['focus-visible'], props: OUTLINE }],
});

// on a touch screen a hovered crumb looks as it does at rest
cases.push({
  name: 'breadcrumb item on a touch screen',
  touch: true,
  html: ex('path'),
  reference: ex('path'),
  checks: [{ target: ITEM, state: ['hover'], refState: [], props: HOVER }],
});

// inside a vp-doc (prose.css, compiled last, as an app imports it), whose
// rules for a list indent, number and space it and for a link underline,
// recolor and weight it: the list keeps its row and a crumb its look. The
// crumb has no transition of its own, so the markdown's link fade applies
// there: not compared
cases.push({
  name: 'breadcrumb in a doc',
  html: `<div class="vp-doc">${ex('path')}</div>`,
  reference: `<div>${ex('path')}</div>`,
  checks: [
    { target: '.vp-breadcrumb', props: ['display', ...MARGIN, ...PADDING, 'list-style-type', 'height'] },
    { target: '.vp-breadcrumb > li + li', props: ['margin-top', 'display'] },
    { target: ITEM, props: LOOK },
    { target: ITEM, state: ['hover'], props: HOVER },
    { target: CURRENT, props: LOOK },
  ],
});
