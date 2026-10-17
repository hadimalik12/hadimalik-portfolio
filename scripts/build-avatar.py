"""Draw the portfolio avatar as native 32x32 pixel art and export site icons."""
from io import BytesIO
from pathlib import Path
from struct import pack

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]

# Deliberately small palette, snapped to 16-bit RGB565 channels.
def rgb565(red: int, green: int, blue: int) -> tuple[int, int, int, int]:
    return (
        round(round(red * 31 / 255) * 255 / 31),
        round(round(green * 63 / 255) * 255 / 63),
        round(round(blue * 31 / 255) * 255 / 31),
        255,
    )

P = {
    "outline": rgb565(11, 10, 16),
    "hair": rgb565(24, 21, 28),
    "hair_mid": rgb565(43, 39, 48),
    "hair_light": rgb565(63, 57, 67),
    "skin_dark": rgb565(98, 48, 34),
    "skin_shadow": rgb565(157, 79, 51),
    "skin": rgb565(207, 121, 77),
    "skin_light": rgb565(238, 158, 103),
    "skin_highlight": rgb565(247, 179, 121),
    "ear_inner": rgb565(132, 63, 45),
    "beard": rgb565(31, 25, 30),
    "beard_mid": rgb565(51, 41, 44),
    "white": rgb565(247, 231, 214),
    "iris": rgb565(66, 37, 31),
    "pupil": rgb565(19, 14, 18),
    "lip": rgb565(126, 55, 48),
    "shirt": rgb565(31, 35, 47),
}

sprite = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
d = ImageDraw.Draw(sprite)

def poly(points, color):
    d.polygon(points, fill=P[color])

def rect(box, color):
    d.rectangle(box, fill=P[color])

# A small shirt/neck anchor keeps the portrait grounded in the round site avatar.
poly([(7, 31), (9, 29), (12, 28), (20, 28), (23, 29), (25, 31)], "outline")
poly([(8, 31), (11, 29), (21, 29), (24, 31)], "shirt")

# Hair silhouette, ears, and face. Each contour is hand placed on the grid.
poly([(5, 13), (5, 8), (7, 5), (10, 4), (11, 2), (15, 3),
      (17, 2), (21, 3), (24, 4), (27, 7), (27, 14), (25, 17),
      (7, 17)], "outline")
poly([(6, 13), (6, 8), (9, 5), (12, 4), (15, 5), (18, 3),
      (21, 4), (24, 6), (26, 8), (26, 14), (23, 16), (8, 16)], "hair")
poly([(3, 16), (5, 14), (7, 16), (7, 21), (5, 22), (3, 19)], "outline")
poly([(4, 16), (6, 15), (6, 20), (4, 20)], "skin")
rect((4, 17, 4, 19), "ear_inner")
poly([(25, 16), (27, 14), (29, 16), (29, 19), (27, 22), (25, 21)], "outline")
poly([(26, 15), (28, 16), (28, 20), (26, 20)], "skin")
rect((27, 17, 27, 19), "ear_inner")

poly([(9, 9), (22, 9), (25, 12), (26, 17), (25, 22), (23, 26),
      (20, 29), (12, 29), (9, 26), (6, 22), (6, 16), (7, 12)], "skin_dark")
poly([(9, 10), (22, 10), (24, 12), (25, 18), (24, 22), (22, 26),
      (19, 28), (13, 28), (10, 26), (7, 22), (7, 15)], "skin")
poly([(10, 10), (22, 10), (24, 13), (24, 19), (22, 23), (19, 25),
      (12, 25), (9, 22), (8, 18), (8, 14)], "skin_light")
poly([(13, 11), (21, 11), (23, 13), (23, 17), (20, 15), (13, 15)], "skin_highlight")
poly([(8, 19), (11, 22), (11, 24), (9, 22)], "skin_shadow")
poly([(24, 19), (21, 22), (21, 24), (23, 22)], "skin_shadow")

# Short, naturally swept hair with a few broad locks, no long spikes.
poly([(6, 13), (7, 9), (10, 7), (12, 5), (15, 6), (18, 4),
      (21, 5), (25, 8), (25, 12), (22, 11), (19, 9), (17, 11),
      (13, 10), (10, 12), (8, 13)], "hair")
