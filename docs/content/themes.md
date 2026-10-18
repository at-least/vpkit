+++
title = "Themes"
description = "vpkit's 222 color themes, each a whole design for light and dark held to contrast minimums: pick one and this page takes it; what a theme sets, where they come from, and your own colors."
+++

# Themes

vpkit's 222 color themes, each a whole design for light and dark, held by the tests to WCAG contrast minimums ([Tests](https://github.com/at-least/vpkit/blob/main/test/README.md#color-themes)): one `:root` block that sets the contract, the 34 `--vp-c-*` colors, each a `light-dark()` pair, light first, and the five `--vp-shadow-*`. Import one after vpkit, or link it after your compiled stylesheet:

```css
@import "vpkit";
@import "vpkit/themes/nord.css";
```

A theme only sets variables, so the components and your utilities follow it.

Pick one below and this page takes it, as a site that imports it would: the page around you, and the components in the example. Switch the appearance in the navbar for the theme's other half. The pick stays on every page of this site for the rest of your browser session. Without a pick the site is on the stock colors, `tokens.css`'s: VitePress's palette with its contrast shortfalls fitted, which the apps built on vpkit run on; the stock card takes a pick off.

{{ <vp_example file="pages/theme" title="The components, in the theme picked below" /> }}

## Your own colors

The variables' rules are unlayered, so a stylesheet loaded later can override any of them, for both modes in one line, with a theme or without:

```css
:root { --vp-c-brand: light-dark(#0969da, #4493f8); }
```

Every variable a theme must set, and what each is for, is on [Utilities and Variables](@/guide/utilities.md#the-vp-variables); the contrast each must reach is the token contract in [DESIGN.md](https://github.com/at-least/vpkit/blob/main/DESIGN.md).

## Switching at runtime

A theme sets `:root`, so one applies per page. To switch themes at runtime, scope copies of their rules under an attribute of your own, such as `[data-theme="nord"]`, and set the attribute on `<html>`.

## The themes

- 24 are curated: `github`, `catppuccin`, `nord` and `rose-pine` are hand-tuned, and 20 more are mapped by hand from their published palettes.
- 198 are mapped automatically from the Helix editor's palettes (`helix/`), each read as Helix reads it, its `inherits` followed, with accents adjusted where the published colors fall short of WCAG AA. A palette's declared background (`ui.background`) decides whether it is the light or the dark half.

{{ <vp_theme_gallery /> }}
