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
  <a class="vp-chip-remove" href="#" aria-label="Remove the env filter"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg></a>
</span>
<span class="vp-chip">
  <span class="vp-chip-key">release</span>
  <span class="vp-chip-value">2.4.1</span>
  <a class="vp-chip-remove" href="#" aria-label="Remove the release filter"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg></a>
</span>
{% </vp_example> %}

- `vp-chip`: a 12px pill on the soft ground, its parts in a row.
- `vp-chip-key` in the secondary text, `vp-chip-value` at 600 in the body text.
- `vp-chip-remove`: a link or a button around an icon, in the secondary text, the body text when hovered. Its padding is a hit area larger than the icon, taken back by as much negative margin, so the chip keeps its size. The icon is yours (vpkit's icons have no cross); it is drawn at 1rem.
- Name the control for a screen reader with `aria-label`: the icon says nothing.
