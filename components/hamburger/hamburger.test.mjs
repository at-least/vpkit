// vp-hamburger against VitePress's VPNavBarHamburger (test/upstream/
// components/VPNavBarHamburger.vue): the button, its frame and its three
// bars at rest, hovered, open (`.active` there, aria-expanded="true" here)
// and hovered open, at a phone's width, where VitePress shows it (it is
// display:none from 768px; vpkit leaves that to the page). vpkit against
// vpkit: a touch screen's hover at rest. Golden: the example, closed and
// open, and the bars under forced colors (vpkit's addition),
// closed and open, at rest and hovered.

import { TRANSITION, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['components/VPNavBarHamburger.vue'] };
const BAR = ['position', 'top', 'left', 'width', 'height', 'background-color', 'transform', ...TRANSITION];
const upstreamHamburger = (open) =>
  `<button class="VPNavBarHamburger${open ? ' active' : ''}" type="button" aria-label="Menu" aria-expanded="${open}">` +
  '<span class="container" aria-hidden="true"><span class="top"></span><span class="middle"></span><span class="bottom"></span></span></button>';
const vpkitHamburger = (open) =>
  `<button class="vp-hamburger" type="button" aria-label="Menu" aria-expanded="${open}">` +
  '<span class="vp-hamburger-box"><span></span><span></span><span></span></span></button>';
const BARS = ['.top', '.middle', '.bottom'];
const bar = (i) => `.vp-hamburger-box > span:nth-child(${i + 1})`;

// closed and open: the button, the frame, each bar at rest and with the
// button hovered
for (const open of [false, true]) {
  cases.push({
    name: `hamburger${open ? ' open' : ''}`,
    width: 375,
    upstream: { ...UPSTREAM, html: upstreamHamburger(open) },
    html: vpkitHamburger(open),
    checks: [
      { target: '.vp-hamburger', refTarget: '.VPNavBarHamburger', props: ['display', 'justify-content', 'align-items', 'width', 'height'] },
      { target: '.vp-hamburger-box', refTarget: '.container', props: ['position', 'width', 'height', 'overflow-x', 'overflow-y'] },
      ...BARS.map((cls, i) => ({ target: bar(i), refTarget: cls, props: BAR })),
      ...BARS.map((cls, i) => ({ target: bar(i), refTarget: cls, on: '.vp-hamburger', refOn: '.VPNavBarHamburger', state: ['hover'], props: BAR })),
    ],
  });
}

// on a touch screen a hovered button's bars sit as they do at rest
for (const open of [false, true]) {
  const html = vpkitHamburger(open);
  cases.push({
    name: `hamburger${open ? ' open' : ''} on a touch screen`,
    touch: true,
    width: 375,
    html,
    reference: html,
    checks: BARS.map((cls, i) => ({ target: bar(i), on: '.vp-hamburger', state: ['hover'], refState: [], props: ['transform', 'background-color'] })),
  });
}

// under forced colors the bars, backgrounds the browser would erase, are
// the system's text color, closed and open, at rest and hovered
for (const open of [false, true]) {
  cases.push({
    name: `hamburger${open ? ' open' : ''} under forced colors`,
    forcedColors: true,
    width: 375,
    html: vpkitHamburger(open),
    checks: [
      ...BARS.map((cls, i) => ({ target: bar(i), props: ['background-color'] })),
      ...BARS.map((cls, i) => ({ target: bar(i), on: '.vp-hamburger', state: ['hover'], props: ['background-color'] })),
    ],
  });
}

// the example: closed and open
cases.push({
  name: 'hamburger example',
  html: ex('states'),
  checks: [
    { target: '.vp-hamburger', props: ['width', 'height'] },
    ...[0, 1, 2].map((i) => ({ target: `.vp-hamburger[aria-expanded="false"] ${bar(i)}`, props: ['top', 'transform', 'background-color'] })),
    ...[0, 1, 2].map((i) => ({ target: `.vp-hamburger[aria-expanded="true"] ${bar(i)}`, props: ['top', 'transform', 'background-color'] })),
  ],
});
