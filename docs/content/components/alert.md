+++
title = "Alert"
description = "VitePress's custom blocks (::: tip and the others) as a class with its type as an attribute, the details block on <details>, and an icon beside the text."
+++

# Alert

VitePress's custom blocks (`::: tip` and the others).

```css
@import "vpkit/components/alert/alert.css";
```

{{ <vp_example file="alert/tip" title="A tip" /> }}

- `vp-alert` alone: the info type (gray).
- `data-variant="note"`, `"tip"`, `"important"`, `"warning"`, `"danger"`, `"caution"`: the other types, each the role's text for its links and code on the role's tint. A note is the info look under its own title, as VitePress's is; caution is the danger's color unless a theme sets it apart.
- `vp-alert-title`: the bold title line; a block with one gets the larger top padding.
- `<details class="vp-alert">`: the details block, by element. Its `<summary>` is the title, bold, with the pointer; the block opens and closes as the element does, and takes a variant like any other.

{{ <vp_example file="alert/variants" title="The alert's types" layout="stack" /> }}

{{ <vp_example file="alert/details" title="A details block" /> }}

## What goes inside

Links, inline code and paragraphs inside take the alert's look. A nested alert keeps its own colors. A component keeps its own look too, inside a `vp-doc` as well: a `vp-btn`, `vp-link`, `vp-code`, `vp-card`, `vp-dropdown-item`, `vp-tabs-tab` or `vp-icon-btn` is not restyled as a link or as code, hovered either: the alert's rules for links and inline code are for bare ones.

{{ <vp_example file="alert/inside" title="A button and a nested alert inside an alert" /> }}

## With an icon

vpkit's addition: an icon (`vp-alert-icon`, an inline SVG) first, then the content in one element. The block becomes a row, the icon 1rem square in the type's color and centered on the first line, the content beside it.

{{ <vp_example file="alert/icons" title="A warning and a danger notice with icons" layout="stack" /> }}

Not included: the rules for tables and blockquotes inside a block.
