// vp-team-page against VitePress's VPTeamPage
// (test/upstream/components/VPTeamPage.vue, its rules for the parts a page
// puts in it, the parts' own originals beside it): the block's margins and
// height, the space between its parts, its members grids' padding and the
// grids' width and centering inside it, wide, between 48rem and 60rem and
// at a phone's width, the widths its lengths change at; a section right
// under the header; the header on the home page. The header and the
// sections hold a placeholder of a fixed height on both sides: the page's
// rules read only their roots, and the originals' own .title and .lead,
// unscoped here, would style each other's. Then the page inside a vp-doc,
// whose reset of a grid's padding the page's padding outranks, against the
// page alone.

import { MARGIN, PADDING, examples, inDoc } from '../../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const CARD = '<div style="height:3rem"></div>';
const header = (vp) => (vp ? `<header class="vp-team-header"><div style="height:4rem"></div></header>` : `<div class="VPTeamPageTitle"><div style="height:4rem"></div></div>`);
const members = (vp) =>
  vp
    ? `<ul class="vp-team-members"><li>${CARD}</li><li>${CARD}</li></ul>`
    : `<div class="VPTeamMembers medium count-2"><ul class="container"><li class="item">${CARD}</li><li class="item">${CARD}</li></ul></div>`;
const section = (vp) =>
  vp ? `<section class="vp-team-section"><div style="height:5rem"></div></section>` : `<section class="VPTeamPageSection"><div style="height:5rem"></div></section>`;
const page = (vp, parts) => `<div class="${vp ? 'vp-team-page' : 'VPTeamPage'}">${parts.map((p) => p(vp)).join('')}</div>`;

// the page's nth child on each side
const child = (n) => ({ vp: `.vp-team-page > :nth-child(${n})`, up: `.VPTeamPage > :nth-child(${n})` });
const at = (n, props) => ({ target: child(n).vp, refTarget: child(n).up, props });
// a grid: its content's width and the margins that center it, which are
// VitePress's container's only if the content box sits where the
// container does, and its first card's width
const grid = (n) => [
  { target: child(n).vp, refTarget: `${child(n).up} > .container`, props: ['width', 'margin-left', 'margin-right'] },
  { target: `${child(n).vp} > li:first-child`, refTarget: `${child(n).up} li:first-child`, props: ['width'] },
];

const FILES = ['components/VPTeamPage.vue', 'components/VPTeamPageTitle.vue', 'components/VPTeamPageSection.vue', 'components/VPTeamMembers.vue'];
const FULL = [header, members, members, section, section];
const FULL_CHECKS = [
  { target: '.vp-team-page', refTarget: '.VPTeamPage', props: [...MARGIN, 'height'] },
  at(2, [...PADDING, 'margin-top', 'offset-top']),
  ...grid(2),
  at(3, [...PADDING, 'margin-top', 'offset-top']),
  ...grid(3),
  at(4, ['margin-top', 'offset-top']),
  at(5, ['margin-top', 'offset-top']),
];
const UNDER_HEADER = [header, section];
const UNDER_HEADER_CHECKS = [{ target: '.vp-team-page', refTarget: '.VPTeamPage', props: [...MARGIN, 'height'] }, at(2, ['margin-top', 'offset-top'])];

for (const [suffix, width] of [['', undefined], [' at 800px', 800], [" at a phone's width", 375]]) {
  cases.push({ name: `team-page${suffix}`, width, upstream: { files: FILES, html: page(false, FULL) }, html: page(true, FULL), checks: FULL_CHECKS });
  cases.push({
    name: `team-page, a section under the header${suffix}`,
    width,
    upstream: { files: FILES, html: page(false, UNDER_HEADER) },
    html: page(true, UNDER_HEADER),
    checks: UNDER_HEADER_CHECKS,
  });
}

// on the home page: the header's rule above and its padding over the title
for (const [suffix, width] of [['', undefined], [" at a phone's width", 375]]) {
  cases.push({
    name: `team-page on the home page${suffix}`,
    width,
    upstream: { files: FILES, html: `<div class="VPHome">${page(false, FULL)}</div>` },
    html: `<div class="vp-home">${page(true, FULL)}</div>`,
    checks: [at(1, [...PADDING, 'border-top-width', 'border-top-style', 'border-top-color', 'height']), at(2, ['offset-top'])],
  });
}

// inside a vp-doc: the grids keep the page's padding over the members'
// reset of it there, the example against itself alone
cases.push({
  name: 'team-page in a doc',
  html: inDoc(ex('page')),
  reference: `<div>${ex('page')}</div>`,
  checks: [
    { target: '.vp-team-page', props: MARGIN },
    { target: '.vp-team-page > .vp-team-members', props: [...PADDING, 'width'] },
    { target: '.vp-team-page > .vp-team-section', props: ['margin-top'] },
  ],
});
