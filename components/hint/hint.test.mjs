// vp-hint: vpkit's own, so golden: the dot (the crate's markup, beside its
// word), and its tooltip, the ::after drawn from data-hint, hidden at rest
// and shown hovered, focused from the keyboard and open
// (aria-expanded="true", which a tap sets: the example); the focus ring;
// where the shown tooltip sits: under the dot and centered on it, and
// kept on the screen 1rem from its edges by the left edge, by the right
// edge of a phone's screen (the page no wider for it) and over the dot by
// the screen's bottom. vpkit against vpkit: a touch screen's hover against
// rest, where the tooltip stays hidden. The copy after the dot is a hidden
// element, with no style to compare.

import { BORDER, COLORS, OUTLINE, PADDING, RADIUS, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const DOT = ['display', 'align-items', 'justify-content', 'width', 'height', ...BORDER, ...COLORS, ...RADIUS, 'font-size', 'line-height', 'cursor', 'position', 'vertical-align', ...PADDING];
const TIP = ['display', 'position', 'max-width', ...PADDING, ...BORDER, ...COLORS, ...RADIUS, 'box-shadow', 'font-size', 'font-weight', 'line-height', 'text-transform', 'white-space', 'text-align', 'z-index', 'pointer-events'];
// where a shown tooltip's box is: from the dot, and from the screen's edges
const PLACE = ['offset-top', 'offset-left', 'viewport-left', 'viewport-right'];
const tip = (state, place) => ({ target: '.vp-hint', ...(state ? { state } : {}), pseudo: '::after', props: place ? [...TIP, ...PLACE] : TIP });
// the crate's markup, beside its word
const rest = `<p>Ignored ${ex('basic')}</p>`;

// at rest: the dot, its tooltip hidden
cases.push({ name: 'hint', html: rest, checks: [{ target: '.vp-hint', props: DOT }, tip(null)] });

// shown: hovered, focused from the keyboard (with base.css's ring on the
// dot), and open
cases.push({ name: 'hint hovered', html: rest, checks: [tip(['hover'], true)] });
cases.push({
  name: 'hint focused from the keyboard',
  html: rest,
  checks: [tip(['focus-visible'], true), { target: '.vp-hint', state: ['focus-visible'], props: OUTLINE }],
});
// the example: its dot near the screen's left edge, the tooltip kept 1rem in
cases.push({ name: 'hint open', html: ex('open'), checks: [{ target: '.vp-hint', props: DOT }, tip(null, true)] });

// open in the middle of a line: under the dot, centered on it
cases.push({ name: 'hint open mid-line', html: ex('open').replace('<p class="pb-16">', '<p class="pb-16 text-center">'), checks: [tip(null, true)] });

// open by the right edge of a phone's screen: kept 1rem in, and the page
// no wider for it
cases.push({
  name: "hint open by the screen's right edge",
  width: 375,
  html: ex('open').replace('<p class="pb-16">', '<p class="pb-16 text-right">'),
  checks: [tip(null, true), { target: 'html', props: ['scroll-width'] }],
});

// open by the screen's bottom, where under the dot is off it: over the dot
cases.push({ name: "hint open by the screen's bottom", html: ex('open').replace('<p class="pb-16">', '<p class="mt-[42rem]">'), checks: [tip(null, true)] });

// on a touch screen a hovered dot keeps its tooltip hidden, as at rest
cases.push({
  name: 'hint on a touch screen',
  touch: true,
  html: rest,
  reference: rest,
  checks: [{ ...tip(['hover']), refState: [] }],
});
