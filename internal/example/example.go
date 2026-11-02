// Package example holds a component's output to its example
// (components/<name>/examples/<id>.html), the markup its docs page shows, so
// the two cannot part.
package example

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	g "maragu.dev/gomponents"
)

// the repository's root, from this file's place in it
var root = func() string {
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		panic("no caller")
	}
	return filepath.Join(filepath.Dir(file), "../..")
}()

// Read is the example at path, under components/, each line trimmed and the
// lines joined with nothing between them: the markup as a component writes it.
func Read(path string) string {
	b, err := os.ReadFile(filepath.Join(root, "components", path))
	if err != nil {
		panic(err)
	}
	var out strings.Builder
	for _, line := range strings.Split(string(b), "\n") {
		out.WriteString(strings.TrimSpace(line))
	}
	return out.String()
}

// Render is node's HTML, with gomponents' two escapes the examples write
// otherwise put as they do: ' as itself (gomponents writes &#39;), " as
// &quot; (&#34;). Each pair means the same in text and in a double-quoted
// attribute.
func Render(node g.Node) string {
	var b strings.Builder
	if err := node.Render(&b); err != nil {
		panic(err)
	}
	return strings.NewReplacer("&#39;", "'", "&#34;", "&quot;").Replace(b.String())
}

// Check fails t where node does not write the example at path.
func Check(t testing.TB, node g.Node, path string) {
	t.Helper()
	if got, want := Render(node), Read(path); got != want {
		t.Errorf("%s\n got: %s\nwant: %s", path, got, want)
	}
}
