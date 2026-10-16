+++
title = "Row"
description = "One dense row of a list inside a card, ruled off from the next by a hairline; vpkit's own."
+++

# Row

One dense row of a list inside a card, ruled off from the next by a hairline. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/row.css";
```

{% <vp_example title="Services on a board"> %}
<div class="vp-card vp-card-outline block h-auto p-0">
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

- `vp-row`: 0.75rem by 1rem of padding and a divider line under it. The last row of its list draws none: the card's border closes the list.
- Put the rows in an outlined [Card](@/components/card.md) with no padding of its own (`block p-0`, and `h-auto` if the card sits in a grid).
- What a row holds, and its layout, are yours: above, a wrapping flex row of a badge, a name and a line of secondary text.
