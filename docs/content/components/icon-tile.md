+++
title = "Icon Tile"
description = "An icon in a bordered square: a row's mark, a login's provider or a file's kind; vpkit's own."
+++

# Icon Tile

An icon in a bordered square: a row's mark, such as a login's provider or a file's kind. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/icon-tile.css";
```

{% <vp_example title="Rows with a mark" layout="row"> %}
<span class="vp-icon-tile"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg></span>
<span class="vp-icon-tile"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg></span>
{% </vp_example> %}

- `vp-icon-tile`: a 2.5rem square in a divider border, on the page's ground; it doesn't shrink in a row.
- Its icon is centered, 1.25rem, in secondary text. An icon drawn in `currentColor` takes that color; a vendor's mark keeps its own. A size utility on the icon wins.
- It is decorative: the row's text names what it marks.
