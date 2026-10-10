+++
title = "Spinner"
description = "VitePress's loading ring, the one in the local search box, as a class; in a button it turns in the label's color."
+++

# Spinner

VitePress's loading ring, the one in the local search box.

```css
@import "vpkit/spinner.css";
```

{% <vp_example title="A spinner, and one in a button" layout="row"> %}
<span class="vp-spinner" role="status" aria-label="Loading"></span>
<button class="vp-btn vp-btn-brand" disabled><span class="vp-spinner size-4"></span>Paying…</button>
{% </vp_example> %}

- An 18px ring of the divider color with a brand quarter, a turn every 0.8s; `size-4` or any size utility resizes it.
- It turns whenever it is rendered: show and hide it with `hidden` or your request library's indicator.
- In a button it turns in the label's color instead, which every button style holds against its ground; VitePress's brand and divider colors would vanish on a brand button. Its colors are the variables `--vp-spinner-ring` and `--vp-spinner-head`.
- It stops under `prefers-reduced-motion`, as VitePress's does.

{% <vp_example title="A spinner in each button style" layout="row"> %}
<button class="vp-btn" disabled><span class="vp-spinner size-4"></span>Saving…</button>
<button class="vp-btn vp-btn-sponsor" disabled><span class="vp-spinner size-4"></span>Saving…</button>
<button class="vp-btn vp-btn-danger" disabled><span class="vp-spinner size-4"></span>Deleting…</button>
{% </vp_example> %}
