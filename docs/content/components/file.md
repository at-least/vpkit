+++
title = "File Input"
description = "The browser's file chooser on <input type=\"file\">, its button drawn as an input's box; vpkit's own."
+++

# File Input <span class="vp-badge" data-variant="tip">vpkit</span> {#file-input}

The browser's file chooser on `<input type="file">`, its button drawn as an [Input](@/components/input.md)'s box. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/components/file/file.css";
```

{{ <vp_example file="file/upload" title="A file input beside its upload button" layout="row" /> }}

- Not `vp-input` on the element: the input's fixed box would top-align the chooser inside it. The element sizes itself, and the browser's button is the box: 2.75rem tall, the control height, a 0.5rem radius, the input's border and ground, 14px text, 0.75rem before the file name the browser writes after it.
- A brand border and text on hover; focused from the keyboard, the brand border, as a focused [Input](@/components/input.md) shows, and base.css's ring around the element.
- The whole element opens the chooser, its file name too, so hovering anywhere on it lights the button.
- `data-size="sm"`: the button 2.25rem tall, beside a small button.
- Its width is the browser's, about 330px; on a narrow page a width utility keeps it in, as `max-w-full` does here.

{{ <vp_example file="file/small" title="The small size beside a small button" layout="row" /> }}
