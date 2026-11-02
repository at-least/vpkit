package vpkit

import (
	"io"

	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

// Tabs is vp-tabs (components/tabs) as a row of links to pages: a <nav> named
// by Label, its Tabs inside. A link that opens a page is no tab over a panel,
// so the current one says so with aria-current, not aria-selected; tabs over
// panels, with role="tablist" and the script that shows a panel, are written
// with the classes.
type Tabs struct {
	// Label is the <nav>'s aria-label, what the row is called. Required: an
	// empty one panics.
	Label string
	// Children are the Tab links.
	Children []Tab
}

// Render writes the row.
func (t Tabs) Render(w io.Writer) error {
	if t.Label == "" {
		panic("vpkit.Tabs needs a Label")
	}
	return h.Nav(h.Class("vp-tabs"), h.Aria("label", t.Label),
		g.Map(t.Children, func(tab Tab) g.Node { return tab }),
	).Render(w)
}

// Tab is vp-tabs-tab: one link of a Tabs row, aria-current="page" while
// Current.
type Tab struct {
	// Href is the page the link opens.
	Href string
	// Current is whether it is the page shown.
	Current bool
	// Children is the link's content.
	Children g.Node
}

// Render writes the link.
func (t Tab) Render(w io.Writer) error {
	return h.A(h.Class("vp-tabs-tab"), h.Href(t.Href), g.If(t.Current, h.Aria("current", "page")), t.Children).Render(w)
}
