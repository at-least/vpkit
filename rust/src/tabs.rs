use hypertext::{Buffer, prelude::*};

/// `vp-tabs` (`tabs.css`) as a row of links to pages: a `<nav>` named by
/// `label`, its [`Tab`]s inside. A link that opens a page is no tab over a
/// panel, so the current one says so with `aria-current`, not
/// `aria-selected`; tabs over panels, with `role="tablist"` and the script
/// that shows a panel, are written with the classes.
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::{Tab, Tabs};
///
/// let html = rsx! {
///     <Tabs label="Status">
///         <Tab href="?status=open" current=true>"Open"</Tab>
///         <Tab href="?status=resolved" current=false>"Resolved"</Tab>
///     </Tabs>
/// }
/// .render();
/// assert_eq!(
///     html.as_inner(),
///     concat!(
///         r#"<nav class="vp-tabs" aria-label="Status">"#,
///         r#"<a class="vp-tabs-tab" href="?status=open" aria-current="page">Open</a>"#,
///         r#"<a class="vp-tabs-tab" href="?status=resolved">Resolved</a></nav>"#,
///     ),
/// );
/// ```
pub struct Tabs<'a, R: Renderable> {
    /// The `<nav>`'s `aria-label`, what the row is called. Required: an
    /// empty one panics.
    pub label: &'a str,
    /// The [`Tab`]s.
    pub children: R,
}

impl<R: Renderable> Renderable for Tabs<'_, R> {
    fn render_to(&self, buffer: &mut Buffer) {
        assert!(!self.label.is_empty(), "vpkit::Tabs needs a label");
        rsx! { <nav class="vp-tabs" aria-label=(self.label)>(self.children)</nav> }
            .render_to(buffer);
    }
}

/// `vp-tabs-tab`: one link of a [`Tabs`] row, `aria-current="page"` while
/// `current`.
pub struct Tab<'a, R: Renderable> {
    /// The page the link opens.
    pub href: &'a str,
    /// Whether it is the page shown.
    pub current: bool,
    /// The link's content.
    pub children: R,
}

impl<R: Renderable> Renderable for Tab<'_, R> {
    fn render_to(&self, buffer: &mut Buffer) {
        rsx! {
            <a class="vp-tabs-tab" href=(self.href) aria-current="page"[self.current]>(self.children)</a>
        }
        .render_to(buffer);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::header::nth_example;

    #[test]
    fn renders_the_stylesheets_link_markup() {
        let html = rsx! {
            <Tabs label="Status">
                <Tab href="?status=open" current=true>"Open"</Tab>
                <Tab href="?status=resolved" current=false>"Resolved"</Tab>
            </Tabs>
        }
        .render();
        assert_eq!(
            *html.as_inner(),
            nth_example(include_str!("../../tabs.css"), 1)
        );
    }

    #[test]
    #[should_panic(expected = "vpkit::Tabs needs a label")]
    fn panics_without_a_label() {
        rsx! { <Tabs label="">"x"</Tabs> }.render();
    }
}
