use hypertext::{Buffer, prelude::*};

use crate::icon::{MOON, SUN};

/// `vp-toggle` in its appearance variant (`components/toggle`), VitePress's
/// VPSwitchAppearance: a switch whose knob, sun and moon follow `.dark` on
/// `<html>`, so it is right before any script runs. It renders
/// `aria-checked="false"`; the page's script flips `.dark` on a click and
/// keeps every switch's `aria-checked` in step (vpkit ships none), finding
/// each by its `id` or as `.vp-toggle[data-variant="appearance"]`.
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::AppearanceSwitch;
///
/// let html = rsx! { <AppearanceSwitch label="Appearance" id="appearance" /> }.render();
/// assert!(html.as_inner().starts_with(concat!(
///     r#"<button class="vp-toggle" id="appearance" data-variant="appearance" type="button" role="switch" aria-checked="false" aria-label="Appearance">"#,
///     r#"<span class="vp-toggle-check"><span class="vp-toggle-icon"><svg class="vp-toggle-light""#,
/// )));
/// ```
#[derive(Default)]
pub struct AppearanceSwitch<'a> {
    /// The switch's name (`aria-label`), the same in either mode, as
    /// VitePress's "Appearance": the mode is `aria-checked`. Required: an
    /// empty one panics.
    pub label: &'a str,
    /// The button's id, for the page's script; `""` leaves it out.
    pub id: &'a str,
}

impl Renderable for AppearanceSwitch<'_> {
    fn render_to(&self, buffer: &mut Buffer) {
        // `..` fills a missing label with "": a switch with no name
        assert!(
            !self.label.is_empty(),
            "vpkit::AppearanceSwitch needs a label"
        );
        rsx! {
            <button class="vp-toggle" id=(self.id)[!self.id.is_empty()] data-variant="appearance" type="button" role="switch" aria-checked="false" aria-label=(self.label)>
                <span class="vp-toggle-check">
                    <span class="vp-toggle-icon">
                        (SUN.class("vp-toggle-light"))
                        (MOON.class("vp-toggle-dark"))
                    </span>
                </span>
            </button>
        }
        .render_to(buffer);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::example::example;

    #[test]
    fn renders_the_example() {
        let html = rsx! { <AppearanceSwitch label="Appearance" .. /> }.render();
        assert_eq!(
            *html.as_inner(),
            example(include_str!(
                "../../components/toggle/examples/appearance.html"
            ))
        );
    }

    #[test]
    fn writes_the_id_and_escapes_the_label() {
        let html = rsx! { <AppearanceSwitch label="Dark & light" id="themeToggle" /> }.render();
        assert!(
            html.as_inner().starts_with(concat!(
                r#"<button class="vp-toggle" id="themeToggle" data-variant="appearance" type="button""#,
                r#" role="switch" aria-checked="false" aria-label="Dark &amp; light">"#,
            )),
            "{}",
            html.as_inner()
        );
    }

    #[test]
    #[should_panic(expected = "vpkit::AppearanceSwitch needs a label")]
    fn panics_without_a_label() {
        rsx! { <AppearanceSwitch id="appearance" .. /> }.render();
    }
}
