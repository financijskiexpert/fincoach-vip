"""
promo_video.py — FinCoach VIP Promo Video Generator
Generira prodajni video iz slika + ElevenLabs glas + ffmpeg montaža.
Output: E:\fincoach-vip\promo\fincoach_promo_<timestamp>.mp4
"""

import os
import re
import sys
import json
import requests
import subprocess
import shutil
from pathlib import Path
from datetime import datetime

try:
    import certifi
    os.environ.setdefault("SSL_CERT_FILE", certifi.where())
    os.environ.setdefault("REQUESTS_CA_BUNDLE", certifi.where())
except ImportError:
    pass

# ── CONFIG ────────────────────────────────────────────────────────────────────
BASE_DIR       = Path(__file__).parent
IMAGES_DIR     = BASE_DIR / "public" / "images"
OUTPUT_DIR     = BASE_DIR / "promo"
OUTPUT_DIR.mkdir(exist_ok=True)

ELEVENLABS_API_KEY = "sk_9aad93deb96c3d70e6b788513dc9bc9a59e5ad3fb309dd35"
VOICE_ID           = "UHqZihCaTRvL7TIfJCrQ"   # Brane Recek — osobni glas
MODEL_ID           = "eleven_multilingual_v2"

VOICE_SETTINGS = {
    "stability":         0.25,   # nižje = bolj naravno, manj robotsko
    "similarity_boost":  0.90,
    "style":             0.35,   # nižje = manj dramatično, bolj human
    "use_speaker_boost": True,
}

# Redoslijed slika u videu (prilagodi po potrebi)
IMAGE_ORDER = [
    # Uvod — stres, kriza
    "generated/01_financial_stress.jpg",
    "brane-portrait.jpg",
    # Šola te ni naučila
    "generated/02_no_school.jpg",
    "NIVE9326.jpg",
    # Mentalni šum, konflikti
    "generated/03_couple_argument.jpg",
    "NIVE8337 (1).jpg",
    # FinCoach VIP — program
    "brane-predava.jpg",
    "NIVE5490.jpg",
    "NIVE9289 (1).jpg",
    # Transformacija
    "generated/04_peace_control.jpg",
    "brane-smiljan.jpg",
    # Rezultati
    "generated/05_family_vacation.jpg",
    "NIVE5374.jpg",
    "NIVE2713.jpg",
    "20201128_084551.jpg",
    # Investiranje
    "generated/06_investing.jpg",
    "Screenshot_20220918_204352.jpg",
    # CTA
    "brane-robin-sharma.jpg",
    "brane-portrait.jpg",
]

# ── SCRIPT ────────────────────────────────────────────────────────────────────
PROMO_SCRIPT = """
Zapitaj se jedno.

Ako bi ti sutra — bez upozorenja — auto otkazao, klima se pokvarila, ili dijete završilo u bolnici...

Imaš li novac za to?

Ili bi morao zvati banku. Tražiti od rodbine. Stavljati na karticu.

Ako si se upravo stegnuo u stomaku — ova poruka je za tebe.

Nije problem u tome što ne zarađuješ.

Problem je u tome što te nitko nikad nije naučio što s tim novcem napraviti.

Ni škola. Ni fakultet. Ni roditelji — jer ni njima nitko nije rekao.

I tako idemo iz godine u godinu. Zarađujemo, trošimo, preživljavamo.

A u glavi — stalni šum. Jesam li dovoljno odvojen? Što ako izgubim posao? Kako ću djeci priuštiti ono što zaslužuju?

Taj šum — ubija koncentraciju. Kvari odnose. Krade ti prisutnost.

FinCoach VIP program je osmišljen točno za tu osobu.

Onu koja zarađuje — ali ne napreduje.

Koja želi promijeniti — ali ne zna odakle početi.

Devedeset dana. Devedeset lekcija. Sustav koji funkcionira za stvaran život.

Naučit ćeš kako kontrolirati novac — a ne da on kontrolira tebe.

Izgradit ćeš jastučić sigurnosti koji ti daje mir.

Počet ćeš investirati — čak i s malim iznosima.

I otplatit ćeš dugove brže nego što misliš da je moguće.

Ali promjena nije samo na računu.

Naši polaznici govore da su postali smireniji roditelji.

Da su se prestali svađati s partnerom oko novca.

Da su konačno rekli da godišnjem odmoru — bez grižnje savjesti.

Da se ujutro bude s osjećajem kontrole — a ne straha.

Ovo nije još jedan tečaj.

Ovo je sustav koji će promijeniti kako gledaš na novac — zauvijek.

Bez žargona. Bez složene matematike. Korak po korak, u svom tempu.

I ako za trideset dana ne osjetiš razliku — vraćamo ti svaki cent. Bez pitanja.

Jedino pitanje je — koliko dugo ćeš još čekati?

Posjetite fincoach.vip

I napravite prvi korak prema životu bez financijskog stresa.
"""

