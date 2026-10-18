+++
title = "Avatar"
description = "The round picture of VitePress's team member card as a class."
+++

# Avatar

The round picture of VitePress's `VPTeamMembersItem`, the team page's member card.

```css
@import "vpkit/docs-theme/components/avatar/avatar.css";
```

{{ <vp_example file="avatar/basic" title="A member's picture" layout="row" kit="docs-theme" /> }}

- `vp-avatar`: on an `<img>`, a 4rem circle under `shadow-3`, the picture cropped to it. It is never squeezed in a flex row.
- The size is the small card's; a size utility sets another: `size-8` beside a name in a row, `size-24` for the medium card's 6rem. `shadow-none` removes the shadow.
- The picture is a block, as Tailwind's preflight makes every image; `inline-block align-middle` puts it in a line of text.

{{ <vp_example file="avatar/sizes" title="Sizes, in a row with a name" layout="row" kit="docs-theme" /> }}

Without a picture, a `<span>` with initials takes the class for the circle and the shadow, with the centering and a ground as utilities: `inline-flex items-center justify-center bg-soft font-semibold`.

{{ <vp_example file="avatar/initials" title="Initials in place of a picture" layout="row" kit="docs-theme" /> }}
