+++
title = "Tabs"
description = "VitePress's code group tab bar as classes, its selection read off aria-selected."
+++

# Tabs

VitePress's code group tab bar.

```css
@import "vpkit/tabs.css";
```

{% <vp_example title="A tab bar"> %}
<div class="vp-tabs" role="tablist">
  <button class="vp-tabs-tab" type="button" role="tab" aria-selected="true">npm</button>
  <button class="vp-tabs-tab" type="button" role="tab" aria-selected="false">pnpm</button>
  <button class="vp-tabs-tab" type="button" role="tab" aria-selected="false">yarn</button>
</div>
{% </vp_example> %}

- `vp-tabs`: the bar, on the code block's ground with a divider along its bottom and rounded top corners; it scrolls sideways when the tabs don't fit.
- `vp-tabs-tab`: a 48px tab, `text-1` on hover and while `aria-selected="true"`, when a 2px brand bar marks it.
- Showing the selected tab's panel, and moving the selection with the arrow keys, are the page's.
