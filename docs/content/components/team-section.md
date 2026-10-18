+++
title = "Team Section"
description = "A team page's section, its title centered on a rule, a lead and its members: VitePress's team page section as a class."
+++

# Team Section

A team page's section: its title centered on a rule, a lead, then its members. VitePress's team page section (`VPTeamPageSection`) as a class.

```css
@import "vpkit/team-section.css";
```

{% <vp_example title="A section of a team page"> %}
<section class="vp-team-section">
  <div class="vp-team-section-title"><h2>Partners</h2></div>
  <p class="vp-team-section-lead">The companies that lend their people to the work.</p>
  <div class="vp-team-section-members">
    <div class="flex justify-center gap-6">
      <img class="vp-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%235672cd'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23fff'/%3E%3Cpath d='M10 60c2-14 11-21 22-21s20 7 22 21z' fill='%23fff'/%3E%3C/svg%3E" alt="Ada Lovelace">
      <img class="vp-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2318794e'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23fff'/%3E%3Cpath d='M10 60c2-14 11-21 22-21s20 7 22 21z' fill='%23fff'/%3E%3C/svg%3E" alt="Grace Hopper">
    </div>
  </div>
</section>
{% </vp_example> %}

- `vp-team-section`: the block, with VitePress's padding at each side, which grows from 48rem and from 60rem wide.
- `vp-team-section-title`: holds the section's heading, any element, centered on a line across the section, the line stopping short of the text.
- `vp-team-section-lead`: the lead under it, centered, in secondary text, at most 30rem wide.
- `vp-team-section-members`: what the section lists, 2.5rem under the lead.
- The line is a border, where VitePress paints a background, so it stays in forced colors.
