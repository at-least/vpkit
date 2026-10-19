// vp-sidenav against VitePress's VPSidebarItem (test/upstream/components/
// VPSidebarItem.vue): a group's title (its level-0 text) over a list of
// links drawn as its nested level (the level-1 item's bordered list, its
// level-2 links, the current one with its indicator), at rest and
// hovered; and the <nav> against VPSidebar's (VPSidebar.vue), a focus
// target with no ring. What is vpkit's is golden, named: the link one
// block whose ::before is the indicator, where VitePress has a flex row
// around a paragraph beside an indicator element; the focus ring on a
// link. vpkit against vpkit: a touch screen's hover at rest, the sidenav
// inside a vp-doc.

import { MARGIN, OUTLINE, PADDING, RADIUS, TRANSITION, examples, inDoc } from '../../test/harness.mjs';

const ex = examples(import.meta.url);

export const cases = [];

// the original: a top-level group whose nested level holds two links, the
// second the current page (VitePress writes aria-current="page" on it
// beside .is-active); its items in the one <li> VPSidebarItem renders
const upstream =
  '<div style="width:16rem"><div class="VPSidebarItem level-0 has-active"><div class="item"><h2 class="text">Accounts</h2></div>' +
  '<ul class="items"><li><div class="VPSidebarItem level-1 has-active"><ul class="items"><li>' +
  '<div class="VPSidebarItem level-2 is-link"><div class="item"><div class="indicator"></div><a class="VPLink link" href="#"><p class="text">Search</p></a></div></div>' +
  '<div class="VPSidebarItem level-2 is-link is-active"><div class="item"><div class="indicator"></div><a class="VPLink link" href="#" aria-current="page"><p class="text">Orders</p></a></div></div>' +
  '</li></ul></div></li></ul></div></div>';
const vpkit =
  '<div style="width:16rem"><nav class="vp-sidenav" aria-label="Main"><div class="vp-sidenav-group"><p class="vp-sidenav-title">Accounts</p>' +
  '<ul class="vp-sidenav-items">' +
  '<li><a class="vp-sidenav-link" href="#">Search</a></li>' +
  '<li><a class="vp-sidenav-link" href="#" aria-current="page">Orders</a></li>' +
  '</ul></div></nav></div>';

const TEXT = ['line-height', 'font-size', 'font-weight', 'color'];
const LINK = '.vp-sidenav-link:not([aria-current])';
const CURRENT = '.vp-sidenav-link[aria-current="page"]';
const INDICATOR = ['position', 'top', 'bottom', 'left', 'width', ...RADIUS, 'background-color', ...TRANSITION];

// the group, its title, its list and its links against the original
cases.push({
  name: 'sidenav',
  upstream: { files: ['components/VPSidebarItem.vue'], html: upstream },
  html: vpkit,
  checks: [
    { target: '.vp-sidenav-group', refTarget: '.level-0', props: [...PADDING, 'height'] },
    { target: '.vp-sidenav-title', refTarget: '.level-0 > .item > .text', props: [...TEXT, ...MARGIN, ...PADDING, 'height'] },
    { target: '.vp-sidenav-items', refTarget: '.level-1 > .items', props: ['border-left-width', 'border-left-style', 'border-left-color', ...MARGIN, ...PADDING, 'list-style-type', 'height'] },
    // a link: the nested level's text, at rest and with the link hovered
    { target: LINK, refTarget: '.level-2:not(.is-active) .text', props: [...TEXT, ...TRANSITION, ...PADDING, 'text-decoration-line', 'height'] },
    { target: LINK, refTarget: '.level-2:not(.is-active) .text', refOn: '.level-2:not(.is-active) .link', state: ['hover'], props: ['color'] },
    { target: LINK, pseudo: '::before', refTarget: '.level-2:not(.is-active) .indicator', refPseudo: null, props: ['background-color'] },
    // the current link, its place under the first, and its indicator
    { target: CURRENT, refTarget: '.is-active .text', props: [...TEXT, 'height'] },
    { target: '.vp-sidenav-items > li:last-child', refTarget: '.level-2.is-active', props: ['offset-top', 'height'] },
    { target: CURRENT, pseudo: '::before', refTarget: '.is-active .indicator', refPseudo: null, props: INDICATOR },
    {
      target: LINK,
      source: 'golden',
      props: ['display', 'position'],
      why: 'the link is one positioned block carrying the text\'s padding and type, its ::before the indicator, where VPSidebarItem has a flex row (.link) around a padded paragraph (.text) beside an indicator element: the same box',
    },
  ],
});

// the <nav>, VPSidebar's: a focus target (tabindex="-1", where a skip link
// lands) drawn with no ring, base.css's :focus-visible ring left off it
cases.push({
  name: 'sidenav focused',
  upstream: { files: ['components/VPSidebar.vue'], html: '<nav class="nav" tabindex="-1">Main</nav>' },
  html: '<nav class="vp-sidenav" tabindex="-1">Main</nav>',
  checks: [{ target: '.vp-sidenav', refTarget: '.nav', state: ['focus', 'focus-visible'], props: ['outline-style', 'outline-width'] }],
});

// a link's focus ring: base.css's outline
cases.push({
  name: 'sidenav link focused',
  html: vpkit,
  checks: [{ target: LINK, state: ['focus-visible'], props: OUTLINE }],
});

// on a touch screen a hovered link looks as it does at rest
cases.push({
  name: 'sidenav on a touch screen',
  touch: true,
  html: vpkit,
  reference: vpkit,
  checks: [{ target: LINK, state: ['hover'], refState: [], props: ['color'] }],
});

// inside a vp-doc (prose.css, compiled last, as an app imports it), whose
// rules for a paragraph, a list, its items and a link are in play: the
// title, the list and the links keep their look and place
cases.push({
  name: 'sidenav in a doc',
  html: inDoc(vpkit),
  reference: vpkit,
  checks: [
    { target: '.vp-sidenav-title', props: [...TEXT, ...MARGIN, ...PADDING, 'height'] },
    { target: '.vp-sidenav-items', props: [...MARGIN, ...PADDING, 'list-style-type', 'height'] },
    { target: LINK, props: [...TEXT, ...TRANSITION, 'text-decoration-line', 'height'] },
    { target: LINK, state: ['hover'], props: ['color'] },
    { target: '.vp-sidenav-items > li:last-child', props: ['offset-top', ...MARGIN] },
    { target: CURRENT, props: ['color', 'text-decoration-line'] },
  ],
});

// the example: two groups, the second under the first's 1.5rem, the
// current link marked
cases.push({
  name: 'sidenav groups',
  html: ex('groups'),
  checks: [
    { target: '.vp-sidenav', props: ['width', 'height', 'outline-style'] },
    { target: '.vp-sidenav-group + .vp-sidenav-group', props: ['offset-top'] },
    { target: CURRENT, props: ['color', 'offset-top'] },
    { target: CURRENT, pseudo: '::before', props: ['background-color', 'width'] },
  ],
});
