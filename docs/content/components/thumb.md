+++
title = "Thumbnail"
description = "An image in a frame, a cover or an attachment's preview, alone or as a link; vpkit's own."
+++

# Thumbnail <span class="vp-badge" data-variant="tip">vpkit</span> {#thumbnail}

An image in a frame: a cover, an attachment's preview, alone or as a link to what it shows. VitePress has none; this is vpkit's own, on the tokens.

```css
@import "vpkit/components/thumb/thumb.css";
```

{{ <vp_example file="thumb/covers" title="A cover as a link, and a preview alone" layout="row" /> }}

- `vp-thumb`: a block that clips its image to rounded corners, in a divider border, on the page's color.
- As a link it takes the brand border while hovered, as a link card does, in the text's own color with no underline.
- The image's size and fit are yours (`w-full aspect-square object-contain`, `max-h-40`), as is the frame's width.
