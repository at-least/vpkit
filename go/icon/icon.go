// Package icon is icons as inline SVG: Lucide's (ISC; LICENSE-Lucide), every
// icon VitePress draws plus a few of its own, each a 24-unit square of 2px
// strokes (Sparkles's 1.8, as VitePress draws it) in currentColor, so it takes
// the text's color and, at 1em in vp-icon or sized by the component around it
// (a button's, an icon button's), the text's size. Inline, so a page whose
// Content-Security-Policy refuses data: images draws it too, where a mask (the
// docs theme's icons.css) would show nothing.
package icon

import (
	"html"
	"io"

	g "maragu.dev/gomponents"
)

// Icon is an icon: its paths inside the 24-unit square. It is a gomponents
// node.
type Icon struct {
	inner string
}

// Render writes the icon's <svg>.
func (i Icon) Render(w io.Writer) error {
	return i.write(w, "", false)
}

// Class is the icon with a class on its <svg>: vp-icon for 1em, a size
// utility, or a component's part (vp-toggle-light).
func (i Icon) Class(class string) g.Node {
	return g.NodeFunc(func(w io.Writer) error { return i.write(w, class, true) })
}

func (i Icon) write(w io.Writer, class string, classed bool) error {
	svg := "<svg"
	if classed {
		svg += ` class="` + html.EscapeString(class) + `"`
	}
	svg += ` aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`
	_, err := io.WriteString(w, svg+i.inner+"</svg>")
	return err
}

// Sun is the sun: the light appearance.
var Sun = Icon{inner: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>`}

// Moon is the moon: the dark appearance.
var Moon = Icon{inner: `<path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9"/>`}

// Monitor is a monitor: the appearance that follows the system.
var Monitor = Icon{inner: `<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>`}

// X is a cross: close, remove, clear.
var X = Icon{inner: `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`}

// Plus is a plus: add, open.
var Plus = Icon{inner: `<path d="M5 12h14"/><path d="M12 5v14"/>`}

// Minus is a minus: remove, collapse.
var Minus = Icon{inner: `<path d="M5 12h14"/>`}

// Check is a check mark.
var Check = Icon{inner: `<path d="M20 6 9 17l-5-5"/>`}

// Search is a magnifier: search.
var Search = Icon{inner: `<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>`}

// Menu is three lines, left-aligned: a menu (VitePress's align-left, its
// local nav's Menu icon).
var Menu = Icon{inner: `<path d="M15 12H3m14 6H3M21 6H3"/>`}

// MoreHorizontal is three dots: more.
var MoreHorizontal = Icon{inner: `<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>`}

// ChevronDown is a chevron pointing down.
var ChevronDown = Icon{inner: `<path d="m6 9 6 6 6-6"/>`}

// ChevronUp is a chevron pointing up.
var ChevronUp = Icon{inner: `<path d="m18 15-6-6-6 6"/>`}

// ChevronLeft is a chevron pointing left.
var ChevronLeft = Icon{inner: `<path d="m15 18-6-6 6-6"/>`}

// ChevronRight is a chevron pointing right.
var ChevronRight = Icon{inner: `<path d="m9 18 6-6-6-6"/>`}

// ArrowUp is an arrow pointing up.
var ArrowUp = Icon{inner: `<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>`}

// ArrowDown is an arrow pointing down.
var ArrowDown = Icon{inner: `<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>`}

// ArrowLeft is an arrow pointing left.
var ArrowLeft = Icon{inner: `<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`}

// ArrowRight is an arrow pointing right.
var ArrowRight = Icon{inner: `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`}

// Copy is two sheets: copy.
var Copy = Icon{inner: `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>`}

// ExternalLink is a box with an arrow out: an external link.
var ExternalLink = Icon{inner: `<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`}

// Info is an i in a circle: information.
var Info = Icon{inner: `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`}

// CircleAlert is an exclamation mark in a circle: an error, a warning.
var CircleAlert = Icon{inner: `<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>`}

// TriangleAlert is an exclamation mark in a triangle: a warning.
var TriangleAlert = Icon{inner: `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>`}

// CircleCheck is a check mark in a circle: done, success.
var CircleCheck = Icon{inner: `<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>`}

// CornerDownLeft is a corner arrow, down and to the left: the Enter key
// (VitePress's search box, its select hint).
var CornerDownLeft = Icon{inner: `<path d="M20 4v7a4 4 0 0 1-4 4H4"/><path d="m9 10l-5 5l5 5"/>`}

// Delete is a key with a cross: delete, clear a field (VitePress's search
// box, its reset).
var Delete = Icon{inner: `<path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm2 4l6 6m0-6l-6 6"/>`}

// Heart is a heart: sponsor (VitePress's sponsors and team members).
var Heart = Icon{inner: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2c-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`}

// Languages is two scripts: languages, a translation (VitePress's
// translations menu).
var Languages = Icon{inner: `<path d="m5 8l6 6m-7 0l6-6l2-3M2 5h12M7 2h1m14 20l-5-10l-5 10m2-4h6"/>`}

// LayoutList is two squares beside lines: a detailed list (VitePress's search
// box, its layout toggle).
var LayoutList = Icon{inner: `<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M14 4h7m-7 5h7m-7 6h7m-7 5h7"/>`}

// Sparkles is sparkles: AI (VitePress's Ask AI button), its strokes 1.8 as
// VitePress draws it.
var Sparkles = Icon{inner: `<g stroke-width="1.8"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594zM20 2v4m2-2h-4"/><circle cx="4" cy="20" r="2"/></g>`}

// SquarePen is a pen on a square: edit (VitePress's doc footer, its edit
// link).
var SquarePen = Icon{inner: `<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>`}
