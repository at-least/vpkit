// vp-site-footer against VitePress's VPFooter (test/upstream/components/
// VPFooter.vue), wide and at a phone's width: the footer's box, line and
// ground; its paragraph against the message's type and the container's
// width and centering; a link at rest and hovered. What is vpkit's is
// golden, named: no place in the stack (VPFooter's z-index). vpkit
// against vpkit: a touch screen's hover at rest, a vp-link inside against
// itself outside. The example, golden.

import { BORDER, MARGIN, PADDING, TRANSITION, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const upstream = '<footer class="VPFooter"><div class="container"><p class="message">Made by <a href="#">Example Inc.</a> 16753096</p></div></footer>';
const vpkit = '<footer class="vp-site-footer"><p>Made by <a href="#">Example Inc.</a> 16753096</p></footer>';
const BOXP = ['position', ...BORDER, 'border-top-color', ...PADDING, 'background-color', 'height', 'width'];
const TEXT = ['line-height', 'font-size', 'font-weight', 'color', 'text-align', 'height'];
const PLACE = ['max-width', 'width', 'offset-left', ...MARGIN];
const LINK = ['color', 'text-decoration-line', 'text-underline-offset', ...TRANSITION];

// wide, and at a phone's width, where the padding is narrower
for (const [name, width] of [['site-footer', undefined], ["site-footer at a phone's width", 375]]) {
  cases.push({
    name,
    width,
    upstream: { files: ['components/VPFooter.vue'], html: upstream },
    html: vpkit,
    checks: [
      { target: '.vp-site-footer', refTarget: '.VPFooter', props: BOXP },
      { target: '.vp-site-footer', source: 'golden', props: ['z-index'], why: 'no place in the stack: the footer sits in the page\'s flow, where VPFooter\'s z-index stacks it in its layout' },
      { target: 'p', refTarget: '.message', props: TEXT },
      { target: 'p', refTarget: '.container', props: PLACE },
      { target: 'a', props: LINK },
      { target: 'a', state: ['hover'], props: ['color'] },
    ],
  });
}

// on a touch screen a hovered link looks as it does at rest
cases.push({
  name: 'site-footer on a touch screen',
  touch: true,
  html: vpkit,
  reference: vpkit,
  checks: [{ target: 'a', state: ['hover'], refState: [], props: ['color'] }],
});

// a vp-link inside keeps its own look: the footer's rule is for a bare
// link only
cases.push({
  name: 'site-footer with a vp-link',
  html: '<footer class="vp-site-footer"><p>Made by <a class="vp-link" href="#">Example Inc.</a></p></footer>',
  reference: '<p><a class="vp-link" href="#">Example Inc.</a></p>',
  checks: [
    { target: '.vp-link', props: ['color', 'text-decoration-line', 'text-underline-offset', ...TRANSITION] },
    { target: '.vp-link', state: ['hover'], props: ['color'] },
  ],
});

// the example
cases.push({
  name: 'site-footer message',
  html: ex('message'),
  checks: [
    { target: '.vp-site-footer', props: ['height', 'border-top-color', 'background-color'] },
    { target: 'p', props: ['color', 'font-size', 'text-align'] },
    { target: 'a', props: ['color', 'text-decoration-line'] },
  ],
});
