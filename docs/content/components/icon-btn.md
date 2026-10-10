+++
title = "Icon Button"
description = "VitePress's VPSocialLink, the navbar's social icons, as a button for any icon."
+++

# Icon Button

VitePress's `VPSocialLink`, the navbar's social icons, as a button for any icon.

```css
@import "vpkit/icons.css";  /* the vpi-* icons */
@import "vpkit/icon-btn.css";
```

{% <vp_example title="Icon buttons" layout="row"> %}
<button class="vp-icon-btn" type="button" aria-label="Delete"><span class="vpi-delete"></span></button>
<button class="vp-icon-btn" type="button" aria-label="Edit"><span class="vpi-square-pen"></span></button>
<a class="vp-icon-btn" href="#" aria-label="Favorites"><svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg></a>
{% </vp_example> %}

- A 2.25rem square centering a 1.25rem icon, `text-2`, `text-1` on hover. The icon is a `vpi-*` icon of `icons.css` or an inline SVG, which takes the text color unless it sets its own `fill`.
- vpkit's addition: a 0.5rem radius and the soft gray ground on hover, so it reads as a control.
- The button shows only the icon: give it an `aria-label`.

Inside a `vp-doc` (the markdown's styles, `content.css`) an icon link keeps its color: the markdown's rule for links is outranked by the button's own.
