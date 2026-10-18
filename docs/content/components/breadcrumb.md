+++
title = "Breadcrumb"
description = "vpkit's own breadcrumb, which VitePress has none of: a list of crumbs with a slash between them, the current one bold."
+++

# Breadcrumb <span class="vp-badge" data-variant="tip">vpkit</span> {#breadcrumb}

The path to where the page is. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/components/breadcrumb/breadcrumb.css";
```

{{ <vp_example file="breadcrumb/path" title="The path to a folder" /> }}

- `vp-breadcrumb`: the list, a wrapping row with a slash before every item but the first. A long name breaks inside the word, so the path never overflows a narrow column.
- `vp-breadcrumb-item`: a crumb, a link or a span. Secondary text with no underline; `text-1` and underlined on hover. The current one (`aria-current="page"`) is `text-1` and bold, and stays so when hovered.
- The `<nav>` with its label, and the `<ol>` of `<li>`s, are the markup assistive technology reads a breadcrumb from; the list draws the slashes with empty alternative text, so they are not read out (Firefox reads them before version 128).

A current crumb that is not a link is a `<span>`; one that is a link keeps the pointer. A focused crumb draws base.css's ring.

{{ <vp_example file="breadcrumb/span" title="The current page as a span, and a long name" /> }}
