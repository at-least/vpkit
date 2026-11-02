package example

import (
	"os"
	"path/filepath"
	"testing"
)

func TestReadTrimsAndJoins(t *testing.T) {
	dir := t.TempDir()
	saved := root
	root = dir
	defer func() { root = saved }()
	if err := os.MkdirAll(filepath.Join(dir, "components/a/examples"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "components/a/examples/b.html"), []byte("<div class=\"a\">\n  <p>b</p>\n</div>\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if got, want := Read("a/examples/b.html"), `<div class="a"><p>b</p></div>`; got != want {
		t.Errorf("got %s, want %s", got, want)
	}
}
