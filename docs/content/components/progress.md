+++
title = "Progress"
description = "own-drive's storage quota bar: a track and a brand fill whose width the page sets."
+++

# Progress

A progress bar. VitePress has none; this is own-drive's storage quota bar.

```css
@import "vpkit/progress.css";
```

{% <vp_example title="A progress bar at 40%"> %}
<span class="vp-progress w-28" role="progressbar" aria-label="Storage used"
      aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
  <span class="vp-progress-bar" style="width: 40%"></span>
</span>
{% </vp_example> %}

- `vp-progress`: the track, a 0.3rem bar of the soft gray with rounded ends, as wide as its container. In a flex row it claims the whole row and squeezes the items beside it; give it `flex-1` to take only the free space, or a width utility.
- `vp-progress-bar`: the brand fill, empty until the page sets its width. The value for assistive technology goes in the progressbar's `aria-value*` attributes.
- With forced colors, as in Windows' contrast themes, the track is framed and the fill takes the system's highlight color.

{% <vp_example title="A bar in a flex row, taking the free space"> %}
<div class="flex items-center gap-3 text-sm">
  <span class="vp-progress flex-1" role="progressbar" aria-label="Storage used"
        aria-valuenow="72" aria-valuemin="0" aria-valuemax="100">
    <span class="vp-progress-bar" style="width: 72%"></span>
  </span>
  <span class="text-text-2">7.2 of 10 GB</span>
</div>
{% </vp_example> %}
