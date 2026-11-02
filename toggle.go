package vpkit

import (
	"io"

	"github.com/at-least/vpkit/go/icon"
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

// AppearanceSwitch is vp-toggle in its appearance variant
// (components/toggle), VitePress's VPSwitchAppearance: a switch whose knob,
// sun and moon follow .dark on <html>, so it is right before any script runs.
// It renders aria-checked="false"; the page's script flips .dark on a click
// and keeps every switch's aria-checked in step (vpkit ships none), finding
// each by its id or as .vp-toggle[data-variant="appearance"].
type AppearanceSwitch struct {
	// Label is the switch's name (aria-label), the same in either mode, as
	// VitePress's "Appearance": the mode is aria-checked. Required: an empty
	// one panics.
	Label string
	// ID is the button's id, for the page's script; "" leaves it out.
	ID string
	// Title is the hint shown on hover (title): the action, as VitePress's
	// "Switch to dark theme", not the name; "" leaves it out.
	Title string
}

// Render writes the switch.
func (s AppearanceSwitch) Render(w io.Writer) error {
	if s.Label == "" {
		panic("vpkit.AppearanceSwitch needs a Label")
	}
	return h.Button(h.Class("vp-toggle"), g.If(s.ID != "", h.ID(s.ID)), h.Data("variant", "appearance"), h.Type("button"), h.Role("switch"), h.Aria("checked", "false"), h.Aria("label", s.Label), g.If(s.Title != "", h.Title(s.Title)),
		h.Span(h.Class("vp-toggle-check"),
			h.Span(h.Class("vp-toggle-icon"),
				icon.Sun.Class("vp-toggle-light"),
				icon.Moon.Class("vp-toggle-dark"),
			),
		),
	).Render(w)
}
