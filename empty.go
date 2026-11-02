package vpkit

import (
	"io"

	"github.com/at-least/vpkit/internal/class"
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

// Empty is vp-empty (components/empty): the box a list shows when it has
// nothing to list, a title and an optional line under it.
type Empty struct {
	// Title is the bold line (vp-empty-title). Required: the box shows
	// nothing without it, so an empty title panics.
	Title string
	// Desc is the line under the title (vp-empty-desc); "" leaves it out.
	Desc string
	// Class is the page's utilities on the box; "" for none.
	Class string
}

// Render writes the box.
func (e Empty) Render(w io.Writer) error {
	if e.Title == "" {
		panic("vpkit.Empty needs a Title")
	}
	return h.Div(class.Root("vp-empty", e.Class),
		h.P(h.Class("vp-empty-title"), g.Text(e.Title)),
		g.If(e.Desc != "", h.P(h.Class("vp-empty-desc"), g.Text(e.Desc))),
	).Render(w)
}
