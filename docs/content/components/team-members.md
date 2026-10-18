+++
title = "Team Members"
description = "A team page's grid of member cards, as many columns as fit: VitePress's team members as a class."
+++

# Team Members

A team page's grid of [member cards](@/components/team-member.md), as many columns as fit. VitePress's team members (`VPTeamMembers`) as a class.

```css
@import "vpkit/docs-theme/components/team-members/team-members.css";
```

{{ <vp_example file="team-members/small" title="A grid of small cards" kit="docs-theme" /> }}

- `vp-team-members`: on the `<ul>`, its cards in `<li>`s, as many columns as fit, each at least 16rem wide (18rem from 23.4375rem wide), 1.5rem apart; the grid at most 72rem wide and centered.
- With one or two members the grid is no wider than their cards, centered. It counts them itself, from the list.
- `data-size="sm"`: the grid of small cards (a `vp-team-member` with `data-size="sm"`), its columns at least 14rem wide, and no wider than its cards up to three.
