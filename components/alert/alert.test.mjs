// vp-alert against VitePress's custom blocks (test/upstream/custom-block.css
// with vp-doc.css, whose rules for a container's links and paragraphs meet
// it, as VitePress renders a container inside .vp-doc): the seven types
// with a title and the things inside whose look the block sets (links,
// code, paragraphs), a block without a title, the details block open and
// closed, a block inside a vp-doc, a nested block. vpkit's own, golden: the
// icon beside the content, and a nested block's code tint. vpkit against
// vpkit: a nested alert against a lone one, a component inside an alert
// against itself alone, in and out of a vp-doc, and a touch screen's hover
// at rest.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, COLORS, MARGIN, PADDING, RADIUS, TRANSITION, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

// custom-block.css, then vp-doc.css, in VitePress's import order: the
// later file wins the ties (a link's weight, its transition)
const UPSTREAM = { files: ['custom-block.css', 'vp-doc.css'] };
const TYPES = ['info', 'note', 'tip', 'important', 'warning', 'danger', 'caution'];
const variant = (type) => (type === 'info' ? '' : ` data-variant="${type}"`);
const ofType = (type) => (type === 'info' ? '.vp-alert:not([data-variant])' : `.vp-alert[data-variant="${type}"]`);
// VitePress renders a container inside .vp-doc, whose rules for links and
// code meet custom-block.css's: the upstream side is that rendering
const inDoc = (html) => `<div class="vp-doc">${html}</div>`;

const ALERT_BOX = [...BORDER, ...RADIUS, ...PADDING, 'line-height', 'font-size', ...COLORS];
const LINK = ['color', 'font-weight', 'text-decoration-line', 'text-underline-offset', ...TRANSITION, 'opacity'];
const CODE = ['font-size', 'color', 'background-color', ...RADIUS, ...PADDING, ...TRANSITION];
const SUMMARY = ['display', ...MARGIN, 'font-weight', 'cursor', 'user-select'];
const A = '[data-t="a"]';
const A2 = '[data-t="a2"]';
const CODE_T = '[data-t="code"]';
const ACODE = '[data-t="acode"]';
const TITLE_T = '[data-t="title"]';
const P1 = '[data-t="p1"]';
const P2 = '[data-t="p2"]';
// the things inside: a link at rest and hovered, code, and code in a
// hovered link
const INSIDES = [
  { target: A, props: LINK },
  { target: A, state: ['hover'], props: ['color', 'opacity'] },
  { target: CODE_T, props: CODE },
  { target: ACODE, on: A2, state: ['hover'], props: ['color'] },
];
const body = (title) =>
  `${title}<p data-t="p1">Body with <a data-t="a" href="#">a link</a> and <code data-t="code">code</code>.</p>` +
  `<p data-t="p2">Then <a data-t="a2" href="#"><code data-t="acode">linked code</code></a>.</p>`;
const UP_TITLE = '<p data-t="title" class="custom-block-title">TIP</p>';
const VP_TITLE = '<p data-t="title" class="vp-alert-title">TIP</p>';
const upstreamAlert = (type, inner) => inDoc(`<div class="custom-block ${type}">${inner}</div>`);
const vpkitAlert = (type, inner) => `<div class="vp-alert"${variant(type)}>${inner}</div>`;

// the seven types with a title: the box, the title, the paragraphs, the insides
for (const type of TYPES) {
  cases.push({
    name: `alert ${type}`,
    upstream: { ...UPSTREAM, html: upstreamAlert(type, body(UP_TITLE)) },
    html: vpkitAlert(type, body(VP_TITLE)),
    checks: [
      { target: '.vp-alert', refTarget: '.custom-block', props: ALERT_BOX },
      { target: TITLE_T, props: ['font-weight'] },
      { target: P2, props: ['margin-top', 'margin-bottom'] },
      ...INSIDES,
    ],
  });
}

// without a title the block keeps its 0.5rem top padding (the :has() rule)
cases.push({
  name: 'alert info, no title',
  upstream: { ...UPSTREAM, html: upstreamAlert('info', body('')) },
  html: vpkitAlert('info', body('')),
  checks: [{ target: '.vp-alert', refTarget: '.custom-block', props: PADDING }],
});

// inside a vp-doc: the markdown's margins on the block, the custom block's
// margins and line on its paragraphs, as vp-doc.css restates them
cases.push({
  name: 'alert tip in a doc',
  upstream: { ...UPSTREAM, html: upstreamAlert('tip', body(UP_TITLE)) },
  html: inDoc(vpkitAlert('tip', body(VP_TITLE))),
  checks: [
    { target: '.vp-alert', refTarget: '.custom-block', props: [...ALERT_BOX, ...MARGIN] },
    { target: TITLE_T, props: ['margin-top', 'margin-bottom', 'font-weight', 'line-height'] },
    { target: P2, props: ['margin-top', 'margin-bottom', 'line-height'] },
    ...INSIDES,
  ],
});

