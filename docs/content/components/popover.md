+++
title = "Popover"
description = "A floating panel of content that isn't a menu: the surface of VitePress's menu, without the menu."
+++

# Popover

A floating panel of content that isn't a menu: an upload tray, a panel a button opens. It is the surface of VitePress's menu (`VPMenu`, the [Dropdown](@/components/dropdown.md)'s), without the menu.

```css
@import "vpkit/components/popover/popover.css";
```

{{ <vp_example file="popover/tray" title="An upload tray" /> }}

- `vp-popover`: the elevated ground in a divider border, a 0.75rem radius, 0.75rem of padding, the menu's shadow.
- On a `[popover]` it replaces the border, padding and colors the browser gives one, and resets its `inset: 0`, so your `right-4 bottom-14` place it (centered is `inset-0 m-auto`).
- Where it sits, how wide it is, and showing and hiding it are yours (`fixed right-4 bottom-14 w-80`).
- Its title is a `vp-group-title` ([Heading](@/components/heading.md)). A list of choices is a [Dropdown](@/components/dropdown.md).
