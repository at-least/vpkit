+++
title = "Description List"
description = "Terms and their values, a record's details, each term over its value or beside it; vpkit's own."
+++

# Description List <span class="vp-badge" data-variant="tip">vpkit</span> {#description-list}

Terms and their values: a record's details. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/components/dl/dl.css";
```

{{ <vp_example file="dl/basic" title="An order's details" /> }}

- `vp-dl`: each term over its value, a pair in a `<div>`; the pairs a grid, 0.75rem apart and 1.5rem between columns. One column; more are yours (`sm:grid-cols-2`).
- The term is small secondary text at weight 500; the value body text, which breaks a long word, such as an address, rather than overflow. A value that must stay on one line takes `truncate`.
- A utility on a `<dt>` or a `<dd>` wins.

## Inline

`data-variant="inline"` sets each term beside its value, the `<dt>` and `<dd>` straight in the list: two columns, the terms as wide as the widest, on one baseline.

{{ <vp_example file="dl/inline" title="An event's metadata" /> }}
