// vp-popover against VitePress's VPMenu (test/upstream/components/
// VPMenu.vue), the surface without the menu: on a <div>, and on a manual
// [popover], whose browser defaults (its border, padding, colors) the
// class must override. VPMenu's menu parts, its minimum width and its
// height capped to the viewport, are vp-dropdown's and neutralised inline
// on the upstream side; the popover's placement is neutralised on
// vpkit's, so the two are the same box. Golden: a [popover] shown where
// the page puts it (the browser's inset reset), and the example, an upload
// tray on an <aside> of the page's width.

import { BORDER, COLORS, MARGIN, PADDING, RADIUS, TRANSITION, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const UPSTREAM = { files: ['components/VPMenu.vue'] };
const SURFACE = [...BORDER, ...COLORS, ...RADIUS, ...PADDING, 'box-shadow', ...TRANSITION];
const BODY = '<p>notes.txt · uploaded</p><p>photos.zip · 40%</p>';
const menu = `<div style="display:inline-block"><div class="VPMenu" style="max-height:none;min-width:0;overflow-y:visible">${BODY}</div></div>`;

for (const [name, tag] of [['popover', 'div'], ['popover on a [popover]', 'div popover="manual"']]) {
  cases.push({
    name,
    upstream: { ...UPSTREAM, html: menu },
    html: `<div style="display:inline-block"><${tag} class="vp-popover" style="position:static;margin:0">${BODY}</${tag.split(' ')[0]}></div>`,
    checks: [{ target: '.vp-popover', refTarget: '.VPMenu', props: SURFACE }],
  });
}

// a [popover] shown where the page puts it: the browser's `inset: 0` is
// reset, so a fixed box with a right and a bottom sits at that corner (its
// left and top the used values at the pinned 1280×720), with no margin
// (Tailwind's preflight zeroes the browser's auto ones)
cases.push({
  name: 'popover on a [popover], shown',
  width: 1280,
  html: `<div class="vp-popover" popover="manual" id="tray" style="position:fixed;right:1rem;bottom:3.5rem;width:20rem">${BODY}</div><script>document.getElementById('tray').showPopover()</script>`,
  checks: [{ target: '.vp-popover', props: ['position', 'top', 'right', 'bottom', 'left', ...MARGIN, 'width', 'height'] }],
});

// the example: the surface on an <aside> the page sizes
cases.push({
  name: 'popover example',
  html: ex('tray'),
  checks: [{ target: '.vp-popover', props: [...SURFACE, 'width'] }],
});
