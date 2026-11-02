package vpkit

import (
	"go/ast"
	"go/build"
	"go/doc"
	"go/parser"
	"go/token"
	"go/types"
	"io/fs"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

// the module's package directories: the root, and every one under go/ and
// internal/ that holds a Go file (not a walk of the root, which would read
// node_modules)
func moduleDirs(t *testing.T) []string {
	t.Helper()
	dirs := []string{"."}
	for _, root := range []string{"go", "internal"} {
		err := filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return err
			}
			dir := filepath.Dir(path)
			if !d.IsDir() && strings.HasSuffix(path, ".go") && !slices.Contains(dirs, dir) {
				dirs = append(dirs, dir)
			}
			return nil
		})
		if err != nil {
			t.Fatal(err)
		}
	}
	return dirs
}

// undocumented lists each item of the package that go doc shows without a doc
// comment. go/doc decides what is shown (exported names, methods promoted from
// embedded types, build constraints left to the caller); a field or interface
// method, which go/doc does not model, is walked in the type's filtered Decl, and
// its trailing comment documents it.
func undocumented(fset *token.FileSet, files []*ast.File) ([]string, error) {
	p, err := doc.NewFromFiles(fset, files, "vpkit")
	if err != nil {
		return nil, err
	}
	var out []string
	at := func(n ast.Node, what string) {
		out = append(out, fset.Position(n.Pos()).String()+": "+what)
	}
	if p.Doc == "" {
		at(files[0].Name, "package "+p.Name)
	}
	// Value.Doc is the group's comment only (go/doc clears Decl.Doc), and a
	// spec's own comment documents its names too
	values := func(vs []*doc.Value) {
		for _, v := range vs {
			for _, spec := range v.Decl.Specs {
				s := spec.(*ast.ValueSpec)
				if v.Doc == "" && s.Doc == nil {
					for _, name := range s.Names {
						at(s, name.Name)
					}
				}
			}
		}
	}
	funcs := func(fs []*doc.Func) {
		for _, f := range fs {
			if f.Doc == "" {
				at(f.Decl, f.Name)
			}
		}
	}
	values(p.Consts)
	values(p.Vars)
	funcs(p.Funcs)
	for _, t := range p.Types {
		if t.Doc == "" {
			at(t.Decl, t.Name)
		}
		values(t.Consts)
		values(t.Vars)
		funcs(t.Funcs)
		funcs(t.Methods)
		ast.Inspect(t.Decl, func(n ast.Node) bool {
			var list *ast.FieldList
			switch x := n.(type) {
			case *ast.StructType:
				list = x.Fields
			case *ast.InterfaceType:
				list = x.Methods
			}
			if list == nil {
				return true
			}
			for _, field := range list.List {
				if field.Doc != nil || field.Comment != nil {
					continue
				}
				name := types.ExprString(field.Type)
				if len(field.Names) > 0 {
					name = field.Names[0].Name
				}
				at(field, t.Name+"."+name)
			}
			return true
		})
	}
	return out, nil
}

// every item of the module that go doc shows has a doc comment, the package
// included
func TestEveryExportedItemIsDocumented(t *testing.T) {
	dirs := moduleDirs(t)
	if len(dirs) < 4 {
		t.Fatalf("%d package directories read", len(dirs))
	}
	for _, dir := range dirs {
		pkg, err := build.ImportDir(dir, 0)
		if err != nil {
			t.Fatal(err)
		}
		fset := token.NewFileSet()
		var files []*ast.File
		for _, name := range pkg.GoFiles {
			file, err := parser.ParseFile(fset, filepath.Join(dir, name), nil, parser.ParseComments)
			if err != nil {
				t.Fatal(err)
			}
			files = append(files, file)
		}
		problems, err := undocumented(fset, files)
		if err != nil {
			t.Fatal(err)
		}
		for _, problem := range problems {
			t.Errorf("%s has no doc comment", problem)
		}
	}
}

func TestAnUndocumentedItemFails(t *testing.T) {
	src := `package p

import "io"

// A is documented.
type A struct {
	io.Writer
	B string // B is documented.
	C string
	c string
}

func D() {}

var E = 1

func f() {}

// I is documented.
type I interface {
	M()
}

type x struct{}

func (x) N() {}

// S is documented.
type S struct {
	// In is documented.
	In struct {
		Z int
		z int
	}
	// Ps is documented.
	Ps []struct {
		Q int
	}
	y
}

type y struct{}

func (y) P() {}
`
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, "p.go", src, parser.ParseComments)
	if err != nil {
		t.Fatal(err)
	}
	problems, err := undocumented(fset, []*ast.File{file})
	if err != nil {
		t.Fatal(err)
	}
	got := strings.Join(problems, "\n")
	want := `p.go:1:9: package p
p.go:15:5: E
p.go:13:1: D
p.go:7:2: A.io.Writer
p.go:9:2: A.C
p.go:21:2: I.M
p.go:44:1: P
p.go:32:3: S.Z
p.go:37:3: S.Q`
	if got != want {
		t.Errorf("got\n%s\nwant\n%s", got, want)
	}
}
