+++
title = "Utilities and Variables"
description = "What vpkit gives a Tailwind project: dark mode, VitePress's breakpoints, the semantic colors, shadows and fonts, the --vp-* variables and the global rules."
+++

# Utilities and Variables

What `@import "vpkit"` gives a Tailwind project.

## Dark mode

Put `class="dark"` on `<html>`. The `dark:` variant, every `--vp-*` variable and the color scheme (scrollbars, form controls) follow it.

## The page

`base.css` paints the page as VitePress does: `--vp-c-text-1` on `--vp-c-bg` on `<body>`, with VitePress's legibility and font smoothing, and `--vp-c-text-3` placeholders. The rules are in Tailwind's base layer, so a utility on the element, `bg-bg-alt` on `<body>`, still wins. [Getting Started](@/guide/getting-started.md#the-page).

## Breakpoints

VitePress's, replacing Tailwind's defaults:

| Variant | From | At the default font size |
| --- | --- | --- |
| `sm` | 40rem | 640px |
| `md` | 48rem | 768px |
| `lg` | 60rem | 960px |
| `xl` | 80rem | 1280px |
| `2xl` | 90rem | 1440px |

They are in rem because VitePress's media queries are ([vuejs/vitepress#5323](https://github.com/vuejs/vitepress/pull/5323)): at a browser font size other than the default, the layout and the components move with the font size, and a utility in rem moves with them.

## Semantic colors

For every color utility (`text-`, `bg-`, `border-`, …): `bg`, `bg-alt`, `bg-elv`, `bg-soft`, `text-1`, `text-2`, `text-3`, `border`, `divider`, `gutter`, `brand-1`/`2`/`3`/`soft`, `default-1`/`2`/`3`/`soft`, `success-1`/`soft`, `danger-1`/`soft`, `sponsor`. So `text-text-1`, `bg-bg-alt`, `border-divider`, `text-brand-1`, `text-danger-1`.

They resolve to the `--vp-*` variables, so they follow dark mode and a color theme as the components do.

{% <vp_example title="The surfaces and the text colors"> %}
<div class="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
  <div class="rounded-lg border border-divider bg-bg p-3">bg</div>
  <div class="rounded-lg border border-divider bg-bg-alt p-3">bg-alt</div>
  <div class="rounded-lg border border-divider bg-bg-elv p-3">bg-elv</div>
  <div class="rounded-lg border border-divider bg-bg-soft p-3">bg-soft</div>
</div>
<p class="mt-4 text-text-1">text-1: the body text</p>
<p class="text-text-2">text-2: secondary text</p>
<p class="text-text-3">text-3: muted text</p>
{% </vp_example> %}

{% <vp_example title="The roles, as text on their soft tints" layout="row"> %}
<span class="rounded-md bg-brand-soft px-3 py-1 text-sm text-brand-1">brand</span>
<span class="rounded-md bg-default-soft px-3 py-1 text-sm text-text-1">default</span>
<span class="rounded-md bg-success-soft px-3 py-1 text-sm text-success-1">success</span>
<span class="rounded-md bg-danger-soft px-3 py-1 text-sm text-danger-1">danger</span>
<span class="rounded-md border border-divider px-3 py-1 text-sm text-sponsor">sponsor</span>
{% </vp_example> %}

## Shadows and fonts

`shadow-1` … `shadow-5`, `font-sans`, `font-mono`.

{% <vp_example title="The five shadows" layout="row"> %}
<div class="rounded-lg bg-bg-elv px-4 py-3 text-sm shadow-1">shadow-1</div>
<div class="rounded-lg bg-bg-elv px-4 py-3 text-sm shadow-2">shadow-2</div>
<div class="rounded-lg bg-bg-elv px-4 py-3 text-sm shadow-3">shadow-3</div>
<div class="rounded-lg bg-bg-elv px-4 py-3 text-sm shadow-4">shadow-4</div>
<div class="rounded-lg bg-bg-elv px-4 py-3 text-sm shadow-5">shadow-5</div>
{% </vp_example> %}

## The `--vp-*` variables

The variables from VitePress's `vars.css`: colors, typography, z-indexes, and the per-component ones (nav, sidebar, code, buttons, custom blocks, badges, search). Use them directly in arbitrary values, e.g. `h-(--vp-nav-height)`. A stylesheet loaded later can override any of them: [Theming](@/guide/theming.md).

## Global rules

Rules that cannot be utilities (`base.css`): the color scheme of the appearance, bold at 600, pointer cursor on buttons, focus outlines (a focused field keeps a transparent 2px outline where VitePress has none: nothing on screen, the system's focus color in forced colors, which strip the box-shadow ring `vp-input` draws), reduced motion, CJK line breaking, the Alpine `[x-cloak]` rule.

## Markdown rules

`doc.css`: the code-block line notations under `.vp-doc pre`, the code-block title bar and the external-link icon. VitePress's styles for the rest of the markdown are `content.css`, for a docs theme: [Docs Layout](@/guide/layout.md).

## Graded containers

A `vp-graded-containers` class anywhere on the page switches warning and caution to GitHub's severity colors. [Alert](@/components/alert.md#graded-containers) shows them.
