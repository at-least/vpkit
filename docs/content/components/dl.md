+++
title = "Description List"
description = "Terms and their values, a record's details, each term over its value or beside it; vpkit's own."
+++

# Description List <span class="vp-badge vp-badge-tip">vpkit</span> {#description-list}

Terms and their values: a record's details. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/dl.css";
```

{% <vp_example title="An order's details"> %}
<dl class="vp-dl sm:grid-cols-2">
  <div><dt>Ordered</dt><dd>2026-10-18</dd></div>
  <div><dt>Invoice email</dt><dd>someone.with.a.long.address@example.com</dd></div>
  <div><dt>Total</dt><dd>NT$1,280</dd></div>
  <div><dt>Invoice</dt><dd>Sent to the email above</dd></div>
</dl>
{% </vp_example> %}

- `vp-dl`: each term over its value, a pair in a `<div>`; the pairs a grid, 0.75rem apart and 1.5rem between columns. One column; more are yours (`sm:grid-cols-2`).
- The term is small secondary text at weight 500; the value body text, which breaks a long word, such as an address, rather than overflow. A value that must stay on one line takes `truncate`.
- A utility on a `<dt>` or a `<dd>` wins.

## Inline

`vp-dl-inline`, with `vp-dl`, sets each term beside its value, the `<dt>` and `<dd>` straight in the list: two columns, the terms as wide as the widest, on one baseline.

{% <vp_example title="An event's metadata"> %}
<dl class="vp-dl vp-dl-inline">
  <dt>Release</dt><dd>2.4.1</dd>
  <dt>Device ID</dt><dd>3f9c2b7e-very-long-identifier-0042</dd>
  <dt>OS</dt><dd>iOS 18.1</dd>
</dl>
{% </vp_example> %}
