+++
title = "Table"
description = "VitePress's markdown tables as a class: banded rows, scrolling sideways on its own."
+++

# Table

VitePress's markdown tables.

```css
@import "vpkit/table.css";
```

{% <vp_example title="A table"> %}
<table class="vp-table">
  <thead><tr><th>Plan</th><th>Price</th><th>Storage</th></tr></thead>
  <tbody>
    <tr><td>Free</td><td>$0</td><td>5 GB</td></tr>
    <tr><td>Pro</td><td>$9</td><td>100 GB</td></tr>
    <tr><td>Team</td><td>$29</td><td>1 TB</td></tr>
  </tbody>
</table>
{% </vp_example> %}

The table scrolls sideways on its own rather than squeezing its columns, and every second row is banded. It keeps VitePress's 1.25rem vertical margin; `my-0` removes it.

{% <vp_example title="Without the margin"> %}
<table class="vp-table my-0">
  <thead><tr><th>Plan</th><th>Price</th></tr></thead>
  <tbody><tr><td>Pro</td><td>$9</td></tr></tbody>
</table>
{% </vp_example> %}
