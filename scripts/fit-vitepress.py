# themes/vitepress.css: VitePress's stock palette (tokens.css) with its
# contrast shortfalls fitted to the contract test/themes.mjs holds every
# theme to, and to what the owner asked for on 2026-10-11 (the apps gave
# up their own AA fixes, so vpkit carries them for all of them). The
# property list is themes/github.css's; the fits are gen-themes.py's,
# copied because that script generates on import.
#
#   python3 scripts/fit-vitepress.py            # writes themes/vitepress.css
#   python3 scripts/fit-vitepress.py --check    # exits 1 if it would differ
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
check = "--check" in sys.argv

def rgb(c):
    n = int(c.lstrip("#"), 16); return ((n >> 16) & 255, (n >> 8) & 255, n & 255)
def hexs(c):
    r, g, b = c; return f"#{r:02x}{g:02x}{b:02x}"
def lum(c):
    def ch(v):
        v = v / 255; return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = rgb(c) if isinstance(c, str) else c
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)
def contrast(a, b):
    la, lb = lum(a), lum(b); hi, lo = max(la, lb), min(la, lb); return (hi + 0.05) / (lo + 0.05)
def mix(a, b, t):
    (ar, ag, ab), (br, bg_, bb) = rgb(a), rgb(b)
    return hexs((round(ar + (br - ar) * t), round(ag + (bg_ - ag) * t), round(ab + (bb - ab) * t)))
def composite(hex_color, alpha, bg):
    (fr, fg_, fb), (br, bg2, bb) = rgb(hex_color), rgb(bg)
    up = lambda v: int(v + 0.5)
    return hexs((up(fr * alpha + br * (1 - alpha)), up(fg_ * alpha + bg2 * (1 - alpha)), up(fb * alpha + bb * (1 - alpha))))
EPS = 0.03
black, white = "#000000", "#ffffff"
def fit_all(c, mode, text=(), dimmed=(), target=4.5):
    target += EPS
    end = black if mode == "light" else white
    for k in range(101):
        x = mix(c, end, k / 100)
        if all(contrast(x, g) >= target for g in text) and all(contrast(composite(x, 0.75, g), g) >= target for g in dimmed):
            return x
    return end
def over(value, bg):
    """an rgba() token composited over bg, or a hex as is"""
    m = re.match(r"rgba\((\d+), (\d+), (\d+), ([\d.]+)\)", value)
    if not m: return value
    r, g, b, a = int(m[1]), int(m[2]), int(m[3]), float(m[4])
    return composite(hexs((r, g, b)), a, bg)

def declarations(css, selector):
    """every top-level `selector { ... }` block's declarations, merged"""
    out = {}
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    for m in re.finditer(r"(?:^|\n)" + re.escape(selector) + r"\s*\{([^}]*)\}", css):
        for line in m[1].split(";"):
            if ":" in line:
                k, val = line.split(":", 1); out[k.strip()] = " ".join(val.split())
    return out
tokens = open(f"{ROOT}/tokens.css").read()
stock = {":root": declarations(tokens, ":root"), ".dark": declarations(tokens, ".dark")}
def resolve(value, mode, depth=0):
    m = re.fullmatch(r"var\((--[\w-]+)\)", value)
    if not m: return value
    nxt = stock[mode].get(m[1], stock[":root"].get(m[1]))
    assert nxt is not None and depth < 8, f"unresolved {value} in {mode}"
    return resolve(nxt, mode, depth + 1)
template = open(f"{ROOT}/themes/github.css").read()
blocks = {}
for sel, mode in ((":root", "light"), (".dark", "dark")):
    blocks[sel] = {k: resolve(stock[sel].get(k, stock[":root"].get(k)), sel) for k in declarations(template, sel)}
