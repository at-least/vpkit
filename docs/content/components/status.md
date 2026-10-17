+++
title = "Status"
description = "The line where a page shows the reply to what was just done, with an error and a success state; vpkit's own."
+++

# Status

The line where a page shows the reply to what was just done: a handler's answer, a form's outcome. VitePress has none; this is vpkit's own, on VitePress's tokens.

```css
@import "vpkit/status.css";
```

{% <vp_example title="Replies"> %}
<div class="vp-status">Sent: the code is valid for 10 minutes.</div>
<div class="vp-status" data-state="error">That code has expired.</div>
<div class="vp-status" data-state="success">Saved.</div>
{% </vp_example> %}

- `vp-status`: secondary text, 0.875rem.
- `data-state="error"` turns it danger, `data-state="success"` success: the page's script sets the state with the reply.
- A reply that is a fragment keeps the document's ink in its blocks (a paragraph, a list, a table, a heading), so the slot may hold a line or a whole section.
- Placement is yours. An empty slot has no height; drop its margin while empty (`mt-4 empty:mt-0`). Keep a slot that is a live region (`role="status"`) rendered rather than hidden, so a screen reader announces the reply that fills it.
