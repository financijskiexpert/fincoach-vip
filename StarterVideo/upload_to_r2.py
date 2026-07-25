"""
Naloži Starter video na Cloudflare R2.
Credentials prebere iz E:\fincoach-vip\.env.local (CLOUDFLARE_R2_* spremenljivke).
Uporaba: python upload_to_r2.py <video_num>
Primer:  python upload_to_r2.py 1
"""
import sys
import re
import boto3
from pathlib import Path

ENV_FILE = Path(__file__).parent.parent / ".env.local"

def load_env(path: Path) -> dict:
    env = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        m = re.match(r'^([A-Z0-9_]+)=(.+)$', line.strip())
        if m:
            env[m.group(1)] = m.group(2).strip('"').strip("'")
    return env

def upload(video_num: int):
    env = load_env(ENV_FILE)
    r2 = boto3.client(
        "s3",
        endpoint_url=env["CLOUDFLARE_R2_ENDPOINT"],
        aws_access_key_id=env["CLOUDFLARE_R2_ACCESS_KEY"],
        aws_secret_access_key=env["CLOUDFLARE_R2_SECRET_KEY"],
        region_name="auto",
    )

    video_file = Path(__file__).parent / f"{video_num}.video" / f"video{video_num}_final.mp4"
    r2_key = f"starter/video{video_num}.mp4"

    if not video_file.exists():
        print(f"Napaka: datoteka ne obstaja: {video_file}")
        sys.exit(1)

    size_mb = video_file.stat().st_size / 1024 / 1024
    print(f"Nalagam: {video_file.name} ({size_mb:.1f} MB)")
    print(f"Cilj:    {env['CLOUDFLARE_R2_BUCKET']}/{r2_key}")

    r2.upload_file(
        str(video_file),
        env["CLOUDFLARE_R2_BUCKET"],
        r2_key,
        ExtraArgs={"ContentType": "video/mp4"},
        Callback=Progress(video_file.stat().st_size),
    )
    print(f"\nUspješno! R2 key: {r2_key}")

class Progress:
    def __init__(self, total):
        self.total = total
        self.done = 0
    def __call__(self, n):
        self.done += n
        pct = self.done / self.total * 100
        print(f"\r  {pct:.1f}%  ({self.done/1024/1024:.1f} / {self.total/1024/1024:.1f} MB)", end="", flush=True)

if __name__ == "__main__":
    num = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    upload(num)
