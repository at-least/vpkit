//! Icons as inline SVG: Lucide's (ISC; LICENSE-Lucide), the set VitePress's
//! theme draws plus a few an app needs, each a 24-unit square of 2px
//! strokes in `currentColor`, so it takes the text's color and, at 1em in
//! `vp-icon` or sized by the component around it (a button's, an icon
//! button's), the text's size. Inline, so a page whose
//! Content-Security-Policy refuses `data:` images draws it too, where a
//! mask (the docs theme's icons.css) would show nothing.
//!
//! ```
//! use hypertext::prelude::*;
//! use vpkit::icon::{Icon, SUN};
//!
//! let html = rsx! { <button class="vp-btn" type="button">(SUN)" Light"</button> }.render();
//! assert!(html.as_inner().starts_with(r#"<button class="vp-btn" type="button"><svg aria-hidden="true" viewBox="0 0 24 24""#));
//! let sized = rsx! { (SUN.class("vp-icon")) }.render();
//! assert!(sized.as_inner().contains(r#"class="vp-icon""#));
//! let _: Icon = SUN;
//! ```
use hypertext::{Buffer, Raw, prelude::*};

/// An icon: its paths inside the 24-unit square.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Icon {
    inner: &'static str,
}

impl Icon {
    const fn new(inner: &'static str) -> Self {
        Self { inner }
    }

    /// The icon with a class on its `<svg>`: `vp-icon` for 1em, a size
    /// utility, or a component's part (`vp-icon-btn-light`).
    pub fn class<'a>(&self, class: &'a str) -> Classed<'a> {
        Classed { icon: *self, class }
    }

    // hypertext's rsx! knows the HTML elements, not SVG's: the markup is
    // written out, the class escaped as an attribute value
    fn write(&self, class: Option<&str>, buffer: &mut Buffer) {
        let mut svg = String::from("<svg");
        if let Some(class) = class {
            svg.push_str(" class=\"");
            for ch in class.chars() {
                match ch {
                    '&' => svg.push_str("&amp;"),
                    '"' => svg.push_str("&quot;"),
                    '<' => svg.push_str("&lt;"),
                    _ => svg.push(ch),
                }
            }
            svg.push('"');
        }
        svg.push_str(
            r#" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">"#,
        );
        svg.push_str(self.inner);
        svg.push_str("</svg>");
        Raw::<_>::dangerously_create(svg).render_to(buffer);
    }
}

impl Renderable for Icon {
    fn render_to(&self, buffer: &mut Buffer) {
        self.write(None, buffer);
    }
}

/// An [`Icon`] with a class on it ([`Icon::class`]).
pub struct Classed<'a> {
    icon: Icon,
    class: &'a str,
}

impl Renderable for Classed<'_> {
    fn render_to(&self, buffer: &mut Buffer) {
        self.icon.write(Some(self.class), buffer);
    }
}

/// The sun: the light appearance.
pub const SUN: Icon = Icon::new(
    r#"<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>"#,
);
/// The moon: the dark appearance.
pub const MOON: Icon = Icon::new(r#"<path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9"/>"#);
/// A monitor: the appearance that follows the system.
pub const MONITOR: Icon = Icon::new(
    r#"<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>"#,
);
/// A cross: close, remove, clear.
pub const X: Icon = Icon::new(r#"<path d="M18 6 6 18"/><path d="m6 6 12 12"/>"#);
/// A plus: add, open.
pub const PLUS: Icon = Icon::new(r#"<path d="M5 12h14"/><path d="M12 5v14"/>"#);
/// A minus: remove, collapse.
pub const MINUS: Icon = Icon::new(r#"<path d="M5 12h14"/>"#);
/// A check mark.
pub const CHECK: Icon = Icon::new(r#"<path d="M20 6 9 17l-5-5"/>"#);
/// A magnifier: search.
pub const SEARCH: Icon =
    Icon::new(r#"<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>"#);
/// Three lines, left-aligned: a menu (VitePress's hamburger).
pub const MENU: Icon = Icon::new(r#"<path d="M15 12H3m14 6H3M21 6H3"/>"#);
/// Three dots: more.
pub const MORE_HORIZONTAL: Icon = Icon::new(
    r#"<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>"#,
);
/// A chevron pointing down.
pub const CHEVRON_DOWN: Icon = Icon::new(r#"<path d="m6 9 6 6 6-6"/>"#);
/// A chevron pointing up.
pub const CHEVRON_UP: Icon = Icon::new(r#"<path d="m18 15-6-6-6 6"/>"#);
/// A chevron pointing left.
pub const CHEVRON_LEFT: Icon = Icon::new(r#"<path d="m15 18-6-6 6-6"/>"#);
/// A chevron pointing right.
pub const CHEVRON_RIGHT: Icon = Icon::new(r#"<path d="m9 18 6-6-6-6"/>"#);
/// An arrow pointing up.
pub const ARROW_UP: Icon = Icon::new(r#"<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>"#);
/// An arrow pointing down.
pub const ARROW_DOWN: Icon = Icon::new(r#"<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>"#);
/// An arrow pointing left.
pub const ARROW_LEFT: Icon = Icon::new(r#"<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>"#);
/// An arrow pointing right.
pub const ARROW_RIGHT: Icon = Icon::new(r#"<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>"#);
/// Two sheets: copy.
pub const COPY: Icon = Icon::new(
    r#"<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>"#,
);
/// A box with an arrow out: an external link.
pub const EXTERNAL_LINK: Icon = Icon::new(
    r#"<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>"#,
);
/// An i in a circle: information.
pub const INFO: Icon =
    Icon::new(r#"<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>"#);
/// An exclamation mark in a circle: an error, a warning.
pub const CIRCLE_ALERT: Icon =
    Icon::new(r#"<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>"#);
/// An exclamation mark in a triangle: a warning.
pub const TRIANGLE_ALERT: Icon = Icon::new(
    r#"<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>"#,
);
/// A check mark in a circle: done, success.
pub const CIRCLE_CHECK: Icon =
    Icon::new(r#"<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>"#);

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn renders_an_svg_in_current_color() {
        let html = rsx! { (X) }.render();
        assert_eq!(
            html.as_inner(),
            concat!(
                r#"<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">"#,
                r#"<path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>"#,
            )
        );
    }

    #[test]
    fn a_class_goes_on_the_svg() {
        let html = rsx! { (PLUS.class("size-5")) }.render();
        assert!(
            html.as_inner()
                .starts_with(r#"<svg class="size-5" aria-hidden="true""#)
        );
    }
}
