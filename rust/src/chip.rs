use hypertext::{Buffer, Raw, prelude::*};

/// Lucide's x (ISC; LICENSE-Lucide), the remove control's icon: an inline
/// SVG, so a page whose Content-Security-Policy refuses `data:` images
/// draws it too. `vp-chip-remove` sizes it at 1rem.
const X: &str = r#"<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>"#;

/// `vp-chip` (`chip.css`): a key and its value in a pill. A filter the
/// page applies has a control that removes it (`remove_href`); a value
/// that opens a list filtered by it is a link as a whole (`href`).
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::Chip;
///
/// let html = rsx! { <Chip key="release:" value="2.4.1" href=(Some("/events?release=2.4.1")) .. /> }.render();
/// assert_eq!(
///     html.as_inner(),
///     concat!(
///         r#"<a class="vp-chip" href="/events?release=2.4.1"><span class="vp-chip-key">release:</span>"#,
///         r#"<span class="vp-chip-value">2.4.1</span></a>"#,
///     ),
/// );
/// ```
#[derive(Default)]
pub struct Chip<'a> {
    /// The key (`vp-chip-key`), as the page words it (`"release:"`).
    /// Required: an empty one panics.
    pub key: &'a str,
    /// The value (`vp-chip-value`).
    pub value: &'a str,
    /// `Some`: the chip is a link to this URL. Not with `remove_href`: a
    /// control inside a link is no valid HTML, so both panic.
    pub href: Option<&'a str>,
    /// `Some`: the chip has a remove control, a link to this URL.
    pub remove_href: Option<&'a str>,
    /// The remove control's `aria-label` (`"Remove the env filter"`).
    /// Required with `remove_href`: the control is an icon alone.
    pub remove_label: &'a str,
    /// The page's utilities on the pill; `""` for none.
    pub class: &'a str,
}

impl Renderable for Chip<'_> {
    fn render_to(&self, buffer: &mut Buffer) {
        assert!(!self.key.is_empty(), "vpkit::Chip needs a key");
        assert!(
            self.href.is_none() || self.remove_href.is_none(),
            "vpkit::Chip is a link or has a remove control, not both"
        );
        assert!(
            self.remove_href.is_none() || !self.remove_label.is_empty(),
            "vpkit::Chip needs a remove_label with a remove_href"
        );
        let parts = rsx! {
            <span class="vp-chip-key">(self.key)</span>
            <span class="vp-chip-value">(self.value)</span>
        };
        rsx! {
            @if let Some(href) = self.href {
                <a class={ "vp-chip" @if !self.class.is_empty() { " " (self.class) } } href=(href)>(parts)</a>
            } @else {
                <span class={ "vp-chip" @if !self.class.is_empty() { " " (self.class) } }>
                    (parts)
                    @if let Some(remove) = self.remove_href {
                        <a class="vp-chip-remove" href=(remove) aria-label=(self.remove_label)>(Raw::<_>::dangerously_create(X))</a>
                    }
                </span>
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
            <Chip key="env" value="production" remove_href=(Some("?")) remove_label="Remove the env filter" .. />
        }
        .render();
        assert_eq!(*html.as_inner(), example(include_str!("../../chip.css")));
    }

    #[test]
    fn a_chip_alone_is_a_span_with_its_class() {
        let html = rsx! { <Chip key="os:" value="<14>" class="mt-1" .. /> }.render();
        assert_eq!(
            html.as_inner(),
            concat!(
                r#"<span class="vp-chip mt-1"><span class="vp-chip-key">os:</span>"#,
                r#"<span class="vp-chip-value">&lt;14&gt;</span></span>"#,
            )
        );
    }

    #[test]
    #[should_panic(expected = "vpkit::Chip is a link or has a remove control, not both")]
    fn a_link_with_a_remove_control_panics() {
        rsx! {
            <Chip key="env" value="prod" href=(Some("/a")) remove_href=(Some("/b")) remove_label="Remove" .. />
        }
        .render();
    }

    #[test]
    #[should_panic(expected = "vpkit::Chip needs a remove_label with a remove_href")]
    fn a_remove_control_without_a_label_panics() {
        rsx! { <Chip key="env" value="prod" remove_href=(Some("/b")) .. /> }.render();
    }
}
