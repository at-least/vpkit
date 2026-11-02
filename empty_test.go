package vpkit_test

import (
	"testing"

	"github.com/at-least/vpkit"
	"github.com/at-least/vpkit/internal/example"
)

func TestEmptyRendersTheExample(t *testing.T) {
	example.Check(t, vpkit.Empty{Title: "No issues", Desc: "Nothing matched these filters in the last 7 days.", Class: ""}, "empty/examples/basic.html")
}

func TestEmptyATitleAloneHasNoSecondLine(t *testing.T) {
	got := example.Render(vpkit.Empty{Title: "No jobs yet", Desc: "", Class: ""})
	if want := `<div class="vp-empty"><p class="vp-empty-title">No jobs yet</p></div>`; got != want {
		t.Errorf("got %s", got)
	}
}

func TestEmptyEscapesItsText(t *testing.T) {
	got := example.Render(vpkit.Empty{Title: "<b>", Desc: "a & b", Class: ""})
	want := `<div class="vp-empty"><p class="vp-empty-title">&lt;b&gt;</p>` +
		`<p class="vp-empty-desc">a &amp; b</p></div>`
	if got != want {
		t.Errorf("got %s", got)
	}
}

func TestEmptyPanicsWithoutATitle(t *testing.T) {
	mustPanic(t, "vpkit.Empty needs a Title", func() {
		example.Render(vpkit.Empty{Title: "", Desc: "Nothing here.", Class: ""})
	})
}
