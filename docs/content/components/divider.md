+++
title = "Divider"
description = "VitePress's rules as a class: the markdown's horizontal rule, and the navbar's vertical rule between two of its clusters."
+++

# Divider

The markdown's horizontal rule (`.vp-doc hr`), and the navbar's vertical rule between two of its clusters (`VPNavBar`), as a class.

```css
@import "vpkit/components/divider/divider.css";
```

{{ <vp_example file="divider/rule" title="A rule between two paragraphs" /> }}

- `vp-divider` on an `<hr>`: a line of the divider color across its container, 1rem above and below (VitePress's own spacing; `my-0` removes it).
- `aria-orientation="vertical"`: the navbar's rule, upright with VitePress's space at each side, for a row of items. The attribute says so for assistive technology, and the style follows it.

{{ <vp_example file="divider/vertical" title="A vertical rule in a row" /> }}

Under forced colors (Windows' contrast themes) the vertical rule, a background the browser would erase, takes the text color; the horizontal rule is a border, which those themes keep.

## With a label

A `vp-divider` that is not an `<hr>`, vpkit's own: a `<div role="separator">` holding a short label, the rule broken by the label centered on it, in small secondary text. The label is the element's text; the rules are drawn.

{{ <vp_example file="divider/label" title="Between two ways to sign in" /> }}
