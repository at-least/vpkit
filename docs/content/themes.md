+++
title = "Themes"
description = "vpkit's 223 color themes, each a whole design for light and dark: pick one, and this page takes it."

[extra]
sidebar = false
aside = false
+++

# Themes

vpkit's 223 color themes, each a whole design for light and dark. Pick one below and this page takes it, as a site that imports it would: the page around you, and the components in the example. Switch the appearance in the navbar for the theme's other half. The pick stays on every page of this site for the rest of your browser session. This site is on `vitepress`, as the apps built on vpkit are; the stock card takes it off, to `tokens.css`'s colors.

```css
@import "vpkit";
@import "vpkit/themes/nord.css";
```

[Theming](@/guide/theming.md#color-themes) has what a theme sets, where the themes come from, and what the tests hold each one to.

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

The 24 curated themes are hand-tuned or mapped by hand from their published palettes; the other 198 are mapped from the Helix editor's palettes.

{{ <vp_theme_gallery /> }}
