use hypertext::{Buffer, prelude::*};

/// `vp-pager` (`pager.css`): under a list, a line saying what it shows and
/// the buttons to the pages either side, a link where there is a page that
/// way and a disabled button where there is none. `label` names the
/// `<nav>` landmark, so a page with two lists gives each its own.
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::Pager;
///
/// let html = rsx! {
///     <Pager label="Issue pages" summary="1–50 of 230" prev_label="Newer" next_href=(Some("?page=2")) next_label="Older" .. />
/// }
/// .render();
/// assert_eq!(
///     html.as_inner(),
///     concat!(
///         r#"<nav class="vp-pager" aria-label="Issue pages"><p class="vp-pager-summary">1–50 of 230</p>"#,
///         r#"<div class="vp-pager-actions"><button type="button" class="vp-btn" disabled>Newer</button>"#,
///         r#"<a class="vp-btn" href="?page=2">Older</a></div></nav>"#,
///     ),
/// );
/// ```
#[derive(Default)]
pub struct Pager<'a> {
    /// The `<nav>`'s `aria-label`, what the landmark is called. Required:
    /// an empty one panics.
    pub label: &'a str,
    /// The line saying what the list shows (`vp-pager-summary`); `""`
    /// leaves it out, and the buttons keep the far end.
    pub summary: &'a str,
    /// The previous page's URL; `None` draws a disabled button.
    pub prev_href: Option<&'a str>,
    /// The previous button's text. Required: an empty one panics.
    pub prev_label: &'a str,
    /// The next page's URL; `None` draws a disabled button.
    pub next_href: Option<&'a str>,
    /// The next button's text. Required: an empty one panics.
    pub next_label: &'a str,
    /// The page's utilities on the `<nav>`; `""` for none.
    pub class: &'a str,
}

impl Renderable for Pager<'_> {
    fn render_to(&self, buffer: &mut Buffer) {
        // `..` fills a missing label with "": a nameless landmark, an empty button.
        assert!(!self.label.is_empty(), "vpkit::Pager needs a label");
        assert!(
            !self.prev_label.is_empty(),
            "vpkit::Pager needs a prev_label"
        );
        assert!(
            !self.next_label.is_empty(),
            "vpkit::Pager needs a next_label"
        );
        rsx! {
            <nav class={ "vp-pager" @if !self.class.is_empty() { " " (self.class) } } aria-label=(self.label)>
                @if !self.summary.is_empty() {
                    <p class="vp-pager-summary">(self.summary)</p>
                }
                <div class="vp-pager-actions">
                    (PageButton { href: self.prev_href, label: self.prev_label })
                    (PageButton { href: self.next_href, label: self.next_label })
                </div>
            </nav>
        }
        .render_to(buffer);
    }
}

struct PageButton<'a> {
    href: Option<&'a str>,
    label: &'a str,
}

impl Renderable for PageButton<'_> {
    fn render_to(&self, buffer: &mut Buffer) {
        rsx! {
            @if let Some(href) = self.href {
                <a class="vp-btn" href=(href)>(self.label)</a>
            } @else {
                <button type="button" class="vp-btn" disabled>(self.label)</button>
            }
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
            <Pager
                label="Pages"
                summary="51–100 of 230"
                prev_href=(Some("?page=1"))
                prev_label="Newer"
                next_href=(Some("?page=3"))
                next_label="Older"
                ..
            />
        }
        .render();
        assert_eq!(*html.as_inner(), example(include_str!("../../pager.css")));
    }

    #[test]
    fn no_page_either_side_is_two_disabled_buttons_and_no_summary_no_line() {
        let html = rsx! {
            <Pager label="Event pages" prev_label="Previous" next_label="Next" class="mt-0" .. />
        }
        .render();
        assert_eq!(
            html.as_inner(),
            concat!(
                r#"<nav class="vp-pager mt-0" aria-label="Event pages"><div class="vp-pager-actions">"#,
                r#"<button type="button" class="vp-btn" disabled>Previous</button>"#,
                r#"<button type="button" class="vp-btn" disabled>Next</button></div></nav>"#,
            )
        );
    }

    #[test]
    #[should_panic(expected = "vpkit::Pager needs a label")]
    fn panics_without_a_label() {
        rsx! { <Pager prev_label="Previous" next_label="Next" .. /> }.render();
    }

    #[test]
    #[should_panic(expected = "vpkit::Pager needs a next_label")]
    fn panics_without_a_next_label() {
        rsx! { <Pager label="Pages" prev_label="Previous" .. /> }.render();
    }
}
