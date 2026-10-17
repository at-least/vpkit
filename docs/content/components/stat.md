+++
title = "Stat"
description = "One number in a box, with its title beside it and a hint under it; vpkit's own."
+++

# Stat

One number in a box, with its title beside it and a hint under it. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/stat.css";
```

{% <vp_example title="Three stats in a grid"> %}
<div class="grid gap-4 sm:grid-cols-3">
  <div class="vp-stat">
    <header class="vp-stat-header">
      <p class="vp-stat-title">Crash-free sessions</p>
      <span class="vp-stat-value">99.2%</span>
    </header>
    <p class="vp-stat-hint">release 2.4.1</p>
  </div>
  <div class="vp-stat">
    <header class="vp-stat-header">
      <p class="vp-stat-title">Unhandled errors</p>
      <span class="vp-stat-value">1.2k</span>
    </header>
    <p class="vp-stat-hint">in the last 7 days</p>
  </div>
  <div class="vp-stat">
    <header class="vp-stat-header">
      <p class="vp-stat-title">New issues</p>
      <span class="vp-stat-value">14</span>
    </header>
    <p class="vp-stat-hint">first seen in the last 7 days</p>
  </div>
</div>
{% </vp_example> %}

- `vp-stat`: the box, as an outlined [Card](@/components/card.md) draws it: the page's ground in a divider border, a 0.75rem radius, 1rem by 1.25rem of padding.
- `vp-stat-header`: the title and the value on one baseline, at its two ends.
- `vp-stat-title`: 13px at 500 in the secondary text, on a paragraph: a grid of stats is one section's figures, not headings of its own. `vp-stat-value`: 22px at 600, in tabular figures, so numbers that change keep their width.
- `vp-stat-hint`: 13px secondary text under the header, at most 75 characters wide.
- The grid, and a stat that is a link to the list it counts, are yours.

In Rust: [`Stat`](../../rust/vpkit/struct.Stat.html), from vpkit's [crate](@/guide/rust.md).

## A stat that is a link

A stat on an `<a>` opens the list it counts: it keeps the text's color and has no underline, and takes the brand border while hovered.

{% <vp_example title="A figure that opens its list"> %}
<a class="vp-stat w-56" href="#">
  <div class="vp-stat-header"><p class="vp-stat-title">Open issues</p><span class="vp-stat-value">42</span></div>
</a>
{% </vp_example> %}
