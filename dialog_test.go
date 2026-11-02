package vpkit_test

import (
	"testing"

	"github.com/at-least/vpkit"
	"github.com/at-least/vpkit/internal/example"
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

func TestDialogRendersTheExample(t *testing.T) {
	example.Check(t, vpkit.Dialog{ID: "rename", Title: g.Text("Rename"), Open: true, Children: g.Group{
		h.P(g.Text("A new name for notes.txt.")),
		h.Div(h.Class("vp-dialog-actions"),
			h.Button(h.Class("vp-btn"), h.Type("button"), g.Text("Cancel")),
			h.Button(h.Class("vp-btn"), h.Data("variant", "brand"), h.Type("submit"), g.Text("Rename")),
		),
	}}, "dialog/examples/basic.html")
}

func TestDialogATitleTakesMarkup(t *testing.T) {
	name := "<a>.txt"
	got := example.Render(vpkit.Dialog{ID: "versions", Title: g.Group{g.Text("previous versions — "), g.Text(name)}, Open: false, Children: h.P(g.Text("none"))})
	want := `<dialog class="vp-dialog" id="versions" aria-labelledby="versions-title">` +
		`<h2 class="vp-dialog-title" id="versions-title">previous versions — &lt;a&gt;.txt</h2>` +
		`<p>none</p></dialog>`
	if got != want {
		t.Errorf("got %s", got)
	}
}
