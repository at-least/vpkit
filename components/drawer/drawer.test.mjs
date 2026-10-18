// vp-drawer against VitePress's sidebar as a phone shows it (test/upstream/
// components/VPSidebar.vue, its open state under 60rem, where its desktop
// rules don't apply: at 375px the viewport sizes it, at 800px its
// max-width does) and VPBackdrop.vue, the scrim VitePress draws as an
// element, against the dialog's ::backdrop (`refPseudo: null` reads the
// reference's element itself). The drawer is opened with showModal() by
// the case's script. What the element brings and VPSidebar has no need of
// (a modal dialog's size, insets and text color) the drawer sets back to
// the aside's, and its margins and borders hold the preflight's zeros, so
// the box is compared on every side. What is vpkit's is golden, named:
// no transform on the open panel. vpkit against vpkit: a fixed box inside
// the open drawer against one in the page, the drawer inside a vp-doc.

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BORDER, COLORS, MARGIN, PADDING, SIDES, TRANSITION, example } from '../../test/harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ex = (id) => example(HERE, id);

export const cases = [];

const OPEN = '<script>document.getElementById(\'menu\').showModal()</script>';
const SIDEBAR = ['components/VPSidebar.vue', 'components/VPBackdrop.vue'];
const body = '<nav><a href="#">Guide</a><a href="#">Reference</a></nav>';
// VitePress's open sidebar with its scrim beside it; the drawer, opened
const upstreamOpen = `<div class="VPBackdrop"></div><aside class="VPSidebar open">${body}</aside>`;
const drawer = ex('menu') + OPEN;
// the slide's transition: its properties, durations, curves and behaviors
const SLIDE = [...TRANSITION, 'transition-timing-function', 'transition-behavior'];
const BOXP = [
  'position', ...SIDES, 'offset-top', 'offset-left', 'height', 'width', 'max-width', 'max-height',
  ...MARGIN, ...BORDER, ...PADDING, ...COLORS, 'opacity', 'box-shadow',
  'overflow-x', 'overflow-y', 'overscroll-behavior-x', 'overscroll-behavior-y', ...SLIDE,
];
// the scrim: VPBackdrop's element against the drawer's ::backdrop
const scrim = (props) => ({ target: '.vp-drawer', pseudo: '::backdrop', refTarget: '.VPBackdrop', refPseudo: null, props });
const BACKDROP = ['position', ...SIDES, 'background-color', 'opacity', ...TRANSITION];
const NO_TRANSFORM = {
  target: '.vp-drawer',
  source: 'golden',
  props: ['transform'],
  why: "the open drawer has no transform, where VitePress's has translateX(0), the same place: a transform would make the panel the containing block of a fixed descendant, and a toast shown inside the open drawer would sit in the panel's corner instead of the viewport's",
};

// the open drawer: the box on every side, its colors, motion and scrim
for (const width of [375, 800]) {
  cases.push({
    name: `drawer at ${width}px`,
    width,
    upstream: { files: SIDEBAR, html: upstreamOpen },
    html: drawer,
    checks: [{ target: '.vp-drawer', refTarget: '.VPSidebar', props: BOXP }, NO_TRANSFORM, scrim(BACKDROP)],
  });
}

// the closed state, where the slide out ends: VitePress's closed sidebar
// with vpkit's addition written inline (the display and overlay
// transitions, allow-discrete, that keep a closing dialog on screen and
// in the top layer until the slide ends) against the closed drawer shown
// (display: block inline): a closed dialog has no box, and its transform
// reads none; and VitePress's leaving scrim (Vue's fade-leave classes on
// VPBackdrop) against the closed drawer's ::backdrop, which Chromium
// resolves on a dialog with a box
cases.push({
  name: 'drawer closed',
  width: 375,
  upstream: {
    files: SIDEBAR,
    html:
      '<div class="VPBackdrop fade-leave-active fade-leave-to"></div>' +
      `<aside class="VPSidebar" style="transition:opacity 0.5s, transform 0.25s ease, display 0.5s allow-discrete, overlay 0.5s allow-discrete">${body}</aside>`,
  },
  html: `<dialog class="vp-drawer" id="menu" aria-label="Menu" style="display:block">${body}</dialog>`,
  checks: [{ target: '.vp-drawer', refTarget: '.VPSidebar', props: ['opacity', 'transform', ...SLIDE] }, scrim(['opacity', ...TRANSITION])],
});

// under prefers-reduced-motion: VitePress's rule (`*, ::before, ::after`)
// zeroes its sidebar's and its scrim's durations, the scrim being an
// element; vpkit's scrim is the dialog's ::backdrop, which the star
// doesn't match, so base.css's rule names it
const STILL = [...TRANSITION, 'transition-delay'];
cases.push({
  name: 'drawer under reduced motion',
  width: 375,
  reducedMotion: true,
  upstream: { files: SIDEBAR, html: upstreamOpen },
  html: drawer,
  checks: [{ target: '.vp-drawer', refTarget: '.VPSidebar', props: STILL }, scrim(STILL)],
});

// below a layout top: VitePress's --vp-layout-top-height (a banner above
// the layout, 0px unset), which the drawer reads as VPSidebar does
const LAYOUT_TOP = '<style>:root{--vp-layout-top-height:3rem}</style>';
cases.push({
  name: 'drawer under a layout top',
  width: 375,
  upstream: { files: SIDEBAR, html: `${LAYOUT_TOP}${upstreamOpen}` },
  html: `${LAYOUT_TOP}${drawer}`,
  checks: [{ target: '.vp-drawer', refTarget: '.VPSidebar', props: ['top', 'offset-top', 'height'] }],
});

// a fixed element inside the open drawer, a toast shown while the page
// behind it is inert: at the viewport's corner, as in the page, since the
// open panel carries no transform (one would make it the containing block)
const TOAST = '<div class="vp-toast" style="position:fixed;right:1rem;bottom:1rem">Saved</div>';
cases.push({
  name: 'drawer with a fixed box inside',
  html: `<dialog class="vp-drawer" id="menu" aria-label="Menu"><nav>Menu</nav>${TOAST}</dialog>${OPEN}`,
  reference: TOAST,
  checks: [{ target: '.vp-toast', props: ['offset-top', 'offset-left', 'height'] }],
});

// inside a vp-doc (prose.css, compiled last, as an app imports it), which
// has no rule for a dialog: the panel as it is alone; what is inside it
// is the page's
cases.push({
  name: 'drawer in a doc',
  html: `<div class="vp-doc">${drawer}</div>`,
  reference: `<div>${drawer}</div>`,
  checks: [{ target: '.vp-drawer', props: [...PADDING, ...COLORS, 'width', 'opacity'] }],
});
