// vp-carbon-ads against VitePress's VPCarbonAds
// (test/upstream/components/VPCarbonAds.vue), holding the markup Carbon's
// classic script writes (its image link, text and credit) and a second ad
// as a refresh adds one; the text and the credit hovered; on a touch
// screen against itself at rest; then inside a vp-doc, where vpkit's
// addition keeps the markdown's underline off the ad's links, against
// itself outside one. The example is golden.

import { MARGIN, PADDING, RADIUS, TRANSITION, examples } from '../../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['components/VPCarbonAds.vue'] };
const IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='100' viewBox='0 0 130 100'%3E%3Crect width='130' height='100' fill='%23888'/%3E%3C/svg%3E";
const t = (name) => `[data-t="${name}"]`;

// the box in 16rem, with Carbon's ad and a second one
const ad = (cls) =>
  `<div style="width:16rem"><div data-t="box" class="${cls}"><div data-t="ad" id="carbonads"><span><span class="carbon-wrap">` +
  `<a class="carbon-img" href="#"><img data-t="img" src="${IMG}" alt="" width="130" height="100"></a>` +
  `<a data-t="text" class="carbon-text" href="#">Build a better docs site, faster, with the new release.</a></span>` +
  `<a data-t="by" class="carbon-poweredby" href="#">ads via Carbon</a></span></div><div data-t="second">A refreshed ad</div></div></div>`;

const CHECKS = [
  { target: t('box'), props: ['display', 'justify-content', 'align-items', ...PADDING, ...RADIUS, 'min-height', 'text-align', 'line-height', 'font-size', 'font-weight', 'background-color', 'height'] },
  { target: t('img'), props: [...MARGIN, ...RADIUS, 'offset-left'] },
  { target: t('text'), props: ['display', ...MARGIN, ...PADDING, 'color', 'text-decoration-line', ...TRANSITION, 'height'] },
  { target: t('text'), state: ['hover'], props: ['color'] },
  { target: t('by'), props: ['display', ...PADDING, 'font-size', 'font-weight', 'color', 'text-transform', 'text-decoration-line', ...TRANSITION, 'height'] },
  { target: t('by'), state: ['hover'], props: ['color'] },
  { target: t('ad'), props: ['display'] },
  { target: t('second'), props: ['display'] },
];

// the box and the ad, its text and credit at rest and hovered, the second
// ad hidden
cases.push({ name: 'carbon ads', upstream: { ...UPSTREAM, html: ad('VPCarbonAds') }, html: ad('vp-carbon-ads'), checks: CHECKS });

// on a touch screen the hovered text and credit look as they do at rest
cases.push({
  name: 'carbon ads on a touch screen',
  touch: true,
  html: ad('vp-carbon-ads'),
  reference: ad('vp-carbon-ads'),
  checks: [
    { target: t('text'), state: ['hover'], refState: [], props: ['color'] },
    { target: t('by'), state: ['hover'], refState: [], props: ['color'] },
  ],
});

// inside a vp-doc (prose.css), whose rule for a link underlines it:
// against itself alone
cases.push({
  name: 'carbon ads in a doc',
  html: `<div class="vp-doc">${ad('vp-carbon-ads')}</div>`,
  reference: `<div>${ad('vp-carbon-ads')}</div>`,
  checks: CHECKS.filter((c) => !c.state),
});

// the example: the box at a utility's width, with an ad as Carbon writes it
cases.push({
  name: 'carbon ads example',
  html: ex('ad'),
  checks: [
    { target: '.vp-carbon-ads', props: ['display', 'width', 'min-height', 'height', ...RADIUS, 'background-color', 'font-size', 'font-weight'] },
    { target: '.carbon-text', props: ['display', 'color', 'padding-top', 'text-decoration-line'] },
    { target: '.carbon-poweredby', props: ['display', 'color', 'font-size', 'text-transform'] },
  ],
});
