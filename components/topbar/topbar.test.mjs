// vp-topbar against VitePress's VPNavBar (test/upstream/components/
// VPNavBar.vue: the bar, its wrapper's padding, its container, the ground
// its ::before paints) and VPNavBarTitle (the site's name): at a desktop's
// width and a phone's. vpkit's own, golden, each named: the rule as a
// border, the row centering its items; and the example, a bar with its
// name, its links and the appearance switch.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARGIN, PADDING, TRANSITION, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const UPSTREAM = {
  files: ['components/VPNavBar.vue', 'components/VPNavBarTitle.vue'],
  // not .home, whose ground is transparent at the top of the page
  html:
    '<div class="VPNavBar"><div class="wrapper"><div class="container">' +
    '<div class="title"><div class="VPNavBarTitle"><a class="title" href="#"><span>Site</span></a></div></div>' +
    '<div class="content"><div class="content-body"></div></div></div></div><div class="divider"><div class="divider-line"></div></div></div>',
};
const BAR = '<header class="vp-topbar"><div class="vp-topbar-row"><a class="vp-topbar-title" href="#"><span>Site</span></a></div></header>';
const ROW = ['display', 'justify-content', ...MARGIN, 'max-width', 'height', 'width'];
const TITLE = ['display', 'align-items', 'height', 'font-size', 'font-weight', 'color', 'text-decoration-line', ...TRANSITION];
const CHECKS = [
  { target: '.vp-topbar', refTarget: '.VPNavBar', props: ['white-space'] },
  { target: '.vp-topbar', refTarget: '.wrapper', props: PADDING },
  // the ground VPNavBar paints on its ::before: the bar's own here
  { target: '.vp-topbar', refTarget: '.VPNavBar', refPseudo: '::before', props: ['background-color', 'backdrop-filter', ...TRANSITION] },
  {
    target: '.vp-topbar',
    source: 'golden',
    props: ['border-bottom-width', 'border-bottom-style', 'border-bottom-color'],
    why: 'the rule along the bottom is a 1px border in the gutter color, where VPNavBar draws it as an element under the row (.divider-line, 1px of --vp-nav-divider-color, the gutter): a background, not a border, so not comparable by name',
  },
  { target: '.vp-topbar-row', refTarget: '.container', props: ROW },
  {
    target: '.vp-topbar-row',
    source: 'golden',
    props: ['align-items'],
    why: "the row centers its items, since a control in an app's bar is shorter than the row, where VPNavBar's container leaves them to stretch (its parts are all the bar's height)",
  },
  { target: '.vp-topbar-title', refTarget: 'a.title', props: TITLE },
  { target: '.vp-topbar-title > span', refTarget: 'a.title > span', props: ['overflow-x', 'overflow-y', 'text-overflow'] },
];

// at a desktop's width, 2rem of padding each side; at a phone's, VitePress's
// 1.5rem at the left and 0.5rem at the right
cases.push({ name: 'topbar', upstream: UPSTREAM, html: BAR, checks: CHECKS });
cases.push({ name: 'topbar at 375px', width: 375, upstream: UPSTREAM, html: BAR, checks: CHECKS });

// the example: the name, two links and the appearance switch in the row,
// each as tall as it is and centered on the row
cases.push({
  name: 'topbar example',
  html: ex('bar'),
  checks: [
    { target: '.vp-topbar', props: ['height', 'padding-left', 'padding-right', 'background-color', 'border-bottom-color'] },
    { target: '.vp-topbar-row', props: ['height', 'width', 'offset-left'] },
    { target: '.vp-topbar-title', props: ['height', 'offset-top', 'color'] },
    { target: '.vp-nav-link', props: ['height', 'offset-top', 'color'] },
    { target: '.vp-toggle', props: ['height', 'offset-top', 'offset-left'] },
  ],
});
