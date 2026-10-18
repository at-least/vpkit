//! A component's example (`components/<name>/examples/<id>.html`), the
//! markup its docs page shows, as hypertext renders the same elements: each
//! line trimmed and the lines joined with nothing between them. The tests
//! hold each component's output to its example, so the two cannot part.

/// `html` with each line trimmed, joined.
pub fn example(html: &str) -> String {
    html.lines().map(str::trim).collect()
}

#[test]
fn trims_and_joins() {
    assert_eq!(
        example("<div class=\"a\">\n  <p>b</p>\n</div>\n"),
        r#"<div class="a"><p>b</p></div>"#
    );
}
