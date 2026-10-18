+++
title = "Utilities and Variables"
description = "What vpkit gives a Tailwind project: dark mode, VitePress's breakpoints, the semantic colors, shadows and fonts, the --vp-* variables and the global rules."
+++

# Utilities and Variables

What `@import "vpkit"` gives a Tailwind project.

## Dark mode

Put `class="dark"` on `<html>`. The `dark:` variant, the color scheme and with it every `light-dark()` pair, the scrollbars and the form controls follow it.

## Breakpoints

VitePress's, replacing Tailwind's defaults:

| Variant | From | At the default font size |
| --- | --- | --- |
| `sm` | 40rem | 640px |
| `md` | 48rem | 768px |
| `lg` | 60rem | 960px |
| `xl` | 80rem | 1280px |
| `2xl` | 90rem | 1440px |

They are in rem because VitePress's media queries are ([vuejs/vitepress#5323](https://github.com/vuejs/vitepress/pull/5323)): at a browser font size other than the default, the components move with the font size, and a utility in rem moves with them.

## Semantic colors

The text colors are `text-body`, `text-secondary` and `text-muted`, and the grounds `bg-page`, `bg-alt`, `bg-soft` and `bg-elv`. The rest work with every color utility (`text-`, `bg-`, `border-`, `fill-`, …): the lines `border`, `divider` and `gutter`; `brand`, `brand-hover`, `brand-fill` and `brand-soft`; `gray-fill` and `gray-soft`; `success`, `warning`, `danger` and `important`, each with its `-soft` tint. So `border-divider`, `text-brand`, `bg-danger-soft`, `fill-brand`.

They resolve to the `--vp-c-*` variables, so they follow dark mode and a color theme as the components do.

{{ <vp_example file="pages/surfaces" title="The surfaces and the text colors" /> }}

{{ <vp_example file="pages/roles" title="The roles, as text on their soft tints" layout="row" /> }}

## Shadows and fonts

`shadow-1` … `shadow-5`, `font-sans`, `font-mono`.

{{ <vp_example file="pages/shadows" title="The five shadows" layout="row" /> }}

## The `--vp-*` variables

The colors are the contract every color theme defines, 34 colors named by their job, each a `light-dark()` pair: the grounds `--vp-c-bg`, `-bg-alt`, `-bg-elv` and `-bg-soft`; the text `-text-1`, `-text-2` and `-text-3`; the lines `-border`, `-divider` and `-gutter`; `-brand` (text, icons and lines), `-brand-hover` (a hovered link), `-brand-fill`, `-brand-fill-hover` and `-brand-fill-active` (the brand button's grounds, white text on them) and `-brand-soft` (the tint); `-gray-fill`, `-gray-fill-hover`, `-gray-fill-active` (the alt button's grounds) and `-gray-soft` (the wash); and a role's text, hover and tint: `-success`, `-warning`, `-danger`, `-caution`, `-important`, each with `-soft` and all but success with `-hover`. Tip and note read brand; caution is danger unless a page sets it apart. With them the five shadows, `--vp-shadow-1` to `-5`.

The rest is not themed: the font families (`--vp-font-family-base`, `-mono`), the radii (`--vp-radius-sm`, `--vp-radius`, `--vp-radius-lg`, `--vp-radius-full`), the control height (`--vp-control-height`, 2.75rem, a touch target's 44px; `-sm` 2.25rem, `-lg` 3rem), the durations (`--vp-duration-fast`, `--vp-duration`, `--vp-duration-slow`), the focus ring (`--vp-focus-ring`, `--vp-focus-ring-offset`), the bar's height (`--vp-nav-height`), the layout's width (`--vp-layout-max-width`) and the scrim (`--vp-backdrop-bg-color`). Use any of them in arbitrary values, e.g. `h-(--vp-nav-height)`. A stylesheet loaded later can override any of them: [Themes](@/themes.md#your-own-colors).

## Global rules

`base.css` paints the page ([Getting Started](@/guide/getting-started.md#the-page)) and carries the rules that cannot be utilities:

- the one focus ring: `:focus-visible` draws `--vp-focus-ring`, on a button, a link, a field, a scroll box, a dialog; an outline follows the box's corners, and forced colors keep it. `outline-none` on an element removes it; a component restates it only to inset it.
- bold at 600, the pointer cursor on buttons, CJK line breaking, no autospace in code
- reduced motion: every transition and animation off, a dialog's scrim (`::backdrop`) included

{{ <vp_example file="pages/focus" title="The focus ring, on a button, a field and a link: press Tab" layout="row" /> }}

## Graded containers

The docs theme's `vars.css` has VitePress's graded containers: a `vp-graded-containers` class anywhere on the page switches warning and caution to GitHub's severity colors, orange and yellow. In an app, which has no `vars.css`, set `--vp-c-caution` and its hover and tint yourself where caution should not read as danger.
