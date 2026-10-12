# Music for the two Idyll showcase videos, synthesised from scratch (sine partials and filtered noise).
# Extends the felt-piano bed used in the 10 s ads with a marimba-like pluck, a soft bass, a soft kick and a shaker.
#   python3 score.py tour out.wav     (19.5 s)
#   python3 score.py keep out.wav     (16.0 s)
import sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
piece, out = sys.argv[1], sys.argv[2]
DUR = {'tour': 19.5, 'keep': 16.0}[piece]
N = int(SR * DUR)
t = np.arange(N) / SR
bus = {k: np.zeros(N) for k in ('piano', 'pluck', 'bass', 'drums', 'fx')}
rnd = np.random.default_rng(7)

def midi(n): return 440 * 2 ** ((n - 69) / 12)

def put(name, at, sig):
    i0 = int(at * SR)
    if i0 >= N: return
    sig = sig[: N - i0]
    bus[name][i0:i0 + len(sig)] += sig

def piano(n, at, length, vel=.5):
    f = midi(n); seg = np.arange(int((length + 2.5) * SR)) / SR
    env = (1 - np.exp(-seg / .012)) * np.exp(-seg / (1.6 if f < 300 else 1.1))
    env *= np.where(seg > length, np.clip(1 - (seg - length) / 1.2, 0, 1), 1)
    s = sum(a * np.sin(2 * np.pi * f * k * seg * (1 + .0004 * k * k) + k) * np.exp(-seg * k * .9) for k, a in [(1, 1), (2, .32), (3, .12), (4, .05)])
    put('piano', at, vel * env * s * (1 + .003 * np.sin(2 * np.pi * 4.5 * seg)))

def pluck(n, at, vel=.3, decay=.35):
    """A small wooden mallet: fundamental, a 4x overtone that dies fast, a soft click."""
    f = midi(n); seg = np.arange(int(1.6 * SR)) / SR
    s = np.sin(2 * np.pi * f * seg) * np.exp(-seg / decay) + .35 * np.sin(2 * np.pi * f * 3.98 * seg) * np.exp(-seg / .05)
    s *= 1 - np.exp(-seg / .002)
    put('pluck', at, vel * s)

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
def shaker(at, vel=.12, length=.07):
    seg = np.arange(int(length * 2 * SR)) / SR
    put('drums', at, vel * sosfilt(_hp, rnd.standard_normal(len(seg))) * np.exp(-seg / (length / 3)) * (1 - np.exp(-seg / .004)))

def clap(at, vel=.22):
    seg = np.arange(int(.35 * SR)) / SR
    env = sum(np.exp(-np.clip(seg - d, 0, None) / .008) * (seg >= d) for d in (0, .011, .023)) * .5 + np.exp(-seg / .09) * .6
    put('drums', at, vel * sosfilt(_bp, rnd.standard_normal(len(seg))) * env)

def chord(notes, at, length, vel=.22, roll=.06):
    for j, n in enumerate(notes): piano(n, at + j * roll, length, vel * (1.25 if j == 0 else 1))

