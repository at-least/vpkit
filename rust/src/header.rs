//! The markup a stylesheet's header documents, for the tests to hold each
//! component's output to it.

/// The first block of markup in `css`'s header comment: its consecutive
/// lines indented as ` *   <…`, each trimmed and joined with nothing
/// between them, which is how hypertext renders the same elements.
pub fn example(css: &str) -> String {
    let lines: Vec<&str> = css
        .lines()
        .skip_while(|l| !l.starts_with(" *   <"))
        .take_while(|l| l.starts_with(" *   "))
        .map(|l| l[" *   ".len()..].trim())
        .collect();
    assert!(!lines.is_empty(), "no markup in the stylesheet's header");
    lines.concat()
}

#[test]
fn reads_the_first_block() {
    let css = "/* x\n *\n *   <div class=\"a\">\n *     <p>b</p>\n *   </div>\n *\n * text\n *   <i></i>\n */";
    assert_eq!(example(css), r#"<div class="a"><p>b</p></div>"#);
}
