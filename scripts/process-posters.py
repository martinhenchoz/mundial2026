#!/usr/bin/env python3
"""Download the 17 FIFA World Cup 2026 official posters and remove their white backgrounds."""

import urllib.request
import os
import sys

OUTDIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'posters')
os.makedirs(OUTDIR, exist_ok=True)

POSTERS = [
    ('poster-01', 'https://store.fifa.com/cdn/shop/files/image_217bb8c0-803c-4772-9c18-18f1e677f831.jpg'),
    ('poster-02', 'https://store.fifa.com/cdn/shop/files/image_431ba3fa-9179-4ef1-8a62-5825c8bb8bd1.jpg'),
    ('poster-03', 'https://store.fifa.com/cdn/shop/files/image_e39dbc54-ed49-45af-83e1-93d773047629.png'),
    ('poster-04', 'https://store.fifa.com/cdn/shop/files/image_df89b42e-0d60-42b0-9074-f3aa4bb70262.jpg'),
    ('poster-05', 'https://store.fifa.com/cdn/shop/files/image_ea08d4b1-01af-42ac-aab8-a4d5d5231042.jpg'),
    ('poster-06', 'https://store.fifa.com/cdn/shop/files/image_4c517ce7-8c9c-491f-a47a-1bbc1ff84431.jpg'),
    ('poster-07', 'https://store.fifa.com/cdn/shop/files/image_e6303a66-448b-4986-8318-b2f451afa5be.jpg'),
    ('poster-08', 'https://store.fifa.com/cdn/shop/files/image_322a0986-b0dc-491c-ad97-df38f1943450.jpg'),
    ('poster-09', 'https://store.fifa.com/cdn/shop/files/image_3cdc5f24-22f6-4265-98c8-83c8b161c21d.jpg'),
    ('poster-10', 'https://store.fifa.com/cdn/shop/files/image_a97537e7-31a8-41b7-b804-035ba383a725.png'),
    ('poster-11', 'https://store.fifa.com/cdn/shop/files/image_2a091bf1-9d12-4ed4-b707-388f6362ce57.jpg'),
    ('poster-12', 'https://store.fifa.com/cdn/shop/files/image_671e20df-3728-4f00-ba36-eef941bc4ca7.jpg'),
    ('poster-13', 'https://store.fifa.com/cdn/shop/files/image_79ac96d8-933c-49f8-95bf-e5d76557fb8c.jpg'),
    ('poster-14', 'https://store.fifa.com/cdn/shop/files/image_00b95848-e678-4b71-9854-62b37e9fa82a.jpg'),
    ('poster-15', 'https://store.fifa.com/cdn/shop/files/image_9a859a84-9a83-44e5-b6a4-75278a672612.jpg'),
    ('poster-16', 'https://store.fifa.com/cdn/shop/files/image_78b89cd8-8a4d-4f0f-80b9-910838335e72.jpg'),
    ('poster-17', 'https://store.fifa.com/cdn/shop/files/image_c1e17b7c-9241-476b-859d-a6eaafd2f5f1.jpg'),
]

try:
    from rembg import remove
    USE_REMBG = True
    print('Using rembg for AI background removal')
except ImportError:
    USE_REMBG = False
    print('rembg not available, using threshold method')

if not USE_REMBG:
    from PIL import Image
    import io

    def remove_white(data):
        img = Image.open(io.BytesIO(data)).convert('RGBA')
        pixels = img.load()
        w, h = img.size
        threshold = 240
        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                if r >= threshold and g >= threshold and b >= threshold:
                    pixels[x, y] = (r, g, b, 0)
        buf = io.BytesIO()
        img.save(buf, 'PNG')
        return buf.getvalue()

headers = {'User-Agent': 'Mozilla/5.0'}

total = len(POSTERS)
for i, (name, url) in enumerate(POSTERS, 1):
    out_path = os.path.join(OUTDIR, f'{name}.png')
    if os.path.exists(out_path):
        print(f'[{i}/{total}] {name} already exists, skipping')
        continue

    print(f'[{i}/{total}] Downloading {name}...', end=' ', flush=True)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        print(f'{len(data)//1024}KB', end=' → ', flush=True)
    except Exception as e:
        print(f'ERROR downloading: {e}')
        continue

    print('removing background...', end=' ', flush=True)
    try:
        result = remove(data) if USE_REMBG else remove_white(data)
        with open(out_path, 'wb') as f:
            f.write(result)
        print(f'saved ({len(result)//1024}KB)')
    except Exception as e:
        print(f'ERROR processing: {e}')

print('\nDone! Check public/posters/')
