"""
make_video.py — FinCoach VIP Promo Video
Audio: promo/Fincoach.m4a (Branov glas)
Slike: public/images/ + public/images/generated/
Logo outro: public/logo/fincoach-logo-vertical.svg
Output: promo/fincoach_promo_final.mp4
"""

import json
import subprocess
import sys
import os
import time
from pathlib import Path
from datetime import datetime

try:
    import certifi
    os.environ.setdefault("SSL_CERT_FILE", certifi.where())
except ImportError:
    pass

BASE_DIR   = Path(__file__).parent
IMAGES_DIR = BASE_DIR / "public" / "images"
LOGO_DIR   = BASE_DIR / "public" / "logo"
PROMO_DIR  = BASE_DIR / "promo"
PROMO_DIR.mkdir(exist_ok=True)

AUDIO_FILE = PROMO_DIR / "Fincoach.m4a"

# Razpored slik glede na vsebino skripte
IMAGE_ORDER = [
    "generated/01_financial_stress.jpg",
    "brane-portrait.jpg",
    "generated/02_no_school.jpg",
    "NIVE9326.jpg",
    "generated/03_couple_argument.jpg",
    "NIVE8337 (1).jpg",
    "brane-predava.jpg",
    "NIVE5490.jpg",
    "NIVE9289 (1).jpg",
    "generated/04_peace_control.jpg",
    "brane-smiljan.jpg",
    "generated/05_family_vacation.jpg",
    "NIVE5374.jpg",
    "NIVE2713.jpg",
    "20201128_084551.jpg",
    "generated/06_investing.jpg",
    "Screenshot_20220918_204352.jpg",
    "brane-robin-sharma.jpg",
    "brane-portrait.jpg",
]

OUTRO_DURATION = 4  # sekunde za logo outro


def get_duration(path: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", str(path)],
        capture_output=True, text=True
    )
    return float(json.loads(result.stdout)["format"]["duration"])


def generate_subtitles(audio_path: Path) -> Path:
    srt_path = PROMO_DIR / "subtitles.srt"
    if srt_path.exists():
        print("[WHISPER] Podnapisi že obstajajo, preskačem.")
        return srt_path

    print("[WHISPER] Generiram podnapise...")
    try:
        import whisper
        model = whisper.load_model("base")
        result = model.transcribe(str(audio_path), language="hr", word_timestamps=False)

        with open(srt_path, "w", encoding="utf-8") as f:
            for i, seg in enumerate(result["segments"], 1):
                start = format_time(seg["start"])
                end   = format_time(seg["end"])
                text  = seg["text"].strip()
                f.write(f"{i}\n{start} --> {end}\n{text}\n\n")

        print(f"[WHISPER] Podnapisi shranjeni: {srt_path.name}")
        return srt_path
    except Exception as e:
        print(f"[WARN] Whisper napaka: {e} — nadaljujem brez podnapisov")
        return None