poly([(8, 8), (10, 6), (13, 5), (15, 6), (12, 8), (10, 9)], "hair_mid")
poly([(18, 5), (20, 4), (23, 6), (24, 8), (22, 7), (20, 6)], "hair_mid")
rect((11, 5, 12, 5), "hair_light")
rect((20, 5, 21, 5), "hair_light")
poly([(8, 11), (10, 10), (12, 9), (11, 12), (8, 14)], "hair")
poly([(21, 9), (24, 11), (25, 14), (22, 12)], "hair")

# Level brows and slightly enlarged but relaxed eyes.
rect((9, 14, 13, 14), "hair")
rect((19, 14, 23, 14), "hair")
rect((10, 15, 13, 15), "skin_shadow")
rect((19, 15, 22, 15), "skin_shadow")
rect((9, 16, 13, 17), "white")
rect((19, 16, 23, 17), "white")
rect((11, 16, 12, 17), "iris")
rect((20, 16, 21, 17), "iris")
rect((11, 16, 11, 17), "pupil")
rect((20, 16, 20, 17), "pupil")
rect((10, 18, 13, 18), "skin_shadow")
rect((19, 18, 22, 18), "skin_shadow")

# Nose stays simple enough to read at 16px.
rect((15, 18, 16, 20), "skin")
rect((16, 19, 17, 20), "skin_highlight")
rect((14, 21, 15, 21), "skin_shadow")
rect((17, 21, 18, 21), "skin_shadow")

# Beard wraps the cheeks and jaw, leaving a warm skin opening for the mouth.
poly([(7, 20), (9, 22), (10, 23), (12, 24), (20, 24), (22, 23),
      (23, 21), (25, 20), (25, 24), (23, 27), (20, 29), (18, 30),
      (14, 30), (11, 29), (9, 27), (7, 24)], "outline")
poly([(8, 21), (10, 23), (12, 25), (20, 25), (22, 23), (24, 21),
      (24, 24), (22, 27), (19, 29), (13, 29), (10, 27), (8, 24)], "beard")
poly([(11, 23), (13, 22), (19, 22), (21, 23), (21, 26),
      (19, 27), (13, 27), (11, 26)], "skin_shadow")
poly([(12, 23), (20, 23), (20, 26), (18, 27), (14, 27), (12, 26)], "skin")
rect((10, 24, 11, 26), "beard_mid")
rect((21, 24, 22, 26), "beard_mid")
rect((14, 28, 18, 28), "beard_mid")

# Trimmed mustache and a quiet closed-mouth smile.
poly([(11, 23), (13, 22), (15, 23), (16, 22), (17, 23),
      (19, 22), (21, 23), (20, 24), (17, 24), (15, 24), (12, 24)], "beard")
rect((13, 25, 19, 25), "lip")
rect((14, 26, 18, 26), "skin_dark")
rect((15, 27, 17, 27), "skin_light")

# Publish a tiny native sprite and crisp integer-scaled site artwork.
assets = ROOT / "public"
assets.mkdir(exist_ok=True)
sprite.save(assets / "avatar-sprite.png")
sprite.resize((480, 480), Image.Resampling.NEAREST).save(assets / "avatar.png")
sprite.resize((192, 192), Image.Resampling.NEAREST).save(assets / "apple-touch-icon.png")

# ICO with hand-sized PNG frames (including a dedicated pixel-perfect 16px frame).
frames = [
    (16, sprite.resize((16, 16), Image.Resampling.NEAREST)),
    (32, sprite),
    (64, sprite.resize((64, 64), Image.Resampling.NEAREST)),
]
chunks = []
for size, frame in frames:
    data = BytesIO()
    frame.save(data, format="PNG")
    chunks.append((size, data.getvalue()))
header_size = 6 + 16 * len(chunks)
offset = header_size
entries = []
for size, data in chunks:
    entries.append(pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(data), offset))
    offset += len(data)
(ROOT / "app" / "favicon.ico").write_bytes(
    pack("<HHH", 0, 1, len(chunks)) + b"".join(entries) + b"".join(data for _, data in chunks)
)