if piece == 'tour':
    # 0 to 2.5 s: the feed. Ticks get faster and higher with a noise swell, then everything stops dead at 2.5.
    STOP = 2.5
    tk, k = 0.0, 0
    scale = [72, 74, 76, 79, 81, 84, 86, 88]
    while tk < STOP - .02:
        pluck(scale[k % 8] + 12 * (k // 16 % 2), tk, .14 + .22 * tk / STOP, decay=.07)
        gap = .19 - .13 * (tk / STOP) ** .7; tk += gap; k += 1
    seg = np.arange(int(STOP * SR)) / SR
    sw = rnd.standard_normal(len(seg)); sw = sosfilt(butter(2, [1500, 7000], 'bp', fs=SR, output='sos'), sw)
    put('fx', 0, .2 * sw * (seg / STOP) ** 2)
    # The stop: one soft low thump into silence, then the piano picks it up.
    kick(STOP, .8)
    # 2.9 s: a soft pickup chord out of the silence. From 3.9 s, 120 bpm, a bar every 2 s, so each scene lands on a downbeat.
    chord([40, 52, 55, 60, 64], 2.9, 1.0, .2)
    T0, BAR = 3.9, 2.0
    prog = [([41, 53, 57, 60, 64], 29), ([40, 52, 55, 60, 64], 28), ([38, 50, 53, 57, 60], 26), ([46, 50, 57, 60, 65], 34),
            ([43, 50, 55, 58, 65], 31), ([36, 48, 55, 58, 64], 36)]
    arp = [[72, 69, 64, 69, 72, 76, 72, 69], [72, 67, 64, 67, 72, 76, 72, 67], [74, 69, 65, 69, 74, 77, 74, 69], [74, 69, 65, 69, 74, 77, 74, 72],
           [74, 70, 67, 70, 74, 79, 74, 70], [72, 70, 67, 70, 72, 76, 79, 76]]
    mel = {0: [(76, 0)], 1: [(76, 0), (74, 1)], 2: [(77, 0), (76, 1)], 3: [(74, 0), (72, 1)], 4: [(74, 0), (77, 1)], 5: [(76, 0), (79, 1)]}
    for b, (ch, bn) in enumerate(prog):
        at = T0 + b * BAR
        chord(ch, at, 1.9, .2)
        bass(bn + 12 if bn < 33 else bn, at, 1.8, .34)
        for i, n in enumerate(arp[b]): pluck(n, at + i * .25, (.16 if i % 2 == 0 else .11))
        for q in range(4):
            if q in (0, 2): kick(at + q * .5, .42)
            shaker(at + q * .5 + .25, .07)
        for n, off in mel.get(b, []): piano(n + 12, at + off, 1.3, .13)
    # A light bell where the words and numbers change on screen.
    for s_, n in ((7.4, 84), (8.4, 86), (10.9, 84), (11.9, 89), (13.9, 84), (14.9, 81)): pluck(n, s_, .13, .3)
    pluck(96, 6.75, .07, .05)
    # 15.9 s, the end card: home to F, held, with three falling notes.
    END = T0 + 6 * BAR
    chord([29, 41, 48, 57, 60, 65, 69], END, 3.2, .24); kick(END, .5)
    piano(81, END + .05, 2.0, .12)
    for i, n in enumerate([81, 77, 72]): pluck(n, END + .5 + i * .5, .1, .5)
else:
    # 120 bpm from the first frame, a bar every 2 s, D major. Fuller: kick, clap, shaker, bass from bar 2.
    BAR = 2.0
    prog = [([38, 50, 54, 57, 61], 38), ([35, 50, 54, 57, 62], 35), ([43, 50, 55, 59, 62], 31), ([45, 52, 57, 61, 64], 33),
            ([47, 50, 54, 57, 62], 35), ([45, 49, 52, 55, 61], 33)]
    arp = [[74, 69, 66, 69, 74, 78, 74, 69], [74, 71, 66, 71, 74, 78, 74, 71], [74, 71, 67, 71, 74, 79, 74, 71], [76, 73, 69, 73, 76, 81, 76, 73],
           [74, 71, 66, 71, 74, 78, 74, 71], [76, 73, 67, 73, 76, 79, 76, 73]]
    mel = {1: [(78, 0), (76, 1), (74, 1.5)], 2: [(79, 0), (78, 1)], 3: [(76, 0)], 4: [(78, 0), (81, 1)], 5: [(79, 0), (76, 1)]}
    for b, (ch, bn) in enumerate(prog):
        at = b * BAR
        chord(ch, at, 1.9, .2 if b else .26)
        if b >= 1:
            bass(bn, at, .9, .38); bass(bn, at + 1.0, .45, .3); bass(bn + 7, at + 1.5, .45, .26)
        for i, n in enumerate(arp[b]): pluck(n, at + i * .25, (.16 if i % 2 == 0 else .1) * (.6 if b == 0 else 1))
        if b >= 1:
            for q in range(4):
                kick(at + q * .5, .5 if q in (0, 2) else (.28 if b >= 3 else 0))
                if q in (1, 3) and b >= 2: clap(at + q * .5, .2)
                shaker(at + q * .5 + .25, .085); shaker(at + q * .5 + .125, .035)
        for n, off in mel.get(b, []): piano(n + 12, at + off, 1.2, .14)
    # The strikes in "what goes" land on a woody tick.
    for s_ in (7.0, 7.5, 8.0, 8.5, 9.0): pluck(93, s_, .1, .04)
    # 12 s, the end card: home to D, held.
    chord([26, 38, 45, 50, 54, 57, 62, 66], 12.0, 3.0, .24); kick(12.0, .55)
    for i, n in enumerate([78, 74, 69]): pluck(n, 12.5 + i * .5, .1, .5)

# Mix: piano and plucks through a small room, drums drier, a gentle low pass over all.
ir_t = np.arange(int(2.2 * SR)) / SR
ir = rnd.standard_normal(len(ir_t)) * np.exp(-ir_t / .45); ir = sosfilt(butter(1, 3500, 'lp', fs=SR, output='sos'), ir); ir /= np.sqrt(np.sum(ir ** 2))
music = bus['piano'] + .8 * bus['pluck'] + bus['fx']
wet = fftconvolve(music + .3 * bus['drums'], ir)[:N]
if piece == 'tour':  # the dead stop: the hook's room is cut at once, only the thump rings.
    cut = int(2.52 * SR); pre = music.copy(); pre[cut:] = 0; music[:cut] = 0
    wp = fftconvolve(pre, ir)[:N]; g = np.clip(1 - (t - 2.5) / .1, 0, 1); wet = fftconvolve(music + .3 * bus['drums'], ir)[:N] + wp * g
    music = music + pre
mix = music + (.9 if piece == 'tour' else .7) * bus['bass'] + bus['drums'] + .32 * wet
mix = sosfilt(butter(2, 9000, 'lp', fs=SR, output='sos'), mix)
mix = sosfilt(butter(2, 30, 'hp', fs=SR, output='sos'), mix)
fade = np.clip((DUR - t) / 1.8, 0, 1) * np.clip(t / .02, 0, 1)
mix *= fade
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.3) / np.tanh(1.3) * .7
st = np.stack([mix, np.roll(mix, int(.011 * SR)) * .96 + .04 * np.roll(mix, int(.023 * SR))], 1)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(st, -1, 1) * 32767).astype('<i2').tobytes())
print('wrote', out, DUR)
