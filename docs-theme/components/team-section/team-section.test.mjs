// vp-team-section against VitePress's VPTeamPageSection
// (test/upstream/components/VPTeamPageSection.vue): the block, its title
// with the line behind it and the heading on it, its lead and its members
// (a placeholder of a fixed height on both sides), wide, between 48rem and
// 60rem, and at a phone's width, the widths its padding changes at. The
// line's place is compared with VitePress's own element for it; what it is
// made of is golden, vpkit's departure: a border on the title's ::before
// where VitePress paints 1px of background. Then the example inside a
// vp-doc, whose rule for an h2 draws a line above it, against itself alone.

import { MARGIN, PADDING, examples, inDoc } from '../../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const LEAD = 'The companies that lend their people to the work, and the people they lend.';
const section = (vp) =>
  vp
    ? `<section class="vp-team-section"><div class="vp-team-section-title"><h2>Partners</h2></div>` +
      `<p class="vp-team-section-lead">${LEAD}</p><div class="vp-team-section-members"><div style="height:3rem"></div></div></section>`
    : `<section class="VPTeamPageSection"><div class="title"><div class="title-line"></div><h2 class="title-text">Partners</h2></div>` +
      `<p class="lead">${LEAD}</p><div class="members"><div style="height:3rem"></div></div></section>`;
const CHECKS = [
  { target: '.vp-team-section', refTarget: '.VPTeamPageSection', props: [...PADDING, 'height'] },
  { target: '.vp-team-section-title', refTarget: '.title', props: ['position', ...MARGIN, 'max-width', 'text-align', 'color', 'height', 'width'] },
  // the line: its place is VitePress's element's; a border, golden
  { target: '.vp-team-section-title', pseudo: '::before', refTarget: '.title-line', refPseudo: null, props: ['position', 'top', 'left', 'width'] },
  {
    target: '.vp-team-section-title',
    pseudo: '::before',
    source: 'golden',
    props: ['border-top-width', 'border-top-style', 'border-top-color', 'background-color'],
    why: 'the line is a 1px divider border on the title\'s ::before, which forced colors keep, where VitePress paints 1px of background on an element of its own, which they erase',
  },
  { target: '.vp-team-section-title > h2', refTarget: '.title-text', props: ['position', 'display', ...MARGIN, 'border-top-width', ...PADDING, 'letter-spacing', 'line-height', 'font-size', 'font-weight', 'color', 'background-color', 'height', 'offset-top', 'offset-left'] },
  { target: '.vp-team-section-lead', refTarget: '.lead', props: [...MARGIN, 'max-width', ...PADDING, 'text-align', 'line-height', 'font-size', 'font-weight', 'color', 'height', 'offset-top', 'offset-left', 'width'] },
  { target: '.vp-team-section-members', refTarget: '.members', props: [...PADDING, 'height', 'offset-top'] },
];
const UPSTREAM = { files: ['components/VPTeamPageSection.vue'], html: section(false) };

for (const [name, width] of [['team-section', undefined], ['team-section at 800px', 800], ["team-section at a phone's width", 375]]) {
  cases.push({ name, width, upstream: UPSTREAM, html: section(true), checks: CHECKS });
}

// inside a vp-doc: the example, both sides vpkit's (the line is the
// title's ::before on each)
cases.push({
  name: 'team-section in a doc',
  html: inDoc(ex('section')),
  reference: `<div>${ex('section')}</div>`,
  checks: CHECKS.map(({ refTarget, refPseudo, source, why, ...check }) => check),
});
