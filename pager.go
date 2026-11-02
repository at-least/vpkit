package vpkit

import (
	"io"

	"github.com/at-least/vpkit/internal/class"
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

// Pager is vp-pager (components/pager): under a list, a line saying what it
// shows and the buttons to the pages either side, a link where there is a page
// that way and a disabled button where there is none. Label names the <nav>
// landmark, so a page with two lists gives each its own.
type Pager struct {
	// Label is the <nav>'s aria-label, what the landmark is called.
	// Required: an empty one panics.
	Label string
	// Summary is the line saying what the list shows (vp-pager-summary); ""
	// leaves it out, and the buttons keep the far end.
	Summary string
	// PrevHref is the previous page's URL; "" draws a disabled button.
	PrevHref string
	// PrevLabel is the previous button's text. Required: an empty one panics.
	PrevLabel string
	// NextHref is the next page's URL; "" draws a disabled button.
	NextHref string
	// NextLabel is the next button's text. Required: an empty one panics.
	NextLabel string
	// Class is the page's utilities on the <nav>; "" for none.
	Class string
}

// Render writes the pager.
func (p Pager) Render(w io.Writer) error {
	if p.Label == "" {
		panic("vpkit.Pager needs a Label")
	}
	if p.PrevLabel == "" {
		panic("vpkit.Pager needs a PrevLabel")
	}
	if p.NextLabel == "" {
		panic("vpkit.Pager needs a NextLabel")
	}
	return h.Nav(class.Root("vp-pager", p.Class), h.Aria("label", p.Label),
		g.If(p.Summary != "", h.P(h.Class("vp-pager-summary"), g.Text(p.Summary))),
		h.Div(h.Class("vp-pager-actions"),
			pageButton(p.PrevHref, p.PrevLabel),
			pageButton(p.NextHref, p.NextLabel),
		),
	).Render(w)
}

func pageButton(href, label string) g.Node {
	if href == "" {
		return h.Button(h.Type("button"), h.Class("vp-btn"), h.Disabled(), g.Text(label))
	}
	return h.A(h.Class("vp-btn"), h.Href(href), g.Text(label))
}
