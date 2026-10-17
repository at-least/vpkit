+++
title = "Checkbox"
description = "A bare checkbox in a row or a cell, with the label around it that is its tap target; vpkit's own."
+++

# Checkbox

A bare checkbox in a row or a cell, where a [Choice](@/components/choice.md)'s card would be too much: a table's select column. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/checkbox.css";
```

{% <vp_example title="A table's select column"> %}
<table class="vp-table my-0">
  <thead><tr><th><label class="vp-checkbox-label"><input class="vp-checkbox" type="checkbox" aria-label="Select all"></label></th><th>Project</th></tr></thead>
  <tbody>
    <tr><td><label class="vp-checkbox-label"><input class="vp-checkbox" type="checkbox" aria-label="Select shop" checked></label></td><td>shop</td></tr>
    <tr><td><label class="vp-checkbox-label"><input class="vp-checkbox" type="checkbox" aria-label="Select bot-server"></label></td><td>bot-server</td></tr>
  </tbody>
</table>
{% </vp_example> %}

- `vp-checkbox`: 1rem, in the brand's accent; 1.25rem on a coarse pointer.
- `vp-checkbox-label`: the label around it that is its tap target. On a coarse pointer it is a 2.75rem square, a touch target's 44px, pulled over the cell's padding so the row barely grows.
- Its name is yours: `aria-label`, or the row's text inside the label.
