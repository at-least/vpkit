+++
title = "Avatar"
description = "The round picture of VitePress's team member card as a class."
+++

# Avatar

The round picture of VitePress's `VPTeamMembersItem`, the team page's member card.

```css
@import "vpkit/avatar.css";
```

{% <vp_example title="A member's picture" layout="row"> %}
<img class="vp-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%235672cd'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23fff'/%3E%3Cpath d='M10 60c2-14 11-21 22-21s20 7 22 21z' fill='%23fff'/%3E%3C/svg%3E" alt="Ada Lovelace">
{% </vp_example> %}

- `vp-avatar`: on an `<img>`, a 4rem circle under `shadow-3`, the picture cropped to it. It is never squeezed in a flex row.
- The size is the small card's; a size utility sets another: `size-8` beside a name in a row, `size-24` for the medium card's 6rem. `shadow-none` removes the shadow.
- The picture is a block, as Tailwind's preflight makes every image; `inline-block align-middle` puts it in a line of text.

{% <vp_example title="Sizes, in a row with a name" layout="row"> %}
<div class="flex items-center gap-3">
  <img class="vp-avatar size-8" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2318794e'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23fff'/%3E%3Cpath d='M10 60c2-14 11-21 22-21s20 7 22 21z' fill='%23fff'/%3E%3C/svg%3E" alt="">
  <span class="text-sm font-medium">Grace Hopper</span>
</div>
<img class="vp-avatar size-24" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23b8860b'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23fff'/%3E%3Cpath d='M10 60c2-14 11-21 22-21s20 7 22 21z' fill='%23fff'/%3E%3C/svg%3E" alt="Katherine Johnson">
{% </vp_example> %}

Without a picture, a `<span>` with initials takes the class for the circle and the shadow, with the centering and a ground as utilities: `inline-flex items-center justify-center bg-soft font-semibold`.

{% <vp_example title="Initials in place of a picture" layout="row"> %}
<span class="vp-avatar inline-flex items-center justify-center bg-soft text-secondary font-semibold" role="img" aria-label="Ada Lovelace">AL</span>
{% </vp_example> %}
