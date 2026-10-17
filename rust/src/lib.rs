//! vpkit's components as [hypertext] components: the markup the `vp-*`
//! classes expect, for an app that renders with hypertext's `rsx!` or
//! `maud!`. The CSS stays the components: import the stylesheet of each
//! one you use (`@import "vpkit/empty.css";`), as without this crate.
//!
//! One module per stylesheet (`empty.rs` renders `empty.css`'s markup),
//! and only the components whose markup is more than a class on one
//! element: a button, an input or a badge is a class string, written on the
//! element with the attributes the page gives it.
//!
//! A component emits vpkit's classes and nothing else. Where it has a root
//! element, `class` adds the page's utilities to it (`class="mb-0"`), as
//! `class="vp-empty mb-0"` would by hand; Tailwind finds them in the app's
//! own source, where they are written.
//!
//! ```
//! use hypertext::prelude::*;
//! use vpkit::Empty;
//!
//! let html = rsx! { <Empty title="No issues" .. /> }.render();
//! assert_eq!(
//!     html.as_inner(),
//!     r#"<div class="vp-empty"><p class="vp-empty-title">No issues</p></div>"#,
//! );
//! ```

mod empty;
mod field;

pub use empty::Empty;
pub use field::{Field, field_error_id};

#[cfg(test)]
mod header;
