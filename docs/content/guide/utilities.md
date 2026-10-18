+++
title = "Utilities and Variables"
description = "What vpkit gives a Tailwind project: dark mode, VitePress's breakpoints, the semantic colors, shadows and fonts, the --vp-* variables and the global rules."
+++

# Utilities and Variables

What `@import "vpkit"` gives a Tailwind project.

## Dark mode

Put `class="dark"` on `<html>`. The `dark:` variant, every `--vp-*` variable and the color scheme (scrollbars, form controls) follow it.

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

The text colors are `text-body`, `text-secondary` and `text-muted` (VitePress's `text-1`, `text-2` and `text-3`), and the grounds `bg-bg` (the page), `bg-alt`, `bg-soft` and `bg-elv`. The others work with every color utility (`text-`, `bg-`, `border-`, …): `border`, `divider`, `gutter`, `brand-1`/`2`/`3`/`soft`, `default-1`/`2`/`3`/`soft`, `success-1`/`soft`, `warning-1`/`soft`, `danger-1`/`soft`, `sponsor`. So `border-divider`, `text-brand-1`, `bg-danger-soft`.

The first names, which doubled the prefix, still work, with every color utility: `text-text-2`, `bg-bg-alt`, `fill-text-2`.

They resolve to the `--vp-*` variables, so they follow dark mode and a color theme as the components do.

{% <vp_example title="The surfaces and the text colors"> %}
<div class="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
  <div class="rounded-lg border border-divider bg-bg p-3">bg</div>
  <div class="rounded-lg border border-divider bg-alt p-3">bg-alt</div>
  <div class="rounded-lg border border-divider bg-elv p-3">bg-elv</div>
  <div class="rounded-lg border border-divider bg-soft p-3">bg-soft</div>
</div>
<p class="mt-4 text-body">text-body: the body text</p>
<p class="text-secondary">text-secondary: secondary text</p>
<p class="text-muted">text-muted: muted text</p>
{% </vp_example> %}

{% <vp_example title="The roles, as text on their soft tints" layout="row"> %}
<span class="rounded-md bg-brand-soft px-3 py-1 text-sm text-brand-1">brand</span>
<span class="rounded-md bg-default-soft px-3 py-1 text-sm text-body">default</span>
<span class="rounded-md bg-success-soft px-3 py-1 text-sm text-success-1">success</span>
<span class="rounded-md bg-warning-soft px-3 py-1 text-sm text-warning-1">warning</span>
<span class="rounded-md bg-danger-soft px-3 py-1 text-sm text-danger-1">danger</span>
<span class="rounded-md border border-divider px-3 py-1 text-sm text-sponsor">sponsor</span>
{% </vp_example> %}

## Shadows and fonts

`shadow-1` … `shadow-5`, `font-sans`, `font-mono`.

{% <vp_example title="The five shadows" layout="row"> %}
<div class="rounded-lg bg-elv px-4 py-3 text-sm shadow-1">shadow-1</div>
<div class="rounded-lg bg-elv px-4 py-3 text-sm shadow-2">shadow-2</div>
<div class="rounded-lg bg-elv px-4 py-3 text-sm shadow-3">shadow-3</div>
<div class="rounded-lg bg-elv px-4 py-3 text-sm shadow-4">shadow-4</div>
<div class="rounded-lg bg-elv px-4 py-3 text-sm shadow-5">shadow-5</div>
{% </vp_example> %}

## The `--vp-*` variables

The variables from VitePress's `vars.css`: colors, typography, z-indexes, and the per-component ones (nav, sidebar, code, buttons, custom blocks, badges, search). Use them directly in arbitrary values, e.g. `h-(--vp-nav-height)`. A stylesheet loaded later can override any of them: [Themes](@/themes.md#your-own-colors).

## Global rules

`base.css` paints the page ([Getting Started](@/guide/getting-started.md#the-page)) and carries the rules that cannot be utilities:

- the color scheme of the appearance, bold at 600, the pointer cursor on buttons, CJK line breaking
- focus outlines: a focused field keeps a transparent 2px outline where VitePress has none, nothing on screen and the system's focus color in forced colors, which strip the box-shadow ring `vp-input` draws
- reduced motion: every transition and animation off, a dialog's scrim (`::backdrop`) included
- with it, `doc.css`: the external-link icon of rendered markdown; the rest of the markdown's styles are `content.css` ([Getting Started](@/guide/getting-started.md#markdown-and-icons))

## Graded containers

A `vp-graded-containers` class anywhere on the page switches warning and caution to GitHub's severity colors. [Alert](@/components/alert.md#graded-containers) shows them.
