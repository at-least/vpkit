+++
title = "Go"
description = "vpkit's Go module: the components' markup as gomponents nodes, Lucide's icons as inline SVG, and the stylesheets embedded, so one commit pins both."
aliases = ["/guide/rust/"]
+++

# Go

For a page rendered in Go with [gomponents](https://www.gomponents.com), vpkit's repository is the module `github.com/at-least/vpkit`, of three things: components that write the markup of the components whose markup is more than one class, Lucide's icons as inline SVG, and every stylesheet of the kit embedded, so an app's dependency on the module, at a commit, is the one pin for its markup and its CSS.

## Installation

Add the module at a commit:

```sh
go get github.com/at-least/vpkit@<commit>
```

## The components

Each component is a struct and a gomponents node; its fields are the part's: its text, its links, its body as a node, and, for `Chip`, `Empty` and `Pager`, `Class`, the page's utilities on its root (`""` for none). A call writes every field:

```go
_ = vpkit.Empty{Title: "No issues", Desc: "Nothing matched these filters.", Class: "mt-4"}.Render(os.Stdout)
// Output: <div class="vp-empty mt-4"><p class="vp-empty-title">No issues</p><p class="vp-empty-desc">Nothing matched these filters.</p></div>
```

A field left out of a call would be a default nobody chose, and Go fills it in silently. So an app runs exhaustruct on its own code in its checks; a field added to a component then stops every call that does not set it. Add the tool to the app's `go.mod` once:

```sh
go get -tool github.com/GaijinEntertainment/go-exhaustruct/v3/cmd/exhaustruct
```

and run it with the app's tests:

```sh
go tool exhaustruct -i 'github.com/at-least/vpkit[./].*' ./...
```

| Go | Classes | Page |
| --- | --- | --- |
| `vpkit.AppearanceSwitch` | `vp-toggle`, its appearance variant | [Toggle](@/components/toggle.md) |
| `vpkit.Chip` | `vp-chip` | [Chip](@/components/chip.md) |
| `vpkit.Dialog` | `vp-dialog` | [Dialog](@/components/dialog.md) |
| `vpkit.Empty` | `vp-empty` | [Empty State](@/components/empty.md) |
| `vpkit.Field`, `vpkit.FieldHint`, `vpkit.FieldError` | `vp-field` | [Field](@/components/field.md) |
| `vpkit.Hint` | `vp-hint` | [Hint](@/components/hint.md) |
| `vpkit.Pager` | `vp-pager` | [Pager](@/components/pager.md) |
| `vpkit.Tabs`, `vpkit.Tab` | `vp-tabs`, as links to pages | [Tabs](@/components/tabs.md) |

Everything else is a class string on your own element, written with the attributes the element needs: a button with its `data-variant`, an input with its `aria-invalid`, a badge, an alert (its `role` is yours).

The module writes vpkit's classes and nothing else: a utility for the page goes in a component's `Class` where it has one, or on an element around it. Each component's test renders its example, the markup its page shows, so the two cannot part.

## Icons

The package `github.com/at-least/vpkit/go/icon` has Lucide's icons as inline SVG in `currentColor`: `Sun`, `Moon` and `Monitor` for an appearance switch, `X`, `Plus`, `Minus`, `Check`, `Search`, `Menu`, `MoreHorizontal`, the four `Chevron*` and `Arrow*`, `Copy`, `ExternalLink`, `Info`, `CircleAlert`, `TriangleAlert`, `CircleCheck`, and the rest of VitePress's: `CornerDownLeft`, `Delete`, `Heart`, `Languages`, `LayoutList`, `Sparkles` (its strokes 1.8, as VitePress draws it), `SquarePen`. An icon is a gomponents node; `.Class("vp-icon")` puts a class on its `<svg>`, for a size or a component's part.

```go
page := h.Button(h.Class("vp-btn"), h.Type("button"), icon.Sun.Class("vp-icon"), g.Text(" Light"))
```

## The stylesheets

`vpkit.CSSFiles()` lists every stylesheet by its path in the kit, `vpkit.CSS(path)` is its text, and `vpkit.WriteCSS(dir)` lays them out under a directory, for the Tailwind entry to import ([Getting Started](@/guide/getting-started.md#installation)). The module's command writes them with one line, from the commit `go.mod` names:

```sh
go run github.com/at-least/vpkit/go/cmd/vpkit-css target/vpkit
```

## Reference

`go doc -all github.com/at-least/vpkit` has every component's fields, and the module's examples (`go test`) run each one.
