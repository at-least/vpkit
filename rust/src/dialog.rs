use hypertext::{Buffer, prelude::*};

/// `vp-dialog` (`dialog.css`): a modal `<dialog>` with its title
/// (`vp-dialog-title`), the body under it. The page opens it with
/// `showModal()` and writes the body, its last part a
/// `<div class="vp-dialog-actions">` of buttons.
///
/// The dialog's id is `id`; the title's is `{id}-title`, which the dialog's
/// `aria-labelledby` names, so a screen reader announces the title when the
/// dialog opens. The title is any [`Renderable`], text or markup.
///
/// ```
/// use hypertext::prelude::*;
/// use vpkit::Dialog;
///
/// let html = rsx! {
///     <Dialog id="rename" title="Rename">
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
    /// The body, its buttons last.
    pub children: R,
}

impl<R: Renderable, L: Renderable> Renderable for Dialog<'_, R, L> {
    fn render_to(&self, buffer: &mut Buffer) {
        let title_id = format!("{}-title", self.id);
        rsx! {
            <dialog class="vp-dialog" id=(self.id) aria-labelledby=(title_id.as_str())>
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
    use crate::header::example;

    #[test]
    fn renders_the_stylesheets_markup() {
        let html = rsx! {
            <Dialog id="rename" title="Rename">
                <p>"…"</p>
                <div class="vp-dialog-actions">
                    <button class="vp-btn" type="button">"Cancel"</button>
                    <button class="vp-btn vp-btn-brand" type="submit">"Rename"</button>
                </div>
            </Dialog>
        }
        .render();
        assert_eq!(*html.as_inner(), example(include_str!("../../dialog.css")));
    }

    #[test]
    fn a_title_takes_markup() {
        let name = "<a>.txt";
        let html = rsx! {
            <Dialog id="versions" title=(rsx! { "previous versions — " (name) })>
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
