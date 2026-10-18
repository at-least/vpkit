//! With the `css` feature, the app kit's stylesheets as `include_str!`
//! items: every root stylesheet, every component's and every color theme's,
//! listed by their paths in the kit, so `vpkit::css::write` can lay them
//! out for an app's Tailwind build. The paths are absolute, from the
//! crate's directory: a git checkout of the repository has the kit beside
//! `rust/`.
use std::env;
use std::fs;
use std::path::{Path, PathBuf};

fn css_files(dir: &Path, root: &Path, out: &mut Vec<(String, PathBuf)>) {
    let mut entries: Vec<_> = fs::read_dir(dir)
        .unwrap_or_else(|e| panic!("{}: {e}", dir.display()))
        .map(|e| e.unwrap().path())
        .collect();
    entries.sort();
    for path in entries {
        if path.is_dir() {
            css_files(&path, root, out);
        } else if path.extension().is_some_and(|x| x == "css") {
            let rel = path
                .strip_prefix(root)
                .unwrap()
                .to_string_lossy()
                .replace('\\', "/");
            out.push((rel, path));
        }
    }
}

fn main() {
    let manifest = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    let root = manifest.parent().unwrap();
    println!("cargo:rerun-if-changed=build.rs");
    if env::var_os("CARGO_FEATURE_CSS").is_none() {
        return;
    }
    let mut files = Vec::new();
    for name in [
        "index.css",
        "theme.css",
        "tokens.css",
        "base.css",
        "prose.css",
        "fonts.css",
    ] {
        files.push((name.to_string(), root.join(name)));
    }
    for dir in ["components", "themes"] {
        css_files(&root.join(dir), root, &mut files);
        println!("cargo:rerun-if-changed={}", root.join(dir).display());
    }
    let mut out = String::from(
        "/// Every stylesheet of the app kit: its path in the kit, and its text.\npub const FILES: &[(&str, &str)] = &[\n",
    );
    for (rel, path) in &files {
        println!("cargo:rerun-if-changed={}", path.display());
        out.push_str(&format!(
            "    ({rel:?}, include_str!({:?})),\n",
            path.display()
        ));
    }
    out.push_str("];\n");
    fs::write(
        Path::new(&env::var("OUT_DIR").unwrap()).join("css_files.rs"),
        out,
    )
    .unwrap();
}
