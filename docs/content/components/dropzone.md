+++
title = "Drop Zone"
description = "Where to drop files: the target a page shows while files are dragged over it; vpkit's own."
+++

# Drop Zone <span class="vp-badge vp-badge-tip">vpkit</span> {#drop-zone}

Where to drop files: the target a page shows while files are dragged over it. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/dropzone.css";
```

{% <vp_example title="A drop target"> %}
<div class="flex justify-center bg-brand-soft p-6">
  <div class="vp-dropzone">Drop files to upload</div>
</div>
{% </vp_example> %}

- `vp-dropzone`: a dashed brand border, large brand text, on the elevated ground with a deep shadow.
- When it shows, while a drag is over the window, and where are yours: an overlay that washes the page in the brand's soft color and centers it, as above (`fixed inset-0 flex items-center justify-center bg-brand-soft pointer-events-none`).
- The file chooser a click opens is a [File Input](@/components/file.md).
