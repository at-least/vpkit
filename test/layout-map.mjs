// vpkit's names for VitePress's layout components, shared by the CSS port
// (scripts/vitepress-port.mjs) and the layout tests (test/layout.mjs).
//
// A component's root class becomes its block (`VPNavBar` → `vp-nav-bar`); a
// class its CSS compounds on the root (`.VPNavBar.home`,
// `.VPDoc:not(.has-sidebar)`) becomes a modifier (`vp-nav-bar--home`); any
// other class of its own becomes a part (`vp-nav-bar__title`). BEM
// separators, because VitePress names child components after their parent's
// parts: VPNavBar's `.title` holds VPNavBarTitle (`vp-nav-bar-title`).

// file: the copy in test/upstream; root: its root class, when not the
// component's name; block: vpkit's name when the default (kebab case of the
// name without VP) won't do; states: classes the template puts on the root
// that its CSS uses without the root class, modifiers all the same; deep:
// classes its CSS reaches inside a child component with :deep(), and whose
// they are
export const LAYOUT = {
  Layout: { file: 'components/Layout.vue', root: 'Layout' },
  VPContent: { file: 'components/VPContent.vue' },
  // `vp-doc` is the markdown content's class, inside VPDoc
  VPDoc: { file: 'components/VPDoc.vue', block: 'vp-doc-page' },
  VPPage: { file: 'components/VPPage.vue' },
  VPSkipLink: { file: 'components/VPSkipLink.vue' },
  VPBackdrop: { file: 'components/VPBackdrop.vue' },
  VPSidebar: { file: 'components/VPSidebar.vue' },
  // one div.group per sidebar section, no root of its own
  VPSidebarGroup: {
    file: 'components/VPSidebarGroup.vue',
    root: 'group',
    states: ['no-transition'],
    deep: { 'caret-icon': 'VPSidebarItem' },
  },
  VPSidebarItem: { file: 'components/VPSidebarItem.vue' },
  VPLocalNav: { file: 'components/VPLocalNav.vue' },
  VPLocalNavOutlineDropdown: { file: 'components/VPLocalNavOutlineDropdown.vue' },
  VPDocAside: { file: 'components/VPDocAside.vue' },
  VPDocAsideOutline: { file: 'components/VPDocAsideOutline.vue' },
  // the outline's list: .root at the top, .nested below
  VPDocOutlineItem: { file: 'components/VPDocOutlineItem.vue', states: ['root', 'nested'] },
  // vitepress.dev's sponsors and ads: no styles, named for VPDocAside's rules
  VPDocAsideSponsors: { file: 'components/VPDocAsideSponsors.vue' },
  VPDocAsideCarbonAds: { file: 'components/VPDocAsideCarbonAds.vue' },
};

// classes that keep their names in every component: global ones
const GLOBAL = new Set(['dark', 'vp-doc', 'visually-hidden']);
export const isGlobal = (name) => GLOBAL.has(name) || name.startsWith('vpi-');

export function rootOf(component) {
  return LAYOUT[component].root ?? component;
}

export function blockOf(component) {
  const entry = LAYOUT[component];
  if (!entry) throw new Error(`no layout component ${component}`);
  if (entry.block) return entry.block;
  const name = component === entry.root ? component : component.replace(/^VP/, '');
  return `vp-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
}

// the component whose root class this is, if any; a root that is a plain
// word (VPSidebarGroup's group) names no component outside its own CSS
export function componentOfRoot(name) {
  return Object.keys(LAYOUT).find((c) => rootOf(c) === name && /^[A-Z]/.test(name));
}
