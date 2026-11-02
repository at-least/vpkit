package vpkit

import (
	"go/ast"
	"go/parser"
	"go/token"
	"io/fs"
	"path/filepath"
	"strings"
	"testing"
)

// the module's Go files besides tests: the root's, and every one under go/
// and internal/ (not a walk of the root, which would read node_modules)
func moduleFiles(t *testing.T) []string {
	t.Helper()
	files, err := filepath.Glob("*.go")
	if err != nil {
		t.Fatal(err)
	}
	for _, dir := range []string{"go", "internal"} {
		err := filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return err
			}
			if !d.IsDir() && strings.HasSuffix(path, ".go") {
				files = append(files, path)
			}
			return nil
		})
		if err != nil {
			t.Fatal(err)
		}
	}
	var out []string
	for _, f := range files {
		if !strings.HasSuffix(f, "_test.go") {
			out = append(out, f)
		}
	}
	return out
}

// undocumented lists, in file, each exported item without a doc comment: a
// type, a func, a method, a var or a const, an exported struct field
func undocumented(fset *token.FileSet, file *ast.File) []string {
	var out []string
	at := func(n ast.Node, what string) {
		out = append(out, fset.Position(n.Pos()).String()+": "+what)
	}
	for _, decl := range file.Decls {
		switch d := decl.(type) {
		case *ast.FuncDecl:
			if d.Name.IsExported() && d.Doc == nil {
				at(d, d.Name.Name)
			}
		case *ast.GenDecl:
			for _, spec := range d.Specs {
				switch s := spec.(type) {
				case *ast.TypeSpec:
					if !s.Name.IsExported() {
						continue
					}
					if d.Doc == nil && s.Doc == nil {
						at(s, s.Name.Name)
					}
					st, ok := s.Type.(*ast.StructType)
					if !ok {
						continue
					}
					for _, field := range st.Fields.List {
						for _, name := range field.Names {
							if name.IsExported() && field.Doc == nil {
								at(field, s.Name.Name+"."+name.Name)
							}
						}
					}
				case *ast.ValueSpec:
					for _, name := range s.Names {
						if name.IsExported() && d.Doc == nil && s.Doc == nil {
							at(s, name.Name)
						}
					}
				}
			}
		}
	}
	return out
}

// every exported item of the module has a doc comment, and every package a
// package comment, as go doc shows them
func TestEveryExportedItemIsDocumented(t *testing.T) {
	files := moduleFiles(t)
	if len(files) < 10 {
		t.Fatalf("%d Go files read", len(files))
	}
	fset := token.NewFileSet()
	packageDoc := map[string]bool{}
	for _, path := range files {
		file, err := parser.ParseFile(fset, path, nil, parser.ParseComments)
		if err != nil {
			t.Fatal(err)
		}
		dir := filepath.Dir(path)
		packageDoc[dir] = packageDoc[dir] || file.Doc != nil
		for _, problem := range undocumented(fset, file) {
			t.Errorf("%s has no doc comment", problem)
		}
	}
	for dir, documented := range packageDoc {
		if !documented {
			t.Errorf("%s: its package has no package comment", dir)
		}
	}
}

func TestAnUndocumentedItemFails(t *testing.T) {
	src := "package p\n\n// A is documented.\ntype A struct {\n\t// B is documented.\n\tB string\n\tC string\n}\n\nfunc D() {}\n\nvar E = 1\n\nfunc f() {}\n"
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, "p.go", src, parser.ParseComments)
	if err != nil {
		t.Fatal(err)
	}
	got := strings.Join(undocumented(fset, file), "; ")
	want := "p.go:7:2: A.C; p.go:10:1: D; p.go:12:5: E"
	if got != want {
		t.Errorf("got %s, want %s", got, want)
	}
}
