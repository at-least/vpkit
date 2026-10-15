+++
title = "Breadcrumb"
description = "own-drive's folder path as classes: a list of crumbs with a slash between them, the current one bold."
+++

# Breadcrumb

The path to where the page is. VitePress has none; this is own-drive's folder path, on VitePress's tokens.

```css
@import "vpkit/breadcrumb.css";
```

{% <vp_example title="The path to a folder"> %}
<nav aria-label="Breadcrumb">
  <ol class="vp-breadcrumb">
    <li><a class="vp-breadcrumb-item" href="#">root</a></li>
    <li><a class="vp-breadcrumb-item" href="#">docs</a></li>
    <li><a class="vp-breadcrumb-item" href="#" aria-current="page">2026</a></li>
  </ol>
</nav>
{% </vp_example> %}

- `vp-breadcrumb`: the list, a wrapping row of 0.875rem text with a slash before every item but the first. A long name breaks inside the word, so the path never overflows a narrow column.
- `vp-breadcrumb-item`: a crumb, a link or a span. Secondary text with no underline; `text-1` and underlined on hover. The current one (`aria-current="page"`) is `text-1` at weight 600, and stays so when hovered.
- The `<nav>` with its label, and the `<ol>` of `<li>`s, are the markup assistive technology reads a breadcrumb from; the list draws the slashes, so they are not read out.

A current crumb that is not a link is a `<span>`; one that is a link, as own-drive's current folder is, keeps the pointer.

{% <vp_example title="The current page as a span, and a long name"> %}
<nav aria-label="Breadcrumb" class="max-w-xs">
  <ol class="vp-breadcrumb">
    <li><a class="vp-breadcrumb-item" href="#">root</a></li>
    <li><a class="vp-breadcrumb-item" href="#">reports</a></li>
    <li><span class="vp-breadcrumb-item" aria-current="page">quarterly-revenue-by-region-and-channel-2026-q3.xlsx</span></li>
  </ol>
</nav>
{% </vp_example> %}
