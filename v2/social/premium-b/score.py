# Music and sound for the six premium B videos, synthesised from scratch as in ../tools/score.py:
# a felt piano, a small wooden mallet, a soft bass, a soft kick and shaker, and quiet UI sounds (taps, slides, keys)
# placed from cues.json so they land on the frames that show them. 12 s, 120 bpm, a bar every 2 s.
#   python3 score.py <shorts|words|focus|sleep|stays|free> out.wav
import sys, wave, json, os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
piece, out = sys.argv[1], sys.argv[2]
DUR = 12.0
N = int(SR * DUR)
t = np.arange(N) / SR
bus = {k: np.zeros(N) for k in ('piano', 'pluck', 'bass', 'drums', 'ui')}
rnd = np.random.default_rng(11)
cues = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cues.json')))[piece]

def midi(n): return 440 * 2 ** ((n - 69) / 12)

def put(name, at, sig):
    i0 = int(at * SR)
    if i0 < 0: sig = sig[-i0:]; i0 = 0
    if i0 >= N: return
    sig = sig[: N - i0]
    bus[name][i0:i0 + len(sig)] += sig

def piano(n, at, length, vel=.5):
    f = midi(n); seg = np.arange(int((length + 2.5) * SR)) / SR
    env = (1 - np.exp(-seg / .012)) * np.exp(-seg / (1.6 if f < 300 else 1.1))
    env *= np.where(seg > length, np.clip(1 - (seg - length) / 1.2, 0, 1), 1)
    s = sum(a * np.sin(2 * np.pi * f * k * seg * (1 + .0004 * k * k) + k) * np.exp(-seg * k * .9) for k, a in [(1, 1), (2, .32), (3, .12), (4, .05)])
    put('piano', at, vel * env * s * (1 + .003 * np.sin(2 * np.pi * 4.5 * seg)))

def pluck(n, at, vel=.3, decay=.35, bus_='pluck'):
    f = midi(n); seg = np.arange(int(1.6 * SR)) / SR
    s = np.sin(2 * np.pi * f * seg) * np.exp(-seg / decay) + .35 * np.sin(2 * np.pi * f * 3.98 * seg) * np.exp(-seg / .05)
    s *= 1 - np.exp(-seg / .002)
    put(bus_, at, vel * s)

def bass(n, at, length, vel=.5):
    f = midi(n); seg = np.arange(int((length + .4) * SR)) / SR
    env = (1 - np.exp(-seg / .01)) * np.exp(-seg / 1.4) * np.where(seg > length, np.clip(1 - (seg - length) / .3, 0, 1), 1)
    put('bass', at, vel * env * (np.sin(2 * np.pi * f * seg) + .25 * np.sin(4 * np.pi * f * seg) + .08 * np.sin(6 * np.pi * f * seg)))

def kick(at, vel=.8):
    seg = np.arange(int(.45 * SR)) / SR
    f = 46 + 70 * np.exp(-seg / .035); ph = 2 * np.pi * np.cumsum(f) / SR
    put('drums', at, vel * np.sin(ph) * np.exp(-seg / .16) * (1 - np.exp(-seg / .001)))

_hp = butter(4, 6500, 'hp', fs=SR, output='sos')
_bp = butter(2, [900, 2600], 'bp', fs=SR, output='sos')
def shaker(at, vel=.08, length=.07):
    seg = np.arange(int(length * 2 * SR)) / SR
    put('drums', at, vel * sosfilt(_hp, rnd.standard_normal(len(seg))) * np.exp(-seg / (length / 3)) * (1 - np.exp(-seg / .004)))

def clap(at, vel=.16):
    seg = np.arange(int(.35 * SR)) / SR
    env = sum(np.exp(-np.clip(seg - d, 0, None) / .008) * (seg >= d) for d in (0, .011, .023)) * .5 + np.exp(-seg / .09) * .6
    put('drums', at, vel * sosfilt(_bp, rnd.standard_normal(len(seg))) * env)

def chord(notes, at, length, vel=.2, roll=.05):
    for j, n in enumerate(notes): piano(n, at + j * roll, length, vel * (1.25 if j == 0 else 1))