changes = []
for sel, mode in ((":root", "light"), (".dark", "dark")):
    v = blocks[sel]
    bg, elv = v["--vp-c-bg"], v["--vp-c-bg-elv"]
    gray = over(v["--vp-c-default-soft"], bg)
    gray2 = over(v["--vp-c-default-soft"], gray)
    def change(k, new, why):
        if new != v[k]:
            changes.append((sel, k, v[k], new, why)); v[k] = new
    # a hovered link: brand-2 as text on the page, the elevated surface and
    # code's tint, and dimmed to 0.75 in the gray containers
    change("--vp-c-brand-2", fit_all(v["--vp-c-brand-2"], mode, text=[bg, elv, gray], dimmed=[gray, gray2]),
           "a hovered link as text, and dimmed in a container")
    # each role's -2, dimmed in its own container and on code's tint there
    for role in ("tip", "important", "warning", "danger", "caution"):
        tint = over(v[f"--vp-c-{role}-soft"], bg); tint2 = over(v[f"--vp-c-{role}-soft"], tint)
        change(f"--vp-c-{role}-2", fit_all(v[f"--vp-c-{role}-2"], mode, dimmed=[tint, tint2]), f"a hovered link dimmed in a {role} container")
    # the brand button's white label: 4.5 at rest (brand-3), hovered and pressed
    change("--vp-c-brand-3", fit_all(v["--vp-c-brand-3"], "light", text=[white]), "the brand button's white label at rest")
    rest = v["--vp-c-brand-3"]
    hover = v["--vp-c-brand-2"] if mode == "light" else mix(rest, black, 0.15)
    if contrast(hover, white) < 4.5 + EPS: hover = fit_all(hover, "light", text=[white])
    change("--vp-button-brand-hover-bg", hover, "the brand button's white label hovered")
    active = v["--vp-c-brand-1"] if mode == "light" else mix(rest, black, 0.25)
    if contrast(active, white) < 4.5 + EPS: active = fit_all(active, "light", text=[white])
    v["--vp-button-brand-active-bg"] = active
    if mode == "dark": changes.append((sel, "--vp-button-brand-active-bg", "#a8b1ff (brand-1)", active, "the brand button's white label pressed"))
    # a control's boundary: 3:1 against the page (WCAG 1.4.11)
    change("--vp-c-border", fit_all(v["--vp-c-border"], mode, text=[bg], target=3.0), "a control's boundary at 3:1 on the page")

HEADER = """/* Built-in theme: vitepress — VitePress's own palette, its contrast
 * shortfalls fitted. Every value is tokens.css's stock one (vars.css at
 * the tag in test/upstream/SOURCE) except what the contract and the owner
 * asked for (2026-10-11, after the apps gave up their own AA fixes): a
 * hovered link's -2, as text and dimmed to 0.75 in its container, at 4.5:1
 * (brand, tip, important, warning, danger, caution, both modes: stock
 * paints 2.2 to 4.1); the brand button's white label at 4.5:1 at rest
 * (light brand-3 4.48 to 4.5), hovered (dark: a deeper ground than stock's
 * lighter brand-2 at 4.15) and pressed (dark: a deeper ground than stock's
 * brand-1 at 1.6); a control's border at 3:1 on the page (stock 2.2 light,
 * 1.6 dark). Fitted by gen-themes.py's steps toward black (light) or white
 * (dark); `python3 scripts/fit-vitepress.py` reproduces it from tokens.css
 * and npm test checks that it does. Import after vpkit, as the apps do. */
"""
out = HEADER
for sel in (":root", ".dark"):
    out += f"{sel} {{\n"
    prev = None
    for k, val in blocks[sel].items():
        group = re.sub(r"^--vp-(c-)?", "", k).split("-")[0]
        if prev and group != prev: out += "\n"
        prev = group
        out += f"  {k}: {val};\n"
        if k == "--vp-button-brand-hover-bg":
            out += f"  --vp-button-brand-active-bg: {blocks[sel]['--vp-button-brand-active-bg']};\n"
    out += "}\n" + ("\n" if sel == ":root" else "")
path = f"{ROOT}/themes/vitepress.css"
if check:
    current = open(path).read() if os.path.exists(path) else ""
    if current != out:
        print("themes/vitepress.css is not scripts/fit-vitepress.py's output: run it", file=sys.stderr); sys.exit(1)
    print("themes/vitepress.css is fit-vitepress.py's output")
else:
    for sel, k, old, new, why in changes:
        print(f"{sel:6} {k:30} {old:>18} -> {new}  {why}")
    open(path, "w").write(out)
