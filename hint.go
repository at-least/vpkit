package vpkit

import (
	"fmt"
	"hash/fnv"
	"io"

	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

// Hint is vp-hint (components/hint): a small "i" button whose tooltip says
// what a word means, and a hidden copy of the tooltip that the button's
// aria-describedby names, so a screen reader reads it as the button's
// description.
//
// The tooltip shows while the button is hovered, focused from the keyboard,
// or open: the page's script toggles aria-expanded on a tap, since on a touch
// screen hovering doesn't open it. The copy's id is ID, or, left empty, hint-
// and the hint's FNV-1a hash in hex, so two buttons with the same hint share
// one id harmlessly and ids stay stable.
type Hint struct {
	// Hint is what the word means: the tooltip and the hidden copy.
	// Required: an empty hint panics.
	Hint string
	// Label is the button's accessible name (aria-label), what it is about.
	// Required: an empty label panics.
	Label string
	// ID is the hidden copy's id; "" derives it from the hint.
	ID string
}

// Render writes the button and the hidden copy.
func (t Hint) Render(w io.Writer) error {
	if t.Hint == "" {
		panic("vpkit.Hint needs a Hint")
	}
	if t.Label == "" {
		panic("vpkit.Hint needs a Label")
	}
	id := t.ID
	if id == "" {
		hash := fnv.New32a()
		hash.Write([]byte(t.Hint))
		id = fmt.Sprintf("hint-%x", hash.Sum32())
	}
	return g.Group{
		h.Button(h.Type("button"), h.Class("vp-hint"), h.Data("hint", t.Hint), h.Aria("label", t.Label), h.Aria("expanded", "false"), h.Aria("describedby", id), g.Text("i")),
		h.Span(h.ID(id), g.Attr("hidden"), g.Text(t.Hint)),
	}.Render(w)
}