// the details block, open and closed: VitePress's .custom-block.details on
// a <details>, against <details class="vp-alert">, its summary the title
const DETAILS = body('<summary data-t="title">Details</summary>');
for (const open of [true, false]) {
  const attr = open ? ' open' : '';
  cases.push({
    name: `alert details${open ? '' : ', closed'}`,
    upstream: { ...UPSTREAM, html: inDoc(`<details class="custom-block details"${attr}>${DETAILS}</details>`) },
    html: `<details class="vp-alert"${attr}>${DETAILS}</details>`,
    checks: open
      ? [
          { target: '.vp-alert', refTarget: '.custom-block', props: [...ALERT_BOX, 'height'] },
          { target: TITLE_T, props: SUMMARY },
          { target: P1, props: ['margin-top', 'margin-bottom'] },
          { target: P2, props: ['margin-top', 'margin-bottom'] },
          ...INSIDES,
        ]
      : [{ target: '.vp-alert', refTarget: '.custom-block', props: [...PADDING, 'height'] }],
  });
}

// an info alert nested in a tip alert keeps the info look: its colors and
// its link against VitePress's; its code's tint is its own
const INNER = '<p>Inner with <a data-t="a" href="#">a link</a> and <code data-t="code">code</code>.</p>';
const NESTED = `<div class="vp-alert" data-variant="tip"><div data-t="inner" class="vp-alert">${INNER}</div></div>`;
cases.push({
  name: 'alert info nested in tip',
  upstream: { ...UPSTREAM, html: inDoc(`<div class="custom-block tip"><div data-t="inner" class="custom-block info">${INNER}</div></div>`) },
  html: NESTED,
  checks: [
    { target: '[data-t="inner"]', props: COLORS },
    { target: A, props: ['color'] },
    { target: CODE_T, props: CODE.filter((p) => p !== 'background-color') },
    {
      target: CODE_T,
      source: 'golden',
      props: ['background-color'],
      why: "a nested alert keeps its own code tint, the info's gray: VitePress's `.custom-block.tip code`, later in custom-block.css than `.custom-block.info code`, paints code inside a nested info block with the tip's",
    },
  ],
});
cases.push({
  name: 'alert info nested in tip, against a lone info alert',
  reference: `<div data-t="inner" class="vp-alert">${INNER}</div>`,
  html: NESTED,
  checks: [
    { target: '[data-t="inner"]', props: COLORS },
    { target: A, props: ['color'] },
    { target: A, state: ['hover'], props: ['color'] },
    { target: CODE_T, props: CODE },
  ],
});

// the icon beside the content, vpkit's addition: the block a row, the icon
// 1rem square in the type's color, centered on the first line, the content
// filling the rest with its paragraphs keeping their margins, a titled
// block its top padding; in a 24rem box, so the geometry is the block's own
const WARN = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>';
const ICON = `<svg data-t="icon" class="vp-alert-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${WARN}</svg>`;
const iconAlert = (type, titled) =>
  `<div class="vp-alert" data-variant="${type}" style="width:24rem">${ICON}<div data-t="content">` +
  `${titled ? '<p data-t="title" class="vp-alert-title">Platform mismatch</p>' : ''}` +
  '<p data-t="p1">Events arrive from a platform this project does not declare.</p><p data-t="p2">Check which app holds this DSN.</p></div></div>';
const ICON_CHECKS = [
  { target: '.vp-alert', props: ['display', 'align-items', 'column-gap', ...PADDING, 'height'] },
  { target: '[data-t="icon"]', props: ['width', 'height', 'margin-top', 'color', 'offset-left', 'offset-top'] },
  { target: '[data-t="content"]', props: ['width', 'offset-left', 'offset-top', 'height'] },
  { target: P1, props: [...MARGIN, 'offset-top'] },
  { target: P2, props: [...MARGIN, 'offset-top'] },
];
for (const [type, titled] of [['warning', false], ['danger', true], ['tip', true]]) {
  cases.push({
    name: `alert ${type} with an icon${titled ? ' and a title' : ''}`,
    html: iconAlert(type, titled),
    checks: titled ? [...ICON_CHECKS, { target: TITLE_T, props: ['offset-top', 'font-weight'] }] : ICON_CHECKS,
  });
}
// inside a vp-doc against itself outside one
cases.push({
  name: 'alert with an icon in a doc',
  reference: `<div>${iconAlert('danger', true)}</div>`,
  html: inDoc(iconAlert('danger', true)),
  checks: [...ICON_CHECKS, { target: TITLE_T, props: ['offset-top'] }],
});

