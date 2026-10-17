+++
title = "Thumbnail"
description = "An image in a frame, a cover or an attachment's preview, alone or as a link; vpkit's own."
+++

# Thumbnail

An image in a frame: a cover, an attachment's preview, alone or as a link to what it shows. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/thumb.css";
```

{% <vp_example title="A cover as a link" layout="row"> %}
<a class="vp-thumb w-32" href="#"><img class="aspect-square w-full object-contain" alt="A cover" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 4'%3E%3Crect width='4' height='4' fill='%23a8b1ff'/%3E%3C/svg%3E"></a>
{% </vp_example> %}

- `vp-thumb`: a block that clips its image to rounded corners, in a divider border, on the page's ground.
- As a link it takes the brand border while hovered, as a link card does, in the text's own color with no underline.
- The image's size and fit are yours (`w-full aspect-square object-contain`, `max-h-40`).
