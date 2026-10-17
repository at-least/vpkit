//! The markup a stylesheet's header documents, for the tests to hold each
//! component's output to it.

/// The first block of markup in `css`'s header comment: its consecutive
/// lines indented as ` *   <…`, each trimmed and joined with nothing
/// between them, which is how hypertext renders the same elements.
pub fn example(css: &str) -> String {
    nth_example(css, 0)
}

/// The `n`th block of markup in `css`'s header comment, counted from 0, read
/// as [`example`] reads the first.
pub fn nth_example(css: &str, n: usize) -> String {
    let mut lines = css.lines().peekable();
    for _ in 0..n {
        lines.by_ref().find(|l| l.starts_with(" *   <"));
        while lines.next_if(|l| l.starts_with(" *   ")).is_some() {}
    }
    let block: Vec<&str> = lines
        .skip_while(|l| !l.starts_with(" *   <"))
        .take_while(|l| l.starts_with(" *   "))
        .map(|l| l[" *   ".len()..].trim())
        .collect();
    assert!(
        !block.is_empty(),
        "no markup block {n} in the stylesheet's header"
    );
    block.concat()
}

#[test]
fn reads_the_first_block() {
    let css = "/* x\n *\n *   <div class=\"a\">\n *     <p>b</p>\n *   </div>\n *\n * text\n *   <i></i>\n */";
    assert_eq!(example(css), r#"<div class="a"><p>b</p></div>"#);
}

#[test]
fn reads_a_later_block() {
    let css = "/* x\n *   <a></a>\n *\n * text\n *   <b>\n *     <i></i>\n *   </b>\n */";
    assert_eq!(nth_example(css, 1), "<b><i></i></b>");
    assert_eq!(nth_example(css, 0), "<a></a>");
}
