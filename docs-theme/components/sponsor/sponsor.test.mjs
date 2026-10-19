// vp-sponsor against VitePress's VPSponsors and VPSponsorsGrid
// (test/upstream/vp-sponsor.css) in a 40rem box: two tiers, a big grid of
// two and a medium grid of three whose row an empty tile fills, the
// columns and the empty tile written as VitePress's script writes them
// (data-vp-grid, a div with `empty`, where vpkit's empty tile is an item
// with nothing in it); every part, a tile hovered with its logo, the empty
// tile hovered, in light and dark (where a hovered tile turns white and
// the logos invert); the aside box; the grid's other sizes and every
// count; on a touch screen against itself at rest; then inside a vp-doc
// against itself outside one. The example is golden.

import { MARGIN, PADDING, RADIUS, TRANSITION, examples } from '../../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['vp-sponsor.css'] };
const LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='60' viewBox='0 0 240 60'%3E%3Crect width='240' height='60' rx='8' fill='%23e44'/%3E%3C/svg%3E";
const t = (name) => `[data-t="${name}"]`;

// a tile with a logo, its parts tagged when named
const tile = (name) =>
  `<li${name ? ` data-t="${name}"` : ''} class="vp-sponsor-grid-item"><a${name ? ` data-t="${name}-link"` : ''} class="vp-sponsor-grid-link" href="#">` +
  `<article${name ? ` data-t="${name}-box"` : ''} class="vp-sponsor-grid-box"><img${name ? ` data-t="${name}-img"` : ''} class="vp-sponsor-grid-image" src="${LOGO}" alt="Example"></article></a></li>`;
// a grid: VitePress's with its size as a class and its empty tile a div
// with `empty`, vpkit's with the size an attribute and the empty tile an
// item with nothing in it
const grid = (vp, size, cols, tiles, empty = '', name = '') => {
  const tag = name ? ` data-t="${name}"` : '';
  const open = vp
    ? `<ul${tag} class="vp-sponsor-grid"${size === 'medium' ? '' : ` data-size="${size}"`} data-vp-grid="${cols}">`
    : `<ul${tag} class="VPSponsorsGrid vp-sponsor-grid ${size}" data-vp-grid="${cols}">`;
  const filler = !empty ? '' : vp ? `<li data-t="${empty}" class="vp-sponsor-grid-item"></li>` : `<div data-t="${empty}" class="vp-sponsor-grid-item empty"></div>`;
  return `${open}${tiles}${filler}</ul>`;
};
// the box in 40rem: two tiers, a big grid of two and a medium grid of
// three with an empty tile
const box = (vp, mode = 'normal') =>
  `<div style="width:40rem"><div data-t="box" class="${vp ? 'vp-sponsor' : `VPSponsors vp-sponsor ${mode}`}"${vp && mode === 'aside' ? ' data-variant="aside"' : ''}>` +
  `<section data-t="s1" class="vp-sponsor-section"><h3 data-t="tier" class="vp-sponsor-tier">Platinum</h3>${grid(vp, 'big', 2, tile('a') + tile(''), '', 'grid')}</section>` +
  `<section data-t="s2" class="vp-sponsor-section"><h3 class="vp-sponsor-tier">Gold</h3>${grid(vp, 'medium', 3, tile('b') + tile(''), 'e')}</section></div></div>`;

const TIER = [...MARGIN, ...PADDING, 'width', 'text-align', 'letter-spacing', 'line-height', 'font-size', 'font-weight', 'color', 'background-color', 'height'];
const CHECKS = [
  { target: t('box'), props: [...RADIUS, 'overflow-x', 'overflow-y', 'width', 'height'] },
  { target: t('tier'), props: TIER },
  { target: t('s2'), props: [...MARGIN, 'offset-top'] },
  { target: t('grid'), props: ['display', 'flex-wrap', 'row-gap', 'column-gap', 'height'] },
  { target: t('a'), props: ['flex-shrink', 'width', 'background-color', ...TRANSITION] },
  { target: t('a'), state: ['hover'], props: ['background-color'] },
  { target: t('a-img'), on: t('a'), state: ['hover'], props: ['filter'] },
  { target: t('a-link'), props: ['display', 'height'] },
  { target: t('a-box'), props: ['display', 'justify-content', 'align-items', 'width'] },
  { target: t('a-img'), props: ['max-width', 'max-height', 'filter', ...TRANSITION, 'width', 'height', 'offset-left', 'offset-top'] },
  { target: t('b'), props: ['width'] },
  { target: t('b-link'), props: ['height'] },
  { target: t('b-img'), props: ['max-width', 'max-height', 'width', 'height'] },
  { target: t('e'), props: ['width', 'height', 'background-color', 'offset-left'] },
  { target: t('e'), state: ['hover'], props: ['background-color'] },
];

