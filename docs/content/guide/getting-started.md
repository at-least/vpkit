+++
title = "Getting Started"
description = "Add vpkit to a Tailwind CSS v4 build: from the Rust crate or from npm, the entry, the page, the parts one by one, the components, the markdown, the fonts, a color theme."
+++

# Getting Started

## Installation

vpkit is a Rust crate and a package of plain CSS in one repository. An app that renders its pages in Rust with [hypertext](https://crates.io/crates/hypertext) takes the crate, at a commit, and gets the CSS from it, so one pin covers the markup and the stylesheets:

```toml
[dependencies]
vpkit = { git = "https://github.com/at-least/vpkit", rev = "<sha>", features = ["css"] }
```

Before the Tailwind build, write the stylesheets out of the crate at that same commit, with its `css` feature (the dependency's `vpkit-css` binary, built from the commit the lock file names in a target directory of its own; or `vpkit::css::write("target/vpkit")` from a binary of your own):

```sh
cargo build -p vpkit --bin vpkit-css --target-dir target/vpkit-css
target/vpkit-css/debug/vpkit-css target/vpkit
```

Anything else takes the CSS from npm, pinned to a commit with `#<sha>`:

```sh
npm install --save-dev github:at-least/vpkit
```

## The entry

Import vpkit from your Tailwind entry stylesheet, after Tailwind itself, then the components you use, one file each, and the markdown last:

```css
@import "tailwindcss" source(none);
@source "../src";                          /* wherever your class strings live */
@import "../target/vpkit/fonts.css";       /* optional: the Inter webfonts */
@import "../target/vpkit/index.css";
@import "../target/vpkit/components/button/button.css";
@import "../target/vpkit/components/input/input.css";
@import "../target/vpkit/prose.css";       /* optional: the markdown */
```

From npm the paths are the package's: `@import "vpkit";`, `@import "vpkit/components/button/button.css";`. `@source` stays in your stylesheet: Tailwind resolves it relative to the file it is written in.

## The page

`base.css` paints the page as VitePress does: the text and background colors on `<body>`, its legibility and font smoothing, and the placeholder color of every input, in Tailwind's base layer, so a utility on the element still wins (`bg-alt` on `<body>`). It also draws the one focus ring: `:focus-visible` on any element takes a 2px outline in the brand color, 2px out, which forced colors keep.

For dark mode, put `class="dark"` on `<html>`, before the first paint, or the page flashes light. Every color is a `light-dark()` pair that the page's color scheme picks, and `tokens.css` sets the scheme from that class, so the pairs, the scrollbars and the form controls turn together. The pairs need Chrome 123, Safari 17.5 or Firefox 120.

```html
<html class="dark">
  <body>
```

## Taking only some parts

`index.css` is three files, each importable on its own:

| file | what it holds |
| --- | --- |
| `theme.css` | the `dark:` variant, the breakpoints, the semantic utilities |
| `tokens.css` | the `--vp-*` variables: the color contract, the radii, the control height, the durations, the focus ring (plain CSS, no Tailwind directive) |
| `base.css` | the page's colors and typography, the placeholder color, the focus ring, VitePress's global element rules |

A project that paints its page itself takes the first two:

```css
@import "tailwindcss" source(none);
@import "vpkit/theme.css";
@import "vpkit/tokens.css";
```

## Components

The components are one import each, so a site ships only the ones it uses:

```css
@import "vpkit/components/button/button.css";
@import "vpkit/components/input/input.css";
```

[Components](@/components/_index.md) has the whole list. A component's markup is in its page, and in its directory as `examples/*.html`; the Rust crate writes the markup of the components that are more than one class ([Rust](@/guide/rust.md)).

## Markdown

`prose.css` is VitePress's own styles for its markdown, inside `<div class="vp-doc">`: headings with anchor links, custom blocks and GitHub alerts, code blocks with their copy button, language label, highlighted and diff lines and line numbers, code group tabs, and the arrow of an external link, under VitePress's own class names. Not the code's colors, which come with the highlighter. Its rules are in `@layer base`, below the components, so a component inside a `vp-doc` keeps its look and its states; the variables it reads are defined on `.vp-doc`, so it needs nothing beyond `tokens.css`.

```css
@import "vpkit/prose.css";
```

## Icons

An icon is an inline SVG in `currentColor`: the crate's `icon` module has Lucide's, the set VitePress draws and a few an app needs (`vpkit::icon::SUN`, `MOON`, `X`, `PLUS`, `SEARCH`, `CHEVRON_DOWN`, …), and any SVG written into the page does the same. [`vp-icon`](@/components/icon.md) sizes one at 1em; a button, an icon button or a chip sizes the SVG inside it. No mask and no `data:` image, so a strict Content-Security-Policy draws them.

## Fonts

`fonts.css` refers to the files as `url("fonts/…")`, relative to the compiled stylesheet: the Tailwind CLI leaves these URLs as written. Copy the repository's `fonts/` directory next to your built CSS once (the crate does not embed them).

## A color theme

Without one, the page is VitePress's palette with its contrast shortfalls fitted: a hovered link dimmed in a container, the brand button's white label and a control's border at WCAG AA, where VitePress's own values fall short. A color theme is one more import, after `index.css`:

```css
@import "vpkit/index.css";
@import "vpkit/themes/nord.css";
```

[Themes](@/themes.md) has the 222 of them.

## The docs theme

VitePress's navbar, sidebar, outline, home page and footers are `docs-theme/`: their stylesheets, for VitePress's markup with its classes renamed, on VitePress's own variables and palette, for a docs theme. [vpkit-zola](https://github.com/at-least/vpkit-zola), the Zola theme this site is built with, is built on it:

```css
@import "vpkit";
@import "vpkit/docs-theme/vars.css";
@import "vpkit/docs-theme/icons.css";
@import "vpkit/docs-theme/layout.css";
@import "vpkit/prose.css";
```
