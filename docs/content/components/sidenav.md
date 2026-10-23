+++
title = "Side Navigation"
description = "Groups of links in an app's sidebar, the current page marked: VitePress's sidebar items as classes."
+++

# Side Navigation

Groups of links in an app's sidebar, the current page marked: VitePress's sidebar items (`VPSidebarItem`) as classes.

```css
@import "vpkit/components/sidenav/sidenav.css";
```

{{ <vp_example file="sidenav/groups" title="Two groups" /> }}

- `vp-sidenav`: the `<nav>`. Where a [Skip Link](@/components/skip.md) lands on it, give it `tabindex="-1"`: it is drawn with no focus ring then, as VitePress's sidebar nav is.
- `vp-sidenav-group`: a group of links, 1.5rem above the next. `vp-sidenav-title`: its title, bold.
- `vp-sidenav-items`: the group's list, a divider line at its left. `vp-sidenav-link`: a link in secondary text, brand when hovered.
- The current page's link takes `aria-current="page"`: brand, with a bar on the list's line.
- The sidebar's box is yours: a fixed column beside the page on a wide screen, a [Drawer](@/components/drawer.md) on a phone.
- Not included: collapsible groups and deeper levels.
