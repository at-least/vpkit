use hypertext::{Buffer, prelude::*};

/// `vp-dialog` (`components/dialog`): a modal `<dialog>` with its title
/// (`vp-dialog-title`), the body under it. The page opens it with
/// `showModal()` and writes the body, its last part a
/// `<div class="vp-dialog-actions">` of buttons.
///
/// The dialog's id is `id`; the title's is `{id}-title`, which the dialog's
/// `aria-labelledby` names, so a screen reader announces the title when the
/// dialog opens. The title is any [`Renderable`], text or markup. `open`
/// writes the `open` attribute, the dialog shown in place from the start,
/// as its page shows it; `false` leaves it closed for `showModal()`.
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::Dialog;
///
/// let html = rsx! {
///     <Dialog id="rename" title="Rename" open=false>
///         <p>"A new name for the file."</p>
///     </Dialog>
/// }
/// .render();
/// assert_eq!(
///     html.as_inner(),
///     concat!(
///         r#"<dialog class="vp-dialog" id="rename" aria-labelledby="rename-title">"#,
///         r#"<h2 class="vp-dialog-title" id="rename-title">Rename</h2>"#,
///         r#"<p>A new name for the file.</p></dialog>"#,
///     ),
/// );
/// ```
pub struct Dialog<'a, R: Renderable, L: Renderable = &'a str> {
    /// The dialog's id; the title's is this with `-title` after it.
    pub id: &'a str,
    /// The title's content (`vp-dialog-title`, an `<h2>`).
    pub title: L,
    /// Whether the dialog starts open, in place: `true` writes the `open`
    /// attribute; `false`, the usual, leaves it closed until the page's
    /// `showModal()`.
    pub open: bool,
    /// The body, its buttons last.
    pub children: R,
}

impl<R: Renderable, L: Renderable> Renderable for Dialog<'_, R, L> {
    fn render_to(&self, buffer: &mut Buffer) {
        let title_id = format!("{}-title", self.id);
        rsx! {
            <dialog class="vp-dialog" id=(self.id) aria-labelledby=(title_id.as_str()) open[self.open]>
                <h2 class="vp-dialog-title" id=(title_id.as_str())>(self.title)</h2>
                (self.children)
            </dialog>
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
        let html = rsx! {
            <Dialog id="rename" title="Rename" open=true>
                <p>"A new name for notes.txt."</p>
                <div class="vp-dialog-actions">
                    <button class="vp-btn" type="button">"Cancel"</button>
                    <button class="vp-btn" data-variant="brand" type="submit">"Rename"</button>
                </div>
            </Dialog>
        }
        .render();
        assert_eq!(
            *html.as_inner(),
            example(include_str!("../../components/dialog/examples/basic.html"))
        );
    }

    #[test]
    fn a_title_takes_markup() {
        let name = "<a>.txt";
        let html = rsx! {
            <Dialog id="versions" title=(rsx! { "previous versions — " (name) }) open=false>
                <p>"none"</p>
            </Dialog>
        }
        .render();
        assert_eq!(
            html.as_inner(),
            concat!(
                r#"<dialog class="vp-dialog" id="versions" aria-labelledby="versions-title">"#,
                r#"<h2 class="vp-dialog-title" id="versions-title">previous versions — &lt;a&gt;.txt</h2>"#,
                r#"<p>none</p></dialog>"#,
            )
        );
    }
}
