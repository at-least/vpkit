+++
title = "Dropdown"
description = "VitePress's VPMenu, the panel of a navbar flyout, as classes: items, groups and their titles, in flat markup."
+++

# Dropdown

VitePress's `VPMenu`, the panel of a navbar flyout, with `VPMenuLink` items and `VPMenuGroup` groups.

```css
@import "vpkit/dropdown.css";
```

{% <vp_example title="A menu with a group" layout="row" min_height="20rem"> %}
<div class="vp-dropdown" role="menu">
  <a class="vp-dropdown-item" role="menuitem" href="#">Profile</a>
  <a class="vp-dropdown-item" role="menuitem" href="#" aria-current="page">Settings</a>
  <div class="vp-dropdown-group" role="group" aria-labelledby="density">
    <p class="vp-dropdown-title" id="density">Density</p>
    <button class="vp-dropdown-item" role="menuitemradio" aria-checked="true">Comfortable</button>
    <button class="vp-dropdown-item" role="menuitemradio" aria-checked="false">Compact</button>
  </div>
</div>
{% </vp_example> %}

- `vp-dropdown`: the panel, the elevated surface with `shadow-3`, at least 8rem wide, scrolling once it is as tall as the viewport under the navbar.
- `vp-dropdown-item`: a row, a link or a button; brand on a soft gray when hovered, brand while it is the current one: `aria-current` with a value such as `page`, or `aria-checked="true"`. An empty `aria-current` is not current, as WAI-ARIA has it.
- `vp-dropdown-group`, with an optional `vp-dropdown-title`: every group but the first has a rule above it. The markup is flat where VitePress's is nested lists, so items that follow a group go in a group of their own.
- Placing the panel and opening it are the page's.

These examples' frames are taller than their panels: a panel is at most as tall as the viewport under the navbar, and an example's viewport is its frame.

## Padding

Change the panel's padding with `--vp-dropdown-padding`, as in `[--vp-dropdown-padding:0.5rem]`, which the groups follow to reach the panel's edges. A padding utility moves only the panel's edge, and the groups then overhang it.

{% <vp_example title="A tighter panel" layout="row" min_height="20rem"> %}
<div class="vp-dropdown [--vp-dropdown-padding:0.5rem]" role="menu">
  <a class="vp-dropdown-item" role="menuitem" href="#">Profile</a>
  <div class="vp-dropdown-group" role="group" aria-labelledby="account">
    <p class="vp-dropdown-title" id="account">Account</p>
    <button class="vp-dropdown-item" role="menuitem">Sign out</button>
  </div>
</div>
{% </vp_example> %}
