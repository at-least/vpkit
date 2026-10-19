//! `vpkit-css <dir>`: writes the app kit's stylesheets under `dir`, in the
//! kit's layout, for a Tailwind build to import. Needs the `css` feature:
//! in this repository `cargo run --features css --bin vpkit-css --
//! target/vpkit`; in an app whose dependency turns it on, `cargo build
//! --locked -p vpkit --bin vpkit-css`, then the binary.
fn main() {
    let dir = std::env::args().nth(1).expect("usage: vpkit-css <dir>");
    vpkit::css::write(&dir).unwrap_or_else(|e| panic!("writing {dir}: {e}"));
    println!("vpkit's stylesheets written under {dir}");
}
