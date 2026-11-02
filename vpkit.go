// Package vpkit is vpkit's app kit for a Go app that renders with gomponents:
// its components as gomponents nodes, the markup the vp-* classes expect; and
// its stylesheets embedded, so the app's Go dependency on this module, at a
// commit, is the one pin for both its markup and its CSS: the app writes the
// stylesheets out with WriteCSS (or `go run
// github.com/at-least/vpkit/go/cmd/vpkit-css <dir>`) and its Tailwind entry
// imports the components it uses from there
// (`@import "../target/vpkit/index.css";`). The Inter font files are not
// embedded: fonts.css refers to them as url("fonts/…"), relative to the
// compiled stylesheet, so an app copies the kit's fonts/ directory beside its
// built CSS once. Its icons, as inline SVG, are package icon.
//
// Only the components whose markup is more than a class on one element are
// here, one file per component (empty.go renders components/empty's markup):
// a button, an input or a badge is a class string, written on the element
// with the attributes the page gives it; a variant is an attribute
// (data-variant="brand"), a state the one the markup carries anyway
// (aria-current, aria-invalid, disabled).
//
// A component emits vpkit's classes and nothing else. Chip, Empty and Pager
// take Class, the page's utilities on their root element (class="mb-0"), as
// class="vp-empty mb-0" would by hand; AppearanceSwitch, Dialog, Field, Hint
// and Tabs take none. Tailwind finds them in the app's own source, where they
// are written.
//
// Each component is a struct whose every field a call writes: the module's
// exhaustruct check (go tool exhaustruct) fails a call that leaves one out, as
// an app's own gate should, so a field added here stops every call that does
// not set it.
package vpkit

import (
	"embed"
	"io/fs"
	"os"
	"path/filepath"
)

// the root stylesheets by name: a pattern would take a stray file in the
// repository's root too
//
//go:embed index.css theme.css tokens.css base.css prose.css fonts.css components/*/*.css themes/*.css
var stylesheets embed.FS

// CSSFiles is every stylesheet of the app kit, by its path in the kit, in the
// order of their paths.
func CSSFiles() []string {
	var paths []string
	err := fs.WalkDir(stylesheets, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			paths = append(paths, path)
		}
		return nil
	})
	if err != nil {
		panic(err)
	}
	return paths
}

// CSS is the text of the kit's stylesheet at path (one of CSSFiles); a path
// not there panics.
func CSS(path string) string {
	b, err := stylesheets.ReadFile(path)
	if err != nil {
		panic(err)
	}
	return string(b)
}

// WriteCSS writes every stylesheet of the kit under dir, at its path in the
// kit, creating the directories.
func WriteCSS(dir string) error {
	for _, path := range CSSFiles() {
		out := filepath.Join(dir, filepath.FromSlash(path))
		if err := os.MkdirAll(filepath.Dir(out), 0o755); err != nil {
			return err
		}
		if err := os.WriteFile(out, []byte(CSS(path)), 0o644); err != nil {
			return err
		}
	}
	return nil
}
