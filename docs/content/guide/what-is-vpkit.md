+++
title = "What is vpkit?"
description = "VitePress's look as a Tailwind CSS v4 theme and a kit of components for applications: the color contract, the utilities, the components, the Rust crate, the color themes and the docs theme."
+++

# What is vpkit?

vpkit is the look of [VitePress](https://vitepress.dev)'s default theme, for applications: a [Tailwind CSS v4](https://tailwindcss.com) theme (the `--vp-*` variables, semantic utilities that resolve to them, VitePress's breakpoints, class-based dark mode, the Inter webfonts), components as CSS classes (`vp-btn`, `vp-input`, `vp-dialog`, …), a Rust crate that writes their markup and carries the stylesheets, 222 color themes, and VitePress's docs layout as a product of its own.

It is plain CSS for Tailwind to compile. There is no build step: vpkit's own `npm install` is only for its tests and its generators.

You are reading a site built on it: [vpkit-zola](https://github.com/at-least/vpkit-zola), a Zola theme on vpkit's docs theme, draws these pages, and the examples in them are vpkit's components as an app uses them.

## What is in it

- **The theme**: the color contract, 34 `--vp-c-*` variables named by their job, each a `light-dark()` pair, with the radii, the control height, the durations and the focus ring; the `dark:` variant; VitePress's breakpoints; and the utilities that resolve to the variables, such as `text-body`, `bg-soft`, `border-divider` and `text-brand`. [Utilities and Variables](@/guide/utilities.md)
- **Components**: VitePress's look as classes an application page can use, one optional import each, in one directory each with its examples and its proof. [Components](@/components/_index.md)
- **The Rust crate**: hypertext components for the markup that is more than one class, Lucide's icons as inline SVG, and the stylesheets embedded, so one commit pins both. [Rust](@/guide/rust.md)
- **Color themes**: 222 of them, each a whole design for light and dark. [Themes](@/themes.md)
- **The docs theme**: VitePress's page layout, on VitePress's own variables and palette, for a docs theme such as vpkit-zola. [Getting Started](@/guide/getting-started.md#the-docs-theme)

## What a component is

A component is a class, or a block of a few classes, that gives an element the look of one of VitePress's components, and nothing else: no JavaScript, no page layout, no behavior beyond what CSS reads off the element's own state. The app opens the dialog and toggles the switch; the component shows the state the app set.

The class says what the element is; what varies is an attribute. A mutually exclusive axis is `data-variant` or `data-size` (`<button class="vp-btn" data-variant="brand" data-size="lg">`); an orthogonal switch is a class (`vp-table-sticky`); a state is the attribute the markup carries anyway: `vp-btn:disabled`, `vp-input[aria-invalid="true"]`, `vp-toggle[aria-checked="true"]`, `vp-btn[aria-current]`. The markup an app already writes for accessibility is the markup the component reads, so there is nothing to keep in sync.

Every control that shares a row shares one height, 2.75rem, a touch target's 44px (`data-size="sm"` 2.25rem, `"lg"` 3rem), and there is one focus ring.

## How close to VitePress

Each component is proven in headless Chromium, in both modes and with `:hover`, `:active` and the other states forced. What is VitePress's, the colors, the type, the borders, the motion, is compared property by property with the original at v2.0.0-alpha.20, rendered on vpkit's fitted palette; what is vpkit's, a component VitePress has none of or a departure from one, is held to recorded values, each departure named in the test. The docs theme's layout and the markdown are compared with pages VitePress rendered. [Tests](https://github.com/at-least/vpkit/blob/main/test/README.md)
