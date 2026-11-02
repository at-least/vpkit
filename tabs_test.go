package vpkit_test

import (
	"testing"

	"github.com/at-least/vpkit"
	"github.com/at-least/vpkit/internal/example"
	g "maragu.dev/gomponents"
)

func TestTabsRendersTheLinksExample(t *testing.T) {
	example.Check(t, vpkit.Tabs{Label: "Status", Children: []vpkit.Tab{
		{Href: "?status=open", Current: true, Children: g.Text("Open")},
		{Href: "?status=resolved", Current: false, Children: g.Text("Resolved")},
	}}, "tabs/examples/links.html")
}

func TestTabsPanicsWithoutALabel(t *testing.T) {
	mustPanic(t, "vpkit.Tabs needs a Label", func() {
		example.Render(vpkit.Tabs{Label: "", Children: []vpkit.Tab{{Href: "/", Current: false, Children: g.Text("x")}}})
	})
}
