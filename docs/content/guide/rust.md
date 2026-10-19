+++
title = "Rust"
description = "vpkit's Rust crate: hypertext components for the markup, Lucide's icons as inline SVG, and the stylesheets embedded, so one commit pins both."
+++

# Rust

For a page rendered in Rust with [hypertext](https://crates.io/crates/hypertext), `rust/` in vpkit's repository is a crate of three things: hypertext components that write the markup of the components whose markup is more than one class, Lucide's icons as inline SVG, and, with its `css` feature, every stylesheet of the kit embedded, so an app's dependency on the crate, at a commit, is the one pin for its markup and its CSS.

## Installation

The crate is not on crates.io: add it from the repository at a commit.

```toml
[dependencies]
vpkit = { git = "https://github.com/at-least/vpkit", rev = "<sha>", features = ["css"] }
```

## The stylesheets

With the `css` feature, `vpkit::css::FILES` holds every stylesheet by its path in the kit and `vpkit::css::write(dir)` lays them out under a directory, for the Tailwind entry to import ([Getting Started](@/guide/getting-started.md#installation)). With the feature on in the app's dependency, the dependency's `vpkit-css` binary, built from the commit the lock file names, writes them with one command; an app binary that never calls `vpkit::css` carries none of it.

```sh
cargo build -p vpkit --bin vpkit-css --target-dir target/vpkit-css
target/vpkit-css/debug/vpkit-css target/vpkit
```

## Icons

`vpkit::icon` has Lucide's icons as inline SVG in `currentColor`: `SUN`, `MOON` and `MONITOR` for an appearance switch, `X`, `PLUS`, `MINUS`, `CHECK`, `SEARCH`, `MENU`, `MORE_HORIZONTAL`, the four `CHEVRON_*` and `ARROW_*`, `COPY`, `EXTERNAL_LINK`, `INFO`, `CIRCLE_ALERT`, `TRIANGLE_ALERT`, `CIRCLE_CHECK`, and the rest of VitePress's: `CORNER_DOWN_LEFT`, `DELETE`, `HEART`, `LANGUAGES`, `LAYOUT_LIST`, `SPARKLES` (its strokes 1.8, as VitePress draws it), `SQUARE_PEN`. An icon renders where a `Renderable` goes; `.class("vp-icon")` puts a class on its `<svg>`, for a size or a component's part.

```rust
use hypertext::prelude::*;
use vpkit::icon::PLUS;

rsx! { <button class="vp-btn" data-variant="brand" type="button">(PLUS)" New file"</button> }
```

## What it has

A component whose markup is more than one class on one element:

| Rust | Classes | Page |
| --- | --- | --- |
| [`AppearanceSwitch`](../../rust/vpkit/struct.AppearanceSwitch.html) | `vp-toggle`, its appearance variant | [Toggle](@/components/toggle.md) |
| [`Chip`](../../rust/vpkit/struct.Chip.html) | `vp-chip` | [Chip](@/components/chip.md) |
| [`Dialog`](../../rust/vpkit/struct.Dialog.html) | `vp-dialog` | [Dialog](@/components/dialog.md) |
| [`Empty`](../../rust/vpkit/struct.Empty.html) | `vp-empty` | [Empty State](@/components/empty.md) |
| [`Field`](../../rust/vpkit/struct.Field.html), [`FieldHint`](../../rust/vpkit/struct.FieldHint.html), [`FieldError`](../../rust/vpkit/struct.FieldError.html) | `vp-field` | [Field](@/components/field.md) |
| [`Hint`](../../rust/vpkit/struct.Hint.html) | `vp-hint` | [Hint](@/components/hint.md) |
| [`Pager`](../../rust/vpkit/struct.Pager.html) | `vp-pager` | [Pager](@/components/pager.md) |
| [`Tabs`](../../rust/vpkit/struct.Tabs.html), [`Tab`](../../rust/vpkit/struct.Tab.html) | `vp-tabs`, as links to pages | [Tabs](@/components/tabs.md) |

Everything else is a class string on your own element, written with the attributes the element needs: a button with its `data-variant`, an input with its `aria-invalid`, a badge, an alert (its `role` is yours).

The crate writes vpkit's classes and nothing else: a utility for the page goes in a component's `class` where it has one, or on an element around it. Each component's test renders its example, the markup its page shows, so the two cannot part.

## Reference

The [crate's documentation](../../rust/vpkit/index.html) has every component's fields and examples, each one run by the crate's tests.
