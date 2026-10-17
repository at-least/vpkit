use hypertext::{Buffer, Raw, prelude::*};

/// `vp-stat` (`stat.css`): one number in a box, its title beside it and an
/// optional hint under it.
///
/// The value is any [`Renderable`]: text with `..` filling the fields left
/// out, or markup (a badge beside the figure, a colored figure) with every
/// field written, since markup has no default. `rsx!` is a `move`
/// closure, so a value's `rsx!` inside a page's moves what it names out
/// of the page's closure, which does not compile (E0507): bind a reference
/// with `@let` first and name that.
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::Stat;
///
/// let html = rsx! {
///     <Stat title="New issues" value="2.9k" value_title="2,911 issues" .. />
/// }
/// .render();
/// assert_eq!(
///     html.as_inner(),
///     concat!(
///         r#"<div class="vp-stat"><header class="vp-stat-header">"#,
///         r#"<p class="vp-stat-title">New issues</p>"#,
///         r#"<span class="vp-stat-value" title="2,911 issues">2.9k</span></header></div>"#,
///     ),
/// );
///
/// let rate = String::from("99.2%");
/// let html = rsx! {
///     @let rate = &rate;
///     <Stat
///         title="Crash-free"
///         value=(rsx! { <span class="text-danger">(rate)</span> })
///         hint=""
///         value_title=""
///         class=""
///     />
/// }
/// .render();
/// assert!(html.as_inner().contains(
///     r#"<span class="vp-stat-value"><span class="text-danger">99.2%</span></span>"#
/// ));
/// ```
#[derive(Default)]
pub struct Stat<'a, V: Renderable = &'a str> {
    /// The title beside the number (`vp-stat-title`), a paragraph: a grid
    /// of stats is one section's figures, not headings of its own.
    /// Required: an empty one panics.
    pub title: &'a str,
    /// The number (`vp-stat-value`). Required: one that renders nothing
    /// panics.
    pub value: V,
    /// The line under them (`vp-stat-hint`); `""` leaves it out.
    pub hint: &'a str,
    /// The value's `title`, the exact figure a rounded value leaves out;
    /// `""` leaves the attribute out.
    pub value_title: &'a str,
    /// The page's utilities on the box; `""` for none.
    pub class: &'a str,
}

impl<V: Renderable> Renderable for Stat<'_, V> {
    fn render_to(&self, buffer: &mut Buffer) {
        // `..` fills a missing title or value with "", an empty box.
        assert!(!self.title.is_empty(), "vpkit::Stat needs a title");
        // Rendered once to check it, then spliced as the markup it already is.
        let value = self.value.render().into_inner();
        assert!(!value.is_empty(), "vpkit::Stat needs a value");
        let value = Raw::<_>::dangerously_create(value);
        rsx! {
            <div class={ "vp-stat" @if !self.class.is_empty() { " " (self.class) } }>
                <header class="vp-stat-header">
                    <p class="vp-stat-title">(self.title)</p>
                    <span class="vp-stat-value" title=(self.value_title)[!self.value_title.is_empty()]>(value)</span>
                </header>
                @if !self.hint.is_empty() {
                    <p class="vp-stat-hint">(self.hint)</p>
                }
            </div>
        }
        .render_to(buffer);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::header::example;

    #[test]
    fn renders_the_stylesheets_markup() {
        let html = rsx! {
            <Stat title="Unhandled errors" value="1.2k" hint="in the last 7 days" .. />
        }
        .render();
        assert_eq!(*html.as_inner(), example(include_str!("../../stat.css")));
    }

    #[test]
    fn class_goes_on_the_box() {
        let html =
            rsx! { <Stat title="Adoption" value="12%" class="overflow-hidden" .. /> }.render();
        assert_eq!(
            html.as_inner(),
            concat!(
                r#"<div class="vp-stat overflow-hidden"><header class="vp-stat-header">"#,
                r#"<p class="vp-stat-title">Adoption</p>"#,
                r#"<span class="vp-stat-value">12%</span></header></div>"#,
            )
        );
    }

    #[test]
    fn a_value_with_markup_is_not_escaped_and_its_text_is() {
        let n = "<1";
        let html = rsx! {
            <Stat
                title="Unhandled errors"
                value=(rsx! { (n) " " <span class="vp-badge">"sampled"</span> })
                hint="in this release"
                value_title=""
                class=""
            />
        }
        .render();
        assert_eq!(
            html.as_inner(),
            concat!(
                r#"<div class="vp-stat"><header class="vp-stat-header">"#,
                r#"<p class="vp-stat-title">Unhandled errors</p>"#,
                r#"<span class="vp-stat-value">&lt;1 <span class="vp-badge">sampled</span></span></header>"#,
                r#"<p class="vp-stat-hint">in this release</p></div>"#,
            )
        );
    }

    #[test]
    #[should_panic(expected = "vpkit::Stat needs a value")]
    fn panics_without_a_value() {
        // a tag that leaves the value out cannot infer its type; written
        // out, the default leaves it ""
        Stat::<&str> {
            title: "Adoption",
            ..Default::default()
        }
        .render();
    }

    #[test]
    #[should_panic(expected = "vpkit::Stat needs a title")]
    fn panics_without_a_title() {
        rsx! { <Stat value="12%" .. /> }.render();
    }
}
