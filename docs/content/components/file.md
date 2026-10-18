+++
title = "File Input"
description = "The browser's file chooser on <input type=\"file\">, its button drawn as an input's box; vpkit's own."
+++

# File Input <span class="vp-badge vp-badge-tip">vpkit</span> {#file-input}

The browser's file chooser on `<input type="file">`, its button drawn as an [Input](@/components/input.md)'s box. VitePress has none; this is vpkit's own, on VitePress's input variables.

```css
@import "vpkit/file.css";
```

{% <vp_example title="A file input beside its upload button" layout="row"> %}
<input class="vp-file max-w-full" type="file" name="mapping">
<button class="vp-btn vp-btn-brand" type="button">Upload</button>
{% </vp_example> %}

- Not `vp-input` on the element: the input's fixed 44px box would top-align the chooser inside it. The element sizes itself, and the browser's button is the box: 44px tall, a 0.5rem radius, the input's border and ground, 14px text, 0.75rem before the file name the browser writes after it.
- A brand border and text on hover; on keyboard focus the brand border with a 2px brand ring, as a focused [Input](@/components/input.md) shows.
- The whole element opens the chooser, its file name too, so hovering anywhere on it lights the button.
- Its width is the browser's, about 330px; on a narrow page a width utility keeps it in, as `max-w-full` does here.
