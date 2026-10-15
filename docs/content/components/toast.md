+++
title = "Toast"
description = "The surface of a short status message, vpkit's own."
+++

# Toast

The surface of a short status message. VitePress has none; this is vpkit's own.

```css
@import "vpkit/toast.css";
```

{% <vp_example title="A toast at the bottom of the page" min_height="8rem"> %}
<div class="vp-toast fixed bottom-4 left-1/2 -translate-x-1/2" role="status">Saved notes.txt</div>
{% </vp_example> %}

- The elevated surface in a divider border, rounded, under `shadow-3`.
- Where it sits, how long it stays, and showing and hiding it are the page's. Announce it from a live region the page keeps rendered; one that is `display: none` while empty may not be read out when the message arrives.