def format_time(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def convert_logo_to_png(svg_path: Path) -> Path:
    png_path = PROMO_DIR / "logo_outro.png"
    if png_path.exists():
        return png_path
    # Poskusi z Inkscape ali cairosvg
    try:
        import cairosvg
        cairosvg.svg2png(url=str(svg_path), write_to=str(png_path), output_width=1920, output_height=1080)
        print(f"[LOGO] Konvertiran: {png_path.name}")
        return png_path
    except ImportError:
        pass

    # Fallback: ffmpeg SVG render
    result = subprocess.run(
        ["ffmpeg", "-y", "-i", str(svg_path), str(png_path)],
        capture_output=True, text=True
    )
    if png_path.exists():
        return png_path

    print("[WARN] Logo konverzija ni uspela — outro brez loga")
    return None


def build_image_clips(images: list, duration_each: float) -> list:
    clips = []
    print(f"[VIDEO] Generiram {len(images)} image klipov ({duration_each:.1f}s vsak)...")
    for i, img_path in enumerate(images):
        clip = PROMO_DIR / f"clip_{i:03d}.mp4"
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", img_path,
            "-t", str(duration_each),
            "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-r", "25",
            str(clip),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            clips.append(clip)
            print(f"  [{i+1}/{len(images)}] ok", end="\r")
        else:
            print(f"  [{i+1}/{len(images)}] NAPAKA: {img_path}")
    print()
    return clips


def build_logo_outro(logo_png: Path) -> Path:
    outro = PROMO_DIR / "clip_outro.mp4"
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"color=c=0x1a2744:size=1920x1080:duration={OUTRO_DURATION}:rate=25",
        "-i", str(logo_png),
        "-filter_complex",
        "[0:v][1:v]overlay=(W-w)/2:(H-h)/2:format=auto,format=yuv420p",
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        str(outro),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        return outro
    print(f"[WARN] Outro napaka — nadaljujem brez loga")
    return None


def concat_clips(clips: list) -> Path:
    concat_file = PROMO_DIR / "concat.txt"
    with open(concat_file, "w", encoding="utf-8") as f:
        for clip in clips:
            f.write(f"file '{clip}'\n")

    silent_video = PROMO_DIR / "video_silent.mp4"
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        str(silent_video),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("[ERROR] Concat napaka:")
        print(result.stderr[-2000:])
        raise RuntimeError("Concat ni uspel")
    concat_file.unlink(missing_ok=True)
    return silent_video


def add_audio_and_subtitles(video: Path, audio: Path, srt: Path) -> Path:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output = PROMO_DIR / f"fincoach_promo_{timestamp}.mp4"

    if srt and srt.exists():
        srt_escaped = str(srt).replace("\\", "/").replace(":", "\\:")
        vf = f"subtitles='{srt_escaped}':force_style='FontName=Arial,FontSize=20,PrimaryColour=&Hffffff,OutlineColour=&H000000,Outline=2,Bold=1,Alignment=2,MarginV=40'"
        cmd = [
            "ffmpeg", "-y",
            "-i", str(video),
            "-i", str(audio),
            "-vf", vf,
            "-c:v", "libx264", "-preset", "fast", "-crf", "20",
            "-c:a", "aac", "-b:a", "192k",
            "-map", "0:v:0", "-map", "1:a:0",
            "-shortest",
            str(output),
        ]
    else:
        cmd = [
            "ffmpeg", "-y",
            "-i", str(video),
            "-i", str(audio),
            "-c:v", "libx264", "-preset", "fast", "-crf", "20",
            "-c:a", "aac", "-b:a", "192k",
            "-map", "0:v:0", "-map", "1:a:0",
            "-shortest",
            str(output),
        ]

    print("[VIDEO] Dodajam audio" + (" in podnapise..." if srt and srt.exists() else "..."))
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("[ERROR] ffmpeg napaka:")
        print(result.stderr[-2000:])
        raise RuntimeError("Finalni render ni uspel")

    return output


def cleanup(clips: list):
    for c in clips:
        Path(c).unlink(missing_ok=True)
    (PROMO_DIR / "video_silent.mp4").unlink(missing_ok=True)


def main():
    print("=" * 60)
    print("  FinCoach VIP — Video Montaža")
    print("=" * 60)

    if not AUDIO_FILE.exists():
        print(f"[ERROR] Audio ni najden: {AUDIO_FILE}")
        sys.exit(1)

    # Trajanje audio
    total_duration = get_duration(AUDIO_FILE)
    print(f"[INFO] Audio trajanje: {total_duration:.1f}s")

    # Zberi slike
    images = []
    for name in IMAGE_ORDER:
        p = IMAGES_DIR / name
        if p.exists():
            images.append(str(p))
        else:
            print(f"[WARN] Slika ni najdena: {name}")

    print(f"[INFO] Slik za video: {len(images)}")

    # Trajanje vsake slike (brez outra)
    img_duration = total_duration / len(images)

    # Podnapisi
    srt_path = None  # brez podnapisov

    # Logo outro
    logo_svg = LOGO_DIR / "fincoach-logo-vertical.svg"
    logo_png = None
    if logo_svg.exists():
        logo_png = convert_logo_to_png(logo_svg)

    # Generiraj image klipe
    clips = build_image_clips(images, img_duration)

    # Outro klip
    if logo_png and logo_png.exists():
        outro = build_logo_outro(logo_png)
        if outro:
            clips.append(outro)
            print(f"[LOGO] Outro dodan ({OUTRO_DURATION}s)")

    if not clips:
        print("[ERROR] Ni klipov za montažo!")
        sys.exit(1)

    # Spoji klipe
    print("[VIDEO] Spajam vse klipe...")
    silent_video = concat_clips(clips)

    # Dodaj audio + podnapise
    final = add_audio_and_subtitles(silent_video, AUDIO_FILE, srt_path)

    print(f"[INFO] Klipov ohranjenih: {len(clips)} (v promo/ mapi)")

    size_mb = final.stat().st_size / (1024 * 1024)
    print()
    print("=" * 60)
    print(f"  GOTOVO!")
    print(f"  Video: {final.name}")
    print(f"  Velikost: {size_mb:.1f} MB")
    print(f"  Trajanje: {total_duration:.0f}s")
    print("=" * 60)


if __name__ == "__main__":
    main()
