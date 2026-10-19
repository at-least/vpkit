// vp-nav-link against VitePress's VPNavMenuLink (test/upstream/components/
// VPNavMenuLink.vue): the bar's link (VPNavBarMenuLink) and the screen's
// (VPNavScreenMenuLink), at rest, hovered and current (`.active` there,
// aria-current="page" here). vpkit against vpkit: a <button> against the
// <a>, a touch screen's hover at rest, and each link inside a vp-doc
// against itself alone. vpkit's own, golden: the examples, vp-nav-lane
// fitting, overflowing and on a touch screen, and a lane's link focused.

import { OUTLINE, PADDING, RADIUS, TRANSITION, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['components/VPNavMenuLink.vue'] };
// VitePress's: the box, the rule under the screen's link, the type, the
// color, the motion
const LINK = ['display', 'align-items', 'min-height', ...PADDING, 'border-bottom-width', 'border-bottom-style', 'border-bottom-color', 'line-height', 'font-size', 'font-weight', 'color', 'text-decoration-line', ...TRANSITION, 'height'];
const upstreamLink = (cls, attrs = '') => `<a class="VPLink link VPNavMenuLink ${cls}" href="#"${attrs}><span>Guide</span></a>`;
const vpkitLink = (variant, attrs = '') => `<a class="vp-nav-link"${variant} href="#"${attrs}><span>Guide</span></a>`;

// in the bar and in the screen: at rest and hovered, then current
for (const [place, cls, variant] of [['bar', 'VPNavBarMenuLink', ''], ['screen', 'VPNavScreenMenuLink', ' data-variant="screen"']]) {
  cases.push({
    name: `nav-link ${place}`,
    upstream: { ...UPSTREAM, html: upstreamLink(cls) },
    html: vpkitLink(variant),
    checks: [
      { target: '.vp-nav-link', refTarget: '.VPNavMenuLink', props: LINK },
      { target: '.vp-nav-link', refTarget: '.VPNavMenuLink', state: ['hover'], props: ['color'] },
    ],
  });
  cases.push({
    name: `nav-link ${place} current`,
    upstream: { ...UPSTREAM, html: upstreamLink(`${cls} active`, ' aria-current="page"') },
    html: vpkitLink(variant, ' aria-current="page"'),
    checks: [{ target: '.vp-nav-link', refTarget: '.VPNavMenuLink', props: ['color'] }],
  });
}

// a form's submit drawn as a link of the menu: the same row as the <a>
cases.push({
  name: 'nav-link <button>',
  reference: vpkitLink(''),
  html: '<button class="vp-nav-link" type="submit"><span>Sign out</span></button>',
  checks: [{ target: '.vp-nav-link', props: LINK }],
});

// the examples: the bar's links with a current one and a button, and the
// screen's links stacked
cases.push({
  name: 'nav-link bar example',
  html: ex('bar'),
  checks: [
    { target: '.vp-nav-link[aria-current="page"]', props: ['color', 'height'] },
    { target: 'a.vp-nav-link:not([aria-current])', props: ['color', 'height', 'offset-top'] },
    { target: 'button.vp-nav-link', props: ['color', 'height', 'font-size', 'font-weight'] },
  ],
});
cases.push({
  name: 'nav-link screen example',
  html: ex('screen'),
  checks: [
    { target: '.vp-nav-link[aria-current="page"]', props: ['color', 'height', 'border-bottom-color'] },
    { target: '.vp-nav-link + .vp-nav-link', props: ['color', 'height', 'offset-top'] },
  ],
});

// on a touch screen a hovered link looks as it does at rest
for (const [place, variant] of [['', ''], [' screen', ' data-variant="screen"']]) {
  const html = vpkitLink(variant);
  cases.push({
    name: `nav-link${place} on a touch screen`,
    touch: true,
    html,
    reference: html,
    checks: [{ target: '.vp-nav-link', state: ['hover'], refState: [], props: ['color'] }],
  });
}

// the lane, vpkit's: the row, its links' box and places, fitting in 40rem
// and overflowing (the example's w-64 with data-overflow)
const LANE = ['display', 'column-gap', 'overflow-x', 'overflow-y', 'scrollbar-width', 'mask-image', 'width', 'height'];
const LANE_LINK = ['min-height', ...RADIUS, 'white-space', ...PADDING, 'height', 'offset-top', 'offset-left'];
const LABELS = ['Overview', 'Issues', 'Events', 'Releases', 'Jobs', 'Settings'];
const lane = (style) => `<nav class="vp-nav-lane" aria-label="Project" style="${style}">${LABELS.map((l, i) => `<a class="vp-nav-link" href="#"${i ? '' : ' aria-current="page"'}>${l}</a>`).join('')}</nav>`;
const LANE_CHECKS = [
  { target: '.vp-nav-lane', props: LANE },
  { target: '.vp-nav-link', props: LANE_LINK },
  { target: '.vp-nav-link + .vp-nav-link', props: ['offset-left'] },
];
cases.push({ name: 'nav-link lane', html: lane('width:40rem'), checks: LANE_CHECKS });
cases.push({ name: 'nav-link lane overflowing', html: ex('lane'), checks: LANE_CHECKS });

// a lane's links keep their 2.25rem on a touch screen: the kit raises no
// control by pointer
cases.push({
  name: 'nav-link lane link on a touch screen',
  touch: true,
  html: lane('width:40rem'),
  checks: [{ target: '.vp-nav-link', props: ['min-height', ...PADDING, 'height'] }],
});

// a lane's link focused: base.css's ring, inset 2px, since the lane, a
// scroll box, clips outside its links
cases.push({
  name: 'nav-link lane link focused',
  html: lane('width:40rem'),
  checks: [{ target: '.vp-nav-link', state: ['focus-visible'], props: OUTLINE }],
});

// inside a vp-doc (prose.css), whose rule for a link underlines, recolors
// and weights any <a>: the bar's link, the screen's and a lane's keep
// their look, at rest, hovered and current
const DOC_LOOK = ['color', 'font-weight', 'text-decoration-line', ...TRANSITION];
const DOC_CHECKS = [
  { target: '.vp-nav-link:not([aria-current])', props: DOC_LOOK },
  { target: '.vp-nav-link:not([aria-current])', state: ['hover'], props: ['color', 'text-decoration-line'] },
  { target: '.vp-nav-link[aria-current="page"]', props: DOC_LOOK },
];
for (const [place, variant] of [['', ''], [' screen', ' data-variant="screen"']]) {
  const html = vpkitLink(variant, ' aria-current="page"') + vpkitLink(variant);
  cases.push({ name: `nav-link${place} in a doc`, html: inDoc(html), reference: `<div>${html}</div>`, checks: DOC_CHECKS });
}
cases.push({ name: 'nav-link lane in a doc', html: inDoc(lane('width:40rem')), reference: `<div>${lane('width:40rem')}</div>`, checks: DOC_CHECKS });
