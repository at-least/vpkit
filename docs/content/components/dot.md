+++
title = "Dot"
description = "A small round marker beside a word: a legend's key, or a status's second carrier; vpkit's own."
+++

# Dot <span class="vp-badge vp-badge-tip">vpkit</span> {#dot}

A small round marker beside a word: a legend's key, or a status's second carrier, never its only one, since the word says it. VitePress has none outside a badge; this is vpkit's own, on VitePress's tokens. Inside a [Badge](@/components/badge.md) the same dot is `vp-badge-dot`.

```css
@import "vpkit/dot.css";
```

{% <vp_example title="A legend" layout="row"> %}
<span class="inline-flex items-center gap-1.5"><span class="vp-dot vp-dot-success"></span>99% and up</span>
<span class="inline-flex items-center gap-1.5"><span class="vp-dot vp-dot-warning"></span>95–99%</span>
<span class="inline-flex items-center gap-1.5"><span class="vp-dot vp-dot-danger"></span>under 95%</span>
<span class="inline-flex items-center gap-1.5 text-secondary"><span class="vp-dot"></span>dropped</span>
{% </vp_example> %}

- `vp-dot`: 0.5rem, round, in the text's color by default.
- `vp-dot-success`, `vp-dot-warning`, `vp-dot-danger` and `vp-dot-tip` color it as the badge's types are colored.
- A color of your own, a chart's series, is the variable: `style="--vp-dot-color: var(--series-1)"`.
- Under forced colors it paints in the system's text color.
