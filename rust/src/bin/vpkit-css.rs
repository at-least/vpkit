//! `vpkit-css <dir>`: writes the app kit's stylesheets under `dir`, in the
//! kit's layout, for a Tailwind build to import. Needs the `css` feature:
//! `cargo run --features css --bin vpkit-css -- target/vpkit`.
fn main() {
    let dir = std::env::args().nth(1).expect("usage: vpkit-css <dir>");
    vpkit::css::write(&dir).unwrap_or_else(|e| panic!("writing {dir}: {e}"));
    println!("vpkit's stylesheets written under {dir}");
}
