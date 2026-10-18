+++
title = "Team Header"
description = "The title and the lead a team page opens with: VitePress's team page title as a class."
+++

# Team Header

The title and the lead a team page opens with, centered. VitePress's team page title (`VPTeamPageTitle`) as a class.

```css
@import "vpkit/docs-theme/components/team-header/team-header.css";
```

{{ <vp_example file="team-header/header" title="A team page's header" kit="docs-theme" /> }}

- `vp-team-header`: the block, its lines centered, on VitePress's padding, which grows from 48rem and from 60rem wide.
- `vp-team-header-title`: the title, 2.25rem, and 3rem from 48rem wide.
- `vp-team-header-lead`: the lead under it, in secondary text, at most 32rem wide (37rem from 48rem).
- Either part may be left out.
