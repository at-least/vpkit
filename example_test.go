package vpkit_test

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/at-least/vpkit"
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

func ExampleEmpty() {
	_ = vpkit.Empty{Title: "No issues", Desc: "Nothing matched these filters.", Class: "mt-4"}.Render(os.Stdout)
	// Output: <div class="vp-empty mt-4"><p class="vp-empty-title">No issues</p><p class="vp-empty-desc">Nothing matched these filters.</p></div>
}

func ExampleField() {
	errorText := "This code has expired."
	_ = vpkit.Field{ID: "code", Label: g.Text("Coupon code"), Children: g.Group{
		h.Input(h.Class("vp-input w-full"), h.ID("code"),
			g.If(errorText != "", h.Aria("invalid", "true")),
			g.If(errorText != "", h.Aria("describedby", vpkit.FieldErrorID("code"))),
		),
		g.If(errorText != "", vpkit.FieldError{ID: "code", Text: errorText}),
	}}.Render(os.Stdout)
	// Output: <div class="vp-field"><label class="vp-label" for="code">Coupon code</label><input class="vp-input w-full" id="code" aria-invalid="true" aria-describedby="code-error"><p class="vp-field-error" id="code-error">This code has expired.</p></div>
}

func ExampleTabs() {
	_ = vpkit.Tabs{Label: "Status", Children: []vpkit.Tab{
		{Href: "?status=open", Current: true, Children: g.Text("Open")},
		{Href: "?status=resolved", Current: false, Children: g.Text("Resolved")},
	}}.Render(os.Stdout)
	// Output: <nav class="vp-tabs" aria-label="Status"><a class="vp-tabs-tab" href="?status=open" aria-current="page">Open</a><a class="vp-tabs-tab" href="?status=resolved">Resolved</a></nav>
}

func ExampleAppearanceSwitch() {
	_ = vpkit.AppearanceSwitch{Label: "Appearance", ID: "appearance", Title: ""}.Render(os.Stdout)
	// Output: <button class="vp-toggle" id="appearance" data-variant="appearance" type="button" role="switch" aria-checked="false" aria-label="Appearance"><span class="vp-toggle-check"><span class="vp-toggle-icon"><svg class="vp-toggle-light" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg><svg class="vp-toggle-dark" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9"/></svg></span></span></button>
}

func ExampleDialog() {
	_ = vpkit.Dialog{ID: "rename", Title: g.Text("Rename"), Open: false, Children: h.P(g.Text("A new name for the file."))}.Render(os.Stdout)
	// Output: <dialog class="vp-dialog" id="rename" aria-labelledby="rename-title"><h2 class="vp-dialog-title" id="rename-title">Rename</h2><p>A new name for the file.</p></dialog>
}

func ExampleHint() {
	_ = vpkit.Hint{Hint: "Muted jobs send no alerts.", Label: "About muted", ID: "hint-muted"}.Render(os.Stdout)
	// Output: <button type="button" class="vp-hint" data-hint="Muted jobs send no alerts." aria-label="About muted" aria-expanded="false" aria-describedby="hint-muted">i</button><span id="hint-muted" hidden>Muted jobs send no alerts.</span>
}

func ExampleChip() {
	_ = vpkit.Chip{Key: "release:", Value: "2.4.1", Href: "/events?release=2.4.1", RemoveHref: "", RemoveLabel: "", Class: ""}.Render(os.Stdout)
	// Output: <a class="vp-chip" href="/events?release=2.4.1"><span class="vp-chip-key">release:</span><span class="vp-chip-value">2.4.1</span></a>
}

func ExamplePager() {
	_ = vpkit.Pager{Label: "Issue pages", Summary: "1–50 of 230", PrevHref: "", PrevLabel: "Newer", NextHref: "?page=2", NextLabel: "Older", Class: ""}.Render(os.Stdout)
	// Output: <nav class="vp-pager" aria-label="Issue pages"><p class="vp-pager-summary">1–50 of 230</p><div class="vp-pager-actions"><button type="button" class="vp-btn" disabled>Newer</button><a class="vp-btn" href="?page=2">Older</a></div></nav>
}

func ExampleWriteCSS() {
	dir, err := os.MkdirTemp("", "app")
	if err != nil {
		panic(err)
	}
	defer os.RemoveAll(dir)

	if err := vpkit.WriteCSS(filepath.Join(dir, "target/vpkit")); err != nil {
		panic(err)
	}
	_, err = os.Stat(filepath.Join(dir, "target/vpkit/components/button/button.css"))
	fmt.Println(err == nil)
	// Output: true
}
