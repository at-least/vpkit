+++
title = "Team Section"
description = "A team page's section, its title centered on a rule, a lead and its members: VitePress's team page section as a class."
+++

# Team Section

A team page's section: its title centered on a rule, a lead, then its members. VitePress's team page section (`VPTeamPageSection`) as a class.

```css
@import "vpkit/docs-theme/components/team-section/team-section.css";
```

{{ <vp_example file="team-section/section" title="A section of a team page" kit="docs-theme" /> }}

- `vp-team-section`: the block, with VitePress's padding at each side, which grows from 48rem and from 60rem wide.
- `vp-team-section-title`: holds the section's heading, any element, centered on a line across the section, the line stopping short of the text.
- `vp-team-section-lead`: the lead under it, centered, in secondary text, at most 30rem wide.
- `vp-team-section-members`: what the section lists, 2.5rem under the lead.
- The line is a border, where VitePress paints a background, so it stays in forced colors.
