+++
title = "Progress"
description = "A progress bar, vpkit's own: a track and a brand fill whose width the page sets."
+++

# Progress <span class="vp-badge" data-variant="tip">vpkit</span> {#progress}

A progress bar. VitePress has none; this is vpkit's own.

```css
@import "vpkit/components/progress/progress.css";
```

{{ <vp_example file="progress/bar" title="A progress bar at 40%" /> }}

- `vp-progress`: the track, a thin bar of the gray wash with rounded ends, as wide as its container. In a flex row it claims the whole row and squeezes the items beside it; give it `flex-1` to take only the free space, or a width utility.
- `vp-progress-bar`: the brand fill, empty until the page sets its width. The value for assistive technology goes in the progressbar's `aria-value*` attributes.
- With forced colors, as in Windows' contrast themes, the track is framed and the fill takes the system's highlight color.

{{ <vp_example file="progress/row" title="A bar in a flex row, taking the free space" /> }}

## Indeterminate

A progress bar with `role="progressbar"` and no `aria-valuenow` is indeterminate: work under way whose end isn't known. Its fill sweeps across the track, left to right, every second. Under reduced motion it fills the track at a lower opacity instead, so it reads as busy rather than as a value. A load bar along the top of the window is yours to place (`fixed inset-x-0 top-0 h-0.5`).

{{ <vp_example file="progress/loading" title="Loading" /> }}
