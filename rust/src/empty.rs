use hypertext::{Buffer, prelude::*};

/// `vp-empty` (`empty.css`): the box a list shows when it has nothing to
/// list, a title and an optional line under it.
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::Empty;
///
/// let html = rsx! {
///     <Empty title="No issues" desc="Nothing matched these filters." class="mt-4" ..>
/// }
/// .render();
/// assert_eq!(
///     html.as_inner(),
///     concat!(
///         r#"<div class="vp-empty mt-4"><p class="vp-empty-title">No issues</p>"#,
///         r#"<p class="vp-empty-desc">Nothing matched these filters.</p></div>"#,
///     ),
/// );
/// ```
#[derive(Default)]
pub struct Empty<'a> {
    /// The bold line (`vp-empty-title`). Required: the box shows nothing
    /// without it, so an empty title panics.
    pub title: &'a str,
    /// The line under the title (`vp-empty-desc`); `""` leaves it out.
    pub desc: &'a str,
    /// The page's utilities on the box; `""` for none.
    pub class: &'a str,
}

impl Renderable for Empty<'_> {
    fn render_to(&self, buffer: &mut Buffer) {
        // `..` fills a missing title with "", which would draw an empty box.
        assert!(!self.title.is_empty(), "vpkit::Empty needs a title");
        rsx! {
            <div class={ "vp-empty" @if !self.class.is_empty() { " " (self.class) } }>
                <p class="vp-empty-title">(self.title)</p>
                @if !self.desc.is_empty() {
                    <p class="vp-empty-desc">(self.desc)</p>
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
            <Empty title="No issues" desc="Nothing matched these filters in the last 7 days." ..>
        }
        .render();
        assert_eq!(*html.as_inner(), example(include_str!("../../empty.css")));
    }

    #[test]
    fn a_title_alone_has_no_second_line() {
        let html = rsx! { <Empty title="No jobs yet" ..> }.render();
        assert_eq!(
            html.as_inner(),
            r#"<div class="vp-empty"><p class="vp-empty-title">No jobs yet</p></div>"#
        );
    }

    #[test]
    fn escapes_its_text() {
        let html = rsx! { <Empty title="<b>" desc="a & b" ..> }.render();
        assert_eq!(
            html.as_inner(),
            concat!(
                r#"<div class="vp-empty"><p class="vp-empty-title">&lt;b&gt;</p>"#,
                r#"<p class="vp-empty-desc">a &amp; b</p></div>"#,
            )
        );
    }

    #[test]
    #[should_panic(expected = "vpkit::Empty needs a title")]
    fn panics_without_a_title() {
        rsx! { <Empty desc="Nothing here." ..> }.render();
    }
}
