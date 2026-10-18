//! The app kit's stylesheets, embedded (the `css` feature): the root ones
//! (`index.css` and its parts, `prose.css`, `fonts.css`), every
//! `components/<name>/<name>.css` and every `themes/<name>.css`, by their
//! paths in the kit. An app writes them out before its Tailwind build, so
//! the crate's commit is the one pin for its markup and its CSS:
//!
//! ```no_run
//! vpkit::css::write("target/vpkit").unwrap();
//! ```
//!
//! and its entry imports from there (`@import "../target/vpkit/index.css";`,
//! `@import "../target/vpkit/components/button/button.css";`). The Inter
//! font files are not embedded: `fonts.css` refers to them as
//! `url("fonts/…")`, relative to the compiled stylesheet, so an app that
//! wants the webfonts copies the kit's `fonts/` directory beside its built
//! CSS once.
use std::fs;
use std::io;
use std::path::Path;

include!(concat!(env!("OUT_DIR"), "/css_files.rs"));

/// Writes every stylesheet of [`FILES`] under `dir`, at its path in the
/// kit, creating the directories.
pub fn write(dir: impl AsRef<Path>) -> io::Result<()> {
    let dir = dir.as_ref();
    for (rel, text) in FILES {
        let path = dir.join(rel);
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }
        fs::write(path, text)?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_kit_is_embedded() {
        let paths: Vec<&str> = FILES.iter().map(|(p, _)| *p).collect();
        for want in [
            "index.css",
            "tokens.css",
            "prose.css",
            "components/button/button.css",
            "themes/nord.css",
        ] {
            assert!(paths.contains(&want), "{want} is not embedded");
        }
        let (_, tokens) = FILES.iter().find(|(p, _)| *p == "tokens.css").unwrap();
        assert!(tokens.contains("--vp-c-brand:"));
    }

    #[test]
    fn writes_the_kits_layout() {
        let dir = std::env::temp_dir().join(format!("vpkit-css-{}", std::process::id()));
        write(&dir).unwrap();
        assert!(dir.join("components/button/button.css").is_file());
        assert_eq!(
            fs::read_to_string(dir.join("index.css")).unwrap(),
            FILES.iter().find(|(p, _)| *p == "index.css").unwrap().1
        );
        fs::remove_dir_all(dir).unwrap();
    }
}
