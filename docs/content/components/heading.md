+++
title = "Heading"
description = "An app page's titles: VitePress's doc heading scale as classes, with a page's description and a group's small title."
+++

# Heading

An app page's titles: the page's title and the line under it, a section's title, and the small title of a group of things. The first and the third are VitePress's doc headings (`.vp-doc h1` and `.vp-doc h3`) as classes, for headings outside the markdown; the description and the group title are vpkit's own.

```css
@import "vpkit/heading.css";
```

{% <vp_example title="A page's headings"> %}
<h1 class="vp-page-title">Releases</h1>
<p class="vp-page-desc">Every version this project has shipped, newest first.</p>
<h2 class="vp-section-title mt-8">Retention</h2>
<h3 class="vp-group-title mt-4">API keys</h3>
{% </vp_example> %}

- `vp-page-title`: weight 600, 1.75rem with -0.02em of letter spacing, 2rem from 48rem wide.
- `vp-page-desc`: the line under a page's title, 0.9375rem at 1.75 in secondary text, 65 characters wide at most.
- `vp-section-title`: weight 600, 1.25rem with -0.01em of letter spacing.
- `vp-group-title`: the small title of a group of things, such as a [Panel](@/components/panel.md)'s header, a list of settings or a section of a record: 0.8125rem at weight 500 in secondary text.
- None has a margin, a rule above it or padding: a heading's place is yours (`mt-8`). Inside a `vp-doc` each keeps its own box, without the markdown's margins and rules.
- They go on the heading element the page's outline needs: `vp-section-title` on an `<h2>` and `vp-group-title` on an `<h3>`, or one level up where the page has fewer.
