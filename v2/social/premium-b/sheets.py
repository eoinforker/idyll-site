# Contact sheets for the premium B set: grid.png (the 12 posts as a profile grid, newest first, 3:4 tiles as Instagram
# shows them), stories.png, and videos.png (three frames from each story cut). python3 sheets.py <out dir>
import sys, os, glob, subprocess
from PIL import Image, ImageDraw, ImageFont
D = sys.argv[1]
BG = (255, 255, 255)
def first_slides():
    fs = sorted(glob.glob(os.path.join(D, 'posts', '*.png')))
    seen = {}
    for f in fs:
        n = os.path.basename(f)[:2]
        seen.setdefault(n, f)
    return [seen[k] for k in sorted(seen)]
# grid: newest (12) top left
posts = first_slides()[::-1]
tw, gap = 360, 4
th = tw * 4 // 3
g = Image.new('RGB', (3 * tw + 2 * gap, 4 * th + 3 * gap), BG)
for k, f in enumerate(posts):
    im = Image.open(f).convert('RGB')
    cw = int(im.size[1] * 3 / 4); x0 = (im.size[0] - cw) // 2
    im = im.crop((x0, 0, x0 + cw, im.size[1])).resize((tw, th), Image.LANCZOS)
    g.paste(im, ((k % 3) * (tw + gap), (k // 3) * (th + gap)))
g.save(os.path.join(D, 'grid.png'))
# stories
fs = sorted(glob.glob(os.path.join(D, 'stories', '*.png')))
w, h, gp = 300, 534, 14
s = Image.new('RGB', (6 * w + 7 * gp, 2 * h + 3 * gp), (232, 229, 222))
for k, f in enumerate(fs): s.paste(Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS), (gp + (k % 6) * (w + gp), gp + (k // 6) * (h + gp)))
s.save(os.path.join(D, 'stories.png'))
# videos: frames at 0.5, 3, 6 and 9.5 s of each story cut
vs = sorted(glob.glob(os.path.join(D, 'videos', '*-story.mp4')))
times = [0.5, 3.0, 6.0, 9.5]
w, h = 240, 427
v = Image.new('RGB', (len(times) * (w + gp) + gp + 150, len(vs) * (h + gp) + gp), (232, 229, 222))
dr = ImageDraw.Draw(v)
tmp = os.path.join(D, '.frame.png')
for r, f in enumerate(vs):
    dr.text((gp, gp + r * (h + gp) + 10), os.path.basename(f).replace('-story.mp4', ''), fill=(20, 20, 22))
    for c, tt in enumerate(times):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(tt), '-i', f, '-frames:v', '1', tmp], check=True)
        v.paste(Image.open(tmp).convert('RGB').resize((w, h), Image.LANCZOS), (150 + gp + c * (w + gp), gp + r * (h + gp)))
os.remove(tmp)
v.save(os.path.join(D, 'videos.png'))
print('ok')
