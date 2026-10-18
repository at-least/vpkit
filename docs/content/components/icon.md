+++
title = "Icon"
description = "An SVG of your own at the size and in the color of the text around it: VitePress's icon as a class."
+++

# Icon

An SVG of your own, at the size and in the color of the text around it. VitePress's icon (`VPIcon`, its form for an icon given as markup) as a class.

```css
@import "vpkit/icon.css";
```

{% <vp_example title="Icons beside their text"> %}
<div class="grid gap-3">
  <p class="flex items-center gap-2 text-success-1"><span class="vp-icon"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>Saved just now</p>
  <p class="flex items-center gap-2 text-xl text-warning-1"><span class="vp-icon"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></span>The disk is almost full</p>
</div>
{% </vp_example> %}

- `vp-icon`: a square the size of the text (1em), its SVG filling it in the text's color.
- An SVG that sets its own `fill` keeps it, so an icon drawn with strokes (`fill="none"`) stays an outline, where VitePress fills every SVG. A size or fill utility on the SVG wins.
- Decorative: give the SVG `aria-hidden="true"` when the text beside it says what it means.
