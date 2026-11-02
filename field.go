package vpkit

import (
	"io"

	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

// Field is vp-field (components/field): one form field's box, its label
// (vp-label) first and the body under it: the control the page writes, then a
// FieldHint or a FieldError where there is one.
//
// The label's for is ID. The control is the page's, so the page gives it the
// id, aria-describedby naming the hint's and the error's ids (FieldHintID,
// FieldErrorID) where they are written, and aria-invalid="true" while there is
// an error, which turns vp-input's border danger.
type Field struct {
	// ID is the control's id: the label's for.
	ID string
	// Label is the label's content (vp-label), text or markup.
	Label g.Node
	// Children is the control, then its hint and its error line.
	Children g.Node
}

// Render writes the field.
func (f Field) Render(w io.Writer) error {
	return h.Div(h.Class("vp-field"),
		h.Label(h.Class("vp-label"), h.For(f.ID), f.Label),
		f.Children,
	).Render(w)
}

// FieldHint is vp-field-hint: the line under a control saying what it takes,
// its id FieldHintID's, for the control's aria-describedby.
type FieldHint struct {
	// ID is the control's id.
	ID string
	// Text is the hint. Required: an empty one panics.
	Text string
}

// Render writes the hint's line.
func (f FieldHint) Render(w io.Writer) error {
	return fieldLine(w, "FieldHint", "vp-field-hint", FieldHintID(f.ID), f.Text)
}

// FieldError is vp-field-error: the line under a control saying what is
// wrong, its id FieldErrorID's, for the control's aria-describedby. Write it
// only while there is an error.
type FieldError struct {
	// ID is the control's id.
	ID string
	// Text is the error. Required: an empty one panics.
	Text string
}

// Render writes the error's line.
func (f FieldError) Render(w io.Writer) error {
	return fieldLine(w, "FieldError", "vp-field-error", FieldErrorID(f.ID), f.Text)
}

// a hint's or an error's line under the control: who names the component in
// the panic an empty text raises
func fieldLine(w io.Writer, who, class, id, text string) error {
	if text == "" {
		panic("vpkit." + who + " needs a Text")
	}
	return h.P(h.Class(class), h.ID(id), g.Text(text)).Render(w)
}

// FieldHintID is the hint line's id for the control id.
func FieldHintID(id string) string {
	return id + "-hint"
}

// FieldErrorID is the error line's id for the control id.
func FieldErrorID(id string) string {
	return id + "-error"
}