# UI sounds: small and dry, never louder than the music.
def ui_tap(at, vel=.22):
    seg = np.arange(int(.08 * SR)) / SR
    click = sosfilt(butter(2, [1800, 5200], 'bp', fs=SR, output='sos'), rnd.standard_normal(len(seg))) * np.exp(-seg / .004)
    body = np.sin(2 * np.pi * 1250 * seg) * np.exp(-seg / .018) * .5 + np.sin(2 * np.pi * 180 * seg) * np.exp(-seg / .03) * .6
    put('ui', at, vel * (click * .7 + body))

def ui_key(at, vel=.09):
    seg = np.arange(int(.04 * SR)) / SR
    f = 2600 + 700 * rnd.random()
    s = sosfilt(butter(2, [f * .7, f * 1.3], 'bp', fs=SR, output='sos'), rnd.standard_normal(len(seg))) * np.exp(-seg / .003)
    put('ui', at, vel * s)

def ui_whoosh(at, length=.5, lo=500, hi=4000, vel=.09, rising=False):
    seg = np.arange(int(length * SR)) / SR; u = seg / length
    n = rnd.standard_normal(len(seg))
    # sweep a band through the noise in short blocks
    outp = np.zeros(len(seg)); blk = 1024
    for i in range(0, len(seg), blk):
        k = u[i]; k = k if rising else 1 - k
        fc = lo * (hi / lo) ** k
        sos = butter(2, [fc * .7, min(fc * 1.4, SR / 2 - 100)], 'bp', fs=SR, output='sos')
        outp[i:i + blk] = sosfilt(sos, n[i:i + blk])
    env = np.sin(np.pi * np.clip(u, 0, 1)) ** 1.6
    put('ui', at, vel * outp * env)

def ui_swell(at):
    ui_whoosh(at, .45, 300, 2500, .1, rising=True)
    seg = np.arange(int(.5 * SR)) / SR
    f = 220 * (1 + .5 * seg / .5)
    put('ui', at, .05 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * seg / .5))

def ui_chime(at, n=84, vel=.16):
    """The soft chime Focus ends with: a struck bell, inharmonic partials."""
    f = midi(n); seg = np.arange(int(3.0 * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * r * seg) * np.exp(-seg / d) for r, a, d in [(1, 1, 1.4), (2.76, .35, .5), (5.4, .15, .2), (.5, .25, 1.6)])
    put('ui', at, vel * s * (1 - np.exp(-seg / .003)))

for at, kind in cues:
    if kind == 'tap': ui_tap(at)
    elif kind == 'key': ui_key(at)
    elif kind == 'slide': ui_whoosh(at, .55, 400, 3200, .1)
    elif kind == 'push': ui_whoosh(at - .05, .7, 250, 1600, .06)
    elif kind == 'swell': ui_swell(at)
    elif kind == 'tick': pluck(96, at, .07, .04, 'ui')
    elif kind == 'step': pluck(88, at, .08, .25, 'ui')
    elif kind == 'chime': ui_chime(at)

# The music: one small idea per video, four bars and a held end chord at 8 s.
P = {
    # D major, mallet arpeggio from the first frame, kick and shaker from bar 3.
    'shorts': dict(prog=[([38, 50, 54, 57, 62], 38), ([35, 50, 54, 59, 62], 35), ([43, 50, 55, 59, 62], 31), ([45, 52, 57, 61, 64], 33)],
                   end=[26, 38, 45, 50, 54, 57, 62, 66], fall=[78, 74, 69], drums=2, arp=True),
    # F major, piano alone at first, close and quiet; a mallet joins under the typing.
    'words': dict(prog=[([41, 53, 57, 60, 64], 29), ([38, 50, 53, 57, 62], 26), ([46, 50, 57, 60, 65], 34), ([43, 50, 55, 58, 65], 31)],
                  end=[29, 41, 48, 57, 60, 65, 69], fall=[81, 77, 72], drums=9, arp='late'),
    # A minor to C: an even mallet pulse like a clock, then the chime and C major as the apps come back.
    'focus': dict(prog=[([45, 57, 60, 64], 33), ([41, 57, 60, 65], 29), ([43, 55, 59, 62], 31), ([40, 55, 59, 64], 28)],
                  end=[24, 36, 43, 48, 52, 55, 60, 64], fall=[79, 76, 72], drums=2, arp='pulse'),
    # D flat, low and slow, no drums: night.
    'sleep': dict(prog=[([37, 49, 53, 56, 60], 25), ([42, 49, 54, 58, 61], 30), ([39, 51, 54, 58, 63], 27), ([44, 51, 56, 60, 63], 32)],
                  end=[25, 37, 44, 49, 53, 56, 61, 65], fall=[77, 73, 68], drums=9, arp='slow'),
    # G major, warm, a light clap on two and four from bar 2.
    'stays': dict(prog=[([43, 55, 59, 62, 66], 31), ([40, 55, 59, 64, 67], 28), ([36, 52, 55, 60, 64], 36), ([38, 54, 57, 62, 66], 38)],
                  end=[31, 43, 50, 55, 59, 62, 67, 71], fall=[83, 79, 74], drums=1, arp=True, clap=True),
    # E major, bright and plain.
    'free': dict(prog=[([40, 52, 56, 59, 63], 28), ([45, 52, 57, 61, 64], 33), ([37, 52, 56, 61, 64], 37), ([47, 54, 59, 63, 66], 35)],
                 end=[28, 40, 47, 52, 56, 59, 64, 68], fall=[80, 76, 71], drums=2, arp=True),
}[piece]

