"""
render_logo.py — Renderira SVG logo s Playwright (pravi browser render)
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

SVG_PATH = Path(r"E:\fincoach-vip\public\logo\fincoach-logo-vertical.svg")
OUT_PATH = Path(r"E:\fincoach-vip\promo\logo_clean.png")

HTML = f"""<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; }}
  body {{
    width: 400px;
    height: 560px;
    background: transparent;
  }}
  img {{ width: 400px; height: auto; }}
</style>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
</head>
<body>
  <img src="{SVG_PATH.as_uri()}">
</body>
</html>"""

html_file = Path(r"E:\fincoach-vip\promo\logo_render.html")
html_file.write_text(HTML, encoding="utf-8")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 400, "height": 560})
    page.goto(html_file.as_uri())
    page.wait_for_timeout(2000)
    page.screenshot(path=str(OUT_PATH), omit_background=True)
    browser.close()

html_file.unlink()
size = OUT_PATH.stat().st_size / 1024
print(f"Logo PNG shranjen: {OUT_PATH.name} ({size:.0f} KB)")
