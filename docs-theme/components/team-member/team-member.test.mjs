// vp-team-member against VitePress's VPTeamMembersItem
// (test/upstream/components/VPTeamMembersItem.vue, with VPSocialLinks.vue
// and VPSocialLink.vue for its social link): every part (the profile, the
// picture's round box and its image, the text, the name, the affiliation
// with a linked org, the description with a link, the links row with a
// social link, the sponsor link and its icon), in a 20rem cell, the medium
// card and the small one; the org link hovered, the sponsor link hovered
// and focused; on a touch screen; then the example inside a vp-doc against
// itself alone. VitePress's markup is its template's (the social links in
// their own row, the sponsor's icon a vpi-heart mask); the role's span goes
// without its class, `title`, which the original has no rule for. Golden,
// each named: the social link's place (vp-icon-btn is on the control
// height, where VPSocialLink is 2.25rem) and the focus ring on the sponsor
// strip.

import { MARGIN, OUTLINE, PADDING, RADIUS, TRANSITION, examples, inDoc } from '../../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

const SRC = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%23888'/%3E%3C/svg%3E";
const SVG = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>';
// Lucide's heart, the path of the docs theme's vpi-heart, as the crate writes an icon
const HEART = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2c-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
const DESC = 'Writes the compiler and its manual, <a href="#">her notes</a> among them.';

// the card in a 20rem cell; the name an h3 here and VitePress's h1 (both
// base stylesheets reset a heading's size, weight and margins)
const card = (vp, small) =>
  vp
    ? `<div style="width:20rem"><article class="vp-team-member"${small ? ' data-size="sm"' : ''}><div class="vp-team-member-profile">` +
      `<img class="vp-team-member-avatar" src="${SRC}" alt=""><div class="vp-team-member-data">` +
      `<h3 class="vp-team-member-name">Ada Lovelace</h3>` +
      `<p class="vp-team-member-affiliation"><span>Engineer</span><span> @ </span><a class="vp-team-member-org" href="#">Analytical Engines</a></p>` +
      `<p class="vp-team-member-desc">${DESC}</p>` +
      `<div class="vp-team-member-links"><a class="vp-icon-btn" href="#" aria-label="GitHub">${SVG}</a></div>` +
      `</div></div><a class="vp-team-member-sponsor" href="#">${HEART} Sponsor</a></article></div>`
    : `<div style="width:20rem"><article class="VPTeamMembersItem ${small ? 'small' : 'medium'}"><div class="profile">` +
      `<figure class="avatar"><img class="avatar-img" src="${SRC}" alt=""></figure><div class="data">` +
      `<h1 class="name">Ada Lovelace</h1>` +
      `<p class="affiliation"><span>Engineer</span><span class="at"> @ </span><a class="VPLink link no-icon org" href="#">Analytical Engines</a></p>` +
      `<p class="desc">${DESC}</p>` +
      `<div class="links"><div class="VPSocialLinks"><a class="VPSocialLink no-icon" href="#" aria-label="GitHub"><span>${SVG}</span></a></div></div>` +
      `</div></div><div class="sp"><a class="VPLink link no-icon sp-link" href="#"><span class="vpi-heart sp-icon"></span> Sponsor</a></div></article></div>`;

