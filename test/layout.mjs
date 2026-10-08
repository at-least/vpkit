// Layout components against VitePress's originals.
//
//   node test/layout.mjs
//
// A case takes one VitePress component from a page VitePress
// v2.0.0-alpha.20 rendered (test/upstream/pages, from vitepress.dev): the
// component's own elements, which Vue's data-v scope attribute marks, with
// every child component reduced to its root and only the classes this
// component gives it, so neither side needs another component's rules.
// Upstream renders that tree with VitePress's vars, fonts (the :root rule),
// base, utils and icons stylesheets plus the component's <style>, Vue's
// scoping stripped as in the other tests; vpkit renders the same tree with
// its classes renamed by test/layout-map.mjs, vpkit compiled through
// Tailwind. Every element's computed style, its ::before and ::after, and its
// box are compared at each viewport, and in dark mode at one.
//
// Exits 1, listing every differing value, when any case differs.
//
//   node test/layout.mjs --markup "navbar 1280"
//
// prints a case's markup with vpkit's classes instead.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileStyle } from '@vue/compiler-sfc';
import { chromium } from 'playwright-chromium';

import { FILES, cssClasses, fileText, namer, rootStates, styleOf, unwrapDeep } from '../scripts/vitepress-port.mjs';
import { GLOBAL, LAYOUT, blockOf, isGlobal, rootOf } from './layout-map.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(ROOT, file), 'utf8');

// widths on both sides of VitePress's breakpoints (40, 48, 60, 80, 90rem)
const VIEWPORTS = [375, 768, 960, 1280, 1440, 1600];
const DARK_AT = 1280;

// page: a test/upstream/pages file to take the component from; markup:
// upstream markup written out instead, for what no page renders; toggle:
// root classes to add (true) or remove (false) on both sides; states:
// pseudo-classes to force on the root, one run each. A case without a
// component (global styles: the markdown's) names its selector, and takes
// the whole subtree as it is: no scope, no renaming;
// drop removes elements first; widths replaces the default widths.
//
// A family case takes a component with the components inside it, as
// VitePress rendered them (select: the subtree's root), so rules that cross
// components count too (:deep(), a sibling's group). Upstream keeps Vue's
// scoping: each member's <style> compiled by @vue/compiler-sfc with the scope
// id the page shows for it, in the bundle's order. vpkit renames each class
// by the component it belongs to: an element's own component, then the one
// that passed it the class.
// the navbar's components, and the nav screen's
const NAVBAR = [
  'VPNav', 'VPNavBar', 'VPNavBarTitle', 'VPImage', 'VPNavBarSearch', 'VPNavBarSearchButton', 'VPNavBarAskAiButton',
  'VPNavMenu', 'VPNavMenuLink', 'VPNavMenuGroup', 'VPFlyout', 'VPMenu', 'VPMenuLink', 'VPNavTranslations',
  'VPNavAppearance', 'VPSwitch', 'VPSwitchAppearance', 'VPNavSocialLinks', 'VPSocialLinks', 'VPSocialLink',
  'VPNavBarHamburger',
];
const NAV_SCREEN = [
  'VPNavScreen', 'VPNavMenu', 'VPNavMenuLink', 'VPNavMenuGroup', 'VPMenuLink', 'VPNavTranslations', 'VPNavAppearance',
  'VPSwitch', 'VPSwitchAppearance', 'VPNavSocialLinks', 'VPSocialLinks', 'VPSocialLink',
];

