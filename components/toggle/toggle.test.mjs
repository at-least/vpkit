// vp-toggle against VitePress's VPSwitch and VPSwitchAppearance
// (test/upstream/components/). What is VitePress's is compared with it:
// the track at rest and hovered, the knob, the clip and the icon's place,
// size and color, the appearance switch's knob and its two icons, which
// follow .dark on both sides. What is vpkit's is golden, each named: the
// knob's aria-checked state (VPSwitch has none), an inline SVG where
// VitePress has a mask, the icon's fade in both modes, the focus ring.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, COLORS, OUTLINE, PADDING, RADIUS, TRANSITION, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const UPSTREAM = { files: ['components/VPSwitch.vue'] };
const APPEARANCE = { files: ['components/VPSwitch.vue', 'components/VPSwitchAppearance.vue'] };

// VitePress's: the track's box, colors and motion; the knob; the clip; the
// icon's place, size, color and opacity
const TRACK = ['display', 'position', 'width', 'height', ...BORDER, ...RADIUS, ...PADDING, 'flex-shrink', ...COLORS, ...TRANSITION];
const KNOB = ['position', 'offset-top', 'offset-left', 'width', 'height', ...RADIUS, 'background-color', 'box-shadow', ...TRANSITION];
// the knob while on: its place is the state's (below), the rest VPSwitch's
const KNOB_ON = KNOB.filter((p) => p !== 'offset-left');
const CLIP = ['position', 'display', 'width', 'height', ...RADIUS, 'overflow-x', 'overflow-y'];
const GLYPH = ['position', 'offset-top', 'offset-left', 'width', 'height', 'color', 'opacity'];
// vpkit's: an inline SVG in the knob, where VPSwitch has icons.css's mask
// (an inline-block painted by its background), fading in both modes
const svgGlyph = (target) => ({
  target,
  source: 'golden',
  props: ['display', 'background-color', ...TRANSITION],
  why: 'the icon is an inline SVG in currentColor, with no background, where VPSwitch has icons.css\'s mask painted by its background color; its opacity fades in both modes, where VPSwitch fades it under .dark alone (the kit has no .dark rule but a state read)',
});
// vpkit's: the knob's place by aria-checked
const checkedKnob = (target, on) => ({
  target,
  source: 'golden',
  props: on === 'true' ? ['transform', 'offset-left'] : ['transform'],
  why: `the knob ${on ? 'at the right' : 'at the left'} while the button's aria-checked is "${on}", vpkit's state: VPSwitch has none of its own, only the appearance switch moves its knob, by .dark`,
});

const SWITCH = ' type="button" role="switch" aria-checked="false" aria-label="Notifications"';
const upstream = (cls, inner = '') => `<button class="${cls}"${SWITCH}><span class="check">${inner ? `<span class="icon">${inner}</span>` : ''}</span></button>`;

// the example's two switches, off and on, against VPSwitch
cases.push({
  name: 'toggle off and on',
  upstream: { ...UPSTREAM, html: upstream('VPSwitch') + upstream('VPSwitch') },
  html: ex('switch'),
  checks: [
    { target: '.vp-toggle:first-child', refTarget: '.VPSwitch:first-child', props: TRACK },
    { target: '.vp-toggle:first-child', refTarget: '.VPSwitch:first-child', state: ['hover'], props: [...COLORS, ...TRANSITION] },
    { target: '.vp-toggle:first-child .vp-toggle-check', refTarget: '.VPSwitch:first-child .check', props: KNOB },
    checkedKnob('.vp-toggle:first-child .vp-toggle-check', 'false'),
    { target: '.vp-toggle:last-child', refTarget: '.VPSwitch:last-child', props: TRACK },
    { target: '.vp-toggle:last-child .vp-toggle-check', refTarget: '.VPSwitch:last-child .check', props: KNOB_ON },
    checkedKnob('.vp-toggle:last-child .vp-toggle-check', 'true'),
  ],
});

// the example's switch with an icon in the knob, on, against VPSwitch with
// an icon in its clip
cases.push({
  name: 'toggle with an icon',
  upstream: { ...UPSTREAM, html: upstream('VPSwitch', '<span class="vpi-sun"></span>') },
  html: ex('icon'),
  checks: [
    { target: '.vp-toggle', refTarget: '.VPSwitch', props: TRACK },
    { target: '.vp-toggle-check', refTarget: '.check', props: KNOB_ON },
    checkedKnob('.vp-toggle-check', 'true'),
    { target: '.vp-toggle-icon', refTarget: '.icon', props: CLIP },
    { target: '.vp-toggle-icon > svg', refTarget: '.icon > span', props: GLYPH },
    svgGlyph('.vp-toggle-icon > svg'),
  ],
});

// the appearance switch: the knob and the two icons follow .dark on both
// sides (the runner renders each case light and dark)
cases.push({
  name: 'toggle appearance',
  upstream: { ...APPEARANCE, html: upstream('VPSwitch VPSwitchAppearance', '<span class="vpi-sun sun"></span><span class="vpi-moon moon"></span>') },
  html: ex('appearance'),
  checks: [
    { target: '.vp-toggle', refTarget: '.VPSwitch', props: TRACK },
    { target: '.vp-toggle', refTarget: '.VPSwitch', state: ['hover'], props: [...COLORS, ...TRANSITION] },
    { target: '.vp-toggle-check', refTarget: '.check', props: [...KNOB, 'transform'] },
    { target: '.vp-toggle-icon', refTarget: '.icon', props: CLIP },
    { target: '.vp-toggle-light', refTarget: '.sun', props: GLYPH },
    svgGlyph('.vp-toggle-light'),
    { target: '.vp-toggle-dark', refTarget: '.moon', props: GLYPH },
    svgGlyph('.vp-toggle-dark'),
  ],
});

// the appearance switch keeps the state too: on, its knob is at the right
// in light as well
cases.push({
  name: 'toggle appearance checked',
  html: ex('appearance').replace('aria-checked="false"', 'aria-checked="true"'),
  checks: [{ target: '.vp-toggle-check', props: ['transform', 'offset-left'] }],
});

// the focus ring: base.css's outline on the track
cases.push({
  name: 'toggle focused',
  html: `<button class="vp-toggle"${SWITCH}><span class="vp-toggle-check"></span></button>`,
  checks: [{ target: '.vp-toggle', state: ['focus-visible'], props: OUTLINE }],
});

// on a touch screen a hovered switch looks as it does at rest
{
  const html = `<button class="vp-toggle"${SWITCH}><span class="vp-toggle-check"></span></button>`;
  cases.push({
    name: 'toggle on a touch screen',
    touch: true,
    html,
    reference: html,
    checks: [{ target: '.vp-toggle', state: ['hover'], refState: [], props: COLORS }],
  });
}
