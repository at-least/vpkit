// vp-code against VitePress's inline code in the markdown
// (test/upstream/vp-doc.css, `.vp-doc :not(pre) > code`), alone and inside
// a vp-link, where it takes the link's colors. vpkit against vpkit: inside
// a vp-doc against itself outside one.

import { PADDING, RADIUS, TRANSITION, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['vp-doc.css'] };
const LOOK = ['font-family', 'font-size', 'color', 'background-color', ...RADIUS, ...PADDING, ...TRANSITION];

cases.push({
  name: 'code',
  upstream: { ...UPSTREAM, html: inDoc('<p>Order <code>ORD-2026-0142</code></p>') },
  html: '<p>Order <code class="vp-code">ORD-2026-0142</code></p>',
  checks: [{ target: 'code', props: LOOK }],
});

// inside a vp-link: the link's colors for code, at rest and while the link
// is hovered, as code in a markdown link
cases.push({
  name: 'code in a link',
  upstream: { ...UPSTREAM, html: inDoc('<p><a href="#">See <code>vp-code</code></a></p>') },
  html: '<p><a class="vp-link" href="#">See <code class="vp-code">vp-code</code></a></p>',
  checks: [
    { target: 'code', props: LOOK },
    { target: 'code', on: 'a', state: ['hover'], props: ['color'] },
  ],
});

// the example, and the example inside a vp-doc, whose rules for code are
// in play, against itself outside one
cases.push({
  name: 'code example',
  upstream: { ...UPSTREAM, html: inDoc('<p>Your order <code>ORD-2026-0142</code> has shipped.</p>') },
  html: ex('basic'),
  checks: [{ target: 'code', props: LOOK }],
});
cases.push({
  name: 'code in a doc',
  reference: ex('basic'),
  html: inDoc(ex('basic')),
  checks: [{ target: 'code', props: LOOK }],
});
