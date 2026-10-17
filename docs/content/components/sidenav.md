+++
title = "Side Navigation"
description = "Groups of links in an app's sidebar, the current page marked: VitePress's sidebar items as classes."
+++

# Side Navigation

Groups of links in an app's sidebar, the current page marked: VitePress's sidebar items (`VPSidebarItem`) as classes.

```css
@import "vpkit/sidenav.css";
```

{% <vp_example title="Two groups"> %}
<nav class="vp-sidenav w-56" aria-label="Main">
  <div class="vp-sidenav-group">
    <p class="vp-sidenav-title">Accounts</p>
    <ul class="vp-sidenav-items">
      <li><a class="vp-sidenav-link" href="#">Search</a></li>
      <li><a class="vp-sidenav-link" href="#" aria-current="page">Orders</a></li>
    </ul>
  </div>
  <div class="vp-sidenav-group">
    <p class="vp-sidenav-title">Codes</p>
    <ul class="vp-sidenav-items">
      <li><a class="vp-sidenav-link" href="#">Licenses</a></li>
      <li><a class="vp-sidenav-link" href="#">Coupons</a></li>
    </ul>
  </div>
</nav>
{% </vp_example> %}

- `vp-sidenav-group`: a group of links, 1.5rem above the next. `vp-sidenav-title`: its title, bold.
- `vp-sidenav-items`: the group's list, a divider line at its left. `vp-sidenav-link`: a link in secondary text, brand when hovered.
- The current page's link takes `aria-current="page"`: brand, with a bar on the list's line.
- The sidebar's box is yours: a fixed column beside the page on a wide screen, a [Drawer](@/components/drawer.md) on a phone.
- Not included: collapsible groups and deeper levels.
