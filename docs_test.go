package vpkit

import (
	"fmt"
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

// typeName is the name a receiver or an embedded field takes from its type:
// T, *T, pkg.T, T[P]
func typeName(expr ast.Expr) string {
	switch e := expr.(type) {
	case *ast.Ident:
		return e.Name
	case *ast.StarExpr:
		return typeName(e.X)
	case *ast.SelectorExpr:
		return e.Sel.Name
	case *ast.IndexExpr:
		return typeName(e.X)
	case *ast.IndexListExpr:
		return typeName(e.X)
	}
	panic(fmt.Sprintf("typeName: %T", expr))
}

// undocumented lists, in file, each exported item go doc shows without a doc
// comment: a type, a func, a method of an exported type, a var or a const, and
// in an exported type each exported field, embedded field and interface method,
// down into nested struct types. A field's trailing comment documents it, as
// go doc prints it.
func undocumented(fset *token.FileSet, file *ast.File) []string {
	var out []string
	at := func(n ast.Node, what string) {
		out = append(out, fset.Position(n.Pos()).String()+": "+what)
	}
	var fields func(list *ast.FieldList, prefix string)
	fields = func(list *ast.FieldList, prefix string) {
		for _, field := range list.List {
			names := []string{}
			for _, name := range field.Names {
				names = append(names, name.Name)
			}
			if len(field.Names) == 0 {
				names = append(names, typeName(field.Type))
			}
			for _, name := range names {
				if !ast.IsExported(name) {
					continue
				}
				if field.Doc == nil && field.Comment == nil {
					at(field, prefix+name)
				}
				if st, ok := field.Type.(*ast.StructType); ok {
					fields(st.Fields, prefix+name+".")
				}
			}
		}
	}
	for _, decl := range file.Decls {
		switch d := decl.(type) {
		case *ast.FuncDecl:
			if !d.Name.IsExported() {
				continue
			}
			if d.Recv != nil && !ast.IsExported(typeName(d.Recv.List[0].Type)) {
				continue
			}
			if d.Doc == nil {
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
					switch tt := s.Type.(type) {
					case *ast.StructType:
						fields(tt.Fields, s.Name.Name+".")
					case *ast.InterfaceType:
						fields(tt.Methods, s.Name.Name+".")
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

// every exported item of the module that go doc shows has a doc comment, and
// every package a package comment
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

// each case the review found: an embedded field, an interface method and a
// nested struct's field are held; a trailing comment documents a field, and a
// method on an unexported type is not shown by go doc
func TestUndocumentedMatchesGoDoc(t *testing.T) {
	src := `package p

import "io"

// A is documented.
type A struct {
	io.Writer
	B string // B is documented.
}

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
	}
}
`
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, "p.go", src, parser.ParseComments)
	if err != nil {
		t.Fatal(err)
	}
	got := strings.Join(undocumented(fset, file), "; ")
	want := "p.go:7:2: A.Writer; p.go:13:2: I.M; p.go:24:3: S.In.Z"
	if got != want {
		t.Errorf("got %s, want %s", got, want)
	}
}