const cases = [
  { component: 'Layout', page: 'guide_getting-started.html' },
  { component: 'VPContent', name: 'doc page', page: 'guide_getting-started.html' },
  { component: 'VPContent', name: 'home page', page: 'home.html' },
  { component: 'VPDoc', name: 'with sidebar', page: 'guide_getting-started.html' },
  { component: 'VPDoc', name: 'without sidebar', page: 'guide_getting-started.html', toggle: { 'has-sidebar': false } },
  { component: 'VPSkipLink', page: 'guide_getting-started.html', states: [[], ['focus']] },
  // rendered only while the sidebar is open
  { component: 'VPBackdrop', markup: '<div class="VPBackdrop"></div>' },
  // the 404 page's content, which VitePress renders in the browser only:
  // its default texts
  {
    component: 'NotFound',
    markup:
      '<div class="NotFound"><p class="code">404</p><h1 class="title">PAGE NOT FOUND</h1><div class="divider"></div>' +
      "<blockquote class=\"quote\">But if you don't change your direction, and if you keep looking, you may end up where you are heading.</blockquote>" +
      '<div class="action"><a class="link" href="/" aria-label="go to home">Take me home</a></div></div>',
    widths: [375, 768, 1280],
  },
  // the navbar where its layout changes (VitePress's script moves menu items
  // into the extra menu as it narrows), a flyout open, the extra menu open,
  // and the nav screen of phones
  ...[
    ['375', [375, 640], []],
    ['768', [768, 800], ['VPNavBarExtra']],
    ['960', [960, 1100], ['VPNavBarExtra']],
    ['1280', [1280, 1440, 1600], []],
  ].map(([at, widths, more]) => ({
    name: `navbar ${at}`,
    family: [...NAVBAR, ...more],
    page: `hydrated/guide_getting-started.${at}.html`,
    select: '.VPNav',
    widths,
  })),
  {
    name: 'navbar, flyout open',
    family: NAVBAR,
    page: 'hydrated/guide_getting-started.1280.flyout-open.html',
    select: '.VPNav',
    widths: [1280],
  },
  {
    name: 'navbar, extra menu open',
    family: [...NAVBAR, 'VPNavBarExtra'],
    page: 'hydrated/guide_getting-started.768.extra-open.html',
    select: '.VPNav',
    widths: [768],
  },
  ...['screen-open', 'screen-groups-open'].map((state) => ({
    name: `nav screen, ${state}`,
    family: NAV_SCREEN,
    page: `hydrated/guide_getting-started.375.${state}.html`,
    select: '.VPNavScreen',
    widths: [375, 640],
  })),
  // the sidebar: its sections (VPSidebarGroup) and items, nested
  {
    name: 'sidebar',
    family: ['VPSidebar', 'VPSidebarGroup', 'VPSidebarItem'],
    page: 'hydrated/guide_getting-started.1280.html',
    select: '.VPSidebar',
  },
  {
    name: 'sidebar open',
    family: ['VPSidebar', 'VPSidebarGroup', 'VPSidebarItem'],
    page: 'hydrated/guide_getting-started.375.sidebar-open.html',
    select: '.VPSidebar',
    widths: [375, 768],
  },
  // the bar under the navbar on narrow screens (hidden from 80rem)
  {
    name: 'local nav',
    family: ['VPLocalNav', 'VPLocalNavOutlineDropdown'],
    page: 'hydrated/guide_getting-started.1280.html',
    select: '.VPLocalNav',
    widths: [375, 768, 960, 1280],
  },
  {
    name: 'local nav, outline open',
    family: ['VPLocalNav', 'VPLocalNavOutlineDropdown', 'VPDocOutlineItem'],
    page: 'hydrated/guide_getting-started.375.outline-open.html',
    select: '.VPLocalNav',
    widths: [375, 768, 960],
  },
  // the aside beside the doc from 80rem: the outline, nested for deep pages
  {
    name: 'aside',
    family: ['VPDocAside', 'VPDocAsideOutline', 'VPDocOutlineItem'],
    page: 'hydrated/guide_getting-started.1280.html',
    select: '.VPDocAside',
    widths: [1280, 1440, 1600],
  },
  {
    name: 'aside, nested outline',
    family: ['VPDocAside', 'VPDocAsideOutline', 'VPDocOutlineItem'],
    page: 'hydrated/guide_markdown.1280.html',
    select: '.VPDocAside',
    widths: [1280, 1600],
  },
  // below the doc: the edit link and the last updated time beside it from
  // 40rem, prev and next in two columns from 40rem
  {
    name: 'doc footer',
    family: ['VPDocFooter', 'VPDocFooterLastUpdated'],
    page: 'hydrated/guide_getting-started.1280.html',
    select: '.VPDocFooter',
    widths: [375, 640, 1280],
  },
  // the local search's dialog, which VitePress renders in the browser
  // only, over the page: written out with a query and two results (the
  // first selected, its match marked), as the detailed list with excerpts,
  // and finding nothing while it searches
  ...[
    ['results', '<div role="button" aria-expanded="true" aria-haspopup="listbox" aria-labelledby="localsearch-label" class="VPLocalSearchBox"><div class="backdrop"></div><div class="shell"><form class="search-bar"><label title="Search" id="localsearch-label" for="localsearch-input"><span aria-hidden="true" class="vpi-search search-icon local-search-icon"></span></label><div class="search-actions before"><button class="back-button" title="Close search"><span class="vpi-arrow-left local-search-icon"></span></button></div><input aria-autocomplete="both" aria-labelledby="localsearch-label" autocapitalize="off" autocomplete="off" autocorrect="off" class="search-input" id="localsearch-input" enterkeyhint="go" maxlength="64" placeholder="Search" spellcheck="false" type="search" value="install"><div class="search-actions"><span class="search-loading" aria-live="polite"></span><button class="toggle-layout-button" type="button" title="Display detailed list"><span class="vpi-layout-list local-search-icon"></span></button><button class="clear-button" type="reset" title="Reset search"><span class="vpi-delete local-search-icon"></span></button></div></form><ul class="results"><li id="localsearch-item-0" aria-selected="true" role="option"><a href="/guide/getting-started#installation" class="result selected" aria-label="Getting Started > Installation" data-index="0"><div><div class="titles"><span class="title-icon">#</span><span class="title"><span class="text">Getting Started</span><span class="vpi-chevron-right local-search-icon"></span></span><span class="title main"><span class="text"><mark data-markjs="true">Install</mark>ation</span></span></div></div></a></li><li id="localsearch-item-1" aria-selected="false" role="option"><a href="/guide/getting-started#installation" class="result" aria-label="Getting Started > Installation > Setup Wizard" data-index="1"><div><div class="titles"><span class="title-icon">#</span><span class="title"><span class="text">Getting Started</span><span class="vpi-chevron-right local-search-icon"></span></span><span class="title"><span class="text">Installation</span><span class="vpi-chevron-right local-search-icon"></span></span><span class="title main"><span class="text">Setup Wizard</span></span></div></div></a></li></ul><div class="search-keyboard-shortcuts"><span><kbd aria-label="up arrow"><span class="vpi-arrow-up navigate-icon"></span></kbd><kbd aria-label="down arrow"><span class="vpi-arrow-down navigate-icon"></span></kbd> to navigate</span><span><kbd aria-label="enter"><span class="vpi-corner-down-left navigate-icon"></span></kbd> to select</span><span><kbd aria-label="escape">esc</kbd> to close</span></div></div></div>'],
    ['detailed list', '<div role="button" aria-expanded="true" aria-haspopup="listbox" aria-labelledby="localsearch-label" class="VPLocalSearchBox"><div class="backdrop"></div><div class="shell"><form class="search-bar"><label title="Search" id="localsearch-label" for="localsearch-input"><span aria-hidden="true" class="vpi-search search-icon local-search-icon"></span></label><div class="search-actions before"><button class="back-button" title="Close search"><span class="vpi-arrow-left local-search-icon"></span></button></div><input aria-autocomplete="both" aria-labelledby="localsearch-label" autocapitalize="off" autocomplete="off" autocorrect="off" class="search-input" id="localsearch-input" enterkeyhint="go" maxlength="64" placeholder="Search" spellcheck="false" type="search" value="install"><div class="search-actions"><span class="search-loading" aria-live="polite"></span><button class="toggle-layout-button detailed-list" type="button" title="Display detailed list"><span class="vpi-layout-list local-search-icon"></span></button><button class="clear-button" type="reset" title="Reset search"><span class="vpi-delete local-search-icon"></span></button></div></form><ul class="results"><li id="localsearch-item-0" aria-selected="true" role="option"><a href="/guide/getting-started#installation" class="result selected" aria-label="Getting Started > Installation" data-index="0"><div><div class="titles"><span class="title-icon">#</span><span class="title"><span class="text">Getting Started</span><span class="vpi-chevron-right local-search-icon"></span></span><span class="title main"><span class="text"><mark data-markjs="true">Install</mark>ation</span></span></div><div class="excerpt-wrapper"><div class="excerpt" inert><div class="vp-doc"><p>VitePress can be used on its own, or be <mark data-markjs="true">install</mark>ed into an existing project.</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre><code><span class="line">npm add -D vitepress</span></code></pre></div></div></div><div class="excerpt-gradient-bottom"></div><div class="excerpt-gradient-top"></div></div></div></a></li><li id="localsearch-item-1" aria-selected="false" role="option"><a href="/guide/getting-started#installation" class="result" aria-label="Getting Started > Installation > Setup Wizard" data-index="1"><div><div class="titles"><span class="title-icon">#</span><span class="title"><span class="text">Getting Started</span><span class="vpi-chevron-right local-search-icon"></span></span><span class="title"><span class="text">Installation</span><span class="vpi-chevron-right local-search-icon"></span></span><span class="title main"><span class="text">Setup Wizard</span></span></div><div class="excerpt-wrapper"><div class="excerpt" inert><div class="vp-doc"><p>VitePress ships with a command line setup wizard.</p></div></div><div class="excerpt-gradient-bottom"></div><div class="excerpt-gradient-top"></div></div></div></a></li></ul><div class="search-keyboard-shortcuts"><span><kbd aria-label="up arrow"><span class="vpi-arrow-up navigate-icon"></span></kbd><kbd aria-label="down arrow"><span class="vpi-arrow-down navigate-icon"></span></kbd> to navigate</span><span><kbd aria-label="enter"><span class="vpi-corner-down-left navigate-icon"></span></kbd> to select</span><span><kbd aria-label="escape">esc</kbd> to close</span></div></div></div>'],
    ['no results', '<div role="button" aria-expanded="true" aria-haspopup="listbox" aria-labelledby="localsearch-label" class="VPLocalSearchBox"><div class="backdrop"></div><div class="shell"><form class="search-bar"><label title="Search" id="localsearch-label" for="localsearch-input"><span aria-hidden="true" class="vpi-search search-icon local-search-icon"></span></label><div class="search-actions before"><button class="back-button" title="Close search"><span class="vpi-arrow-left local-search-icon"></span></button></div><input aria-autocomplete="both" aria-labelledby="localsearch-label" autocapitalize="off" autocomplete="off" autocorrect="off" class="search-input" id="localsearch-input" enterkeyhint="go" maxlength="64" placeholder="Search" spellcheck="false" type="search" value="xyzzy"><div class="search-actions"><span class="search-loading active" aria-live="polite"></span><button class="toggle-layout-button" type="button" title="Display detailed list"><span class="vpi-layout-list local-search-icon"></span></button><button class="clear-button" type="reset" title="Reset search"><span class="vpi-delete local-search-icon"></span></button></div></form><ul class="results"><li class="no-results">No results for "<strong>xyzzy</strong>"</li></ul><div class="search-keyboard-shortcuts"><span><kbd aria-label="up arrow"><span class="vpi-arrow-up navigate-icon"></span></kbd><kbd aria-label="down arrow"><span class="vpi-arrow-down navigate-icon"></span></kbd> to navigate</span><span><kbd aria-label="enter"><span class="vpi-corner-down-left navigate-icon"></span></kbd> to select</span><span><kbd aria-label="escape">esc</kbd> to close</span></div></div></div>'],
  ].map(([state, markup]) => ({ component: 'VPLocalSearchBox', name: `search box, ${state}`, markup, widths: [375, 768, 1280] })),
  // the home page: the hero (name, text, tagline, buttons, image), the
  // features (four: a row of four from 60rem), the markdown below them
  {
    name: 'home',
    family: ['VPHome', 'VPHero', 'VPButton', 'VPImage', 'VPFeatures', 'VPFeature', 'VPHomeContent'],
    page: 'home.html',
    select: '.VPHome',
    widths: [375, 640, 768, 960, 1280, 1440],
  },
  // the site's footer: shown on a page without a sidebar, hidden beside one
  { component: 'VPFooter', name: 'home page', page: 'home.html', widths: [375, 768, 1280] },
  { component: 'VPFooter', name: 'doc page', page: 'guide_getting-started.html', widths: [375, 1280] },
  // the markdown page: every block VitePress's markdown renders. Its code
  // blocks with a title bar and its MathJax formulas come from vitepress.dev's
  // plugins, which bring their own styles, not VitePress's.
  {
    name: 'markdown content',
    page: 'guide_markdown.html',
    selector: '.vp-doc',
    drop: '.vp-code-block-title, mjx-container',
    widths: [375, 1280],
  },
];

