+++
title = "Checkbox"
description = "A bare checkbox in a row or a cell, with the label around it that is its tap target; vpkit's own."
+++

# Checkbox <span class="vp-badge" data-variant="tip">vpkit</span> {#checkbox}

A bare checkbox in a row or a cell, where a [Choice](@/components/choice.md)'s card would be too much: a table's select column. VitePress has none; this is vpkit's own, on the tokens.

```css
@import "vpkit/components/checkbox/checkbox.css";
```

{{ <vp_example file="checkbox/column" title="A table's select column" /> }}

- `vp-checkbox`: 1rem, the browser's box in the brand's accent; focused, it draws base.css's ring.
- `vp-checkbox-label`: the label around it that is its tap target. On a coarse pointer it is a 2.75rem square, a touch target's 44px, pulled over the cell's padding so the row barely grows; the control keeps its 1rem.
- Its name is yours: `aria-label`, or the row's text inside the label.
- In a [Table](@/components/table.md), a row whose first cell holds a checked one is selected.
