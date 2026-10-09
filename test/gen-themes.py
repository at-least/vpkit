#!/usr/bin/env python3
"""Does scripts/gen-themes.py read an inheriting Helix palette as Helix
does? Runs the generator's definitions (not its two loops, which write
themes/) and checks two palettes against values computed here from the
raw TOML by Helix's rule (helix-view/src/theme.rs, merge_themes, at
ba40e547426b): the child's top-level keys replace the parent's whole,
and the palettes merge entry by entry, the child's winning.

    python3 test/gen-themes.py                 (part of npm test)
    python3 test/gen-themes.py <generator.py>  another copy of it

Exits 1 when a check fails. Python 3.11+ (tomllib), as the generator.
"""
import os
import sys
import tomllib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = sys.argv[1] if len(sys.argv) > 1 else f"{ROOT}/scripts/gen-themes.py"
H = f"{ROOT}/helix"

src = open(GEN).read()
a = src.index("report = []\nfor spec in SPECS:")
b = src.index("# --- auto-mapping pass")
c = src.index("regenerated = set()")
ns = {"__file__": f"{ROOT}/scripts/gen-themes.py"}
exec(compile(src[:a] + src[b:c], GEN, "exec"), ns)

def raw(stem):
    return tomllib.load(open(f"{H}/{stem}.toml", "rb"))

def norm(v):
    v = v.lower()
    return "#" + "".join(ch * 2 for ch in v[1:]) if len(v) == 4 else v

failed = 0
def check(label, got, want):
    global failed
    ok = got == want
    failed += not ok
    print(f"{'ok  ' if ok else 'FAIL'} {label}: {got!r} {'==' if ok else '!='} {want!r}")

# wolf-alabaster-light-mono has no background of its own: the parent's
# "ui.background" names palette key "bg", resolved in the merged palette
parent, child = raw("wolf-alabaster-light"), raw("wolf-alabaster-light-mono")
assert "ui.background" not in child and child["inherits"] == "wolf-alabaster-light"
want_bg = norm({**parent["palette"], **child.get("palette", {})}[parent["ui.background"]["bg"]])
got = ns["auto_slots"]("wolf-alabaster-light-mono")
check("wolf-alabaster-light-mono maps", got is not None, True)
if got:
    check("wolf-alabaster-light-mono mode", got[0], "light" if ns["lum"](want_bg) > 0.5 else "dark")
    check("wolf-alabaster-light-mono page color", got[1]["bg"], want_bg)

# gruvbox_dark_hard has one palette entry of its own, the background's,
# which must win over gruvbox's entry of the same name
parent, child = raw("gruvbox"), raw("gruvbox_dark_hard")
key = parent["ui.background"]["bg"]
assert child["inherits"] == "gruvbox" and list(child["palette"]) == [key]
want_bg = norm(child["palette"][key])
assert want_bg != norm(parent["palette"][key])
got = ns["auto_slots"]("gruvbox_dark_hard")
check("gruvbox_dark_hard maps", got is not None, True)
if got:
    check("gruvbox_dark_hard page color", got[1]["bg"], want_bg)

# the merge itself, on synthetic tables
if "merge_themes" in ns:
    p = {"ui.background": {"bg": "a", "fg": "b"}, "ui.text": "x", "palette": {"x": "#111111", "y": "#222222"}}
    c = {"inherits": "p", "ui.background": {"bg": "c"}, "palette": {"y": "#333333"}}
    m = ns["merge_themes"](p, c)
    check("a child scope replaces the parent scope whole", m["ui.background"], {"bg": "c"})
    check("a parent-only scope stays", m["ui.text"], "x")
    check("palettes merge, the child winning", m["palette"], {"x": "#111111", "y": "#333333"})
else:
    check("the generator defines merge_themes", False, True)

print(f"gen-themes: {failed} failed" if failed else "gen-themes: inherits read as Helix reads it")
sys.exit(1 if failed else 0)
