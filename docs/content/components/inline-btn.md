+++
title = "Inline Button"
description = "An icon control inside a line of text that leaves the line as tall as it was; vpkit's own."
+++

# Inline Button <span class="vp-badge vp-badge-tip">vpkit</span> {#inline-button}

An icon control inside a line of text, such as the copy button beside an id, that leaves the line as tall as it was. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/inline-btn.css";
```

{% <vp_example title="An event id and its copy control"> %}
<div class="flex items-center gap-1 text-xs">
  <span class="truncate font-mono">a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4</span>
  <button class="vp-inline-btn" type="button" aria-label="Copy the event id">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
  </button>
</div>
{% </vp_example> %}

- `vp-inline-btn`: a 1rem icon in the secondary text, the body text when hovered. Its 0.3125rem of padding is a hit area larger than the icon, cancelled by as much negative margin, so the line lays it out at the icon's size and keeps its height.
- On a `<button>` or an `<a>`, which brings the pointer. The label is yours (`aria-label`); the icon is a `vpi-*` icon or an inline SVG.
- Its placement is yours: above, a flex row centered on its text. In a toolbar, the 2.25rem square of the [Icon Button](@/components/icon-btn.md) is the control.

On a coarse pointer, a touch screen, its hit area grows by 0.4375rem on every side, and as much negative margin cancels it, so the line keeps its height.
