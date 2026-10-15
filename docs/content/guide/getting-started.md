+++
title = "Getting Started"
description = "Add vpkit to a Tailwind CSS v4 build: the import, the page, the parts one by one, the components and the fonts."
+++

# Getting Started

## Installation

vpkit is not on npm: add it from its repository, pinned to a commit with `#<sha>` after the name if you like:

```sh
npm install --save-dev github:at-least/vpkit
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

`base.css` paints the page as VitePress does: the text and background colors on `<body>`, its legibility and font smoothing, and the placeholder color of every input, in Tailwind's base layer, so a utility on the element still wins (`bg-bg-alt` on `<body>`). For dark mode, put `class="dark"` on `<html>`, before the first paint, or the page flashes light.

```html
<html class="dark">
  <body>
```

## Taking only some parts

`vpkit` (`index.css`) is four files, each importable on its own:

| file | what it holds |
| --- | --- |
| `vpkit/theme.css` | the `dark:` variant, the breakpoints, the semantic utilities |
| `vpkit/tokens.css` | the `--vp-*` variables (plain CSS, no Tailwind directive) |
| `vpkit/doc.css` | the external-link rules for rendered markdown |
| `vpkit/base.css` | the page's colors and typography, the placeholder color, VitePress's global element rules |

`base.css`'s element rules are unlayered and reset focus outlines (`button:focus { outline: none }`), so a project that draws its own focus rings should leave it out, and paint its page itself:

```css
@import "tailwindcss" source(none);
@import "vpkit/tokens.css";
@import "vpkit/theme.css";
```

## Components

The components are one import each, so a site ships only the ones it uses:

```css
@import "vpkit";
@import "vpkit/button.css";
@import "vpkit/input.css";
```

[Components](@/components/_index.md) has the whole list.

## Markdown and icons

Two more optional imports, outside `vpkit`, for a page that renders markdown or shows VitePress's icons:

```css
@import "vpkit/content.css";
@import "vpkit/icons.css";
```

- `content.css`: VitePress's own styles for its markdown, inside `<div class="vp-doc">`: headings with anchor links, custom blocks and GitHub alerts, code blocks with their copy button, language label, highlighted and diff lines and line numbers, and code group tabs, under VitePress's own class names. Not the code's colors, which come with the highlighter. Its rules are in `@layer base`, below the components, so a component inside a `vp-doc` keeps its look and its states.
- `icons.css`: VitePress's icons, `<span class="vpi-search"></span>`, a 1em mask over the text color. They are Lucide's (ISC, `LICENSE-Lucide`). Each is an inline SVG in a `data:` URL, so a page with a Content-Security-Policy allows `img-src data:`, or every icon shows nothing. Under forced colors an icon paints in the system's text color, where the mask's own ground would be erased.

The icons, all twenty-one:

{% <vp_example title="The icons"> %}
<ul class="flex flex-wrap gap-x-6 gap-y-3 text-sm">
  <li class="flex items-center gap-2"><span class="vpi-align-left" aria-hidden="true"></span><code>vpi-align-left</code></li>
  <li class="flex items-center gap-2"><span class="vpi-arrow-down" aria-hidden="true"></span><code>vpi-arrow-down</code></li>
  <li class="flex items-center gap-2"><span class="vpi-arrow-left" aria-hidden="true"></span><code>vpi-arrow-left</code></li>
  <li class="flex items-center gap-2"><span class="vpi-arrow-right" aria-hidden="true"></span><code>vpi-arrow-right</code></li>
  <li class="flex items-center gap-2"><span class="vpi-arrow-up" aria-hidden="true"></span><code>vpi-arrow-up</code></li>
  <li class="flex items-center gap-2"><span class="vpi-chevron-down" aria-hidden="true"></span><code>vpi-chevron-down</code></li>
  <li class="flex items-center gap-2"><span class="vpi-chevron-left" aria-hidden="true"></span><code>vpi-chevron-left</code></li>
  <li class="flex items-center gap-2"><span class="vpi-chevron-right" aria-hidden="true"></span><code>vpi-chevron-right</code></li>
  <li class="flex items-center gap-2"><span class="vpi-chevron-up" aria-hidden="true"></span><code>vpi-chevron-up</code></li>
  <li class="flex items-center gap-2"><span class="vpi-corner-down-left" aria-hidden="true"></span><code>vpi-corner-down-left</code></li>
  <li class="flex items-center gap-2"><span class="vpi-delete" aria-hidden="true"></span><code>vpi-delete</code></li>
  <li class="flex items-center gap-2"><span class="vpi-heart" aria-hidden="true"></span><code>vpi-heart</code></li>
  <li class="flex items-center gap-2"><span class="vpi-languages" aria-hidden="true"></span><code>vpi-languages</code></li>
  <li class="flex items-center gap-2"><span class="vpi-layout-list" aria-hidden="true"></span><code>vpi-layout-list</code></li>
  <li class="flex items-center gap-2"><span class="vpi-moon" aria-hidden="true"></span><code>vpi-moon</code></li>
  <li class="flex items-center gap-2"><span class="vpi-more-horizontal" aria-hidden="true"></span><code>vpi-more-horizontal</code></li>
  <li class="flex items-center gap-2"><span class="vpi-plus" aria-hidden="true"></span><code>vpi-plus</code></li>
  <li class="flex items-center gap-2"><span class="vpi-search" aria-hidden="true"></span><code>vpi-search</code></li>
  <li class="flex items-center gap-2"><span class="vpi-sparkles" aria-hidden="true"></span><code>vpi-sparkles</code></li>
  <li class="flex items-center gap-2"><span class="vpi-square-pen" aria-hidden="true"></span><code>vpi-square-pen</code></li>
  <li class="flex items-center gap-2"><span class="vpi-sun" aria-hidden="true"></span><code>vpi-sun</code></li>
</ul>
{% </vp_example> %}

The rest of VitePress's page, the navbar, the sidebar, the outline, the home page and the footers, is `layout.css`, for a docs theme: VitePress's markup with its classes renamed, by the scheme in the file's header. [vpkit-zola](https://github.com/at-least/vpkit-zola), the Zola theme this site is built with, is built on it.

## Fonts

`fonts.css` refers to the files as `url("fonts/…")`, relative to the compiled stylesheet: the Tailwind CLI leaves these URLs as written. Serve this package's `fonts/` directory next to your built CSS.

## A color theme

A color theme is one more import, after vpkit:

```css
@import "vpkit";
@import "vpkit/themes/nord.css";
```

Without one, the page is VitePress's stock palette, `tokens.css`'s, which falls short of WCAG AA in a few places: a hovered link dimmed in a container, the brand button's white label, a control's border. `vitepress` is that palette with those shortfalls fitted, VitePress's look at AA; the apps built on vpkit and this site import it:

```css
@import "vpkit";
@import "vpkit/themes/vitepress.css";
```

[Themes](@/themes.md) has the 223 of them.
