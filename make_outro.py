"""
make_outro.py — Animiran outro z originalnim SVG logom
"""
import subprocess, shutil
from pathlib import Path
from datetime import datetime
from PIL import Image

PROMO_DIR   = Path(r"E:\fincoach-vip\promo")
LOGO_PNG    = PROMO_DIR / "logo_clean.png"
INPUT_VIDEO = PROMO_DIR / "fincoach_promo_20260615_194305.mp4"
OUTRO_VID   = PROMO_DIR / "outro_logo.mp4"

W, H   = 1920, 1080
FPS    = 25
DURATION = 5  # sekunde


def make_frames():
    logo = Image.open(LOGO_PNG).convert("RGBA")
    lw_orig, lh_orig = logo.size

    frames_dir = PROMO_DIR / "outro_frames"
    frames_dir.mkdir(exist_ok=True)

    total  = FPS * DURATION
    zoom_f = FPS * 2
    hold_f = FPS * 2
    fade_f = FPS * 1

    # Max logo višina = 600px
    max_h = 600

    print(f"[OUTRO] Renderiram {total} frames...")
    for i in range(total):
        if i < zoom_f:
            scale = 0.25 + 0.75 * (i / zoom_f)
            alpha = i / zoom_f
        elif i < zoom_f + hold_f:
            scale, alpha = 1.0, 1.0
        else:
            fi = i - zoom_f - hold_f
            scale = 1.0
            alpha = 1.0 - fi / fade_f

        alpha = max(0.0, min(1.0, alpha))

        # Resize logo
        lh = int(max_h * scale)
        lw = int(lw_orig * lh / lh_orig)
        resized = logo.resize((lw, lh), Image.LANCZOS)

        # Alpha compositing
        r, g, b, a = resized.split()
        a = a.point(lambda x: int(x * alpha))
        resized = Image.merge("RGBA", (r, g, b, a))

        # Navy background
        bg = Image.new("RGB", (W, H), (26, 39, 68))
        ox = (W - lw) // 2
        oy = (H - lh) // 2
        bg.paste(resized, (ox, oy), resized)

        bg.save(str(frames_dir / f"frame_{i:04d}.png"))
        print(f"  {i+1}/{total}", end="\r")
    print()
    return frames_dir


def encode_outro(frames_dir: Path):
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
        raise RuntimeError(result.stderr[-500:])
    print(f"[OUTRO] Shranjen: {OUTRO_VID.name}")


def append_outro():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output = PROMO_DIR / f"fincoach_FINAL_{timestamp}.mp4"
    concat = PROMO_DIR / "concat_final.txt"
    with open(concat, "w") as f:
        f.write(f"file '{INPUT_VIDEO}'\n")
        f.write(f"file '{OUTRO_VID}'\n")
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        str(output),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    concat.unlink(missing_ok=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr[-500:])
    size = output.stat().st_size / 1024 / 1024
    print(f"\n{'='*50}\n  FINAL: {output.name} ({size:.1f} MB)\n{'='*50}")


if __name__ == "__main__":
    import sys
    frames_dir = make_frames()
    encode_outro(frames_dir)
    print(f"\nPoglej outro_logo.mp4 — če je ok, poženi z --append")
    if "--append" in sys.argv:
        append_outro()
