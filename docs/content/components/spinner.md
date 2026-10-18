+++
title = "Spinner"
description = "VitePress's loading ring, the one in the local search box, as a class; in a button it turns in the label's color."
+++

# Spinner

VitePress's loading ring, the one in the local search box.

```css
@import "vpkit/components/spinner/spinner.css";
```

{{ <vp_example file="spinner/basic" title="A spinner, and one in a button" layout="row" /> }}

- A ring of the divider color with a turning brand quarter; `size-4` or any size utility resizes it.
- It turns whenever it is rendered: show and hide it with `hidden` or your request library's indicator.
- In a button it turns in the label's color instead, which every button variant holds against its ground; VitePress's brand and divider colors would vanish on a brand button. Its colors are the variables `--vp-spinner-ring` and `--vp-spinner-head`.
- It stops under `prefers-reduced-motion`, as VitePress's does.

{{ <vp_example file="spinner/buttons" title="A spinner in each button variant" layout="row" /> }}
