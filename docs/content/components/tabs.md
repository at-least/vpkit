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
- `vp-tabs-tab`: a tab, `text-1` on hover and while `aria-selected="true"`, when a brand bar marks it.
- Showing the selected tab's panel, and moving the selection with the arrow keys, are the page's.

## Links to pages

vpkit's addition: a row of links that each open a page, a filter or a section, is no set of tabs over panels, so it is a `<nav>` named by `aria-label`, its current link marked with `aria-current` (`page`, `true`, …; `false`, an empty value and `undefined` mean not current). It looks the same as a selected tab.

{% <vp_example title="Links to pages"> %}
<nav class="vp-tabs" aria-label="Status">
  <a class="vp-tabs-tab" href="#" aria-current="page">Open</a>
  <a class="vp-tabs-tab" href="#">Resolved</a>
  <a class="vp-tabs-tab" href="#">Ignored</a>
</nav>
{% </vp_example> %}

In Rust: [`Tabs`](../../rust/vpkit/struct.Tabs.html), [`Tab`](../../rust/vpkit/struct.Tab.html), the row of links, from vpkit's [crate](@/guide/rust.md); tabs over panels are written with the classes.
