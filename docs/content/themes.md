+++
title = "Themes"
description = "vpkit's 223 color themes, each a whole design for light and dark held to contrast minimums: pick one and this page takes it; what a theme sets, where they come from, and your own colors."
+++

# Themes

vpkit's 223 color themes, each a whole design for light and dark: it sets every `--vp-c-*` color the stylesheets use and the brand button's hover color `--vp-button-brand-hover-bg` for light (`:root`) and dark (`.dark`), and the five `--vp-shadow-*` once, at `:root`. Import one after vpkit, or link it after your compiled stylesheet:

```css
@import "vpkit";
@import "vpkit/themes/nord.css";
```

A theme only sets variables, so the components and your utilities follow it.

Pick one below and this page takes it, as a site that imports it would: the page around you, and the components in the example. Switch the appearance in the navbar for the theme's other half. The pick stays on every page of this site for the rest of your browser session. This site is on `vitepress`, as the apps built on vpkit are; the stock card takes it off, to `tokens.css`'s colors.

{% <vp_example title="The components, in the theme picked below"> %}
<div class="grid gap-5">
  <div class="flex flex-wrap items-center gap-3">
    <a class="vp-btn vp-btn-brand" href="#">Get Started</a>
    <button class="vp-btn" type="button">Cancel</button>
    <button class="vp-btn vp-btn-danger" type="button">Delete</button>
    <span class="vp-badge vp-badge-tip">tip</span>
    <span class="vp-badge vp-badge-warning">warning</span>
    <span class="vp-badge vp-badge-danger">danger</span>
    <span class="vp-badge vp-badge-success">success</span>
  </div>
  <div class="vp-alert vp-alert-tip">
    <p class="vp-alert-title">TIP</p>
    <p>An alert, with a <a href="#">link</a> and <code>code</code>.</p>
  </div>
  <div class="vp-alert vp-alert-warning">
    <p class="vp-alert-title">WARNING</p>
    <p>Every color here is the theme's, in light and in dark.</p>
  </div>
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <label class="vp-label" for="file">File name</label>
      <input class="vp-input w-full" id="file" value="notes.txt">
      <p class="mt-3 flex items-center gap-3 text-sm">
        <button class="vp-toggle" type="button" role="switch" aria-checked="true" aria-labelledby="shared">
          <span class="vp-toggle-check"></span>
        </button>
        <span id="shared">Shared</span>
        <a class="vp-link ms-auto" href="#">Details</a>
      </p>
    </div>
    <a class="vp-card" href="#">
      <h2 class="vp-card-title">A card</h2>
      <p class="vp-card-details">Its border turns brand on hover.</p>
    </a>
  </div>
  <div class="flex items-center gap-3 text-sm">
    <span class="vp-progress flex-1" role="progressbar" aria-label="Storage used"
          aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
      <span class="vp-progress-bar" style="width: 60%"></span>
    </span>
    <span class="text-text-2">6 of 10 GB</span>
  </div>
</div>
{% </vp_example> %}

## The themes

- 25 are curated: `github`, `catppuccin`, `nord` and `rose-pine` are hand-tuned, 20 more are mapped by hand from their published palettes, and `vitepress` is VitePress's own palette with its contrast shortfalls fitted (a hovered link's `-2` as text and dimmed in a container, the brand button's white label at rest, hovered and pressed, a control's border at 3:1), written by `scripts/fit-vitepress.mjs` from `tokens.css`. The apps built on vpkit import it, and this site is on it: VitePress's look, AA.
- 198 are mapped automatically from the Helix editor's palettes (`helix/`), each read as Helix reads it, its `inherits` followed, with accents adjusted where the published colors fall short of WCAG AA. A palette's declared background (`ui.background`) decides whether it is the light or the dark half.

{{ <vp_theme_gallery /> }}

## Your own colors

The variables' rules are unlayered, so a stylesheet loaded later can override any of them for both modes, with a theme or without:

```css
:root { --vp-c-brand-1: #0969da; }
.dark { --vp-c-brand-1: #4493f8; }
```

## Switching at runtime

A theme sets `:root` and `.dark`, so one applies per page. To switch themes at runtime, scope copies of their rules under an attribute of your own, such as `[data-theme="nord"]`.

## Links and the brand button

In a theme `brand-2` and each role's `-2` (`tip-2`, `important-2`, `warning-2`, `danger-2`, `caution-2`) are a hovered link's color, which is what VitePress's stylesheets use them for; `default-2` keeps its job as the alt button's hover background. VitePress's `vars.css` describes `-2` as the button's hover color, and makes `brand-2` the brand button's hover background, but in dark mode no one color can be both a white-labelled button's background and a hovered link that reads on the page, so a theme gives the brand button its hover color through `--vp-button-brand-hover-bg`, a variable VitePress has for it. Where a container's tint would leave a hovered link no room, the generator thins the tint, never below 0.06, and a dark page too light to leave room even then is darkened until it does.

## What the tests hold a theme to

`test/themes.mjs` holds every theme to the whole contract (every `--vp-c-*` vpkit's stylesheets reference: the base, the components, the layout, the markdown and the icons, less VitePress's own undefined `--vp-c-shadow-3` in VPSidebar.vue) in both modes, and to contrast minimums: body text 7:1 on the page and on the elevated surface of menus and dialogs, secondary text 4.5:1 on the page, the soft surfaces and the elevated one, muted text 3:1, links 4.5:1 on the page and the elevated surface, white button labels 3:1 on the brand button at rest and hovered, each badge and alert color 4.5:1 on its own tint, and each `-2` 4.5:1 as a hovered link, dimmed to 0.75 where a container dims it, on the container's tint and on code inside it. The generator must fit every theme to them; a half it can't fit fails the run.
