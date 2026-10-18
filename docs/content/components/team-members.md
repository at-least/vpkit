+++
title = "Team Members"
description = "A team page's grid of member cards, as many columns as fit: VitePress's team members as a class."
+++

# Team Members

A team page's grid of [member cards](@/components/team-member.md), as many columns as fit. VitePress's team members (`VPTeamMembers`) as a class.

```css
@import "vpkit/team-members.css";
```

{% <vp_example title="A grid of small cards"> %}
<ul class="vp-team-members vp-team-members-small">
  <li>
    <article class="vp-team-member vp-team-member-small">
      <div class="vp-team-member-profile">
        <img class="vp-team-member-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%235672cd'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23fff'/%3E%3Cpath d='M10 60c2-14 11-21 22-21s20 7 22 21z' fill='%23fff'/%3E%3C/svg%3E" alt="">
        <div class="vp-team-member-data">
          <h3 class="vp-team-member-name">Ada Lovelace</h3>
          <p class="vp-team-member-affiliation">Compiler</p>
        </div>
      </div>
    </article>
  </li>
  <li>
    <article class="vp-team-member vp-team-member-small">
      <div class="vp-team-member-profile">
        <img class="vp-team-member-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2318794e'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23fff'/%3E%3Cpath d='M10 60c2-14 11-21 22-21s20 7 22 21z' fill='%23fff'/%3E%3C/svg%3E" alt="">
        <div class="vp-team-member-data">
          <h3 class="vp-team-member-name">Grace Hopper</h3>
          <p class="vp-team-member-affiliation">Releases</p>
        </div>
      </div>
    </article>
  </li>
  <li>
    <article class="vp-team-member vp-team-member-small">
      <div class="vp-team-member-profile">
        <img class="vp-team-member-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23b8860b'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23fff'/%3E%3Cpath d='M10 60c2-14 11-21 22-21s20 7 22 21z' fill='%23fff'/%3E%3C/svg%3E" alt="">
        <div class="vp-team-member-data">
          <h3 class="vp-team-member-name">Katherine Johnson</h3>
          <p class="vp-team-member-affiliation">Numerics</p>
        </div>
      </div>
    </article>
  </li>
</ul>
{% </vp_example> %}

- `vp-team-members`: on the `<ul>`, its cards in `<li>`s, as many columns as fit, each at least 16rem wide (18rem from 23.4375rem wide), 1.5rem apart; the grid at most 72rem wide and centered.
- With one or two members the grid is no wider than their cards, centered. It counts them itself, from the list.
- `vp-team-members-small`: the grid of small cards (`vp-team-member-small`), its columns at least 14rem wide, and no wider than its cards up to three.