// a component inside an alert keeps its own look, at rest and hovered, not
// dimmed, and a part of it that is a paragraph its own margins and line:
// the alert's rules for links, code and paragraphs are for bare ones.
// Inside a vp-doc too, where the markdown's rules for any <a>, <code> and
// <p> are in play, and the alert's own in-doc paragraph rule would outrank
// a part's. A card's heading inside a <p> would be parsed out of it: block
// wrappers. An entry's fourth element holds checks for the in-doc case
// alone
const X = '[data-t="x"]';
const LOOK = ['color', 'text-decoration-line', 'font-weight'];
const hovered = (target) => ({ target, state: ['hover'], props: ['color', 'opacity'] });
const INSIDE = [
  ['a button', '<a data-t="x" class="vp-btn" data-variant="brand" href="#">Go</a>', [
    { target: X, props: [...LOOK, 'background-color', ...TRANSITION, 'opacity'] },
    { target: X, state: ['hover'], props: ['color', 'background-color', 'opacity'] },
  ]],
  ['a link', '<p>See <a data-t="x" class="vp-link" href="#">the runbook</a>.</p>', [
    { target: X, props: [...LOOK, 'text-underline-offset', ...TRANSITION] },
    hovered(X),
  ]],
  ['a quiet link', '<p>See <a data-t="x" class="vp-link" data-variant="quiet" href="#">the runbook</a>.</p>', [
    { target: X, props: LOOK },
    hovered(X),
  ]],
  ['code', '<p>Run <code data-t="x" class="vp-code">vpkit-css</code>.</p>', [
    { target: X, props: ['color', 'background-color', ...RADIUS, ...PADDING, ...TRANSITION] },
    { target: X, source: 'golden', props: ['font-size'], why: "vp-code's 0.875em of the alert's 14px text is 12.25px; the reference's paragraph is the page's 16px" },
  ]],
  ['a link holding code', '<p>See <a data-t="x" class="vp-link" href="#"><code data-t="c" class="vp-code">vp-alert</code></a>.</p>', [
    { target: X, props: LOOK },
    hovered(X),
    { target: '[data-t="c"]', props: ['color', 'background-color'] },
    { target: '[data-t="c"]', on: X, state: ['hover'], props: ['color'] },
  ]],
  ['a card', '<a data-t="x" class="vp-card" href="#"><h2 data-t="title" class="vp-card-title">Fast</h2><p data-t="details" class="vp-card-details">Instant server start.</p></a>', [
    { target: X, props: LOOK },
    hovered(X),
    { target: TITLE_T, props: LOOK },
    { target: '[data-t="details"]', props: ['color', 'font-weight', ...MARGIN, 'line-height'] },
  ]],
  ['a dropdown item', '<div class="vp-dropdown" role="menu"><a data-t="x" class="vp-dropdown-item" role="menuitem" href="#">Profile</a></div>', [
    { target: X, props: LOOK },
    hovered(X),
  ]],
  ['a tab', '<nav class="vp-tabs" aria-label="Status"><a data-t="x" class="vp-tabs-tab" href="#">Resolved</a></nav>', [
    { target: X, props: LOOK },
    hovered(X),
  ]],
  ['a chip link', '<a data-t="x" class="vp-chip" href="#"><span data-t="key" class="vp-chip-key">release:</span><span data-t="value" class="vp-chip-value">2.4.1</span></a>', [
    { target: X, props: LOOK },
    hovered(X),
    { target: '[data-t="key"]', props: LOOK },
    { target: '[data-t="value"]', props: LOOK },
  ]],
  ['a breadcrumb item', '<ol class="vp-breadcrumb"><li><a data-t="x" class="vp-breadcrumb-item" href="#">root</a></li></ol>', [
    { target: X, props: LOOK },
    hovered(X),
  ]],
  // an icon has no text for the alert's link weight to draw
  ['an icon button', '<a data-t="x" class="vp-icon-btn" href="#" aria-label="Copy"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg></a>', [
    { target: X, props: ['color', 'text-decoration-line'] },
    hovered(X),
  ]],
  // an empty state's lines are paragraphs, the second after the first:
  // their margins stay the box's gap, the description's color secondary.
  // Its line height is its own only in a doc (.vp-doc .vp-empty-desc);
  // elsewhere it inherits the alert's, so it is compared in the doc alone
  ['an empty state', '<div data-t="x" class="vp-empty"><p data-t="title" class="vp-empty-title">No issues</p><p data-t="details" class="vp-empty-desc">Nothing matched these filters.</p></div>', [
    { target: X, props: ['color', 'background-color', 'row-gap'] },
    { target: TITLE_T, props: ['color', 'font-weight', ...MARGIN] },
    { target: '[data-t="details"]', props: ['color', 'font-weight', ...MARGIN] },
  ], [
    { target: '[data-t="details"]', props: ['line-height'] },
  ]],
];
for (const [what, markup, checks, inDocToo = []] of INSIDE) {
  cases.push({ name: `alert with ${what} inside`, reference: `<div>${markup}</div>`, html: `<div class="vp-alert" data-variant="tip">${markup}</div>`, checks });
  cases.push({ name: `alert with ${what} inside, in a doc`, reference: `<div>${markup}</div>`, html: inDoc(`<div class="vp-alert" data-variant="tip">${markup}</div>`), checks: [...checks, ...inDocToo] });
}