// intentional differences: { case: /name/, element: /path/, prop, reason }
const known = [
  {
    case: /^navbar/,
    element: /^img\.VPImage\.logo$/,
    prop: 'vertical-align',
    reason: "Tailwind's preflight gives replaced elements vertical-align: middle, VitePress's version of it leaves baseline; the logo is a flex item, where it does nothing",
  },
  {
    case: /^home$/,
    element: /^img\.VPImage\.image-src$/,
    prop: 'vertical-align',
    reason: "the same preflight rule; the hero image is absolutely positioned, where it does nothing",
  },
];

const SIDES = ['top', 'right', 'bottom', 'left'];
const PROPS = [
  'display', 'position', ...SIDES, 'z-index', 'box-sizing',
  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  ...SIDES.map((s) => `margin-${s}`), ...SIDES.map((s) => `padding-${s}`),
  ...SIDES.flatMap((s) => [`border-${s}-width`, `border-${s}-style`, `border-${s}-color`]),
  ...['top-left', 'top-right', 'bottom-right', 'bottom-left'].map((c) => `border-${c}-radius`),
  'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis', 'order',
  'justify-content', 'align-items', 'align-self', 'row-gap', 'column-gap',
  'grid-template-columns', 'grid-template-rows',
  'overflow-x', 'overflow-y', 'visibility', 'opacity', 'transform', 'clip', 'clip-path',
  'color', 'background-color', 'background-image', 'box-shadow',
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing',
  'text-align', 'text-decoration-line', 'text-transform', 'white-space', 'text-overflow', 'vertical-align',
  'cursor', 'pointer-events', 'outline-style', 'outline-width', 'outline-offset',
  'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay',
  'mask-image', 'list-style-type', 'scrollbar-width', 'color-scheme',
];
const PSEUDO_PROPS = [
  'content', 'display', 'position', ...SIDES, 'width', 'height', 'color', 'background-color',
  'background-image', 'opacity', 'transform', 'mask-image',
];

