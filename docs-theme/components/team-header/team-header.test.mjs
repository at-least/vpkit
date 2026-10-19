// vp-team-header against VitePress's VPTeamPageTitle
// (test/upstream/components/VPTeamPageTitle.vue): the block, its title and
// its lead, wide, between 48rem and 60rem, and at a phone's width, the
// widths its padding and type change at; then the example inside a vp-doc,
// whose rules for a heading and a paragraph it keeps out, against itself
// alone. All VitePress's: nothing golden.

import { MARGIN, PADDING, examples } from '../../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const LEAD = 'The people who build the product, answer the mail and keep the servers running, from four cities.';
const header = (vp) =>
  vp
    ? `<header class="vp-team-header"><h1 class="vp-team-header-title">Our team</h1><p class="vp-team-header-lead">${LEAD}</p></header>`
    : `<div class="VPTeamPageTitle"><h1 class="title">Our team</h1><p class="lead">${LEAD}</p></div>`;
const TYPE = ['font-size', 'line-height', 'letter-spacing', 'font-weight', 'color', ...MARGIN, 'text-align', 'height', 'offset-top'];
const CHECKS = [
  { target: '.vp-team-header', refTarget: '.VPTeamPageTitle', props: [...PADDING, 'text-align', 'height'] },
  { target: '.vp-team-header-title', refTarget: '.title', props: TYPE },
  { target: '.vp-team-header-lead', refTarget: '.lead', props: [...TYPE, 'max-width', ...PADDING, 'offset-left', 'width'] },
];
const UPSTREAM = { files: ['components/VPTeamPageTitle.vue'], html: header(false) };

for (const [name, width] of [['team-header', undefined], ['team-header at 800px', 800], ["team-header at a phone's width", 375]]) {
  cases.push({ name, width, upstream: UPSTREAM, html: header(true), checks: CHECKS });
}

// inside a vp-doc: the example, both sides vpkit's
cases.push({
  name: 'team-header in a doc',
  html: `<div class="vp-doc">${ex('header')}</div>`,
  reference: `<div>${ex('header')}</div>`,
  checks: CHECKS.map(({ refTarget, ...check }) => check),
});
