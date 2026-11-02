package icon_test

import (
	"os"

	"github.com/at-least/vpkit/go/icon"
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

func ExampleIcon_Class() {
	page := h.Button(h.Class("vp-btn"), h.Type("button"), icon.Sun.Class("vp-icon"), g.Text(" Light"))
	_ = page.Render(os.Stdout)
	// Output: <button class="vp-btn" type="button"><svg class="vp-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> Light</button>
}
