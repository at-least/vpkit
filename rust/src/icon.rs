//! Icons as inline SVG: Lucide's (ISC; LICENSE-Lucide), every icon VitePress
//! draws plus a few of its own, each a 24-unit square of 2px strokes
//! (`SPARKLES`'s 1.8, as VitePress draws it) in `currentColor`, so it takes the text's color and, at 1em in
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
use hypertext::{Buffer, prelude::*};

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
    // written out, the class rendered by hypertext as an attribute value,
    // which escapes it
    fn write(&self, class: Option<&str>, buffer: &mut Buffer) {
        buffer.dangerously_get_string().push_str("<svg");
        if let Some(class) = class {
            buffer.dangerously_get_string().push_str(" class=\"");
            class.render_to(buffer.as_attribute_buffer());
            buffer.dangerously_get_string().push('"');
        }
        let svg = buffer.dangerously_get_string();
        svg.push_str(
            r#" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">"#,
        );
        svg.push_str(self.inner);
        svg.push_str("</svg>");
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
/// Three lines, left-aligned: a menu (VitePress's align-left, its local
/// nav's Menu icon).
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
/// A corner arrow, down and to the left: the Enter key (VitePress's search
/// box, its select hint).
pub const CORNER_DOWN_LEFT: Icon =
    Icon::new(r#"<path d="M20 4v7a4 4 0 0 1-4 4H4"/><path d="m9 10l-5 5l5 5"/>"#);
/// A key with a cross: delete, clear a field (VitePress's search box, its
/// reset).
pub const DELETE: Icon = Icon::new(
    r#"<path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm2 4l6 6m0-6l-6 6"/>"#,
);
/// A heart: sponsor (VitePress's sponsors and team members).
pub const HEART: Icon = Icon::new(
    r#"<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2c-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>"#,
);
/// Two scripts: languages, a translation (VitePress's translations menu).
pub const LANGUAGES: Icon =
    Icon::new(r#"<path d="m5 8l6 6m-7 0l6-6l2-3M2 5h12M7 2h1m14 20l-5-10l-5 10m2-4h6"/>"#);
/// Two squares beside lines: a detailed list (VitePress's search box, its
/// layout toggle).
pub const LAYOUT_LIST: Icon = Icon::new(
    r#"<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M14 4h7m-7 5h7m-7 6h7m-7 5h7"/>"#,
);
/// Sparkles: AI (VitePress's Ask AI button), its strokes 1.8 as VitePress
/// draws it.
pub const SPARKLES: Icon = Icon::new(
    r#"<g stroke-width="1.8"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594zM20 2v4m2-2h-4"/><circle cx="4" cy="20" r="2"/></g>"#,
);
/// A pen on a square: edit (VitePress's doc footer, its edit link).
pub const SQUARE_PEN: Icon = Icon::new(
    r#"<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>"#,
);

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

    #[test]
    fn the_class_is_escaped() {
        let html = rsx! { (PLUS.class(r#"a"b&c<d"#)) }.render();
        assert!(
            html.as_inner()
                .starts_with(r#"<svg class="a&quot;b&amp;c&lt;d" aria-hidden="true""#)
        );
    }
}
