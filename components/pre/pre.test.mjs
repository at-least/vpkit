// vp-pre against VitePress's code block (test/upstream/vp-doc.css: the
// language container, its <pre> and its <code>), on a <pre> holding a
// <code>: the container's ground, radius, margin, motion and height on the
// <pre>, the code's box, type and motion; inside an alert against
// VitePress's code block in a custom block (custom-block.css with
// vp-doc.css, in VitePress's import order). vpkit against vpkit: inside a
// vp-doc against itself alone. Golden, named: the example's margin (the
// page's my-0), the margin inside an alert, and the radius and margin at a
// phone's width, where VitePress's block bleeds to the page's edges.

import { MARGIN, PADDING, RADIUS, TRANSITION, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['vp-doc.css'] };
const TEXT = '{\n  "level": "error",\n  "message": "panic in send_digest: connection reset by peer, after 3 retries over 40 seconds"\n}';
const BOX = ['background-color', ...RADIUS, 'overflow-x', ...MARGIN, ...TRANSITION, 'height'];
const CODE = ['display', ...PADDING, 'line-height', 'font-size', 'font-family', 'color', 'background-color', ...RADIUS, 'tab-size', ...TRANSITION, 'offset-top', 'offset-left'];
const at = (width, html) => `<div style="width:${width}">${html}</div>`;
const upstreamPre = `<div class="language-json"><pre><code>${TEXT}</code></pre></div>`;
const vpkitPre = `<pre class="vp-pre"><code>${TEXT}</code></pre>`;
const box = (props = BOX) => ({ target: '.vp-pre', refTarget: '.language-json', props });
const code = { target: 'code', props: CODE };
const noMargin = BOX.filter((p) => !p.startsWith('margin'));

// the block and its code, in a 30rem box that the long line overflows
cases.push({
  name: 'pre',
  upstream: { ...UPSTREAM, html: at('30rem', inDoc(upstreamPre)) },
  html: at('30rem', vpkitPre),
  checks: [box(), code],
});

// the example: the block without its margin, the page's my-0
cases.push({
  name: 'pre example',
  upstream: { ...UPSTREAM, html: at('30rem', inDoc(upstreamPre)) },
  html: at('30rem', ex('payload')),
  checks: [
    box(noMargin),
    code,
    { target: '.vp-pre', source: 'golden', props: MARGIN, why: "the example drops the block's 1rem margin with the page's my-0, as a frame that pads it needs none" },
  ],
});

// inside a vp-doc (prose.css), whose variables and rules for code are in
// play, against itself alone
cases.push({
  name: 'pre in a doc',
  html: at('30rem', inDoc(vpkitPre)),
  reference: at('30rem', vpkitPre),
  checks: [{ target: '.vp-pre', props: BOX }, code],
});

// inside an alert: VitePress's code block in a custom block, whose code
// is 0.875em of the block's 14px and whose chip for bare code the <code>
// rule beats; the margin is the block's own
cases.push({
  name: 'pre in an alert',
  upstream: { files: ['custom-block.css', 'vp-doc.css'], html: at('30rem', inDoc(`<div class="custom-block tip">${upstreamPre}</div>`)) },
  html: at('30rem', `<div class="vp-alert" data-variant="tip">${vpkitPre}</div>`),
  checks: [
    box(noMargin),
    code,
    { target: '.vp-pre', source: 'golden', props: MARGIN, why: "the block keeps its 1rem margin inside an alert, where VitePress's custom block pulls its code block to 0.5rem: an alert is a container of the page's, not the markdown's" },
  ],
});

// at a phone's width: the ground, the scrolling and the code as
// VitePress's; the radius and the margin kept, where VitePress's block
// bleeds to the page's edges
cases.push({
  name: 'pre at 375px',
  width: 375,
  upstream: { ...UPSTREAM, html: inDoc(upstreamPre) },
  html: vpkitPre,
  checks: [
    box(['background-color', 'overflow-x', ...TRANSITION, 'height']),
    code,
    { target: '.vp-pre', source: 'golden', props: [...RADIUS, ...MARGIN, 'width'], why: "the block keeps its radius and its 1rem margin at a phone's width, where VitePress's bleeds to the page's edges (margin 1rem -1.5rem, no radius): placement is the page's" },
  ],
});
