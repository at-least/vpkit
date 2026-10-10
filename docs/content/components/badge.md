+++
title = "Badge"
description = "VitePress's VPBadge as a class: the info, note, tip, important, caution, warning, danger and success types, in two sizes."
+++

# Badge

VitePress's `VPBadge`.

```css
@import "vpkit/badge.css";
```

{% <vp_example title="A badge in a heading"> %}
<h2 class="text-2xl font-semibold">Search <span class="vp-badge vp-badge-tip">new</span></h2>
{% </vp_example> %}

- `vp-badge` alone: the info type (gray).
- `vp-badge-note`, `vp-badge-tip`, `vp-badge-important`, `vp-badge-caution`, `vp-badge-warning`, `vp-badge-danger`: the other types.
- `vp-badge-success`: vpkit's addition (VitePress has no success badge), built the way VitePress builds the others: success text on the soft success tint.
- `vp-badge-small`: the small size.
- `vp-badge-outline`: vpkit's addition, with any type: the badge on the page's color with the type's tint as its border, for a badge on a soft surface.

{% <vp_example title="The badge's types" layout="row"> %}
<span class="vp-badge">info</span>
<span class="vp-badge vp-badge-note">note</span>
<span class="vp-badge vp-badge-tip">tip</span>
<span class="vp-badge vp-badge-important">important</span>
<span class="vp-badge vp-badge-caution">caution</span>
<span class="vp-badge vp-badge-warning">warning</span>
<span class="vp-badge vp-badge-danger">danger</span>
<span class="vp-badge vp-badge-success">success</span>
{% </vp_example> %}

{% <vp_example title="The small size" layout="row"> %}
<span class="vp-badge vp-badge-small">info</span>
<span class="vp-badge vp-badge-tip vp-badge-small">tip</span>
<span class="vp-badge vp-badge-danger vp-badge-small">danger</span>
{% </vp_example> %}

## Outline

On a soft surface, a card or a banded table row, the translucent tint leaves the badge's text short of 4.5:1 (success on `bg-soft`: 4.42:1 in light, measured by totality). `vp-badge-outline` puts the page's color under the text and moves the tint to the border.

{% <vp_example title="Badges on a soft surface, tinted and outlined"> %}
<div class="rounded-xl bg-bg-soft p-4">
  <span class="vp-badge vp-badge-success">paid</span>
  <span class="vp-badge vp-badge-danger">canceled</span>
  <span class="vp-badge">pending</span>
  <span class="vp-badge vp-badge-success vp-badge-outline ml-4">paid</span>
  <span class="vp-badge vp-badge-danger vp-badge-outline">canceled</span>
  <span class="vp-badge vp-badge-outline">pending</span>
</div>
{% </vp_example> %}

## In the markdown

VPBadge's own adjustments come with it: in a `.vp-doc` heading (`h1` to `h6`) a badge sits centered on the line, with VitePress's margins, padding and line height for each level (small or not), and in the doc footer (`.vp-doc-footer`) it is hidden.
