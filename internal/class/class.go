// Package class writes a component's root class.
package class

import g "maragu.dev/gomponents"

// Root is a component's root class: its block, then the page's utilities (its
// Class field), if any.
func Root(block, page string) g.Node {
	if page == "" {
		return g.Attr("class", block)
	}
	return g.Attr("class", block+" "+page)
}