const TEXT = [...MARGIN, 'letter-spacing', 'line-height', 'font-size', 'font-weight', 'color', 'height', 'offset-top'];
const CHECKS = [
  { target: '.vp-team-member', refTarget: '.VPTeamMembersItem', props: ['display', 'flex-direction', 'row-gap', ...RADIUS, 'overflow-x', 'overflow-y', 'width', 'height'] },
  { target: '.vp-team-member-profile', refTarget: '.profile', props: ['flex-grow', ...PADDING, 'background-color', 'height'] },
  { target: '.vp-team-member-avatar', refTarget: '.avatar', props: ['flex-shrink', ...MARGIN, 'width', 'height', ...RADIUS, 'box-shadow', 'offset-left'] },
  { target: '.vp-team-member-avatar', refTarget: '.avatar-img', props: ['object-fit', ...RADIUS, 'width', 'height'] },
  { target: '.vp-team-member-data', refTarget: '.data', props: [...PADDING, 'text-align', 'height', 'offset-top'] },
  { target: '.vp-team-member-name', refTarget: '.name', props: TEXT },
  { target: '.vp-team-member-affiliation', refTarget: '.affiliation', props: [...TEXT, ...PADDING] },
  { target: '.vp-team-member-org', refTarget: '.org', props: ['color', 'text-decoration-line', 'font-weight', ...TRANSITION] },
  { target: '.vp-team-member-org', refTarget: '.org', state: ['hover'], props: ['color'] },
  { target: '.vp-team-member-desc', refTarget: '.desc', props: [...TEXT, ...PADDING, 'max-width', 'width'] },
  { target: '.vp-team-member-desc a', refTarget: '.desc a', props: ['color', 'font-weight', 'text-decoration-style', ...TRANSITION] },
  { target: '.vp-team-member-links', refTarget: '.links', props: ['display', 'justify-content', ...MARGIN, ...PADDING, 'height', 'offset-top'] },
  // the social link: VitePress nests its social links in a row of their
  // own, at whose start the link sits, so the row's place is the link's;
  // the square is vpkit's
  { target: '.vp-team-member-links > .vp-icon-btn', refTarget: '.links > .VPSocialLinks', props: ['offset-top'] },
  {
    target: '.vp-team-member-links > .vp-icon-btn',
    source: 'golden',
    props: ['offset-left', 'width', 'height'],
    why: 'the social link is vp-icon-btn, a 2.75rem square on the control height, so it sits 0.25rem further left in the centered row than VPSocialLink\'s 2.25rem square',
  },
  { target: '.vp-team-member-sponsor', refTarget: '.sp-link', props: ['display', 'justify-content', 'align-items', 'text-align', ...PADDING, 'font-size', 'font-weight', 'color', 'background-color', 'text-decoration-line', ...TRANSITION, 'height'] },
  { target: '.vp-team-member-sponsor', refTarget: '.sp-link', state: ['hover'], props: ['color', 'background-color'] },
  { target: '.vp-team-member-sponsor', refTarget: '.sp-link', state: ['focus'], props: ['color', 'background-color'] },
  {
    target: '.vp-team-member-sponsor',
    source: 'golden',
    state: ['focus', 'focus-visible'],
    props: OUTLINE,
    why: 'base.css\'s focus ring on the focused strip, inset since the card clips its outside, where VitePress hid the outline (outline: none on focus) and showed focus by the fill alone; the fill is kept',
  },
  // the sponsor's icon: an inline SVG against VitePress's mask, the same box
  { target: '.vp-team-member-sponsor > svg', refTarget: '.sp-icon', props: ['margin-right', 'width', 'height', 'offset-left', 'offset-top'] },
];
const FILES = ['components/VPTeamMembersItem.vue', 'components/VPSocialLinks.vue', 'components/VPSocialLink.vue'];
for (const small of [false, true]) {
  cases.push({
    name: small ? 'team-member small' : 'team-member',
    upstream: { files: FILES, html: card(false, small) },
    html: card(true, small),
    checks: CHECKS,
  });
}

// on a touch screen the hovered sponsor link and org link look as they do
// at rest
const MEDIUM = card(true, false);
cases.push({
  name: 'team-member on a touch screen',
  touch: true,
  html: MEDIUM,
  reference: MEDIUM,
  checks: [
    { target: '.vp-team-member-sponsor', state: ['hover'], refState: [], props: ['color', 'background-color'] },
    { target: '.vp-team-member-org', state: ['hover'], refState: [], props: ['color'] },
  ],
});

// inside a vp-doc: the example, both sides vpkit's (the description's link
// draws the markdown's underline there, dotted, as VitePress's does: its
// line is not among its props)
cases.push({
  name: 'team-member in a doc',
  html: inDoc(ex('member')),
  reference: `<div>${ex('member')}</div>`,
  checks: CHECKS.map(({ refTarget, source, why, ...check }) => check),
});

// the small example: the attribute's sizes on the page's markup
cases.push({
  name: 'team-member small example',
  html: ex('small'),
  checks: [
    { target: '.vp-team-member', props: ['width', 'height', ...RADIUS] },
    { target: '.vp-team-member-profile', props: [...PADDING, 'background-color'] },
    { target: '.vp-team-member-avatar', props: ['width', 'height'] },
    { target: '.vp-team-member-name', props: ['font-size', 'line-height', 'letter-spacing'] },
    { target: '.vp-team-member-desc', props: ['font-size', 'line-height', 'max-width', 'padding-top'] },
  ],
});
