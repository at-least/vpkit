+++
title = "Team Member"
description = "A person's card on a team page, their picture, name, role, links and a link to sponsor them: VitePress's team member card as a class."
+++

# Team Member

A person's card on a team page: their picture, name and role, a line about them, their links and a link to sponsor them. VitePress's team member card (`VPTeamMembersItem`) as a class.

```css
@import "vpkit/team-member.css";
```

{% <vp_example title="A member's card"> %}
<div class="max-w-xs">
  <article class="vp-team-member">
    <div class="vp-team-member-profile">
      <img class="vp-team-member-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%235672cd'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23fff'/%3E%3Cpath d='M10 60c2-14 11-21 22-21s20 7 22 21z' fill='%23fff'/%3E%3C/svg%3E" alt="">
      <div class="vp-team-member-data">
        <h3 class="vp-team-member-name">Ada Lovelace</h3>
        <p class="vp-team-member-affiliation">Engineer @ <a class="vp-team-member-org" href="#">Analytical Engines</a></p>
        <p class="vp-team-member-desc">Writes the compiler and its manual, <a href="#">her notes</a> among them.</p>
        <div class="vp-team-member-links">
          <a class="vp-icon-btn" href="#" aria-label="Website"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></a>
        </div>
      </div>
    </div>
    <a class="vp-team-member-sponsor" href="#"><span class="vpi-heart"></span> Sponsor</a>
  </article>
</div>
{% </vp_example> %}

- `vp-team-member`: the card, rounded, its parts in a column.
- `vp-team-member-profile`: the soft ground that holds the rest, its lines centered.
- `vp-team-member-avatar`: the round picture, on an `<img>`.
- `vp-team-member-data`: the text under it, `vp-team-member-name` the name and `vp-team-member-affiliation` the role, with `vp-team-member-org` on the organization, which is secondary text, and brand-colored while hovered when it is a link.
- `vp-team-member-desc`: a line about them; its links are brand-colored.
- `vp-team-member-links`: a row of `vp-icon-btn` links, centered.
- `vp-team-member-sponsor`: a strip under the card in the sponsor color, its icon before the word, filled with the sponsor color while hovered or focused.

{% <vp_example title="The small card"> %}
<div class="max-w-xs">
  <article class="vp-team-member vp-team-member-small">
    <div class="vp-team-member-profile">
      <img class="vp-team-member-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2318794e'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23fff'/%3E%3Cpath d='M10 60c2-14 11-21 22-21s20 7 22 21z' fill='%23fff'/%3E%3C/svg%3E" alt="">
      <div class="vp-team-member-data">
        <h3 class="vp-team-member-name">Grace Hopper</h3>
        <p class="vp-team-member-affiliation">Compilers</p>
        <p class="vp-team-member-desc">Keeps the release train on time.</p>
      </div>
    </div>
  </article>
</div>
{% </vp_example> %}

- `vp-team-member-small`: the small card, with less padding, a 4rem picture and smaller type.
- Any part but the profile may be left out, as VitePress's card leaves out what a member has not given.