function vpkitCss() {
  const dir = mkdtempSync(join(tmpdir(), 'vpkit-layout-'));
  try {
    const out = join(dir, 'vpkit.css');
    execFileSync(
      join(ROOT, 'node_modules/.bin/tailwindcss'),
      // unminified, as a docs theme should ship it: the minifier rounds
      // numbers to six digits, and VitePress's line-height 1.3333333 as
      // 1.33333 makes every h2 1/64px shorter, 0.375px down the markdown page
      ['-i', join(ROOT, 'test/layout-entry.css'), '-o', out],
      { stdio: 'pipe' },
    );
    return readFileSync(out, 'utf8');
  } finally {
    rmSync(dir, { recursive: true });
  }
}

// VitePress's global stylesheets, as its theme loads them; of fonts.css
// only the :root rule that puts Inter first (the rest fetches webfonts).
// The markdown's (vp-doc.css …) come too: VitePress loads them on every page,
// and vp-doc.css draws the external link arrow VPLink's class asks for.
function upstreamGlobals() {
  const fontsRoot = read('test/upstream/fonts.css').match(/\n:root \{[^}]*\}/g).at(-1);
  return [read('test/upstream/vars.css'), fontsRoot, read('test/upstream/base.css'),
    read('test/upstream/utils.css'), read('test/upstream/icons.css'), read('test/upstream/vp-doc.css'),
    read('test/upstream/custom-block.css'), read('test/upstream/vp-code-group.css')].join('\n');
}

