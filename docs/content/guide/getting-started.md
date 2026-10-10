+++
title = "Getting Started"
description = "Add vpkit to a Tailwind CSS v4 build: the import, the page, the parts one by one, the components and the fonts."
+++

# Getting Started

## Installation

Add it as a dependency (here from a sibling checkout):

```sh
npm install --save-dev ../vpkit
```

Then import it from your Tailwind entry stylesheet, after Tailwind itself:

```css
@import "tailwindcss" source(none);
@source "../src";             /* wherever your class strings live */
@import "vpkit/fonts.css";  /* optional: the Inter webfonts */
@import "vpkit";
```

`@source` stays in your stylesheet: Tailwind resolves it relative to the file it is written in.

## The page

vpkit colors its components, not the page: put `bg-bg text-text-1` on `<body>`. For dark mode, put `class="dark"` on `<html>`, before the first paint, or the page flashes light.

```html
<html class="dark">
  <body class="bg-bg text-text-1">
```

## Taking only some parts

`vpkit` (`index.css`) is four files, each importable on its own:

| file | what it holds |
| --- | --- |
| `vpkit/theme.css` | the `dark:` variant, the breakpoints, the semantic utilities |
| `vpkit/tokens.css` | the `--vp-*` variables (plain CSS, no Tailwind directive) |
| `vpkit/doc.css` | code-block and external-link rules for rendered markdown |
| `vpkit/base.css` | VitePress's global element rules |

`base.css` is unlayered and resets focus outlines (`button:focus { outline: none }`), so a project that draws its own focus rings should leave it out:

```css
@import "tailwindcss" source(none);
@import "vpkit/tokens.css";
@import "vpkit/theme.css";
```

## Components

The components are imports of their own, one file each, so a site ships only the ones it uses:

```css
@import "vpkit";
@import "vpkit/button.css";
@import "vpkit/input.css";
```

[Components](@/components/_index.md) has the whole list.

## Fonts

`fonts.css` refers to the files as `url("fonts/…")`, relative to the compiled stylesheet: the Tailwind CLI leaves these URLs as written. Serve this package's `fonts/` directory next to your built CSS.

## A color theme

A color theme is one more import, after vpkit:

```css
@import "vpkit";
@import "vpkit/themes/nord.css";
```

[Theming](@/guide/theming.md#color-themes) has the 222 of them.
