+++
title = "Tests"
description = "How vpkit is checked: the color themes against their contract and contrast minimums, the theme variables and breakpoints against VitePress's sources, each component and the layout against VitePress's own rendering."
+++

# Tests

```sh
npm install
npm test
```

## Color themes

`test/themes.mjs` checks every color theme against the contract and the contrast minimums of [Theming](@/guide/theming.md#what-the-tests-hold-a-theme-to) (ported from rustpress's tests, check for check). `test/gen-themes.py` checks that the generator reads a Helix palette that `inherits` another as Helix does; it needs Python 3.11+, as the generator does.

## The theme

`test/tokens.mjs` holds `tokens.css` to VitePress's `vars.css` and `fonts.css` (the copies in `test/upstream/`): every custom property, in the same scope (selector and enclosing `@media`) with the same value, and holds `theme.css`'s five breakpoints to the lengths of upstream's `min-width` media queries, unit included. The one intended difference, the graded containers' literal palette on `:root:has()`, is listed in `known` with its reason, and its literals are held to upstream's orange and yellow of the same mode; an entry that stops matching fails the run.

## Components

Each component is rendered next to the VitePress original in headless Chromium and their computed styles compared, in light and dark mode and with `:hover`/`:active` forced. On an emulated touch screen, each component with `:hover` forced must look as it does at rest. vpkit is compiled minified, as it ships; lengths match within 1/32 px because the minifier shortens numbers like `2.7142857` to `2.71429`. The originals in `test/upstream/` are verbatim copies from the tag in `test/upstream/SOURCE`. A component without a VitePress original is compared with the app recipe it was taken from (`test/recipes.mjs`). Intentional differences are listed, with their reasons, in `known` in `test/cases.mjs`; an entry that stops matching fails the run. While building a component, `CASES='^dialog' node test/compare.mjs` runs only the cases whose names match.

## Forced colors

`test/forced-colors.mjs` renders, with Chromium's emulation of Windows' contrast themes, the components that show a state only with a background or a shadow, which those themes replace: a checked and an unchecked toggle, and a progress bar at two values, must render differently.

## Layout

`test/layout.mjs` takes the layout components from pages VitePress rendered (`test/upstream/pages`). The skeleton's components are taken alone: their own elements, child components reduced to their roots. The navbar, the nav screen, the sidebar, the local nav, the aside, the doc footer and the home page are taken as families, each with the components inside it, so rules that cross components count too; there VitePress's side keeps Vue's scoping, each `<style>` compiled by `@vue/compiler-sfc` (the version VitePress locks) with the scope id the page shows. What VitePress renders only in the browser, the outline or the open sidebar, comes from snapshots of vitepress.dev (`test/upstream/pages/hydrated`, taken by `scripts/snapshot-vitepress.mjs`, which refuses a site running another VitePress version). Each case renders VitePress's markup with VitePress's styles and with vpkit's renamed classes, and compares every element's computed style, pseudo-elements and box at widths around each breakpoint, and in dark mode. The markdown is compared whole: the `.vp-doc` of VitePress's markdown guide, without the output of plugins vpkit does not style (code block titles, MathJax). vpkit is compiled unminified here, as a docs theme ships it, and lengths match within 1/32px, the rounding of layout.

## This documentation

`test/docs.mjs` builds this site with [zola](https://www.getzola.org), with vpkit-zola from a sibling checkout (`docs/themes/vpkit-zola` links to `../vpkit-zola`), under a path as GitHub Pages serves it, and renders its pages in headless Chromium, where nothing outside that path answers. Every component the component tests compile has a page, and every example works: its frame loads the example stylesheet, which styles each class the example's markup uses, follows the page's appearance, and is as tall as its content. The [theme gallery](@/themes.md) has a card for every theme; the site is on the `vitepress` theme from the first frame, with its card pressed; a pick recolors the page and its example, light and dark, and the next page the session opens from its first frame; the stock card takes the page back to `tokens.css`'s colors, and a pick whose stylesheet no longer exists is forgotten. `node scripts/build-docs.mjs --check` fails when `docs/static/example.css`, the stylesheet the frames load, is not what the examples need, or `docs/static/themes.json`, the gallery's index, not what `themes/` holds; `node scripts/build-docs.mjs` rebuilds them.