// What a case renders, upstream and vpkit, from the same tree. In the
// page: the component's root, its own elements (they carry its scope id),
// child component roots with only this component's classes, text.
function trees(browser, c) {
  const html = c.markup ?? read(`test/upstream/pages/${c.page}`);
  if (c.family) return familyTrees(browser, c, html);
  if (!c.component) {
    return browser.newPage().then(async (page) => {
      const tree = await page.evaluate(
        ([html, selector, drop]) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const root = doc.body.querySelector(selector);
          if (!root) throw new Error(`no ${selector} in the page`);
          if (drop) for (const el of root.querySelectorAll(drop)) el.remove();
          for (const el of [root, ...root.querySelectorAll('*')]) {
            for (const a of el.getAttributeNames()) if (a.startsWith('data-v-')) el.removeAttribute(a);
          }
          return root.outerHTML;
        },
        [html, c.selector, c.drop],
      );
      await page.close();
      return { upstream: tree, vpkit: tree };
    });
  }
  const css = unwrapDeep(styleOf(c.component));
  const names = {
    root: rootOf(c.component),
    block: blockOf(c.component),
    own: [...cssClasses(css)],
    states: [...rootStates(c.component, css)],
  };
  return browser.newPage().then(async (page) => {
    const result = await page.evaluate(
      ([html, names, toggle, fromPage, globals]) => {
        const isGlobal = (n) => globals.includes(n) || n.startsWith('vpi-');
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const root = doc.body.querySelector(`.${names.root}`);
        if (!root) throw new Error(`no .${names.root} in the page`);
        const scopes = (el) => el.getAttributeNames().filter((a) => a.startsWith('data-v-'));
        const scope = fromPage ? scopes(root).at(-1) : null;
        if (fromPage && !scope) throw new Error(`.${names.root} has no scope id`);
        for (const [cls, on] of Object.entries(toggle ?? {})) root.classList.toggle(cls, on);

        // keep: the root's own block and states, an element's own classes,
        // global classes; on a child component's root, only ours
        const keep = (el, isRoot) =>
          [...el.classList].filter((n) =>
            isRoot ? n === names.root || names.states.includes(n) || isGlobal(n) : names.own.includes(n) || isGlobal(n),
          );
        function copy(el, isRoot) {
          const out = doc.createElement(el.tagName.toLowerCase());
          for (const a of el.getAttributeNames()) {
            if (a !== 'class' && !a.startsWith('data-v-')) out.setAttribute(a, el.getAttribute(a));
          }
          const classes = keep(el, isRoot);
          if (classes.length) out.setAttribute('class', classes.join(' '));
          const childRoot = !isRoot && fromPage && scopes(el).some((s) => s !== scope);
          if (childRoot) return out;
          for (const node of el.childNodes) {
            if (node.nodeType === 3) out.append(node.textContent);
            else if (node.nodeType === 1 && (!fromPage || scopes(node).includes(scope))) out.append(copy(node, false));
          }
          return out;
        }
        const tree = copy(root, true);
        const upstream = tree.outerHTML;
        const rename = (n) =>
          n === names.root ? names.block
            : isGlobal(n) ? n
              : names.states.includes(n) ? `${names.block}--${n}`
                : `${names.block}__${n}`;
        for (const el of [tree, ...tree.querySelectorAll('[class]')]) {
          el.setAttribute('class', [...el.classList].map(rename).join(' '));
        }
        return { upstream, vpkit: tree.outerHTML };
      },
      [html, names, c.toggle, !c.markup, GLOBAL],
    );
    await page.close();
    return result;
  });
}

