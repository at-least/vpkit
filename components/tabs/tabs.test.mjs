// vp-tabs against VitePress's code group tab bar (test/upstream/
// vp-code-group.css: .tabs, its radio inputs and labels). What is
// VitePress's is compared with it: the bar's box, ground, line and
// corners, a tab's box, type and colors at rest, hovered and selected,
// the bar under it. The cases run at the default 1280px, where the
// original's bar has its rounded top corners and no bleed, as vp-tabs
// always does. What is vpkit's: a row of links with aria-current, against
// the same original; against vpkit or golden: its values (true as a
// selected tab, those WAI-ARIA treats as false), a touch screen, the focus
// ring (inset, the bar clipping outside a tab), a link tab inside a vp-doc.

import { OUTLINE, PADDING, RADIUS, TRANSITION, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

// the original with the example's labels, the first tab checked
const upstream = (first, second) => ({
  files: ['vp-code-group.css'],
  html:
    '<div class="vp-code-group"><div class="tabs">' +
    `<input type="radio" name="group-1" id="tab-1" checked><label for="tab-1">${first}</label>` +
    `<input type="radio" name="group-1" id="tab-2"><label for="tab-2">${second}</label></div></div>`,
});
const BAR = ['position', 'display', ...PADDING, 'margin-left', 'margin-right', ...RADIUS, 'background-color', 'overflow-x', 'overflow-y', 'box-shadow', 'height', 'width'];
const TAB = ['position', 'display', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color', ...PADDING, 'line-height', 'font-size', 'font-weight', 'color', 'white-space', 'cursor', 'text-decoration-line', ...TRANSITION, 'height', 'width', 'offset-left'];
const AFTER = ['position', 'right', 'bottom', 'left', 'z-index', 'height', ...RADIUS, 'background-color', 'content', ...TRANSITION];

// the bar, a tab at rest and hovered, the selected one and the bars under
// both: against the original's labels
const against = (selected, tab) => [
  { target: '.vp-tabs', refTarget: '.tabs', props: BAR },
  { target: tab, refTarget: 'label[for="tab-2"]', props: TAB },
  { target: tab, refTarget: 'label[for="tab-2"]', state: ['hover'], props: ['color'] },
  { target: tab, refTarget: 'label[for="tab-2"]', pseudo: '::after', props: AFTER },
  { target: selected, refTarget: 'label[for="tab-1"]', props: TAB },
  { target: selected, refTarget: 'label[for="tab-1"]', pseudo: '::after', props: AFTER },
];

// tabs over panels: buttons with role="tab", the selected one aria-selected
cases.push({
  name: 'tabs',
  upstream: upstream('npm', 'pnpm'),
  html: ex('tablist'),
  checks: against('.vp-tabs-tab[aria-selected="true"]', '.vp-tabs-tab[aria-selected="false"]'),
});

// vpkit's addition: a row of links to pages, a <nav> whose current link
// has aria-current, against the same original
cases.push({
  name: 'tabs as links, the current one by aria-current',
  upstream: upstream('Open', 'Resolved'),
  html: ex('links'),
  checks: against('.vp-tabs-tab[aria-current="page"]', '.vp-tabs-tab:not([aria-current])'),
});

// aria-current's values: "true" is current, as a selected tab is; "false",
// "" and a template's stringified undefined leave a link plain
const link = (attrs = '') => `<nav class="vp-tabs" aria-label="Status"><a class="vp-tabs-tab" href="#"${attrs}>Open</a></nav>`;
const CURRENT = [
  { target: '.vp-tabs-tab', props: ['color'] },
  { target: '.vp-tabs-tab', pseudo: '::after', props: ['background-color'] },
];
cases.push({
  name: 'tabs link aria-current="true"',
  html: link(' aria-current="true"'),
  reference: '<div class="vp-tabs" role="tablist"><button class="vp-tabs-tab" type="button" role="tab" aria-selected="true">Open</button></div>',
  checks: CURRENT,
});
for (const value of ['false', '', 'undefined']) {
  cases.push({
    name: `tabs link aria-current="${value}"`,
    html: link(` aria-current="${value}"`),
    reference: link(),
    checks: CURRENT,
  });
}

// on a touch screen a hovered tab looks as it does at rest
{
  const html = '<div class="vp-tabs" role="tablist"><button class="vp-tabs-tab" type="button" role="tab" aria-selected="false">pnpm</button></div>';
  cases.push({
    name: 'tabs tab on a touch screen',
    touch: true,
    html,
    reference: html,
    checks: [{ target: '.vp-tabs-tab', state: ['hover'], refState: [], props: ['color'] }],
  });
}

// the focus ring: base.css's outline on a tab, inset 2px, since the bar, a
// scroll box, clips outside a tab as tall as it
cases.push({
  name: 'tabs tab focused',
  html: ex('tablist'),
  checks: [{ target: '.vp-tabs-tab[aria-selected="false"]', state: ['focus-visible'], props: OUTLINE }],
});

// inside a vp-doc (prose.css, compiled last, as an app imports it), whose
// rule for a link underlines, recolors and weights any <a>: a link tab
// keeps its look, at rest, current and hovered
cases.push({
  name: 'tabs links in a doc',
  html: `<div class="vp-doc">${ex('links')}</div>`,
  reference: ex('links'),
  checks: [
    { target: '.vp-tabs-tab:not([aria-current])', props: ['color', 'text-decoration-line', 'font-weight', ...TRANSITION] },
    { target: '.vp-tabs-tab:not([aria-current])', state: ['hover'], props: ['color'] },
    { target: '.vp-tabs-tab[aria-current="page"]', props: ['color', 'text-decoration-line', 'font-weight'] },
  ],
});
