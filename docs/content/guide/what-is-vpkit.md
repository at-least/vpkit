+++
title = "What is vpkit?"
description = "VitePress's default-theme look as a Tailwind CSS v4 theme: variables, utilities, components, layout and color themes, as plain CSS."
+++

# What is vpkit?

vpkit is the look of [VitePress](https://vitepress.dev)'s default theme as a [Tailwind CSS v4](https://tailwindcss.com) theme: the `--vp-*` variables, semantic utilities that resolve to them, VitePress's breakpoints, class-based dark mode and the Inter webfonts, plus VitePress's components as CSS classes (`vp-btn`, …) and 223 color themes.

It is plain CSS for Tailwind to compile. There is no build step: vpkit's own `npm install` is only for its tests and theme generators.

You are reading a site built on it: [vpkit-zola](https://github.com/at-least/vpkit-zola), a Zola theme on vpkit's layout, draws these pages, and the examples in them are vpkit's components as an app uses them.

## What is in it

- **The theme**: the `--vp-*` variables of VitePress's `vars.css`, the `dark:` variant, VitePress's breakpoints, and the utilities that resolve to the variables, such as `text-text-1`, `bg-bg-alt` and `border-divider`. [Utilities and Variables](@/guide/utilities.md)
- **Components**: VitePress's look as classes an application page can use, thirty-one of them, one optional import each. [Components](@/components/_index.md)
- **Color themes**: 223 of them, each a whole design for light and dark. [Themes](@/themes.md)
- **The docs layout**: VitePress's page layout and markdown styles as classes, for a docs theme such as [vpkit-zola](https://github.com/at-least/vpkit-zola). [Getting Started](@/guide/getting-started.md#markdown-and-icons) has the files.

## What a component is

A component is a class, or a block of a few classes, that gives an element the look of one of VitePress's components, and nothing else: no JavaScript, no page layout, no behavior beyond what CSS reads off the element's own state. The app opens the dialog and toggles the switch; the component shows the state the app set.

States are attributes, never classes: `vp-btn:disabled`, `vp-input[aria-invalid="true"]`, `vp-toggle[aria-checked="true"]`. The markup an app already writes for accessibility is the markup the component reads, so there is nothing to keep in sync.

## How close to VitePress

Each component is rendered next to its VitePress original, from VitePress v2.0.0-alpha.20, in headless Chromium, and their computed styles are compared in light and dark mode and with `:hover` and `:active` forced. A component VitePress doesn't have is compared with the recipe of the app it was taken from. The layout and the markdown are compared with pages VitePress rendered. Where vpkit differs on purpose, the tests list the difference with its reason. [Tests](https://github.com/at-least/vpkit/blob/main/test/README.md)