BAR = 2.0
for b, (ch, bn) in enumerate(P['prog']):
    at = b * BAR
    quiet = piece in ('sleep', 'words')
    chord(ch, at, 1.9, .16 if quiet else .19)
    if piece != 'words' or b >= 2:
        bass(bn + 12 if bn < 30 else bn, at, 1.8, .3 if not quiet else .24)
    top = [n for n in ch if n >= 55]
    pat = [top[i % len(top)] + 12 for i in (0, 2, 1, 3, 2, 1, 3, 2)] if len(top) >= 3 else []
    if P['arp'] is True:
        for i, n in enumerate(pat): pluck(n, at + i * .25, (.14 if i % 2 == 0 else .09) * (.7 if b == 0 else 1))
    elif P['arp'] == 'late' and b >= 2:
        for i, n in enumerate(pat[::2]): pluck(n, at + i * .5, .1)
    elif P['arp'] == 'pulse':
        for i in range(8): pluck(top[0] + 24 if i % 4 == 0 else top[1] + 12, at + i * .25, .11 if i % 4 == 0 else .065, .12)
    elif P['arp'] == 'slow':
        for i, n in enumerate(pat[:4]): pluck(n, at + i * .5, .07, .6)
    if b >= P['drums']:
        for k in range(4):
            if k in (0, 2): kick(at + k * .5, .36)
            shaker(at + k * .5 + .25, .06)
            if P.get('clap') and k in (1, 3): clap(at + k * .5, .12)
# The end card at 8 s: home, held, with three falling notes.
chord(P['end'], 8.0, 3.4, .22, .04)
if P['drums'] < 9: kick(8.0, .45)
for i, n in enumerate(P['fall']): pluck(n, 8.5 + i * .5, .09, .5)

# Mix: piano and mallets through a small room, drums and UI drier, a gentle low pass over all.
ir_t = np.arange(int(2.2 * SR)) / SR
ir = rnd.standard_normal(len(ir_t)) * np.exp(-ir_t / .45); ir = sosfilt(butter(1, 3500, 'lp', fs=SR, output='sos'), ir); ir /= np.sqrt(np.sum(ir ** 2))
music = bus['piano'] + .8 * bus['pluck']
wet = fftconvolve(music + .3 * bus['drums'] + .4 * bus['ui'], ir)[:N]
mix = music + .75 * bus['bass'] + bus['drums'] + .3 * wet
mix = sosfilt(butter(2, 9000, 'lp', fs=SR, output='sos'), mix)
mix = sosfilt(butter(2, 30, 'hp', fs=SR, output='sos'), mix)
mix = mix / np.max(np.abs(mix)) * .8
mix = mix + 1.1 * bus['ui']
fade = np.clip((DUR - t) / 1.6, 0, 1) * np.clip(t / .01, 0, 1)
mix *= fade
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.25) / np.tanh(1.25) * .7 * {'shorts': .84, 'stays': .84}.get(piece, 1)
st = np.stack([mix, np.roll(mix, int(.011 * SR)) * .96 + .04 * np.roll(mix, int(.023 * SR))], 1)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(st, -1, 1) * 32767).astype('<i2').tobytes())
print('wrote', out)