// the classes inside a stylesheet's :deep(…)
function deepClasses(css) {
  const out = new Set();
  for (let at = css.indexOf(':deep('); at !== -1; at = css.indexOf(':deep(', at + 1)) {
    let depth = 1;
    let end = at + ':deep('.length;
    for (; depth > 0; end++) depth += css[end] === '(' ? 1 : css[end] === ')' ? -1 : 0;
    for (const m of css.slice(at, end).matchAll(/\.([A-Za-z_-][\w-]*)/g)) out.add(m[1]);
  }
  return [...out];
}

// A family's trees and the scope id each member has in the page. A
// member's scope is on its root and not on the root's parent (the order of
// data-v attributes differs between server and client renders). Where one
// element is the root of several components (VPNavSocialLinks renders a
// VPSocialLinks), the innermost one's scope is the one its children carry
// (deeper down, an outer component's slot content may carry its own), and a
// component that wraps others (layout-map's wraps) has what is left.
// vpkit's tree takes, for each class, the name every member whose scope the
// element carries gives it (a class two components style gets both names;
// a modifier only next to its block, where it can match), and, below an
// element of a member, the name that member gives a class it reaches with
// :deep() (Vue's [data-v-x] .class matches there).
async function familyTrees(browser, c, html) {
  const members = c.family.map((name) => {
    const rename = namer(name, rootStates(name));
    const owned = new Set([rootOf(name), ...rootStates(name), ...cssClasses(unwrapDeep(styleOf(name)))]);
    return {
      name,
      select: `.${rootOf(name)}`,
      wraps: (LAYOUT[name].wraps ?? []).filter((w) => c.family.includes(w)),
      deep: deepClasses(styleOf(name)),
      roots: [rootOf(name), ...Object.keys(LAYOUT[name].modifiers ?? {})],
      rename: Object.fromEntries([...owned].map((n) => [n, rename(n)])),
    };
  });
  const page = await browser.newPage();
  const result = await page.evaluate(
    ([html, select, members, globals]) => {
      const isGlobal = (n) => globals.includes(n) || n.startsWith('vpi-');
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const root = doc.body.querySelector(select);
      if (!root) throw new Error(`no ${select} in the page`);
      const scopes = (el) => (el ? el.getAttributeNames().filter((a) => a.startsWith('data-v-')) : []);
      const fresh = (el) => scopes(el).filter((s) => !scopes(el.parentElement).includes(s));
      const on = (els) => new Set([...els].flatMap(scopes));
      const scopeOf = {};
      const find = (m) => (root.matches(m.select) ? root : root.querySelector(m.select));
      for (const m of [...members.filter((m) => !m.wraps.length), ...members.filter((m) => m.wraps.length)]) {
        const el = find(m);
        if (!el) continue;
        let candidates = fresh(el);
        if (!candidates.length && scopes(el).length === 1) candidates = scopes(el);
        if (m.wraps.length) candidates = candidates.filter((s) => !m.wraps.some((w) => scopeOf[w] === s));
        else if (candidates.length > 1) {
          const children = on(el.children);
          const inner = candidates.filter((s) => children.has(s));
          candidates = inner.length ? inner : candidates.filter((s) => on(el.querySelectorAll('*')).has(s));
        }
        if (candidates.length !== 1) throw new Error(`${m.name}: ${candidates.length} scopes to choose from on ${el.outerHTML.slice(0, 160)}`);
        scopeOf[m.name] = candidates[0];
      }
      const memberOf = Object.fromEntries(members.filter((m) => scopeOf[m.name]).map((m) => [scopeOf[m.name], m]));
      const reaching = members.filter((m) => scopeOf[m.name] && m.deep.length);
      const upstream = root.cloneNode(true);
      const vpkit = root.cloneNode(true);
      const rename = (el) => {
        const mine = scopes(el).map((s) => memberOf[s]).filter(Boolean);
        const names = new Set();
        for (const n of el.classList) {
          if (isGlobal(n)) names.add(n);
          for (const m of mine) {
            if (!Object.hasOwn(m.rename, n)) continue;
            if (m.rename[n].includes('--') && !m.roots.some((r) => el.classList.contains(r))) continue;
            names.add(m.rename[n]);
          }
          for (const m of reaching) {
            if (m.deep.includes(n) && el.parentElement?.closest(`[${scopeOf[m.name]}]`)) names.add(m.rename[n]);
          }
        }
        return [...names];
      };
      // rename on the original (its scopes), write to the copy
      const originals = [root, ...root.querySelectorAll('*')];
      const copies = [vpkit, ...vpkit.querySelectorAll('*')];
      originals.forEach((el, i) => {
        const names = rename(el);
        const out = copies[i];
        for (const a of out.getAttributeNames()) if (a.startsWith('data-v-') || a === 'class') out.removeAttribute(a);
        if (names.length) out.setAttribute('class', names.join(' '));
      });
      return { upstream: upstream.outerHTML, vpkit: vpkit.outerHTML, scopeOf };
    },
    [html, c.select, members, GLOBAL],
  );
  await page.close();
  for (const name of c.family) {
    if (styleOf(name) && !result.scopeOf[name]) throw new Error(`${c.name}: ${name} is not in the subtree`);
  }
  return result;
}

