package vpkit_test

import (
	"strings"
	"testing"

	"github.com/at-least/vpkit"
	"github.com/at-least/vpkit/internal/example"
)

func TestAppearanceSwitchRendersTheExample(t *testing.T) {
	example.Check(t, vpkit.AppearanceSwitch{Label: "Appearance", ID: "", Title: ""}, "toggle/examples/appearance.html")
}

func TestAppearanceSwitchWritesTheIDAndTheTitleAndEscapesTheLabel(t *testing.T) {
	got := example.Render(vpkit.AppearanceSwitch{Label: "Dark & light", ID: "themeToggle", Title: "toggle dark mode"})
	want := `<button class="vp-toggle" id="themeToggle" data-variant="appearance" type="button"` +
		` role="switch" aria-checked="false" aria-label="Dark &amp; light" title="toggle dark mode">`
	if !strings.HasPrefix(got, want) {
		t.Errorf("got %s", got)
	}
}

func TestAppearanceSwitchPanicsWithoutALabel(t *testing.T) {
	mustPanic(t, "vpkit.AppearanceSwitch needs a Label", func() {
		example.Render(vpkit.AppearanceSwitch{Label: "", ID: "appearance", Title: ""})
	})
}
