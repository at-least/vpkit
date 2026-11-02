package vpkit

import (
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

func TestTheKitIsEmbedded(t *testing.T) {
	paths := CSSFiles()
	for _, want := range []string{"index.css", "tokens.css", "prose.css", "fonts.css", "components/button/button.css", "themes/nord.css"} {
		if !slices.Contains(paths, want) {
			t.Errorf("%s is not embedded", want)
		}
	}
	if !strings.Contains(CSS("tokens.css"), "--vp-c-brand:") {
		t.Error("tokens.css has no --vp-c-brand")
	}
}

// every stylesheet of components/ and themes/ is embedded: the embed's
// patterns name one level of directories, and a stylesheet deeper would be
// left out silently
func TestEveryStylesheetIsEmbedded(t *testing.T) {
	var want []string
	for _, dir := range []string{"components", "themes"} {
		err := filepath.WalkDir(dir, func(path string, d os.DirEntry, err error) error {
			if err != nil {
				return err
			}
			if !d.IsDir() && filepath.Ext(path) == ".css" {
				want = append(want, filepath.ToSlash(path))
			}
			return nil
		})
		if err != nil {
			t.Fatal(err)
		}
	}
	paths := CSSFiles()
	for _, p := range want {
		if !slices.Contains(paths, p) {
			t.Errorf("%s is not embedded", p)
		}
	}
	if len(want) < 200 {
		t.Fatalf("%d stylesheets read", len(want))
	}
}

func TestWritesTheKitsLayout(t *testing.T) {
	dir := t.TempDir()
	if err := WriteCSS(dir); err != nil {
		t.Fatal(err)
	}
	button, err := os.ReadFile(filepath.Join(dir, "components/button/button.css"))
	if err != nil {
		t.Fatal(err)
	}
	if string(button) != CSS("components/button/button.css") {
		t.Error("components/button/button.css is not the kit's")
	}
	index, err := os.ReadFile(filepath.Join(dir, "index.css"))
	if err != nil {
		t.Fatal(err)
	}
	if string(index) != CSS("index.css") {
		t.Error("index.css is not the kit's")
	}
}