// on a touch screen a hovered link looks as it does at rest
cases.push({
  name: 'alert link on a touch screen',
  touch: true,
  html: vpkitAlert('tip', body('')),
  reference: vpkitAlert('tip', body('')),
  checks: [
    { target: A, state: ['hover'], refState: [], props: ['color', 'opacity'] },
    { target: ACODE, on: A2, state: ['hover'], refState: [], props: ['color'] },
  ],
});

// the examples: the tip, the seven types and the details block against
// VitePress's; the nested alert and the button inside against lone ones;
// the icons golden
cases.push({
  name: 'alert tip example',
  upstream: { ...UPSTREAM, html: upstreamAlert('tip', '<p class="custom-block-title">TIP</p><p>Body text, with <a href="#">links</a> and <code>code</code>.</p>') },
  html: ex('tip'),
  checks: [
    { target: '.vp-alert', refTarget: '.custom-block', props: ALERT_BOX },
    { target: '.vp-alert-title', refTarget: '.custom-block-title', props: ['font-weight'] },
    { target: 'a', props: LINK },
    { target: 'a', state: ['hover'], props: ['color', 'opacity'] },
    { target: 'code', props: CODE },
  ],
});
cases.push({
  name: 'alert variants example',
  upstream: {
    ...UPSTREAM,
    html: inDoc(TYPES.map((t) => `<div class="custom-block ${t}"><p class="custom-block-title">${t.toUpperCase()}</p><p>The ${t} type, with a <a href="#">link</a>.</p></div>`).join('')),
  },
  html: ex('variants'),
  checks: TYPES.flatMap((t) => [
    { target: ofType(t), refTarget: `.custom-block.${t}`, props: [...COLORS, ...PADDING] },
    { target: `${ofType(t)} a`, refTarget: `.custom-block.${t} a`, props: ['color'] },
    { target: `${ofType(t)} a`, refTarget: `.custom-block.${t} a`, state: ['hover'], props: ['color', 'opacity'] },
  ]),
});
cases.push({
  name: 'alert details example',
  upstream: { ...UPSTREAM, html: inDoc('<details class="custom-block details"><summary>Details</summary><p>Body text.</p></details>') },
  html: ex('details'),
  checks: [
    { target: '.vp-alert', refTarget: '.custom-block', props: [...ALERT_BOX, 'height'] },
    { target: 'summary', props: SUMMARY },
  ],
});
cases.push({
  name: 'alert inside example',
  reference: '<div class="vp-alert" data-variant="tip"><p>Its files can be moved out first.</p></div><a class="vp-btn" data-variant="danger" href="#">Delete the folder</a>',
  html: ex('inside'),
  checks: [
    { target: '.vp-alert .vp-alert', refTarget: '.vp-alert', props: [...COLORS, ...PADDING] },
    { target: '.vp-btn', props: [...COLORS, 'background-image', 'opacity'] },
    { target: '.vp-btn', state: ['hover'], props: [...COLORS, 'background-image', 'opacity'] },
  ],
});
cases.push({
  name: 'alert icons example',
  html: ex('icons'),
  checks: [
    { target: '.vp-alert[data-variant="warning"]', props: ['display', 'padding-top', 'height'] },
    { target: '.vp-alert[data-variant="warning"] > .vp-alert-icon', props: ['width', 'height', 'color', 'offset-top'] },
    { target: '.vp-alert[data-variant="danger"]', props: ['display', 'padding-top', 'height'] },
    { target: '.vp-alert[data-variant="danger"] > .vp-alert-icon', props: ['width', 'height', 'color', 'offset-top'] },
    { target: '.vp-alert[data-variant="danger"] > div', props: ['offset-left', 'width'] },
  ],
});
