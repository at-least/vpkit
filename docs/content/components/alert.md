+++
title = "Alert"
description = "VitePress's custom blocks (::: tip and the others) as classes, with the details block on <details>."
+++

# Alert

VitePress's custom blocks (`::: tip` and the others).

```css
@import "vpkit/alert.css";
```

{% <vp_example title="A tip"> %}
<div class="vp-alert vp-alert-tip">
  <p class="vp-alert-title">TIP</p>
  <p>Body text, with <a href="#">links</a> and <code>code</code>.</p>
</div>
{% </vp_example> %}

- `vp-alert` alone: the info type (gray).
- `vp-alert-note`, `vp-alert-tip`, `vp-alert-important`, `vp-alert-warning`, `vp-alert-danger`, `vp-alert-caution`: the other types.
- `vp-alert-title`: the bold title line; a block with one gets the larger top padding.
- `vp-alert-details`: the details block, on a `<details>`. Its `<summary>` is the title, bold, with the pointer; the block opens and closes as the element does.

{% <vp_example title="The alert's types" layout="stack"> %}
<div class="vp-alert"><p class="vp-alert-title">INFO</p><p>The info type, with a <a href="#">link</a>.</p></div>
<div class="vp-alert vp-alert-note"><p class="vp-alert-title">NOTE</p><p>The note type, with a <a href="#">link</a>.</p></div>
<div class="vp-alert vp-alert-tip"><p class="vp-alert-title">TIP</p><p>The tip type, with a <a href="#">link</a>.</p></div>
<div class="vp-alert vp-alert-important"><p class="vp-alert-title">IMPORTANT</p><p>The important type, with a <a href="#">link</a>.</p></div>
<div class="vp-alert vp-alert-warning"><p class="vp-alert-title">WARNING</p><p>The warning type, with a <a href="#">link</a>.</p></div>
<div class="vp-alert vp-alert-danger"><p class="vp-alert-title">DANGER</p><p>The danger type, with a <a href="#">link</a>.</p></div>
<div class="vp-alert vp-alert-caution"><p class="vp-alert-title">CAUTION</p><p>The caution type, with a <a href="#">link</a>.</p></div>
{% </vp_example> %}

{% <vp_example title="A details block"> %}
<details class="vp-alert vp-alert-details">
  <summary>Details</summary>
  <p>Body text.</p>
</details>
{% </vp_example> %}

## What goes inside

Links, inline code and paragraphs inside take the alert's look. A nested alert keeps its own colors. A component inside an alert keeps its own look too: a `vp-btn`, `vp-card`, `vp-dropdown-item` or `vp-tabs-tab` link is not restyled as a link. Only the alert's link hover dimming applies to it.

{% <vp_example title="A button and a nested alert inside an alert"> %}
<div class="vp-alert vp-alert-danger">
  <p class="vp-alert-title">DANGER</p>
  <p>Deleting the folder deletes the files in it.</p>
  <div class="vp-alert vp-alert-tip"><p>Its files can be moved out first.</p></div>
  <p><a class="vp-btn vp-btn-danger" href="#">Delete the folder</a></p>
</div>
{% </vp_example> %}

Not included: the rules for tables and blockquotes inside a block.

## Graded containers

A `vp-graded-containers` class anywhere on the page switches warning and caution to GitHub's severity colors.

{% <vp_example title="Warning and caution, graded"> %}
<div class="vp-graded-containers grid gap-4">
  <div class="vp-alert vp-alert-warning"><p class="vp-alert-title">WARNING</p><p>The warning type, graded.</p></div>
  <div class="vp-alert vp-alert-caution"><p class="vp-alert-title">CAUTION</p><p>The caution type, graded.</p></div>
</div>
{% </vp_example> %}

Inside a `vp-doc` (the markdown's styles, `content.css`) an alert takes the markdown's margin, as VitePress's custom block does, and its paragraphs, links and code keep the alert's look: the markdown's rules for them are outranked by the alert's own.