// the box, every part at rest and hovered
cases.push({ name: 'sponsors', upstream: { ...UPSTREAM, html: box(false) }, html: box(true), checks: CHECKS });

// the aside box: its radius and its tiers
cases.push({
  name: 'sponsors, aside',
  upstream: { ...UPSTREAM, html: box(false, 'aside') },
  html: box(true, 'aside'),
  checks: [{ target: t('box'), props: [...RADIUS, 'height'] }, { target: t('tier'), props: TIER }],
});

// the grid's sizes: a tile's height and a logo's bounds
for (const size of ['xmini', 'mini', 'small', 'big']) {
  cases.push({
    name: `sponsor grid, ${size}`,
    upstream: { ...UPSTREAM, html: `<div style="width:40rem">${grid(false, size, 4, tile('a'))}</div>` },
    html: `<div style="width:40rem">${grid(true, size, 4, tile('a'))}</div>`,
    checks: [{ target: t('a-link'), props: ['height'] }, { target: t('a-img'), props: ['max-width', 'max-height', 'width', 'height'] }],
  });
}

// every count: the tiles' widths and where the second lands
for (const cols of [1, 2, 3, 4, 5, 6]) {
  cases.push({
    name: `sponsor grid of ${cols}`,
    upstream: { ...UPSTREAM, html: `<div style="width:40rem">${grid(false, 'medium', cols, tile('a') + tile('b'))}</div>` },
    html: `<div style="width:40rem">${grid(true, 'medium', cols, tile('a') + tile('b'))}</div>`,
    checks: [{ target: t('a'), props: ['width'] }, { target: t('b'), props: ['width', 'offset-left', 'offset-top'] }],
  });
}

// on a touch screen a hovered tile and its logo look as they do at rest
cases.push({
  name: 'sponsors on a touch screen',
  touch: true,
  html: box(true),
  reference: box(true),
  checks: [
    { target: t('a'), state: ['hover'], refState: [], props: ['background-color'] },
    { target: t('a-img'), on: t('a'), state: ['hover'], refState: [], props: ['filter'] },
  ],
});

// inside a vp-doc (prose.css), whose rules give a list bullets and
// margins, an image margins and a link an underline: against itself alone
cases.push({
  name: 'sponsors in a doc',
  html: `<div class="vp-doc">${box(true)}</div>`,
  reference: `<div>${box(true)}</div>`,
  checks: [
    { target: t('tier'), props: [...MARGIN, ...PADDING, 'letter-spacing', 'line-height', 'font-size', 'font-weight', 'height'] },
    { target: t('grid'), props: ['list-style-type', ...MARGIN, ...PADDING, 'height'] },
    { target: t('a'), props: [...MARGIN, ...PADDING, 'width'] },
    { target: t('a-link'), props: ['text-decoration-line', 'height'] },
    { target: t('a-img'), props: [...MARGIN, 'width', 'height'] },
    { target: t('e'), props: [...MARGIN, 'offset-left'] },
  ],
});

// the example: two tiers, the big grid of two, the medium grid of three
// with its empty tile
cases.push({
  name: 'sponsor example',
  html: ex('tiers'),
  checks: [
    { target: '.vp-sponsor', props: [...RADIUS, 'overflow-x', 'height'] },
    { target: '.vp-sponsor-tier', props: [...PADDING, 'font-size', 'font-weight', 'color', 'background-color', 'height'] },
    { target: '.vp-sponsor-grid[data-size="big"] .vp-sponsor-grid-link', props: ['height'] },
    { target: '.vp-sponsor-grid[data-size="big"] .vp-sponsor-grid-image', props: ['max-width', 'max-height', 'filter'] },
    { target: '.vp-sponsor-grid:not([data-size]) .vp-sponsor-grid-item', props: ['width', 'background-color'] },
    { target: '.vp-sponsor-grid-item:empty', props: ['width', 'offset-left', 'background-color'] },
    { target: '.vp-sponsor-grid-item:empty', state: ['hover'], props: ['background-color'] },
  ],
});
