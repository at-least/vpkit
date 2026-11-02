package vpkit_test

import (
	"strings"
	"testing"

	"github.com/at-least/vpkit"
	"github.com/at-least/vpkit/internal/example"
)

func TestHintRendersTheExample(t *testing.T) {
	example.Check(t, vpkit.Hint{Hint: "Ignored issues stay out of the counts.", Label: "About ignored", ID: "hint-ignored"}, "hint/examples/basic.html")
}

// FNV-1a of "a" is 0xe40c292c (the published test vector)
func TestHintAnEmptyIDIsTheHintsHash(t *testing.T) {
	got := example.Render(vpkit.Hint{Hint: "a", Label: "About a", ID: ""})
	for _, want := range []string{`aria-describedby="hint-e40c292c"`, `<span id="hint-e40c292c" hidden>a</span>`} {
		if !strings.Contains(got, want) {
			t.Errorf("%s has no %s", got, want)
		}
	}
}

func TestHintAnEmptyHintPanics(t *testing.T) {
	mustPanic(t, "vpkit.Hint needs a Hint", func() {
		example.Render(vpkit.Hint{Hint: "", Label: "About", ID: ""})
	})
}

func TestHintAnEmptyLabelPanics(t *testing.T) {
	mustPanic(t, "vpkit.Hint needs a Label", func() {
		example.Render(vpkit.Hint{Hint: "Something", Label: "", ID: ""})
	})
}
