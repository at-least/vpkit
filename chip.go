package vpkit

import (
	"io"

	"github.com/at-least/vpkit/go/icon"
	"github.com/at-least/vpkit/internal/class"
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

// Chip is vp-chip (components/chip): a key and its value in a pill. A filter
// the page applies has a control that removes it (RemoveHref, an icon.X
// inside, which vp-chip-remove sizes); a value that opens a list filtered by
// it is a link as a whole (Href).
type Chip struct {
	// Key is the key (vp-chip-key), as the page words it ("release:").
	// Required: an empty one panics.
	Key string
	// Value is the value (vp-chip-value). Required: an empty one panics, as
	// it would leave an empty part and its gap in the pill.
	Value string
	// Href, not "", makes the chip a link to this URL. Not with RemoveHref: a
	// control inside a link is no valid HTML, so both panic.
	Href string
	// RemoveHref, not "", gives the chip a remove control, a link to this
	// URL.
	RemoveHref string
	// RemoveLabel is the remove control's aria-label ("Remove the env
	// filter"). Required with RemoveHref: the control is an icon alone.
	RemoveLabel string
	// Class is the page's utilities on the pill; "" for none.
	Class string
}

// Render writes the pill.
func (c Chip) Render(w io.Writer) error {
	if c.Key == "" {
		panic("vpkit.Chip needs a Key")
	}
	if c.Value == "" {
		panic("vpkit.Chip needs a Value")
	}
	if c.Href != "" && c.RemoveHref != "" {
		panic("vpkit.Chip is a link or has a remove control, not both")
	}
	if c.RemoveHref != "" && c.RemoveLabel == "" {
		panic("vpkit.Chip needs a RemoveLabel with a RemoveHref")
	}
	parts := g.Group{
		h.Span(h.Class("vp-chip-key"), g.Text(c.Key)),
		h.Span(h.Class("vp-chip-value"), g.Text(c.Value)),
	}
	if c.Href != "" {
		return h.A(class.Root("vp-chip", c.Class), h.Href(c.Href), parts).Render(w)
	}
	return h.Span(class.Root("vp-chip", c.Class),
		parts,
		g.If(c.RemoveHref != "", h.A(h.Class("vp-chip-remove"), h.Href(c.RemoveHref), h.Aria("label", c.RemoveLabel), icon.X)),
	).Render(w)
}
