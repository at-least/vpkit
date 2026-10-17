use hypertext::{Buffer, prelude::*};

/// `vp-field` (`field.css`): one form field's box, its label (`vp-label`)
/// first and the body under it, 0.375rem apart: the control the page
/// writes, then a [`FieldHint`] or a [`FieldError`] where there is one.
///
/// The label's `for` is `id`. The control is the page's, so the page gives
/// it `id`, `aria-describedby` naming the hint's and the error's ids
/// ([`field_hint_id`], [`field_error_id`]) where they are written, and
/// `aria-invalid="true"` while there is an error, which turns `vp-input`'s
/// border danger. The label is any [`Renderable`], text or markup.
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::{Field, FieldError, field_error_id};
///
/// let error = Some("This code has expired.");
/// let html = rsx! {
///     <Field id="code" label="Coupon code">
///         <input class="vp-input w-full" id="code"
///             aria-invalid="true"[error.is_some()]
///             aria-describedby=(field_error_id("code"))[error.is_some()]>
///         @if let Some(text) = error {
///             <FieldError id="code" text=(text) />
///         }
///     </Field>
/// }
/// .render();
/// assert_eq!(
///     html.as_inner(),
///     concat!(
///         r#"<div class="vp-field"><label class="vp-label" for="code">Coupon code</label>"#,
///         r#"<input class="vp-input w-full" id="code" aria-invalid="true" aria-describedby="code-error">"#,
///         r#"<p class="vp-field-error" id="code-error">This code has expired.</p></div>"#,
///     ),
/// );
/// ```
pub struct Field<'a, R: Renderable, L: Renderable = &'a str> {
    /// The control's id: the label's `for`.
    pub id: &'a str,
    /// The label's content (`vp-label`).
    pub label: L,
    /// The control, then its hint and its error line.
    pub children: R,
}

impl<R: Renderable, L: Renderable> Renderable for Field<'_, R, L> {
    fn render_to(&self, buffer: &mut Buffer) {
        rsx! {
            <div class="vp-field">
                <label class="vp-label" for=(self.id)>(self.label)</label>
                (self.children)
            </div>
        }
        .render_to(buffer);
    }
}

/// `vp-field-hint`: the line under a control saying what it takes, its id
/// `{id}-hint` for the control's `aria-describedby`.
pub struct FieldHint<'a> {
    /// The control's id.
    pub id: &'a str,
    /// The hint. Required: an empty one panics.
    pub text: &'a str,
}

impl Renderable for FieldHint<'_> {
    fn render_to(&self, buffer: &mut Buffer) {
        line(
            buffer,
            "FieldHint",
            "vp-field-hint",
            &field_hint_id(self.id),
            self.text,
        );
    }
}

/// `vp-field-error`: the line under a control saying what is wrong, its id
/// `{id}-error` for the control's `aria-describedby`. Write it only while
/// there is an error.
pub struct FieldError<'a> {
    /// The control's id.
    pub id: &'a str,
    /// The error. Required: an empty one panics.
    pub text: &'a str,
}

impl Renderable for FieldError<'_> {
    fn render_to(&self, buffer: &mut Buffer) {
        line(
            buffer,
            "FieldError",
            "vp-field-error",
            &field_error_id(self.id),
            self.text,
        );
    }
}

/// A hint's or an error's line under the control: `who` names the
/// component in the panic an empty text raises.
fn line(buffer: &mut Buffer, who: &str, class: &'static str, id: &str, text: &str) {
    assert!(!text.is_empty(), "vpkit::{who} needs a text");
    rsx! { <p class=(class) id=(id)>(text)</p> }.render_to(buffer);
}

/// The hint line's id for the control `id`.
pub fn field_hint_id(id: &str) -> String {
    format!("{id}-hint")
}

/// The error line's id for the control `id`.
pub fn field_error_id(id: &str) -> String {
    format!("{id}-error")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::header::example;

    #[test]
    fn renders_the_stylesheets_markup() {
        let html = rsx! {
            <Field id="code" label="Coupon code">
                <input class="vp-input w-full" id="code" aria-invalid="true" aria-describedby="code-hint code-error">
                <FieldHint id="code" text="Printed on the back of the card." />
                <FieldError id="code" text="This code has expired." />
            </Field>
        }
        .render();
        assert_eq!(*html.as_inner(), example(include_str!("../../field.css")));
    }

    #[test]
    fn a_label_takes_markup() {
        let html = rsx! {
            <Field id="password" label=(rsx! { "Password " <span class="text-xs">"(6+ characters)"</span> })>
                <input class="vp-input" id="password" type="password">
            </Field>
        }
        .render();
        assert_eq!(
            html.as_inner(),
            concat!(
                r#"<div class="vp-field"><label class="vp-label" for="password">Password <span class="text-xs">(6+ characters)</span></label>"#,
                r#"<input class="vp-input" id="password" type="password"></div>"#,
            )
        );
    }

    #[test]
    fn the_ids_are_the_controls_id_and_the_part() {
        assert_eq!(field_hint_id("coupon_id"), "coupon_id-hint");
        assert_eq!(field_error_id("coupon_id"), "coupon_id-error");
        let html = rsx! { <FieldHint id="a" text="b" /> }.render();
        assert_eq!(
            html.as_inner(),
            r#"<p class="vp-field-hint" id="a-hint">b</p>"#
        );
    }

    #[test]
    #[should_panic(expected = "vpkit::FieldError needs a text")]
    fn an_empty_error_panics() {
        rsx! { <FieldError id="a" text="" /> }.render();
    }
}
