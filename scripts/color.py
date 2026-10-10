"""The color math vpkit's generators share (mirrors test/themes.mjs)."""
# --- color math (mirrors test/themes.mjs) -------------------------------
def rgb(c):
    n = int(c.lstrip("#"), 16)
    return ((n >> 16) & 255, (n >> 8) & 255, n & 255)

def hexs(c):
    r, g, b = c
    return f"#{r:02x}{g:02x}{b:02x}"

def lum(c):
    def ch(v):
        v = v / 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = rgb(c) if isinstance(c, str) else c
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)

def contrast(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

def mix(a, b, t):
    """blend a toward b by t (sRGB per-channel)."""
    (ar, ag, ab), (br, bg_, bb) = rgb(a), rgb(b)
    return hexs((round(ar + (br - ar) * t), round(ag + (bg_ - ag) * t), round(ab + (bb - ab) * t)))

EPS = 0.03  # float-safety margin so python's fit clears rust's check

def fit(c, against, target, mode):
    """darken (light mode) / lighten (dark mode) until target contrast;
    if the primary direction cannot reach it, try the other way."""
    target += EPS
    for t in ((black, white) if mode == "light" else (white, black)):
        cur = c
        for _ in range(60):
            if contrast(cur, against) >= target:
                return cur
            cur = mix(cur, t, 0.04)
        if contrast(cur, against) > contrast(c, against):
            c = cur
    return c

def composite(hex_color, alpha, bg):
    # halves round up, as test/themes.mjs's Math.round does: Python's round()
    # takes them to even, and one channel's difference moves a contrast by
    # 0.05 (a dimmed hover over a twice-tinted ground)
    (fr, fg_, fb), (br, bg2, bb) = rgb(hex_color), rgb(bg)
    up = lambda v: int(v + 0.5)
    return hexs((up(fr * alpha + br * (1 - alpha)), up(fg_ * alpha + bg2 * (1 - alpha)), up(fb * alpha + bb * (1 - alpha))))

def fit_on_tint(c, bg, alpha, target, mode):
    """fit c so it passes on its own alpha tint over bg."""
    target += EPS
    for _ in range(80):
        if contrast(c, composite(c, alpha, bg)) >= target and contrast(c, bg) >= target:
            return c
        c = mix(c, black if mode == "light" else white, 0.04)
    return c

def fit_all(c, mode, text=(), dimmed=(), target=4.5):
    """step c toward black (light) or white (dark) until it reaches the
    target as text on every `text` ground and, dimmed to 0.75 (the opacity
    the containers give a hovered link), on every `dimmed` ground."""
    target += EPS
    end = black if mode == "light" else white
    # interpolated from c, not stepped: a rounded 4% step stalls short of
    # black and white (at 12 and 243 per channel)
    for k in range(101):
        x = mix(c, end, k / 100)
        if all(contrast(x, g) >= target for g in text) and all(
            contrast(composite(x, 0.75, g), g) >= target for g in dimmed
        ):
            return x
    return end

black, white = "#000000", "#ffffff"