// a family's VitePress styles, scoped as Vue scopes them, in the bundle's
// order (FILES, as layout.css has them)
function familyCss(c, scopeOf) {
  const order = FILES['layout.css'].components.filter((n) => c.family.includes(n));
  if (order.length !== c.family.length) throw new Error(`${c.name}: every member must be in layout.css`);
  return order
    .filter((n) => styleOf(n))
    .map((n) => {
      const r = compileStyle({ source: styleOf(n), id: scopeOf[n], scoped: true, filename: LAYOUT[n].file });
      if (r.errors.length) throw r.errors[0];
      return r.code;
    })
    .join('\n');
}

// lengths match within 1/32px: layout rounds to 1/64px
const PX = /^-?\d+(\.\d+)?px$/;
const NO_SHADOW = /rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?/g;
// a data: URL's image, decoded and spelled one way: Tailwind's compiler
// re-encodes VitePress's SVG URLs (' as %27, no space before />)
const DATA_URL = /url\("data:image\/svg\+xml,([^"]*)"\)/g;
const svgText = (v) =>
  v.replace(DATA_URL, (_, data) => `url(svg:${decodeURIComponent(data).replace(/"/g, "'").replace(/\s*(\/?>)/g, '$1').replace(/\s+/g, ' ').trim()})`);

function same(a, b, prop) {
  if (prop.endsWith('box-shadow')) [a, b] = [a.replace(NO_SHADOW, ''), b.replace(NO_SHADOW, '')];
  if (typeof a === 'string' && typeof b === 'string' && a.includes('data:image/svg+xml')) [a, b] = [svgText(a), svgText(b)];
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1 / 32;
  return PX.test(a) && PX.test(b) && Math.abs(parseFloat(a) - parseFloat(b)) <= 1 / 32;
}

const BODY = 'color:var(--vp-c-text-1);background-color:var(--vp-c-bg);margin:0';

