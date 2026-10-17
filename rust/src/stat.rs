use hypertext::{Buffer, prelude::*};

/// `vp-stat` (`stat.css`): one number in a box, its title beside it and an
/// optional hint under it. The value is text; a value with markup inside
/// (a badge, a colored figure) is written by hand with the classes.
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
///         r#"<h2 class="vp-stat-title">New issues</h2>"#,
///         r#"<span class="vp-stat-value" title="2,911 issues">2.9k</span></header></div>"#,
///     ),
/// );
/// ```
#[derive(Default)]
pub struct Stat<'a> {
    /// The title beside the number (`vp-stat-title`). Required: an empty
    /// one panics.
    pub title: &'a str,
    /// The number (`vp-stat-value`). Required: an empty one panics.
    pub value: &'a str,
    /// The line under them (`vp-stat-hint`); `""` leaves it out.
    pub hint: &'a str,
    /// The value's `title`, the exact figure a rounded value leaves out;
    /// `""` leaves the attribute out.
    pub value_title: &'a str,
    /// The page's utilities on the box; `""` for none.
    pub class: &'a str,
}

impl Renderable for Stat<'_> {
    fn render_to(&self, buffer: &mut Buffer) {
        // `..` fills a missing title or value with "", an empty box.
        assert!(
            !self.title.is_empty() && !self.value.is_empty(),
            "vpkit::Stat needs a title and a value"
        );
        rsx! {
            <div class={ "vp-stat" @if !self.class.is_empty() { " " (self.class) } }>
                <header class="vp-stat-header">
                    <h2 class="vp-stat-title">(self.title)</h2>
                    <span class="vp-stat-value" title=(self.value_title)[!self.value_title.is_empty()]>(self.value)</span>
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
                r#"<h2 class="vp-stat-title">Adoption</h2>"#,
                r#"<span class="vp-stat-value">12%</span></header></div>"#,
            )
        );
    }

    #[test]
    #[should_panic(expected = "vpkit::Stat needs a title and a value")]
    fn panics_without_a_value() {
        rsx! { <Stat title="Adoption" .. /> }.render();
    }
}
