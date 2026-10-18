// vp-team-members against VitePress's VPTeamMembers
// (test/upstream/components/VPTeamMembers.vue), its block and its list of
// items, the items placeholders of a card's height: four members wide, one
// and two, which cap the grid's width; the small grid with five, one, two
// and three; four at a phone's width; the column's minimum, 16rem below
// 23.4375rem wide and 18rem from it, in a box narrower than one column,
// where it shows; then inside a vp-doc, whose list rules give bullets, an
// indent and space between items, against itself outside one. VitePress
// writes the count as a class; vpkit reads it off the list. The example,
// the small grid of three cards, is golden on the grid's own geometry: its
// cards are vp-team-member's, whose stylesheet sizes them.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARGIN, PADDING, example } from '../../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const UPSTREAM = { files: ['components/VPTeamMembers.vue'] };

// a list of n placeholders: VitePress's block with its size and count as
// classes, and vpkit's list with its size as an attribute
const items = (n, cls) => Array.from({ length: n }, (_, i) => `<li data-t="i${i + 1}"${cls}><div style="height:4rem"></div></li>`).join('');
const vitepress = (n, size = 'medium') => `<div class="VPTeamMembers ${size} count-${n}"><ul data-t="grid" class="container">${items(n, ' class="item"')}</ul></div>`;
const vpkit = (n, size = 'medium') => `<ul data-t="grid" class="vp-team-members"${size === 'small' ? ' data-size="sm"' : ''}>${items(n, '')}</ul>`;

const GRID = '[data-t="grid"]';
const item = (i) => `[data-t="i${i}"]`;
const GRID_PROPS = ['display', 'grid-template-columns', 'column-gap', 'row-gap', ...MARGIN, 'max-width', 'width', 'height'];
// the grid, and the first, the second and the last item's cell
const checks = (n) => [
  { target: GRID, props: GRID_PROPS },
  ...[...new Set([1, 2, n])].filter((i) => i <= n).map((i) => ({ target: item(i), props: ['offset-left', 'offset-top', 'width'] })),
];

for (const [name, n, size, width] of [
  ['team members', 4, 'medium'],
  ['team members with one', 1, 'medium'],
  ['team members with two', 2, 'medium'],
  ['team members, small', 5, 'small'],
  ['team members, small, with one', 1, 'small'],
  ['team members, small, with two', 2, 'small'],
  ['team members, small, with three', 3, 'small'],
  ["team members at a phone's width", 4, 'medium', 375],
]) {
  cases.push({ name, width, upstream: { ...UPSTREAM, html: vitepress(n, size) }, html: vpkit(n, size), checks: checks(n) });
}

// a box narrower than one column, where the column's minimum shows: 16rem
// below 23.4375rem wide, 18rem from it
for (const width of [360, 400]) {
  cases.push({
    name: `team members in a 15rem box at ${width}px`,
    width,
    upstream: { ...UPSTREAM, html: `<div style="width:15rem">${vitepress(2)}</div>` },
    html: `<div style="width:15rem">${vpkit(2)}</div>`,
    checks: [{ target: GRID, props: ['grid-template-columns', 'height'] }],
  });
}

// inside a vp-doc (prose.css), whose rules for a list give it bullets, an
// indent and space above every item but the first: against itself alone
cases.push({
  name: 'team members in a doc',
  html: `<div class="vp-doc">${vpkit(3)}</div>`,
  reference: `<div>${vpkit(3)}</div>`,
  checks: [
    { target: GRID, props: ['list-style-type', ...PADDING, ...MARGIN, 'width', 'height'] },
    { target: item(2), props: [...MARGIN, ...PADDING, 'offset-left', 'offset-top'] },
    { target: item(3), props: [...MARGIN, 'offset-top'] },
  ],
});

// the example: the small grid of three cards, the grid's own geometry (the
// cards' height is vp-team-member's)
cases.push({
  name: 'team members example',
  html: ex('small'),
  checks: [{ target: '.vp-team-members', props: ['display', 'grid-template-columns', 'column-gap', 'row-gap', ...MARGIN, 'max-width', 'width'] }],
});
