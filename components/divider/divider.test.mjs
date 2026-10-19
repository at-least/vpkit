// vp-divider against VitePress's markdown rule (test/upstream/vp-doc.css,
// `.vp-doc hr`) and, upright, the navbar's rule between two of its
// clusters (test/upstream/components/VPNavBar.vue, the `::before` on the
// cluster after the menu, read on the cluster VPSocialLinks makes a flex
// row), each in a flex row as the bar's is; its place in the row is
// golden, named, since a pseudo-element's box can't be read off its
// element. vpkit's own, golden: the labelled divider. vpkit against
// vpkit: the vertical and the labelled one inside a vp-doc against
// themselves outside one.

import { BORDER, BORDER_COLOR, MARGIN, SIDES, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const RULE = [...MARGIN, ...BORDER, ...BORDER_COLOR, 'width', 'height', 'background-color'];

// the markdown's rule
cases.push({
  name: 'divider',
  upstream: { files: ['vp-doc.css'], html: '<div class="vp-doc"><hr></div>' },
  html: '<hr class="vp-divider">',
  checks: [{ target: '.vp-divider', refTarget: 'hr', props: RULE }],
});
cases.push({
  name: 'divider between paragraphs',
  html: ex('rule'),
  checks: [{ target: '.vp-divider', props: [...RULE, 'offset-top'] }, { target: '.vp-divider + p', props: ['offset-top'] }],
});

// the navbar's rule: VPNavBar's ::before on the social links after the
// menu (0.5rem at each side; after the appearance switch it is 1rem)
const VERTICAL = '<hr class="vp-divider" aria-orientation="vertical">';
const row = (rule) => `<div style="display:flex;align-items:center"><span>Menu</span>${rule}<span>Appearance</span></div>`;
cases.push({
  name: 'divider vertical',
  upstream: {
    files: ['components/VPNavBar.vue', 'components/VPSocialLinks.vue'],
    html:
      '<div class="VPNavBar"><div class="wrapper"><div class="container"><div class="content"><div class="content-body">' +
      '<div class="menu">Menu</div><div class="VPSocialLinks social-links"></div></div></div></div></div></div>',
  },
  html: row(VERTICAL),
  checks: [
    // the border's widths, not its styles: at 0 width none paints, and the
    // preflights differ on it (VitePress's base.css gives a ::before `0 solid`,
    // the <hr> here has none)
    { target: '.vp-divider', refTarget: '.social-links', refPseudo: '::before', props: [...MARGIN, ...SIDES.map((side) => `border-${side}-width`), ...BORDER_COLOR, 'width', 'height', 'background-color', 'display'] },
    {
      target: '.vp-divider',
      source: 'golden',
      props: ['offset-top', 'offset-left', 'height'],
      why: "the rule sits centered in its flex row, 0.5rem after the item before it, as VitePress's does in the bar; its place is read off the <hr>, where VitePress's rule is a ::before whose box the runner reads off its element",
    },
  ],
});
cases.push({
  name: 'divider vertical in a doc',
  html: inDoc(row(VERTICAL)),
  reference: `<div>${row(VERTICAL)}</div>`,
  checks: [{ target: '.vp-divider', props: [...RULE, 'display', 'height'] }],
});
cases.push({
  name: 'divider vertical example',
  html: ex('vertical'),
  checks: [
    { target: '.vp-divider', props: [...RULE, 'display', 'offset-top', 'offset-left'] },
    { target: '.vp-divider + .vp-link', props: ['offset-left'] },
  ],
});

// the labelled divider, vpkit's: the element's box and text, the two rules
// drawn as ::before and ::after, as borders, which forced colors keep
const LINE = ['block-size', 'flex-grow', 'flex-shrink', 'border-top-width', 'border-top-style', 'border-top-color', 'background-color'];
const LABEL_BOX = ['display', 'align-items', 'column-gap', 'font-size', 'line-height', 'color', ...MARGIN, ...SIDES.map((side) => `border-${side}-width`), 'height'];
cases.push({
  name: 'divider with a label',
  html: ex('label'),
  checks: [
    { target: '.vp-divider', props: LABEL_BOX },
    { target: '.vp-divider', pseudo: '::before', props: LINE },
    { target: '.vp-divider', pseudo: '::after', props: LINE },
  ],
});
cases.push({
  name: 'divider with a label in a doc',
  html: inDoc(ex('label')),
  reference: `<div>${ex('label')}</div>`,
  checks: [{ target: '.vp-divider', props: LABEL_BOX }],
});
