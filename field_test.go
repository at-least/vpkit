package vpkit_test

import (
	"testing"

	"github.com/at-least/vpkit"
	"github.com/at-least/vpkit/internal/example"
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

func TestFieldRendersTheExample(t *testing.T) {
	example.Check(t, vpkit.Field{ID: "code", Label: g.Text("Coupon code"), Children: g.Group{
		h.Input(h.Class("vp-input w-full"), h.ID("code"), h.Aria("invalid", "true"), h.Aria("describedby", "code-hint code-error")),
		vpkit.FieldHint{ID: "code", Text: "Printed on the back of the card."},
		vpkit.FieldError{ID: "code", Text: "This code has expired."},
	}}, "field/examples/field.html")
}

func TestFieldALabelTakesMarkup(t *testing.T) {
	got := example.Render(vpkit.Field{
		ID:       "password",
		Label:    g.Group{g.Text("Password "), h.Span(h.Class("text-xs"), g.Text("(6+ characters)"))},
		Children: h.Input(h.Class("vp-input"), h.ID("password"), h.Type("password")),
	})
	want := `<div class="vp-field"><label class="vp-label" for="password">Password <span class="text-xs">(6+ characters)</span></label>` +
		`<input class="vp-input" id="password" type="password"></div>`
	if got != want {
		t.Errorf("got %s", got)
	}
}

func TestFieldTheIDsAreTheControlsIDAndThePart(t *testing.T) {
	if got := vpkit.FieldHintID("coupon_id"); got != "coupon_id-hint" {
		t.Errorf("got %s", got)
	}
	if got := vpkit.FieldErrorID("coupon_id"); got != "coupon_id-error" {
		t.Errorf("got %s", got)
	}
	if got := example.Render(vpkit.FieldHint{ID: "a", Text: "b"}); got != `<p class="vp-field-hint" id="a-hint">b</p>` {
		t.Errorf("got %s", got)
	}
}

func TestFieldAnEmptyErrorPanics(t *testing.T) {
	mustPanic(t, "vpkit.FieldError needs a Text", func() {
		example.Render(vpkit.FieldError{ID: "a", Text: ""})
	})
}
