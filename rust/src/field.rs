use hypertext::{Buffer, prelude::*};

/// `vp-label` and `vp-field-error` (`field.css`): a form control's label
/// above it and its error line under it, around the control the page
/// writes as the body.
///
/// The label's `for` is `id`, and the error line's id is `{id}-error`. The
/// control is the page's, so the page gives it `id`, and while there is an
/// error `aria-invalid="true"` and `aria-describedby="{id}-error"`
/// ([`field_error_id`]), which turn `vp-input`'s border danger and tie the
/// line to it. There is no wrapping element: the three are siblings, as in
/// the stylesheet's markup, and the page places them.
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::{Field, field_error_id};
///
/// let error = Some("This code has expired.");
/// let html = rsx! {
///     <Field id="code" label="Coupon code" error=(error)>
///         <input class="vp-input w-full" id="code"
///             aria-invalid="true"[error.is_some()]
///             aria-describedby=(field_error_id("code"))[error.is_some()]>
///     </Field>
/// }
/// .render();
/// assert_eq!(
///     html.as_inner(),
///     concat!(
///         r#"<label class="vp-label" for="code">Coupon code</label>"#,
///         r#"<input class="vp-input w-full" id="code" aria-invalid="true" aria-describedby="code-error">"#,
///         r#"<p class="vp-field-error" id="code-error">This code has expired.</p>"#,
///     ),
/// );
/// ```
pub struct Field<'a, R: Renderable> {
    /// The control's id: the label's `for`, and the error line's id with
    /// `-error` after it.
    pub id: &'a str,
    /// The label's text (`vp-label`).
    pub label: &'a str,
    /// The error line's text (`vp-field-error`); `None` leaves the line out.
    pub error: Option<&'a str>,
    /// The control.
    pub children: R,
}

/// The error line's id for the control `id`: what the control's
/// `aria-describedby` names while there is an error.
pub fn field_error_id(id: &str) -> String {
    format!("{id}-error")
}

impl<R: Renderable> Renderable for Field<'_, R> {
    fn render_to(&self, buffer: &mut Buffer) {
        rsx! {
            <label class="vp-label" for=(self.id)>(self.label)</label>
            (self.children)
            @if let Some(error) = self.error {
                <p class="vp-field-error" id=(field_error_id(self.id))>(error)</p>
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
            <Field id="code" label="Coupon code" error=(Some("This code has expired."))>
                <input class="vp-input w-full" id="code" aria-invalid="true" aria-describedby="code-error">
            </Field>
        }
        .render();
        assert_eq!(*html.as_inner(), example(include_str!("../../field.css")));
    }

    #[test]
    fn no_error_no_line() {
        let html = rsx! {
            <Field id="email" label="Email" error=(None)>
                <input class="vp-input" id="email" type="email">
            </Field>
        }
        .render();
        assert_eq!(
            html.as_inner(),
            concat!(
                r#"<label class="vp-label" for="email">Email</label>"#,
                r#"<input class="vp-input" id="email" type="email">"#,
            )
        );
    }

    #[test]
    fn the_error_id_is_the_controls_id_and_error() {
        assert_eq!(field_error_id("coupon_id"), "coupon_id-error");
    }
}
