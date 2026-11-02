package vpkit_test

import (
	"testing"

	"github.com/at-least/vpkit"
	"github.com/at-least/vpkit/internal/example"
)

func TestChipRendersTheExample(t *testing.T) {
	example.Check(t, vpkit.Chip{Key: "env", Value: "production", Href: "", RemoveHref: "?", RemoveLabel: "Remove the env filter", Class: ""}, "chip/examples/basic.html")
}

func TestChipAloneIsASpanWithItsClass(t *testing.T) {
	got := example.Render(vpkit.Chip{Key: "os:", Value: "<14>", Href: "", RemoveHref: "", RemoveLabel: "", Class: "mt-1"})
	want := `<span class="vp-chip mt-1"><span class="vp-chip-key">os:</span>` +
		`<span class="vp-chip-value">&lt;14&gt;</span></span>`
	if got != want {
		t.Errorf("got %s", got)
	}
}

func TestChipAnEmptyValuePanics(t *testing.T) {
	mustPanic(t, "vpkit.Chip needs a Value", func() {
		example.Render(vpkit.Chip{Key: "env", Value: "", Href: "", RemoveHref: "", RemoveLabel: "", Class: ""})
	})
}

func TestChipALinkWithARemoveControlPanics(t *testing.T) {
	mustPanic(t, "vpkit.Chip is a link or has a remove control, not both", func() {
		example.Render(vpkit.Chip{Key: "env", Value: "prod", Href: "/a", RemoveHref: "/b", RemoveLabel: "Remove", Class: ""})
	})
}

func TestChipARemoveControlWithoutALabelPanics(t *testing.T) {
	mustPanic(t, "vpkit.Chip needs a RemoveLabel with a RemoveHref", func() {
		example.Render(vpkit.Chip{Key: "env", Value: "prod", Href: "", RemoveHref: "/b", RemoveLabel: "", Class: ""})
	})
}
