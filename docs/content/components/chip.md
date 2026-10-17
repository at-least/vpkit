+++
title = "Chip"
description = "A removable filter: its key and its value in a pill with a control that removes it; vpkit's own."
+++

# Chip

A removable filter: its key and its value in a pill, with a control that removes it. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/chip.css";
```

{% <vp_example title="The filters in force" layout="row"> %}
<span class="vp-chip">
  <span class="vp-chip-key">env</span>
  <span class="vp-chip-value">production</span>
  <a class="vp-chip-remove" href="#" aria-label="Remove the env filter"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></a>
</span>
<span class="vp-chip">
  <span class="vp-chip-key">release</span>
  <span class="vp-chip-value">2.4.1</span>
  <a class="vp-chip-remove" href="#" aria-label="Remove the release filter"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></a>
</span>
{% </vp_example> %}

- `vp-chip`: a 12px pill on the soft ground, its parts in a row.
- `vp-chip-key` in the secondary text, `vp-chip-value` at 600 in the body text.
- `vp-chip-remove`: a link or a button around an icon, in the secondary text, the body text when hovered. Its padding is a hit area larger than the icon, taken back by as much negative margin, so the chip keeps its size. The cross is Lucide's x as an inline SVG (above), drawn at 1rem; the Rust crate's `Chip` writes it.
- Name the control for a screen reader with `aria-label`: the icon says nothing.

{% <vp_example title="A chip that opens its list"> %}
<a class="vp-chip" href="#">
  <span class="vp-chip-key">release:</span>
  <span class="vp-chip-value">2.4.1</span>
</a>
{% </vp_example> %}

A chip can be a link as a whole, to the list its value filters; it then has no remove control, since a control inside a link is no valid HTML.

In Rust: [`Chip`](../../rust/vpkit/struct.Chip.html), from vpkit's [crate](@/guide/rust.md).

On a coarse pointer, a touch screen, the remove control's hit area grows by 0.4375rem on every side, and as much negative margin cancels it, so the chip keeps its size.
