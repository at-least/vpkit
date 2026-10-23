use hypertext::{Buffer, prelude::*};

/// `vp-hint` (`components/hint`): a small "i" button whose tooltip says what a
/// word means, and a `hidden` copy of the tooltip that the button's
/// `aria-describedby` names, so a screen reader reads it as the button's
/// description.
///
/// The tooltip shows while the button is hovered, focused from the
/// keyboard, or open: the page's script toggles `aria-expanded` on a tap,
/// since on a touch screen hovering doesn't open it. The copy's id is `id`, or, left
/// empty, `hint-` and the hint's FNV-1a hash in hex, so two buttons with
/// the same hint share one id harmlessly and ids stay stable.
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::Hint;
///
/// let html = rsx! {
///     <Hint hint="Muted jobs send no alerts." label="About muted" id="hint-muted" />
/// }
/// .render();
/// assert_eq!(
///     html.as_inner(),
///     concat!(
///         r#"<button type="button" class="vp-hint" data-hint="Muted jobs send no alerts." aria-label="About muted" aria-expanded="false" aria-describedby="hint-muted">i</button>"#,
///         r#"<span id="hint-muted" hidden>Muted jobs send no alerts.</span>"#,
///     ),
/// );
/// ```
#[derive(Default)]
pub struct Hint<'a> {
    /// What the word means: the tooltip and the hidden copy. Required: an
    /// empty hint panics.
    pub hint: &'a str,
    /// The button's accessible name (`aria-label`), what it is about.
    /// Required: an empty label panics.
    pub label: &'a str,
    /// The hidden copy's id; `""` derives it from the hint.
    pub id: &'a str,
}

impl Renderable for Hint<'_> {
    fn render_to(&self, buffer: &mut Buffer) {
        assert!(!self.hint.is_empty(), "vpkit::Hint needs a hint");
        assert!(!self.label.is_empty(), "vpkit::Hint needs a label");
        let id = if self.id.is_empty() {
            format!("hint-{:x}", fnv1a32(self.hint.as_bytes()))
        } else {
            self.id.to_string()
        };
        rsx! {
            <button type="button" class="vp-hint" data-hint=(self.hint) aria-label=(self.label) aria-expanded="false" aria-describedby=(id.as_str())>"i"</button>
            <span id=(id.as_str()) hidden>(self.hint)</span>
        }
        .render_to(buffer);
    }
}

/// The 32-bit FNV-1a hash.
fn fnv1a32(bytes: &[u8]) -> u32 {
    bytes.iter().fold(0x811c_9dc5, |h, b| {
        (h ^ u32::from(*b)).wrapping_mul(0x0100_0193)
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::example::example;

    #[test]
    fn renders_the_example() {
        let html = rsx! {
            <Hint hint="Ignored issues stay out of the counts." label="About ignored" id="hint-ignored" />
        }
        .render();
        assert_eq!(
            *html.as_inner(),
            example(include_str!("../../components/hint/examples/basic.html"))
        );
    }

    #[test]
    fn an_empty_id_is_the_hints_hash() {
        // FNV-1a of "a" is 0xe40c292c (the published test vector)
        assert_eq!(fnv1a32(b"a"), 0xe40c_292c);
        let html = rsx! { <Hint hint="a" label="About a" .. /> }.render();
        assert!(
            html.as_inner()
                .contains(r#"aria-describedby="hint-e40c292c""#)
        );
        assert!(
            html.as_inner()
                .contains(r#"<span id="hint-e40c292c" hidden>a</span>"#)
        );
    }

    #[test]
    #[should_panic(expected = "vpkit::Hint needs a hint")]
    fn an_empty_hint_panics() {
        rsx! { <Hint label="About" .. /> }.render();
    }

    #[test]
    #[should_panic(expected = "vpkit::Hint needs a label")]
    fn an_empty_label_panics() {
        rsx! { <Hint hint="Something" .. /> }.render();
    }
}
