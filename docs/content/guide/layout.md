+++
title = "Docs Layout"
description = "VitePress's page layout and markdown styles as classes, with VitePress's markup and BEM names, for a docs theme."
+++

# Docs Layout

VitePress's page layout as classes, for a docs theme (vpkit's Zola theme is built on them). Unlike the [components](@/components/_index.md), these keep VitePress's markup: build it from VitePress's templates (`src/client/theme-default`) and rename the classes:

- a component's root class becomes its block, in kebab case: `VPContent` → `vp-content`, `VPNavBar` → `vp-nav-bar`; `VPDoc` → `vp-doc-page`, since `vp-doc` is the class of the markdown inside it
- a class its CSS sets together with the root becomes a modifier: `.VPContent.has-sidebar` → `vp-content--has-sidebar`; so do the few classes a template puts on its root that `test/layout-map.mjs` names (VPDocOutlineItem's `root` and `nested`), and the classes VitePress v2 adds to a root by variant, named for it (VPNavMenu's `VPNavBarMenu` → `vp-nav-menu--bar`, VPNavTranslations' `VPNavScreenTranslations` → `vp-nav-translations--screen`)
- any other class of its own becomes a part: VPDoc's `.aside` → `vp-doc-page__aside`; a class its CSS reaches inside a child with `:deep()` keeps the child's name (VPSidebarGroup's `.caret-icon` is `vp-sidebar-item__caret-icon`), unless it styles what fills the component's slot: VPMenu's `.group` and `.item` are `vp-menu__group` and `vp-menu__item`, which those elements carry next to their own names
- global classes keep their names: `vp-doc`, `visually-hidden`, the `vpi-*` icons

A component without a root class of its own takes the one `test/layout-map.mjs` gives it: VPSidebarGroup's `div.group` elements are `vp-sidebar-group`.

BEM separators, because VitePress names child components after their parent's parts (VPNavBar's `.title` holds VPNavBarTitle, `vp-nav-bar-title`).

This site's pages are VitePress's markup with these names: [vpkit-zola](https://github.com/at-least/vpkit-zola) writes them from Zola's templates.

## The files

```css
@import "vpkit/icons.css";   /* the vpi-* icons */
@import "vpkit/layout.css";  /* the page layout */
@import "vpkit/content.css"; /* the markdown */
```

- `icons.css`: VitePress's icons, `<span class="vpi-search"></span>`, a 1em mask over the text color. They are Lucide's (ISC, `LICENSE-Lucide`).
- `layout.css`: the skeleton (`vp-layout`, `vp-content`, `vp-doc-page`, `vp-skip-link`, `vp-backdrop`, the `visually-hidden` helper), the navbar (`vp-nav`, `vp-nav-bar`, `vp-nav-bar-title`, `vp-nav-bar-search`, `vp-nav-menu`, `vp-flyout`, `vp-menu`, `vp-nav-translations`, `vp-nav-appearance`, `vp-switch-appearance`, `vp-nav-social-links`, `vp-nav-bar-hamburger`, `vp-nav-bar-extra`, …) with the nav screen of phones (`vp-nav-screen`), the sidebar (`vp-sidebar`, `vp-sidebar-group`, `vp-sidebar-item`), the local nav under the navbar on narrow screens (`vp-local-nav`, `vp-local-nav-outline-dropdown`), the aside with the outline (`vp-doc-aside`, `vp-doc-aside-outline`, `vp-doc-outline-item`), the doc footer (`vp-doc-footer`: the edit link, `vp-last-updated`, prev and next), the site footer (`vp-footer`) and the home page (`vp-home`: `vp-hero` with `vp-button`s and an image, `vp-features` of `vp-feature`s, `vp-home-content`). `vp-button` and `vp-feature` are VitePress's VPButton and VPFeature as they are, for the home page's markup; [`vp-btn`](@/components/button.md) and [`vp-card`](@/components/card.md) are the versions changed for apps. The 404 page's content is `vp-not-found`, the local search's dialog `vp-local-search-box`. Their states are classes a script toggles, as VitePress's Vue components do: `vp-sidebar--open`, `vp-sidebar-item--collapsed`, `vp-local-nav-outline-dropdown__open`.
- `content.css`: the markdown inside `<div class="vp-doc">`, VitePress's own styles for it with its own class names: headings with `.header-anchor` links, `.custom-block` containers and GitHub alerts, `div[class*='language-']` code blocks (copy button, language label, highlighted, diff and focused lines, line numbers), `.vp-code-group` tabs. Not the code's colors: those come with the highlighter, as Shiki's do in VitePress (vpkit-zola uses Giallo's).

## Compiling

Compile these unminified: Tailwind's `--minify` rounds numbers to six digits, and VitePress's `line-height: 1.3333333` as `1.33333` makes each `h2` 1/64px shorter.

## Where the files come from

The layout files are written by `scripts/vitepress-port.mjs` from VitePress's component styles, with the declarations unchanged; `node scripts/vitepress-port.mjs --write` rewrites them after a re-sync, and the tests fail if a file is not its output.
