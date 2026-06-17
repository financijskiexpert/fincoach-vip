"""
generate_images.py — Leonardo AI image generator za FinCoach VIP promo video
"""

import os
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from pathlib import Path

try:
    import certifi
    os.environ.setdefault("SSL_CERT_FILE", certifi.where())
    os.environ.setdefault("REQUESTS_CA_BUNDLE", certifi.where())
except ImportError:
    pass

try:
    from dotenv import load_dotenv
    load_dotenv(r"E:\YT_Corporate_Channel\pipeline\.env")
except ImportError:
    pass

def make_session():
    session = requests.Session()
    retry = Retry(total=3, backoff_factor=2, status_forcelist=[500, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    return session

SESSION = make_session()

LEONARDO_API_KEY = os.environ.get("LEONARDO_API_KEY", "")
OUTPUT_DIR = Path(r"E:\fincoach-vip\public\images\generated")
OUTPUT_DIR.mkdir(exist_ok=True)

HEADERS = {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": f"Bearer {LEONARDO_API_KEY}",
}

# Slike za promo video — cinematic, realistic, emotional
PROMPTS = [
    {
        "name": "01_financial_stress",
        "prompt": "A worried man in his 40s sitting at a kitchen table late at night, looking at bills and an empty wallet, dim light, realistic, cinematic, emotional, European appearance",
        "negative": "cartoon, illustration, text, watermark",
    },
    {
        "name": "02_no_school",
        "prompt": "Empty classroom with a blackboard showing a piggy bank crossed out, symbolic, dramatic lighting, cinematic photography, concept of financial education gap",
        "negative": "cartoon, illustration, text, watermark",
    },
    {
        "name": "03_couple_argument",
        "prompt": "A couple having a tense conversation at home, frustrated expressions, financial documents on table, realistic cinematic photography, European lifestyle",
        "negative": "cartoon, text, watermark, violent",
    },
    {
        "name": "04_peace_control",
        "prompt": "A confident man in his 40s smiling while looking at his laptop showing positive financial charts, bright modern home, relaxed atmosphere, cinematic photography",
        "negative": "cartoon, illustration, text, watermark",
    },
    {
        "name": "05_family_vacation",
        "prompt": "Happy family on summer vacation by the Adriatic sea, relaxed and joyful, golden hour lighting, cinematic lifestyle photography",
        "negative": "cartoon, illustration, text, watermark",
    },
    {
        "name": "06_investing",
        "prompt": "Close up of hands using a smartphone with investment app showing growth, coffee on desk, modern minimalist home office, warm cinematic lighting",
        "negative": "cartoon, illustration, text, watermark",
    },
]


def generate_image(name: str, prompt: str, negative: str) -> Path | None:
    print(f"[LEONARDO] Generiram: {name}...")

    # Submit generation
    response = SESSION.post(
        "https://cloud.leonardo.ai/api/rest/v1/generations",
        headers=HEADERS,
        json={
            "prompt": prompt,
            "negative_prompt": negative,
            "modelId": "aa77f04e-3eec-4034-9c07-d0f619684628",  # Leonardo Kino XL
            "width": 1536,
            "height": 864,
            "num_images": 1,
            "guidance_scale": 7,
            "num_inference_steps": 30,
            "alchemy": True,
            "photoReal": True,
            "photoRealVersion": "v2",
        },
    )

    if response.status_code != 200:
        print(f"[ERROR] {name}: {response.status_code} — {response.text[:300]}")
        return None

    generation_id = response.json()["sdGenerationJob"]["generationId"]
    print(f"[LEONARDO] ID: {generation_id} — čakam na rezultat...")

    # Poll for result
    for attempt in range(30):
        time.sleep(5)
        poll = SESSION.get(
            f"https://cloud.leonardo.ai/api/rest/v1/generations/{generation_id}",
            headers=HEADERS,
        )
        data = poll.json().get("generations_by_pk", {})
        status = data.get("status", "")

        if status == "COMPLETE":
            images = data.get("generated_images", [])
            if images:
                img_url = images[0]["url"]
                img_data = requests.get(img_url).content
                out_path = OUTPUT_DIR / f"{name}.jpg"
                out_path.write_bytes(img_data)
                print(f"[OK] Shranjeno: {out_path.name}")
                return out_path
            break
        elif status == "FAILED":
            print(f"[ERROR] Generacija neuspešna: {name}")
            return None
        else:
            print(f"[...] {attempt+1}/30 — status: {status}", end="\r")

    print(f"[TIMEOUT] {name}")
    return None


def main():
    print("=" * 60)
    print("  Leonardo AI — FinCoach VIP Image Generator")
    print("=" * 60)

    generated = []
    for item in PROMPTS:
        # Preskoči če slika že obstaja
        out_path = OUTPUT_DIR / f"{item['name']}.jpg"
        if out_path.exists():
            print(f"[SKIP] Že obstaja: {out_path.name}")
            generated.append(out_path)
            continue
        path = generate_image(item["name"], item["prompt"], item["negative"])
        if path:
            generated.append(path)
        time.sleep(2)

    print()
    print("=" * 60)
    print(f"  GOTOVO: {len(generated)}/{len(PROMPTS)} slik generiranih")
    print(f"  Mapa: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
