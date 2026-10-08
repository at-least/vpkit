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
// they are; modifiers: the class VitePress v2 adds to a root by variant
// (VPNavMenu's VPNavBarMenu in the bar) → the modifier's name (bar); wraps:
// the components whose root this component's root also is (VPNavSocialLinks
// renders a VPSocialLinks)
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
  // below the doc: the edit link, the last updated time, prev and next
  VPDocFooter: { file: 'components/VPDocFooter.vue' },
  VPDocFooterLastUpdated: { file: 'components/VPDocFooterLastUpdated.vue', root: 'VPLastUpdated', block: 'vp-last-updated' },
  // the site's footer, on pages without a sidebar
  VPFooter: { file: 'components/VPFooter.vue' },
  // the home page: the hero with its buttons and image, the features, the
  // markdown below them. VPButton and VPFeature as VitePress has them,
  // beside vpkit's own vp-btn and vp-card, which change them for apps
  VPHome: { file: 'components/VPHome.vue' },
  VPHero: { file: 'components/VPHero.vue' },
  VPButton: { file: 'components/VPButton.vue' },
  VPFeatures: { file: 'components/VPFeatures.vue' },
  VPFeature: { file: 'components/VPFeature.vue' },
  VPHomeContent: { file: 'components/VPHomeContent.vue' },
  // the 404 page's content
  NotFound: { file: 'components/NotFound.vue' },
  // the local search's dialog, over the page
  VPLocalSearchBox: { file: 'components/VPLocalSearchBox.vue' },
  // the navbar and, on narrow screens, the nav screen
  VPNav: { file: 'components/VPNav.vue' },
  VPNavBar: { file: 'components/VPNavBar.vue' },
  VPNavBarTitle: { file: 'components/VPNavBarTitle.vue' },
  VPImage: { file: 'components/VPImage.vue' },
  VPNavBarSearch: { file: 'components/VPNavBarSearch.vue' },
  VPNavBarSearchButton: { file: 'components/VPNavBarSearchButton.vue' },
  VPNavBarAskAiButton: { file: 'components/VPNavBarAskAiButton.vue' },
  VPNavMenu: { file: 'components/VPNavMenu.vue', modifiers: { VPNavBarMenu: 'bar' } },
  VPNavMenuLink: {
    file: 'components/VPNavMenuLink.vue',
    modifiers: { VPNavBarMenuLink: 'bar', VPNavScreenMenuLink: 'screen' },
  },
  // a flyout in the bar, a group in a menu, a collapsible group on the screen
  VPNavMenuGroup: {
    file: 'components/VPNavMenuGroup.vue',
    modifiers: { VPNavScreenMenuGroup: 'screen' },
    wraps: ['VPFlyout', 'VPMenuGroup'],
  },
  VPFlyout: { file: 'components/VPFlyout.vue' },
  // its :deep(.group) and :deep(.item) style what fills its slot: their
  // elements carry vp-menu__group and vp-menu__item as well as their own
  VPMenu: { file: 'components/VPMenu.vue' },
  VPMenuLink: { file: 'components/VPMenuLink.vue' },
  VPMenuGroup: { file: 'components/VPMenuGroup.vue' },
  VPNavBarExtra: { file: 'components/VPNavBarExtra.vue', wraps: ['VPFlyout'] },
  VPNavBarHamburger: { file: 'components/VPNavBarHamburger.vue' },
  VPNavAppearance: {
    file: 'components/VPNavAppearance.vue',
    modifiers: { VPNavBarAppearance: 'bar', VPNavScreenAppearance: 'screen' },
  },
  VPSwitch: { file: 'components/VPSwitch.vue' },
  VPSwitchAppearance: { file: 'components/VPSwitchAppearance.vue', wraps: ['VPSwitch'], deep: { check: 'VPSwitch' } },
  VPNavSocialLinks: {
    file: 'components/VPNavSocialLinks.vue',
    modifiers: { VPNavBarSocialLinks: 'bar' },
    wraps: ['VPSocialLinks'],
  },
  VPSocialLinks: { file: 'components/VPSocialLinks.vue' },
  VPSocialLink: { file: 'components/VPSocialLink.vue' },
  VPNavTranslations: {
    file: 'components/VPNavTranslations.vue',
    modifiers: { VPNavBarTranslations: 'bar', VPNavScreenTranslations: 'screen' },
    wraps: ['VPFlyout'],
  },
  VPNavScreen: { file: 'components/VPNavScreen.vue' },
};

// classes that keep their names in every component: global ones (mac: on
// :root, VitePress's client sets it on Apple devices; vp-external-link-icon
// and no-icon: what vp-doc.css draws the external link arrow by, which
// VPLink and VPSocialLink set), and VitePress components vpkit does not
// port that another's rules name (VPHomeContent stretches a VPHomeSponsors
// or VPTeamPage in the home page's markdown to the window's width)
export const GLOBAL = [
  'dark', 'mac', 'vp-doc', 'visually-hidden', 'vp-external-link-icon', 'no-icon', 'VPHomeSponsors', 'VPTeamPage',
  // the markdown's code groups, in the local search's excerpts
  'vp-code-group', 'tabs',
];
export const isGlobal = (name) => GLOBAL.includes(name) || name.startsWith('vpi-');

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
