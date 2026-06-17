"""
add_logo_outro.py — Animiran logo outro, točna reprodukcija SVG loga
"""

import subprocess, shutil
from pathlib import Path
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

PROMO_DIR   = Path(r"E:\fincoach-vip\promo")
INPUT_VIDEO = PROMO_DIR / "fincoach_promo_20260615_194305.mp4"
OUTRO_VID   = PROMO_DIR / "outro_logo.mp4"

NAVY = (26, 39, 68)
GOLD = (201, 168, 76)
WHITE = (255, 255, 255)
W, H  = 1920, 1080
FPS   = 25
DURATION = 5


def draw_logo(scale: float, alpha: int) -> Image.Image:
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img, "RGBA")

    # Logo dimenzije — SVG viewBox 200x280
    logo_h = int(480 * scale)
    logo_w = int(logo_h * 200 / 280)
    ox = (W - logo_w) // 2
    oy = (H - logo_h) // 2

    def s(x, y):
        return (ox + int(x * logo_w / 200), oy + int(y * logo_h / 280))

    def sa(v):
        return min(255, int(v * alpha / 255))

    # Ščit — SVG path: M100 12 L148 33 L148 94 Q148 137 100 158 Q52 137 52 94 L52 33 Z
    shield = [
        s(100, 12), s(148, 33), s(148, 94),
        s(140, 118), s(124, 142), s(100, 158),
        s(76, 142), s(60, 118),
        s(52, 94), s(52, 33),
    ]
    d.polygon(shield, fill=GOLD + (sa(13),))
    d.line(shield + [shield[0]], fill=GOLD + (sa(230),), width=max(1, int(2*scale)))

    inner = [
        s(100, 24), s(140, 42), s(140, 94),
        s(133, 113), s(119, 135), s(100, 148),
        s(81, 135), s(67, 113),
        s(60, 94), s(60, 42),
    ]
    d.line(inner + [inner[0]], fill=GOLD + (sa(89),), width=1)

    # Stolpci — iz SVG: rx=64,81,98,115  ry=114,100,83,64  w=12  h=26,40,57,76
    bars = [(64, 114, 12, 26, 0.38), (81, 100, 12, 40, 0.58),
            (98, 83, 12, 57, 0.78), (115, 64, 12, 76, 1.00)]
    for bx, by, bw, bh, op in bars:
        x1, y1 = s(bx, by)
        x2, y2 = s(bx + bw, by + bh)
        d.rectangle([x1, y1, x2, y2], fill=GOLD + (sa(int(255 * op)),))

    # Trend linija — SVG: "66,112 83,98 100,81 117,62 134,46"
    tp = [s(66,112), s(83,98), s(100,81), s(117,62), s(134,46)]
    d.line(tp, fill=WHITE + (sa(200),), width=max(1, int(2*scale)))
    tx, ty = s(134, 46)
    r = max(2, int(5 * scale))
    d.ellipse([tx-r, ty-r, tx+r, ty+r], fill=GOLD + (sa(255),))
    r2 = max(1, r // 2)
    d.ellipse([tx-r2, ty-r2, tx+r2, ty+r2], fill=WHITE + (sa(255),))

    # FinCoach tekst — SVG: x=100 y=192 font-size=26
    fs_big   = max(14, int(logo_h * 26 / 280))
    fs_small = max(8,  int(logo_h * 11 / 280))
    try:
        font_big   = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", fs_big)
        font_small = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", fs_small)
    except:
        font_big = font_small = ImageFont.load_default()

    px, py = s(100, 192)
    bb = d.textbbox((0,0), "FinCoach", font=font_big)
    d.text((px - (bb[2]-bb[0])//2, py - (bb[3]-bb[1])//2),
           "FinCoach", font=font_big, fill=WHITE + (alpha,))

    # Linija — SVG: x1=52 y1=200 x2=148 y2=200
    lx1, ly = s(52, 200)
    lx2, _  = s(148, 200)
    d.line([(lx1, ly), (lx2, ly)], fill=GOLD + (sa(100),), width=1)

    # VIP oval — SVG: cx=100 cy=222 rx=37 ry=14
    ex1, ey1 = s(63, 208)
    ex2, ey2 = s(137, 236)
    d.ellipse([ex1, ey1, ex2, ey2],
              fill=GOLD + (sa(25),), outline=GOLD + (sa(230),), width=max(1, int(2*scale)))
    vx, vy = s(100, 222)
    bb2 = d.textbbox((0,0), "VIP", font=font_small)
    d.text((vx - (bb2[2]-bb2[0])//2, vy - (bb2[3]-bb2[1])//2),
           "VIP", font=font_small, fill=GOLD + (alpha,))

    return img


def make_outro_video():
    frames_dir = PROMO_DIR / "outro_frames"
    frames_dir.mkdir(exist_ok=True)

    total = FPS * DURATION
    zoom_f = FPS * 2
    hold_f = FPS * 2
    fade_f = FPS * 1

    print(f"[OUTRO] Renderiram {total} frames...")
    for i in range(total):
        if i < zoom_f:
            scale = 0.25 + 0.75 * (i / zoom_f)
            alpha = int(255 * (i / zoom_f))
        elif i < zoom_f + hold_f:
            scale, alpha = 1.0, 255
        else:
            fi = i - zoom_f - hold_f
            scale = 1.0
            alpha = int(255 * (1 - fi / fade_f))

        frame = draw_logo(scale, max(0, min(255, alpha)))
        frame.save(str(frames_dir / f"frame_{i:04d}.png"))
        print(f"  {i+1}/{total}", end="\r")
    print()

    cmd = [
        "ffmpeg", "-y", "-framerate", str(FPS),
        "-i", str(frames_dir / "frame_%04d.png"),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
        str(OUTRO_VID),
    ]
    print("[OUTRO] Kodiram video...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    shutil.rmtree(str(frames_dir))
    if result.returncode != 0:
        print("[ERROR]", result.stderr[-500:])
        raise RuntimeError("Kodiranje ni uspelo")
    print(f"[OUTRO] Shranjen: {OUTRO_VID.name}")


def append_outro():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output = PROMO_DIR / f"fincoach_FINAL_{timestamp}.mp4"
    concat_file = PROMO_DIR / "concat_final.txt"
    with open(concat_file, "w") as f:
        f.write(f"file '{INPUT_VIDEO}'\n")
        f.write(f"file '{OUTRO_VID}'\n")
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        str(output),
    ]
    print("[VIDEO] Spajam...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    concat_file.unlink(missing_ok=True)
    if result.returncode != 0:
        print("[ERROR]", result.stderr[-500:])
        raise RuntimeError("Spajanje ni uspelo")
    size = output.stat().st_size / 1024 / 1024
    print(f"\n{'='*50}\n  FINAL: {output.name} ({size:.1f} MB)\n{'='*50}")


if __name__ == "__main__":
    import sys
    if "--append" in sys.argv:
        append_outro()
    else:
        make_outro_video()
        print(f"\nOUTRO GOTOV: {OUTRO_VID}")
        print("Poglej ga, potem poženi z --append da dodam na video.")
