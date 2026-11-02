package icon_test

import (
	"strings"
	"testing"

	"github.com/at-least/vpkit/go/icon"
	"github.com/at-least/vpkit/internal/example"
)

func TestRendersAnSVGInCurrentColor(t *testing.T) {
	want := `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
		`<path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
	if got := example.Render(icon.X); got != want {
		t.Errorf("got %s", got)
	}
}

func TestAClassGoesOnTheSVG(t *testing.T) {
	if got := example.Render(icon.Plus.Class("size-5")); !strings.HasPrefix(got, `<svg class="size-5" aria-hidden="true"`) {
		t.Errorf("got %s", got)
	}
}

func TestTheClassIsEscaped(t *testing.T) {
	if got := example.Render(icon.Plus.Class(`a"b&c<d`)); !strings.HasPrefix(got, `<svg class="a&quot;b&amp;c&lt;d" aria-hidden="true"`) {
		t.Errorf("got %s", got)
	}
}
