+++
title = "Team Page"
description = "The block a team page's parts stand in, with the space round it and between them: VitePress's team page as a class."
+++

# Team Page

The block a team page's parts stand in: the header, members grids and sections, spaced as VitePress's team page (`VPTeamPage`) spaces them.

```css
@import "vpkit/docs-theme/components/team-page/team-page.css";
```

{{ <vp_example file="team-page/page" title="A team page: its header, a grid and a section" kit="docs-theme" /> }}

- `vp-team-page`: the block, with VitePress's margins above and below, which grow from 48rem wide. Its children are the team components: a [header](@/components/team-header.md), [members grids](@/components/team-members.md) and [sections](@/components/team-section.md).
- Between them: a section 4rem under a section or a grid (6rem from 48rem wide), and 1rem under the header from 48rem wide; a grid 1.5rem under another.
- A grid that is the page's child takes VitePress's padding at each side, which grows from 48rem and from 60rem wide, and keeps its own width inside it.
- On the home page, inside the docs theme's `vp-home`, the header takes a rule above and room over its title, and the layout stretches the page to the window's width.
