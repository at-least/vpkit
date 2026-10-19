//! vpkit's components as [hypertext] components: the markup the `vp-*`
//! classes expect, for an app that renders with hypertext's `rsx!` or
//! `maud!`; its icons as inline SVG ([`icon`]); and, with the `css`
//! feature, its stylesheets embedded ([`css`]), so an app's cargo
//! dependency on this crate, at a commit, is the one pin for both its
//! markup and its CSS: the app writes the stylesheets out
//! (`vpkit::css::write`) and its Tailwind entry imports the components it
//! uses from there.
//!
//! One module per component (`empty.rs` renders `components/empty`'s
//! markup), and only the components whose markup is more than a class on
//! one element: a button, an input or a badge is a class string, written on
//! the element with the attributes the page gives it; a variant is an
//! attribute (`data-variant="brand"`), a state the one the markup carries
//! anyway (`aria-current`, `aria-invalid`, `disabled`).
//!
//! A component emits vpkit's classes and nothing else. `Chip`, `Empty` and
//! `Pager` take `class`, the page's utilities on their root element
//! (`class="mb-0"`), as `class="vp-empty mb-0"` would by hand;
//! `AppearanceSwitch`, `Dialog`, `Field` and `Tabs` take none. Tailwind
//! finds them in the app's own source, where they are written.
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

#![warn(missing_docs)]

mod chip;
#[cfg(feature = "css")]
pub mod css;
mod dialog;
mod empty;
mod field;
mod hint;
pub mod icon;
mod pager;
mod tabs;
mod toggle;

pub use chip::Chip;
pub use dialog::Dialog;
pub use empty::Empty;
pub use field::{Field, FieldError, FieldHint, field_error_id, field_hint_id};
pub use hint::Hint;
pub use pager::Pager;
pub use tabs::{Tab, Tabs};
pub use toggle::AppearanceSwitch;

#[cfg(test)]
mod example;

use hypertext::{AttributeBuffer, context::AttributeValue, prelude::*};

/// A component's root class: its block, then the page's utilities (its
/// `class` field), if any.
struct Class<'a>(&'static str, &'a str);

impl Renderable<AttributeValue> for Class<'_> {
    fn render_to(&self, buffer: &mut AttributeBuffer) {
        self.0.render_to(buffer);
        if !self.1.is_empty() {
            " ".render_to(buffer);
            self.1.render_to(buffer);
        }
    }
}
