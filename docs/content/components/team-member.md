+++
title = "Team Member"
description = "A person's card on a team page, their picture, name, role, links and a link to sponsor them: VitePress's team member card as a class."
+++

# Team Member

A person's card on a team page: their picture, name and role, a line about them, their links and a link to sponsor them. VitePress's team member card (`VPTeamMembersItem`) as a class; [Team Members](@/components/team-members.md) lays them out in a grid.

```css
@import "vpkit/docs-theme/components/team-member/team-member.css";
```

{{ <vp_example file="team-member/member" title="A member's card" kit="docs-theme" /> }}

- `vp-team-member`: the card, rounded, its parts in a column.
- `vp-team-member-profile`: the soft ground that holds the rest, its lines centered.
- `vp-team-member-avatar`: the round picture, on an `<img>`.
- `vp-team-member-data`: the text under it, `vp-team-member-name` the name and `vp-team-member-affiliation` the role, with `vp-team-member-org` on the organization, which is secondary text, and brand-colored while hovered when it is a link.
- `vp-team-member-desc`: a line about them; its links are brand-colored.
- `vp-team-member-links`: a row of [Icon Button](@/components/icon-btn.md) links, centered.
- `vp-team-member-sponsor`: a strip at the foot of the card in the sponsor color, an inline SVG icon before the word, filled with the sponsor color while hovered or focused.

{{ <vp_example file="team-member/small" title="The small card" kit="docs-theme" /> }}

- `data-size="sm"`: the small card, with less padding, a 4rem picture and smaller type.
- Any part but the profile may be left out, as VitePress's card leaves out what a member has not given.
