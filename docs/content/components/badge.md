+++
title = "Badge"
description = "VitePress's VPBadge as a class: the info, note, tip, important, caution, warning, danger and success variants, in two sizes, with an outline and a dot."
+++

# Badge

VitePress's `VPBadge`.

```css
@import "vpkit/components/badge/badge.css";
```

{{ <vp_example file="badge/heading" title="A badge in a heading" /> }}

- `vp-badge` alone: the info type (gray).
- `data-variant="note"`, `"tip"`, `"important"`, `"caution"`, `"warning"`, `"danger"`: the other types, a role's text on its tint (note and tip the brand's, caution the danger's).
- `data-variant="success"`: vpkit's (VitePress has no success badge), built the way VitePress builds the others.
- `data-size="sm"`: the small size.

{{ <vp_example file="badge/variants" title="The badge's variants" layout="row" /> }}

{{ <vp_example file="badge/small" title="The small size" layout="row" /> }}

## Outline

On a soft surface, a card or a banded table row, the translucent tint leaves the badge's text short of 4.5:1. `vp-badge-outline`, with any variant, puts the page's color under the text and moves the tint to the border.

{{ <vp_example file="badge/outline" title="Badges on a soft surface, tinted and outlined" /> }}

## A dot

A status's second carrier, never its only one: `vp-badge-dot`, vpkit's, is a dot before the word in the badge's own color, so each variant colors it. A badge holding one lays the two out as a row. Under forced colors the dot paints in the system's text color.

{{ <vp_example file="badge/dot" title="Runs of a job, each with its dot" layout="row" /> }}

## In the markdown

VPBadge's own adjustments come with it: in a `.vp-doc` heading (`h1` to `h6`) a badge sits centered on the line, with VitePress's margins, padding and line height for each level (small or not), and in the docs theme's doc footer (`.vp-doc-footer`) it is hidden.
