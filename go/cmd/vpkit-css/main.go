// Command vpkit-css writes the app kit's stylesheets under a directory, in the
// kit's layout, for a Tailwind build to import:
//
//	go run github.com/at-least/vpkit/go/cmd/vpkit-css target/vpkit
package main

import (
	"fmt"
	"os"

	"github.com/at-least/vpkit"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Fprintln(os.Stderr, "usage: vpkit-css <dir>")
		os.Exit(2)
	}
	if err := vpkit.WriteCSS(os.Args[1]); err != nil {
		fmt.Fprintf(os.Stderr, "writing %s: %v\n", os.Args[1], err)
		os.Exit(1)
	}
	fmt.Printf("vpkit's stylesheets written under %s\n", os.Args[1])
}
