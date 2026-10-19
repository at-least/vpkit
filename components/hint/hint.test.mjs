// vp-hint: vpkit's own, so golden: the dot (the crate's markup, beside its
// word), and its tooltip, the ::after drawn from data-hint, hidden at rest
// and shown hovered, focused from the keyboard and open
// (aria-expanded="true", which a tap sets: the example); the focus ring.
// vpkit against vpkit: a touch screen's hover against rest, where the
// tooltip stays hidden. The copy after the dot is a hidden element, with
// no style to compare.

import { BORDER, COLORS, OUTLINE, PADDING, RADIUS, examples } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const DOT = ['display', 'align-items', 'justify-content', 'width', 'height', ...BORDER, ...COLORS, ...RADIUS, 'font-size', 'line-height', 'cursor', 'position', 'vertical-align', ...PADDING];
const TIP = ['display', 'position', 'top', 'left', 'transform', 'max-width', ...PADDING, ...BORDER, ...COLORS, ...RADIUS, 'box-shadow', 'font-size', 'font-weight', 'line-height', 'text-transform', 'white-space', 'text-align', 'z-index', 'pointer-events'];
const tip = (state) => ({ target: '.vp-hint', ...(state ? { state } : {}), pseudo: '::after', props: TIP });
// the crate's markup, beside its word
const rest = `<p>Ignored ${ex('basic')}</p>`;

// at rest: the dot, its tooltip hidden
cases.push({ name: 'hint', html: rest, checks: [{ target: '.vp-hint', props: DOT }, tip(null)] });

// shown: hovered, focused from the keyboard (with base.css's ring on the
// dot), and open
cases.push({ name: 'hint hovered', html: rest, checks: [tip(['hover'])] });
cases.push({
  name: 'hint focused from the keyboard',
  html: rest,
  checks: [tip(['focus-visible']), { target: '.vp-hint', state: ['focus-visible'], props: OUTLINE }],
});
cases.push({ name: 'hint open', html: ex('open'), checks: [{ target: '.vp-hint', props: DOT }, tip(null)] });

// on a touch screen a hovered dot keeps its tooltip hidden, as at rest
cases.push({
  name: 'hint on a touch screen',
  touch: true,
  html: rest,
  reference: rest,
  checks: [{ ...tip(['hover']), refState: [] }],
});
