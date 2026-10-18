// vp-popover against VitePress's VPMenu (test/upstream/components/
// VPMenu.vue), the surface without the menu: on a <div>, and on a manual
// [popover], whose browser defaults (its border, padding, colors) the
// class must override. VPMenu's menu parts, its minimum width and its
// height capped to the viewport, are vp-dropdown's and neutralised inline
// on the upstream side; the popover's placement is neutralised on
// vpkit's, so the two are the same box. Golden: the example, an upload
// tray on an <aside> of the page's width.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, COLORS, PADDING, RADIUS, TRANSITION, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

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

// the example: the surface on an <aside> the page sizes
cases.push({
  name: 'popover example',
  html: ex('tray'),
  checks: [{ target: '.vp-popover', props: [...SURFACE, 'width'] }],
});
