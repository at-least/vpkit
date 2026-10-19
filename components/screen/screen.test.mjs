// vp-screen against VitePress's VPNavScreen (test/upstream/components/
// VPNavScreen.vue) at a phone's width: the screen's box, ground, scrolling
// and motion, and its container; its labelled row against VPNavAppearance's
// screen row (VPNavAppearance.vue) holding VitePress's appearance switch
// (VPSwitch.vue, VPSwitchAppearance.vue), as vpkit's holds vp-toggle's.
// What is vpkit's is golden, named: the screen starts under the bar where
// VitePress's covers it and pads down past it. The example, golden: the
// menu hidden, and open with its links, its group and its row.

import { MARGIN, PADDING, RADIUS, TRANSITION, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

// VitePress's: the screen's box and ground, its scrolling, its motion
const SCREEN = ['position', 'right', 'bottom', 'left', 'padding-right', 'padding-bottom', 'padding-left', 'width', 'background-color', 'overflow-y', 'overscroll-behavior-y', ...TRANSITION];
const UNDER_THE_BAR = 'the screen starts under the bar, the bar\'s height and its 1px line down with no top padding, where VPNavScreen covers the bar and pads down past it, so the bar stays above it with no stacking order to keep';

cases.push({
  name: 'screen',
  width: 375,
  upstream: { files: ['components/VPNavScreen.vue'], html: '<div class="VPNavScreen"><div class="container"><a href="#">Store</a></div></div>' },
  html: '<div class="vp-screen"><div class="vp-screen-container"><a href="#">Store</a></div></div>',
  checks: [
    { target: '.vp-screen', refTarget: '.VPNavScreen', props: SCREEN },
    { target: '.vp-screen-container', refTarget: '.container', props: [...MARGIN, ...PADDING, 'max-width', 'width', 'offset-left'] },
    { target: '.vp-screen', source: 'golden', props: ['top', 'padding-top', 'height'], why: UNDER_THE_BAR },
    { target: '.vp-screen-container', source: 'golden', props: ['offset-top'], why: UNDER_THE_BAR },
  ],
});

// the labelled row, with the appearance switch at its end on both sides
const toggle = ex('menu').match(/<button class="vp-toggle"[\s\S]*?<\/button>/)[0];
cases.push({
  name: 'screen appearance row',
  width: 375,
  upstream: {
    files: ['components/VPNavAppearance.vue', 'components/VPSwitch.vue', 'components/VPSwitchAppearance.vue'],
    html:
      '<div style="width:18rem"><div class="VPNavAppearance VPNavScreenAppearance"><p class="text">Appearance</p>' +
      '<button class="VPSwitch VPSwitchAppearance" type="button" role="switch" aria-checked="false" aria-label="Appearance"><span class="check"><span class="icon"><span class="vpi-sun sun"></span><span class="vpi-moon moon"></span></span></span></button></div></div>',
  },
  html: `<div style="width:18rem"><div class="vp-screen-row"><p class="vp-screen-label">Appearance</p>${toggle}</div></div>`,
  checks: [
    { target: '.vp-screen-row', refTarget: '.VPNavScreenAppearance', props: ['display', 'justify-content', 'align-items', ...RADIUS, ...PADDING, 'background-color', 'height', 'width'] },
    { target: '.vp-screen-label', refTarget: '.text', props: ['line-height', 'font-size', 'font-weight', 'color', ...MARGIN, 'height'] },
    { target: '.vp-toggle', refTarget: '.VPSwitch', props: ['offset-left', 'offset-top', 'width', 'height'] },
  ],
});

// the example: closed, the screen is hidden; open, its links, its group
// and its row sit in the centered column under the bar
cases.push({
  name: 'screen hidden',
  width: 375,
  html: ex('menu'),
  checks: [{ target: '.vp-screen', props: ['display'] }],
});
cases.push({
  name: 'screen menu',
  width: 375,
  html: ex('menu').replace(' hidden>', '>'),
  checks: [
    { target: '.vp-screen', props: ['top', 'height', 'width', 'background-color'] },
    { target: '.vp-screen-container', props: ['width', 'offset-left', 'offset-top'] },
    { target: '.vp-nav-link[aria-current="page"]', props: ['color', 'height', 'border-bottom-color'] },
    { target: '.vp-accordion-title', props: ['color', 'height'] },
    { target: '.vp-screen-row', props: ['height', 'offset-top', 'background-color'] },
    { target: '.vp-screen-row > .vp-toggle', props: ['offset-left', 'offset-top'] },
  ],
});
