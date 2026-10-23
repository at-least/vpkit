+++
title = "Chip"
description = "A removable filter: its key and its value in a pill with a control that removes it; vpkit's own."
+++

# Chip <span class="vp-badge" data-variant="tip">vpkit</span> {#chip}

A removable filter: its key and its value in a pill, with a control that removes it. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/components/chip/chip.css";
```

{{ <vp_example file="chip/basic" title="A filter in force" layout="row" /> }}

- `vp-chip`: a pill of 12px text on the soft ground, its parts in a row.
- `vp-chip-key` in the secondary text, `vp-chip-value` at 600 in the body text.
- `vp-chip-remove`: a link or a button around an icon, in the secondary text, the body text when hovered, base.css's ring when focused. Its padding is a hit area larger than the icon, taken back by as much negative margin, so the chip keeps its size. The cross is Lucide's x as an inline SVG (above), drawn at 1rem; the Rust crate's `Chip` writes it.
- Name the control for a screen reader with `aria-label`: the icon says nothing.

{{ <vp_example file="chip/link" title="A chip that opens its list" /> }}

A chip can be a link as a whole, to the list its value filters; it then has no remove control, since a control inside a link is no valid HTML.

In Rust: [`Chip`](../../rust/vpkit/struct.Chip.html), from vpkit's [crate](@/guide/rust.md).

On a coarse pointer, a touch screen, the remove control's padding, its hit area, is 0.4375rem on every side, and as much negative margin cancels it, so the chip keeps its size.
