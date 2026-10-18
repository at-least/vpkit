// vp-card against VitePress's VPFeature (test/upstream/VPFeature.vue), as a
// link and as a plain box: the surface, its hover, the title and the
// details, alone and inside a vp-doc; VPFeature's padding and flex column
// live on an inner .box, vp-card's on the card itself. vpkit's own,
// golden: the outline variant. vpkit against vpkit: the outlined link card
// against a link card, and a touch screen's hover at rest.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, BORDER_COLOR, COLORS, PADDING, RADIUS, TRANSITION, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const UPSTREAM = { files: ['VPFeature.vue'] };
const text = (title, details) => `<h2 data-t="title" class="${title}">Fast</h2><p data-t="details" class="${details}">Instant server start, always.</p>`;
const upstreamCard = (tag) => `<${tag} class="VPFeature${tag === 'a' ? ' link' : ''}"${tag === 'a' ? ' href="#"' : ''}><article class="box">${text('title', 'details')}</article></${tag}>`;
const vpkitCard = (tag, attrs = '') => `<${tag} class="vp-card"${attrs}${tag === 'a' ? ' href="#"' : ''}>${text('vp-card-title', 'vp-card-details')}</${tag}>`;
const inDoc = (html) => `<div class="vp-doc">${html}</div>`;

const SURFACE = [...BORDER, ...RADIUS, ...COLORS, ...TRANSITION, 'height', 'width'];
const BOX = ['display', 'flex-direction', ...PADDING];
const TITLE = ['line-height', 'font-size', 'font-weight', 'color'];
const DETAILS = ['flex-grow', 'padding-top', 'line-height', 'font-size', 'font-weight', 'color'];
const TITLE_T = '[data-t="title"]';
const DETAILS_T = '[data-t="details"]';
const AGAINST_VPFEATURE = [
  { target: '.vp-card', refTarget: '.VPFeature', props: SURFACE },
  { target: '.vp-card', refTarget: '.box', props: BOX },
  { target: '.vp-card', refTarget: '.VPFeature', state: ['hover'], props: COLORS },
  { target: TITLE_T, props: TITLE },
  { target: DETAILS_T, props: DETAILS },
];

// VPFeature as a link and as a box
for (const tag of ['a', 'div']) {
  cases.push({ name: `card <${tag}>`, upstream: { ...UPSTREAM, html: upstreamCard(tag) }, html: vpkitCard(tag), checks: AGAINST_VPFEATURE });
}

// inside a vp-doc, whose rules for a heading, a paragraph and a link are
// in play: the card's own look, the title's box, the details' margins
cases.push({
  name: 'card in a doc',
  upstream: { ...UPSTREAM, html: upstreamCard('a') },
  html: inDoc(vpkitCard('a')),
  checks: [
    { target: '.vp-card', refTarget: '.VPFeature', props: [...COLORS, 'font-weight', 'text-decoration-line'] },
    { target: '.vp-card', refTarget: '.VPFeature', state: ['hover'], props: COLORS },
    { target: TITLE_T, props: ['margin-top', 'margin-bottom', 'border-top-width', 'padding-top', 'letter-spacing', ...TITLE] },
    { target: DETAILS_T, props: ['margin-top', 'margin-bottom', ...DETAILS] },
  ],
});

// the outline, vpkit's: the page's color in a divider border, the rest the
// card's; a link card still takes the brand border hovered
cases.push({
  name: 'card outline',
  html: ex('outline'),
  checks: [
    { target: 'div.vp-card', props: [...BORDER, ...RADIUS, ...COLORS, ...PADDING, 'display', 'flex-direction', 'height'] },
    { target: 'a.vp-card', props: [...COLORS, 'text-decoration-line', 'font-weight'] },
    { target: 'a.vp-card', state: ['hover'], props: COLORS },
  ],
});
cases.push({
  name: 'card outline <a> against a link card',
  reference: vpkitCard('a'),
  html: vpkitCard('a', ' data-variant="outline"'),
  checks: [
    { target: '.vp-card', props: [...RADIUS, ...PADDING, 'color', 'text-decoration-line', ...TRANSITION, 'display', 'flex-direction', 'height'] },
    { target: '.vp-card', state: ['hover'], props: BORDER_COLOR },
  ],
});

// the examples: the link card against VPFeature, the grid golden
cases.push({
  name: 'card link example',
  upstream: { ...UPSTREAM, html: '<a class="VPFeature link" href="#"><article class="box"><h2 class="title">Fast</h2><p class="details">Instant server start.</p></article></a>' },
  html: ex('link'),
  checks: [
    { target: '.vp-card', refTarget: '.VPFeature', props: SURFACE },
    { target: '.vp-card', refTarget: '.box', props: BOX },
    { target: '.vp-card', refTarget: '.VPFeature', state: ['hover'], props: COLORS },
    { target: '.vp-card-title', refTarget: '.title', props: TITLE },
    { target: '.vp-card-details', refTarget: '.details', props: DETAILS },
  ],
});
cases.push({
  name: 'card grid example',
  html: ex('grid'),
  checks: [
    { target: '.vp-card:nth-child(1)', props: ['height', 'width', 'offset-left'] },
    { target: '.vp-card:nth-child(2)', props: ['height', 'width', 'offset-left'] },
    { target: '.vp-card:nth-child(3)', props: ['height', 'width', 'offset-left', ...COLORS] },
    { target: 'div.vp-card', state: ['hover'], props: COLORS },
  ],
});

// on a touch screen a hovered link card looks as it does at rest
cases.push({
  name: 'card <a> on a touch screen',
  touch: true,
  html: vpkitCard('a'),
  reference: vpkitCard('a'),
  checks: [{ target: '.vp-card', state: ['hover'], refState: [], props: COLORS }],
});
