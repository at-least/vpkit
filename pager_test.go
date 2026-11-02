package vpkit_test

import (
	"testing"

	"github.com/at-least/vpkit"
	"github.com/at-least/vpkit/internal/example"
)

func TestPagerRendersTheExample(t *testing.T) {
	example.Check(t, vpkit.Pager{Label: "Pages", Summary: "51–100 of 230", PrevHref: "?page=1", PrevLabel: "Newer", NextHref: "?page=3", NextLabel: "Older", Class: ""}, "pager/examples/basic.html")
}

func TestPagerNoPageEitherSideIsTwoDisabledButtonsAndNoSummaryNoLine(t *testing.T) {
	got := example.Render(vpkit.Pager{Label: "Event pages", Summary: "", PrevHref: "", PrevLabel: "Previous", NextHref: "", NextLabel: "Next", Class: "mt-0"})
	want := `<nav class="vp-pager mt-0" aria-label="Event pages"><div class="vp-pager-actions">` +
		`<button type="button" class="vp-btn" disabled>Previous</button>` +
		`<button type="button" class="vp-btn" disabled>Next</button></div></nav>`
	if got != want {
		t.Errorf("got %s", got)
	}
}

func TestPagerPanicsWithoutALabel(t *testing.T) {
	mustPanic(t, "vpkit.Pager needs a Label", func() {
		example.Render(vpkit.Pager{Label: "", Summary: "", PrevHref: "", PrevLabel: "Previous", NextHref: "", NextLabel: "Next", Class: ""})
	})
}

func TestPagerPanicsWithoutANextLabel(t *testing.T) {
	mustPanic(t, "vpkit.Pager needs a NextLabel", func() {
		example.Render(vpkit.Pager{Label: "Pages", Summary: "", PrevHref: "", PrevLabel: "Previous", NextHref: "", NextLabel: "", Class: ""})
	})
}
