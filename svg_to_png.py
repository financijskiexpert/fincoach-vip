from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM
from pathlib import Path

svg_path = Path(r"E:\fincoach-vip\public\logo\fincoach-logo-vertical.svg")
out_path = Path(r"E:\fincoach-vip\promo\logo_clean.png")

rlg = svg2rlg(str(svg_path))
print(f"SVG size: {rlg.width} x {rlg.height}")

scale = 800 / rlg.height
renderPM.drawToFile(rlg, str(out_path), fmt="PNG", dpi=int(72 * scale))

size_kb = out_path.stat().st_size / 1024
print(f"Logo PNG shranjen: {out_path.name} ({size_kb:.0f} KB)")
