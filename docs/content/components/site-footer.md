+++
title = "Site Footer"
description = "The line at the foot of a site's pages, a message and its links: VitePress's footer as a class."
+++

# Site Footer

The line at the foot of a site's pages: a message and its links. VitePress's footer (`VPFooter`) as a class; its name is `vp-site-footer`, since the documentation layout's own footer is `vp-footer`.

```css
@import "vpkit/site-footer.css";
```

{% <vp_example title="A footer"> %}
<footer class="vp-site-footer">
  <p>Made by <a href="#">Example Inc.</a> · Company number 16753096</p>
</footer>
{% </vp_example> %}

- `vp-site-footer`: a gutter line above it, on the page's ground, with VitePress's padding; its text small, secondary and centered, each line at most the layout's width.
- Its links are underlined, and turn to body text while hovered.
