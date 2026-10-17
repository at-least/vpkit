+++
title = "Rust"
description = "vpkit's components as hypertext components: the markup the stylesheets document, for a Rust page."
+++

# Rust

For a page rendered in Rust with [hypertext](https://crates.io/crates/hypertext), `rust/` in vpkit's repository is a crate of hypertext components that write the markup each stylesheet documents. The stylesheets stay the components: import each one you use, as on [Getting Started](@/guide/getting-started.md).

## Installation

The crate is not on crates.io: add it from the repository at the commit your stylesheets come from, so the markup and the CSS match.

```toml
[dependencies]
vpkit = { git = "https://github.com/at-least/vpkit", rev = "<sha>" }
```

## What it has

A component whose markup is more than one class on one element:

| Rust | Classes | Page |
| --- | --- | --- |
| [`Chip`](../../rust/vpkit/struct.Chip.html) | `vp-chip` | [Chip](@/components/chip.md) |
| [`Dialog`](../../rust/vpkit/struct.Dialog.html) | `vp-dialog` | [Dialog](@/components/dialog.md) |
| [`Empty`](../../rust/vpkit/struct.Empty.html) | `vp-empty` | [Empty State](@/components/empty.md) |
| [`Field`](../../rust/vpkit/struct.Field.html), [`FieldHint`](../../rust/vpkit/struct.FieldHint.html), [`FieldError`](../../rust/vpkit/struct.FieldError.html) | `vp-field` | [Field](@/components/field.md) |
| [`Hint`](../../rust/vpkit/struct.Hint.html) | `vp-hint` | [Hint](@/components/hint.md) |
| [`Pager`](../../rust/vpkit/struct.Pager.html) | `vp-pager` | [Pager](@/components/pager.md) |
| [`Stat`](../../rust/vpkit/struct.Stat.html) | `vp-stat` | [Stat](@/components/stat.md) |
| [`Tabs`](../../rust/vpkit/struct.Tabs.html), [`Tab`](../../rust/vpkit/struct.Tab.html) | `vp-tabs`, as links to pages | [Tabs](@/components/tabs.md) |

Everything else is a class string on your own element, written with the attributes the element needs: a button, an input, a badge, an alert (its `role` is yours), a copy line (its button and the script it names are yours).

The crate writes vpkit's classes and nothing else: a utility for the page goes in a component's `class` where it has one, or on an element around it.

## Reference

The [crate's documentation](../../rust/vpkit/index.html) has every component's fields and examples, each one run by the crate's tests.
