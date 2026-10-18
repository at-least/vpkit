+++
title = "Dropdown"
description = "VitePress's VPMenu, the panel of a navbar flyout, as classes: items, groups and their titles, in flat markup."
+++

# Dropdown

VitePress's `VPMenu`, the panel of a navbar flyout, with `VPMenuLink` items and `VPMenuGroup` groups.

```css
@import "vpkit/components/dropdown/dropdown.css";
```

{{ <vp_example file="dropdown/menu" title="A menu with a group" layout="row" min_height="20rem" /> }}

- `vp-dropdown`: the panel, the elevated surface with `shadow-3`, at least 8rem wide, scrolling once it is as tall as the viewport under the navbar.
- `vp-dropdown-item`: a row, a link or a button; brand on the gray wash when hovered, brand while it is the current one: `aria-current` with a value such as `page`, or `aria-checked="true"`. An empty `aria-current` is not current, as WAI-ARIA has it.
- `vp-dropdown-group`, with an optional `vp-dropdown-title`: every group has a rule above it unless it starts the panel. The markup is flat where VitePress's is nested lists, so items that follow a group go in a group of their own.
- Placing the panel and opening it are the page's.

These examples' frames are taller than their panels: a panel is at most as tall as the viewport under the navbar, and an example's viewport is its frame.

## Padding

Change the panel's padding with `--vp-dropdown-padding`, as in `[--vp-dropdown-padding:0.5rem]`, which the groups follow to reach the panel's edges. A padding utility moves only the panel's edge, and the groups then overhang it.

{{ <vp_example file="dropdown/padding" title="A tighter panel" layout="row" min_height="20rem" /> }}