# ── FUNCTIONS ─────────────────────────────────────────────────────────────────

def generate_voiceover(script: str) -> Path:
    output_path = OUTPUT_DIR / f"voiceover_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp3"

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
    }
    payload = {
        "text": script.strip(),
        "model_id": MODEL_ID,
        "voice_settings": VOICE_SETTINGS,
    }

    print(f"[TTS] Slanje na ElevenLabs ({len(script.strip()):,} znakova)...")
    response = requests.post(url, headers=headers, json=payload, timeout=180)

    if response.status_code != 200:
        raise RuntimeError(f"ElevenLabs greška {response.status_code}: {response.text}")

    with open(output_path, "wb") as f:
        f.write(response.content)

    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"[TTS] Voiceover spreman: {output_path.name} ({size_mb:.2f} MB)")
    return output_path


def get_audio_duration(audio_path: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json",
         "-show_format", str(audio_path)],
        capture_output=True, text=True
    )
    info = json.loads(result.stdout)
    return float(info["format"]["duration"])


def build_video(images: list, audio_path: Path, output_path: Path):
    total_duration = get_audio_duration(audio_path)
    img_duration = total_duration / len(images)

    print(f"[VIDEO] Trajanje audio: {total_duration:.1f}s")
    print(f"[VIDEO] {len(images)} slika x {img_duration:.1f}s svaka")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    final_path = OUTPUT_DIR / f"fincoach_promo_{timestamp}.mp4"

    # Step 1: Convert each image to a video clip
    clips = []
    print("[VIDEO] Konvertiram slike u klipove...")
    for i, img in enumerate(images):
        clip_path = OUTPUT_DIR / f"clip_{i:03d}.mp4"
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", img,
            "-t", str(img_duration),
            "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-r", "25",
            str(clip_path),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"[WARN] Clip {i} greška: {result.stderr[-500:]}")
            continue
        clips.append(clip_path)
        print(f"[VIDEO] Klip {i+1}/{len(images)} gotov", end="\r")

    print()

    if not clips:
        raise RuntimeError("Nema klipova za montažu!")

    # Step 2: Concat all clips
    concat_file = OUTPUT_DIR / "concat.txt"
    with open(concat_file, "w", encoding="utf-8") as f:
        for clip in clips:
            f.write(f"file '{clip}'\n")

    print("[VIDEO] Spajam klipove i dodajem audio...")
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-i", str(audio_path),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-map", "0:v:0", "-map", "1:a:0",
        "-shortest",
        str(final_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print("[VIDEO] ffmpeg greška:")
        print(result.stderr[-3000:])
        raise RuntimeError("ffmpeg montaža nije uspjela.")

    # Cleanup clips
    for clip in clips:
        clip.unlink(missing_ok=True)
    concat_file.unlink(missing_ok=True)

    size_mb = final_path.stat().st_size / (1024 * 1024)
    print(f"[VIDEO] Video spreman: {final_path.name} ({size_mb:.1f} MB)")
    return final_path


def main():
    voiceover_only = "--voiceover-only" in sys.argv

    print("=" * 60)
    print("  FinCoach VIP — Promo Video Generator")
    if voiceover_only:
        print("  NAČIN: Samo voiceover")
    print("=" * 60)

    # Generate voiceover
    voiceover_path = generate_voiceover(PROMO_SCRIPT)

    if voiceover_only:
        print()
        print("=" * 60)
        print(f"  VOICEOVER GOTOV: {voiceover_path}")
        print("=" * 60)
        return

    # Collect images
    images = []
    for name in IMAGE_ORDER:
        p = IMAGES_DIR / name
        if p.exists():
            images.append(str(p))
        else:
            print(f"[WARN] Slika nije pronađena: {name} — preskačem")

    if not images:
        print("[ERROR] Nema slika! Provjeri IMAGES_DIR.")
        sys.exit(1)

    print(f"[INFO] Pronađeno {len(images)} slika.")

    # Build video
    output_path = OUTPUT_DIR / "fincoach_promo.mp4"
    final = build_video(images, voiceover_path, output_path)

    print()
    print("=" * 60)
    print(f"  GOTOVO! Video: {final}")
    print("=" * 60)


if __name__ == "__main__":
    main()
