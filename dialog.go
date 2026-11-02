package vpkit

import (
	"io"

	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

// Dialog is vp-dialog (components/dialog): a modal <dialog> with its title
// (vp-dialog-title), the body under it. The page opens it with showModal() and
// writes the body, its last part a <div class="vp-dialog-actions"> of buttons.
//
// The dialog's id is ID; the title's is ID with -title after it, which the
// dialog's aria-labelledby names, so a screen reader announces the title when
// the dialog opens.
type Dialog struct {
	// ID is the dialog's id; the title's is this with -title after it.
	ID string
	// Title is the title's content (vp-dialog-title, an <h2>), text or
	// markup.
	Title g.Node
	// Open is whether the dialog starts open, in place: true writes the open
	// attribute; false, the usual, leaves it closed until the page's
	// showModal().
	Open bool
	// Children is the body, its buttons last.
	Children g.Node
}

// Render writes the dialog.
func (d Dialog) Render(w io.Writer) error {
	titleID := d.ID + "-title"
	return h.Dialog(h.Class("vp-dialog"), h.ID(d.ID), h.Aria("labelledby", titleID), g.If(d.Open, h.Open()),
		h.H2(h.Class("vp-dialog-title"), h.ID(titleID), d.Title),
		d.Children,
	).Render(w)
}
