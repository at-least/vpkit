package vpkit_test

import (
	"fmt"
	"strings"
	"testing"
)

// mustPanic fails t unless render panics with a message holding want.
func mustPanic(t *testing.T, want string, render func()) {
	t.Helper()
	defer func() {
		r := recover()
		if r == nil || !strings.Contains(fmt.Sprint(r), want) {
			t.Errorf("panicked with %v, want %q", r, want)
		}
	}()
	render()
}