async function render(browser, css, body, width, dark, states) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.setContent(
    `<!doctype html><html${dark ? ' class="dark"' : ''}><head><style>${css}</style></head><body style="${BODY}">${body}</body></html>`,
  );
  if (states.length) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'body > *' });
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: states });
  }
  const values = await page.evaluate(
    ([props, pseudoProps]) => {
      for (const animation of document.getAnimations()) {
        // a loop (the search's spinner) has no end: held at its start
        if (animation.effect?.getComputedTiming().endTime === Infinity) {
          animation.pause();
          animation.currentTime = 0;
        } else animation.finish();
      }
      return [...document.body.querySelectorAll('*')].map((el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const v = { 'box x': r.x, 'box y': r.y, 'box width': r.width, 'box height': r.height };
        for (const p of props) v[p] = s.getPropertyValue(p);
        for (const pseudo of ['::before', '::after']) {
          const ps = getComputedStyle(el, pseudo);
          v[`${pseudo} content`] = ps.content;
          if (ps.content === 'none' || ps.content === 'normal') continue;
          for (const p of pseudoProps) v[`${pseudo} ${p}`] = ps.getPropertyValue(p);
        }
        return v;
      });
    },
    [PROPS, PSEUDO_PROPS],
  );
  await page.close();
  return values;
}

// an element's place, for the report: its tag and upstream classes
function paths(html) {
  const out = [];
  for (const m of html.matchAll(/<([a-z0-9]+)((?:\s[^>]*?)?)>/g)) {
    const cls = m[2].match(/class="([^"]*)"/)?.[1];
    out.push(`${m[1]}${cls ? '.' + cls.trim().split(/\s+/).join('.') : ''}`);
  }
  return out;
}

// the layout files are the port's output, so every declaration is
// VitePress's: a hand edit belongs in scripts/vitepress-port.mjs
const failures = [];
for (const name of Object.keys(FILES)) {
  if (read(name) !== fileText(name)) failures.push(`${name} is not the port's output: node scripts/vitepress-port.mjs --write`);
}

// --markup <case>: print vpkit's markup for a case, VitePress's rendered
// markup with vpkit's class names, the reference for building it elsewhere
if (process.argv[2] === '--markup') {
  const c = cases.find((x) => [x.component, x.name].filter(Boolean).join(' ') === process.argv[3]);
  if (!c) throw new Error(`no case ${process.argv[3]}; cases: ${cases.map((x) => [x.component, x.name].filter(Boolean).join(' ')).join(', ')}`);
  const browser = await chromium.launch();
  try {
    console.log((await trees(browser, c)).vpkit);
  } finally {
    await browser.close();
  }
  process.exit(0);
}

const upstreamBase = upstreamGlobals();
const vpkit = vpkitCss();
const browser = await chromium.launch();
const expected = [];
let compared = 0;
let renders = 0;
try {
  for (const c of cases) {
    const label = [c.component, c.name].filter(Boolean).join(' ');
    const tree = await trees(browser, c);
    const where = paths(tree.upstream);
    const own = c.family ? [familyCss(c, tree.scopeOf)] : c.component ? [unwrapDeep(styleOf(c.component))] : [];
    const upstreamCss = [upstreamBase, ...own].join('\n');
    const runs = (c.widths ?? VIEWPORTS).map((w) => [w, false]).concat([[DARK_AT, true]]);
    for (const states of c.states ?? [[]]) {
      for (const [width, dark] of runs) {
        const up = await render(browser, upstreamCss, tree.upstream, width, dark, states);
        const vp = await render(browser, vpkit, tree.vpkit, width, dark, states);
        if (up.length !== vp.length) throw new Error(`${label}: ${up.length} elements upstream, ${vp.length} in vpkit`);
        renders++;
        const run = `${label} [${width}px${dark ? ' dark' : ''}${states.length ? ' :' + states.join(':') : ''}]`;
        up.forEach((u, i) => {
          for (const prop of Object.keys(u)) {
            compared++;
            if (same(u[prop], vp[i][prop], prop)) continue;
            const line = `${run} ${where[i]} ${prop}: upstream ${u[prop]} | vpkit ${vp[i][prop]}`;
            const delta = known.find((k) => k.case.test(label) && k.element.test(where[i]) && k.prop === prop);
            if (!delta) {
              failures.push(line);
              continue;
            }
            delta.hits = (delta.hits ?? 0) + 1;
            expected.push(line);
          }
        });
      }
    }
  }
} finally {
  await browser.close();
}

for (const k of known) {
  if (k.hits) console.log(`KNOWN ${k.hits}× ${k.case} ${k.element} ${k.prop}: ${k.reason}`);
  else failures.push(`known difference no longer occurs, remove it: ${k.case} ${k.element} ${k.prop}`);
}
for (const f of failures) console.log(`DIFF  ${f}`);
console.log(
  `${cases.length} layout cases in ${renders} renders (widths, dark, states): ${compared} values compared, ` +
    `${failures.length} differ, ${expected.length} known`,
);
process.exit(failures.length ? 1 : 0);
