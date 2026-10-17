+++
title = "Row"
description = "One dense row of a list inside a panel, ruled off from the next by a hairline; vpkit's own."
+++

# Row

One dense row of a list inside a panel, ruled off from the next by a hairline. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/row.css";
```

{% <vp_example title="Services on a board"> %}
<div class="vp-panel vp-panel-flush">
  <div class="vp-row flex flex-wrap items-baseline gap-x-3 gap-y-1">
    <span class="vp-badge vp-badge-danger">Broken</span>
    <b>bot-server</b>
    <span class="text-sm text-secondary">panic in send_digest · broken 3h</span>
  </div>
  <div class="vp-row flex flex-wrap items-baseline gap-x-3 gap-y-1">
    <span class="vp-badge vp-badge-success">Healthy</span>
    <b>shop</b>
    <span class="text-sm text-secondary">no open issues</span>
  </div>
  <div class="vp-row flex flex-wrap items-baseline gap-x-3 gap-y-1">
    <span class="vp-badge vp-badge-success">Healthy</span>
    <b>pg-backup</b>
    <span class="text-sm text-secondary">ok 14m ago</span>
  </div>
</div>
{% </vp_example> %}

- `vp-row`: 0.75rem by 1rem of padding and a divider line under it. The last row of its list draws none: the panel's border closes the list.
- Put the rows in a [Panel](@/components/panel.md) with `vp-panel-flush`, which has no padding of its own.
- What a row holds, and its layout, are yours: above, a wrapping flex row of a badge, a name and a line of secondary text.

## Title and description

`vp-row-title` is a row's name and `vp-row-desc` the line under it: each a block that breaks a long word, such as an address, rather than overflow. A name that must stay on one line takes `truncate`.

{% <vp_example title="Logins"> %}
<ul class="vp-panel vp-panel-flush list-none">
  <li class="vp-row">
    <span class="vp-row-title">Phone</span>
    <span class="vp-row-desc">0912 345 678</span>
  </li>
  <li class="vp-row">
    <span class="vp-row-title">Google</span>
    <span class="vp-row-desc">someone.with.a.long.address@example.com</span>
  </li>
</ul>
{% </vp_example> %}

## A row that is a link

A row on an `<a>` is a block in the text's own color and weight, with no underline, on a soft ground while hovered.

{% <vp_example title="Top issues"> %}
<div class="vp-panel vp-panel-flush">
  <a class="vp-row flex items-center gap-3" href="#">
    <span class="vp-badge vp-badge-danger">Error</span>
    <span class="vp-row-title min-w-0 flex-1 truncate">panic in send_digest: connection reset by peer</span>
    <span class="vp-row-desc shrink-0 whitespace-nowrap">42 events · 3m ago</span>
  </a>
  <a class="vp-row flex items-center gap-3" href="#">
    <span class="vp-badge vp-badge-warning">Warning</span>
    <span class="vp-row-title min-w-0 flex-1 truncate">slow query on orders</span>
    <span class="vp-row-desc shrink-0 whitespace-nowrap">8 events · 1h ago</span>
  </a>
</div>
{% </vp_example> %}

Inside a `vp-doc` ([Markdown](@/guide/getting-started.md#markdown-and-icons)), a row that is a list item and a part that is a paragraph keep no margin of the markdown's.
