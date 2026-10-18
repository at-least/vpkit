+++
title = "Toast"
description = "The surface of a short status message, vpkit's own."
+++

# Toast <span class="vp-badge" data-variant="tip">vpkit</span> {#toast}

The surface of a short status message. VitePress has none; this is vpkit's own.

```css
@import "vpkit/components/toast/toast.css";
```

{{ <vp_example file="toast/bottom" title="A toast at the bottom of the page" min_height="8rem" /> }}

- The elevated surface in a divider border, rounded, under `shadow-3`.
- Where it sits, how long it stays, and showing and hiding it are the page's. Announce it from a live region the page keeps rendered; one that is `display: none` while empty may not be read out when the message arrives.

## States

`data-state="error"` turns a toast's text danger, and `data-state="success"` success, as a [Status](@/components/status.md) reads it.

{{ <vp_example file="toast/states" title="An error and a success" layout="row" /> }}
