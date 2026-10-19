// vp-home-sponsors against VitePress's VPHomeSponsors
// (test/upstream/components/VPHomeSponsors.vue): the block's margins,
// border and padding, the container's width and centering, the heart's box
// and its icon, the message's box and type, the sponsors' and the action's
// places, wide, between 48rem and 60rem and at a phone's width, the widths
// its padding changes at. The sponsors are a placeholder of a fixed height
// on both sides (vp-sponsor's own test holds the box), the action a plain
// link (the button is the layout's VPButton). Then the example inside a
// vp-doc, whose rule for an h2 the message keeps out, against itself alone.

import { MARGIN, PADDING, examples } from '../../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const MESSAGE = 'The project is free and open source, made possible by its sponsors.';
const HEART =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2c-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
const SPONSORS = '<div style="height:6rem"></div>';
const ACTION = '<a href="https://example.com/sponsor">Become a sponsor</a>';
const sponsors = (vp) =>
  vp
    ? `<section class="vp-home-sponsors"><div class="vp-home-sponsors-container"><div class="vp-home-sponsors-love">${HEART}</div>` +
      `<h2 class="vp-home-sponsors-message">${MESSAGE}</h2><div class="vp-home-sponsors-list">${SPONSORS}</div>` +
      `<div class="vp-home-sponsors-action">${ACTION}</div></div></section>`
    : `<section class="VPHomeSponsors"><div class="container"><div class="header"><div class="love"><span class="vpi-heart icon"></span></div>` +
      `<h2 class="message">${MESSAGE}</h2></div><div class="sponsors">${SPONSORS}</div>` +
      `<div class="action">${ACTION}</div></div></section>`;
const CHECKS = [
  { target: '.vp-home-sponsors', refTarget: '.VPHomeSponsors', props: [...MARGIN, 'border-top-width', 'border-top-style', 'border-top-color', ...PADDING, 'height'] },
  { target: '.vp-home-sponsors-container', refTarget: '.container', props: ['width', 'margin-left', 'margin-right', 'height'] },
  { target: '.vp-home-sponsors-love', refTarget: '.love', props: [...MARGIN, 'width', 'height', 'font-size', 'color', 'offset-top'] },
  { target: '.vp-home-sponsors-love > svg', refTarget: '.icon', props: ['display', 'width', 'height', 'offset-top', 'offset-left'] },
  {
    target: '.vp-home-sponsors-message',
    refTarget: '.message',
    props: [...MARGIN, 'border-top-width', ...PADDING, 'max-width', 'text-align', 'letter-spacing', 'line-height', 'font-size', 'font-weight', 'color', 'width', 'height', 'offset-top'],
  },
  { target: '.vp-home-sponsors-list', refTarget: '.sponsors', props: [...PADDING, 'height', 'offset-top'] },
  { target: '.vp-home-sponsors-action', refTarget: '.action', props: [...PADDING, 'text-align', 'height', 'offset-top'] },
];
const UPSTREAM = { files: ['components/VPHomeSponsors.vue'], html: sponsors(false) };

for (const [name, width] of [['home-sponsors', undefined], ['home-sponsors at 800px', 800], ["home-sponsors at a phone's width", 375]]) {
  cases.push({ name, width, upstream: UPSTREAM, html: sponsors(true), checks: CHECKS });
}

// inside a vp-doc: the example (which has no action), both sides vpkit's
cases.push({
  name: 'home-sponsors in a doc',
  html: `<div class="vp-doc">${ex('sponsors')}</div>`,
  reference: `<div>${ex('sponsors')}</div>`,
  checks: CHECKS.filter((c) => c.target !== '.vp-home-sponsors-action').map(({ refTarget, ...check }) => check),
});
