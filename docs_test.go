package vpkit

import (
	"errors"
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
			if d.IsDir() && d.Name() == "testdata" {
				return filepath.SkipDir
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
// method, which go/doc does not model, is walked in the type's filtered Decl.
// A trailing comment documents a field or a value spec, as go doc prints it.
func undocumented(fset *token.FileSet, files []*ast.File) ([]string, error) {
	p, err := doc.NewFromFiles(fset, files, "vpkit")
	if err != nil {
		return nil, err
	}
	var out []string
	// a method promoted into two types is one item at one position
	at := func(n ast.Node, what string) {
		problem := fset.Position(n.Pos()).String() + ": " + what
		if !slices.Contains(out, problem) {
			out = append(out, problem)
		}
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
				if v.Doc == "" && s.Doc == nil && s.Comment == nil {
					for _, name := range s.Names {
						at(s, name.Name)
					}
				}
			}
		}
	}
	funcs := func(fns []*doc.Func) {
		for _, f := range fns {
			if f.Doc != "" {
				continue
			}
			name := f.Name
			if f.Orig != "" {
				name = strings.TrimPrefix(f.Orig, "*") + "." + f.Name
			}
			at(f.Decl, name)
		}
	}
	// members walks the struct fields and interface methods a type expression
	// shows, through pointers, slices, arrays and maps, never into a func
	// signature or a type parameter, which go doc does not ask to document
	var members func(expr ast.Expr, prefix string)
	members = func(expr ast.Expr, prefix string) {
		var list *ast.FieldList
		switch e := expr.(type) {
		case *ast.StarExpr:
			members(e.X, prefix)
		case *ast.ArrayType:
			members(e.Elt, prefix)
		case *ast.MapType:
			members(e.Key, prefix)
			members(e.Value, prefix)
		case *ast.StructType:
			list = e.Fields
		case *ast.InterfaceType:
			list = e.Methods
		}
		if list == nil {
			return
		}
		for _, field := range list.List {
			var names []string
			for _, name := range field.Names {
				names = append(names, name.Name)
			}
			if len(names) == 0 {
				switch field.Type.(type) {
				case *ast.UnaryExpr, *ast.BinaryExpr:
					// a union term (~int | ~float64), not a member
					continue
				}
				names = append(names, types.ExprString(field.Type))
			}
			for _, name := range names {
				if field.Doc == nil && field.Comment == nil {
					at(field, prefix+name)
				}
				members(field.Type, prefix+name+".")
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
		members(t.Decl.Specs[0].(*ast.TypeSpec).Type, t.Name+".")
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
		var noGo *build.NoGoError
		if errors.As(err, &noGo) || err == nil && len(pkg.GoFiles) == 0 {
			// only tests or only files a build constraint leaves out: go doc
			// shows no package here
			continue
		}
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
	K, L int
}

func D() {}

var E = 1

const (
	E1 = 1 // E1 is documented.
	E2 = 2
)

func f() {}

// I is documented.
type I interface {
	M()
	// Do is documented.
	Do(opts struct{ V int }) error
}

// Num is documented.
type Num interface {
	~int | ~float64
}

// F is documented.
type F func(struct{ A int })

// G is documented.
type G[P interface{ ~int }] struct{}

type x struct{}

func (x) N() {}

func (S) M() {}

// S is documented.
type S struct {
	// In is documented.
	In struct {
		Z int
		z int
	}
	// Ps is documented.
	Ps []*struct {
		Z int
	}
	y
}

// S2 is documented.
type S2 struct {
	y
}

type y struct{}

func (y) P() {}

type (
	// T1 is documented.
	T1 struct {
		U int
	}
	T2 int
)
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
p.go:20:2: E2
p.go:16:5: E
p.go:14:1: D
p.go:7:2: A.io.Writer
p.go:9:2: A.C
p.go:11:2: A.K
p.go:11:2: A.L
p.go:27:2: I.M
p.go:47:1: S.M
p.go:70:1: y.P
p.go:53:3: S.In.Z
p.go:58:3: S.Ps.Z
p.go:75:3: T1.U
p.go:77:2: T2`
	if got != want {
		t.Errorf("got\n%s\nwant\n%s", got, want)
	}
}
