/* Halftone prints for the social pieces: the site's code (img/cygnet-mark.svg and the brand marks sampled
   through a rotated screen and printed as dots), with a seeded random so every frame is deterministic,
   and a paint(ms) that draws the print as it lands: dots grow in, then the blue strike runs across. */
(() => {
  const ROOT = window.IDYLL_ROOT || '../../';
  const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const ease = t => 1 - Math.pow(1 - t, 3);
  function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function screen(a, w, h, c, ang, tone, rk, delay, rnd) {
    const out = [], ca = Math.cos(ang), sa = Math.sin(ang), cx = w / 2, cy = h / 2, n = Math.ceil(Math.hypot(w, h) / c / 2) + 2;
    for (let j = -n; j <= n; j++) for (let i = -n; i <= n; i++) {
      const x = cx + (i * ca - j * sa) * c, y = cy + (i * sa + j * ca) * c;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const v = a[((y | 0) * w + (x | 0)) * 4 + 3] / 255 * tone(x / w, y / h);
      if (v < .05) continue;
      out.push({ x, y, r: c * rk * Math.sqrt(Math.min(v, 1)), d: delay(x / w, y / h) + rnd() });
    }
    return out;
  }
  function sample(img, w, h, inset, blur) {
    const m = document.createElement('canvas'); m.width = w; m.height = h;
    const g = m.getContext('2d', { willReadFrequently: true });
    g.filter = `blur(${blur}px)`; g.drawImage(img, inset, inset, w - 2 * inset, h - 2 * inset);
    return g.getImageData(0, 0, w, h).data;
  }
  const load = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

  /* opts: kind 'cygnet' | 'mark', b (brand), ink, water (or null), strike (or null), cell, speed (1 = the site's pace), seed */
  window.Print = async function (canvas, o) {
    const w = canvas.width = Math.round(canvas.clientWidth), h = canvas.height = Math.round(canvas.clientHeight);
    const rnd = rng(o.seed || 7), sp = o.speed || 1, g = canvas.getContext('2d');
    let layers = [], cross = null, dur = 360 / sp;
    if (o.kind === 'cygnet') {
      const img = await load(`${ROOT}img/cygnet-mark.svg`);
      const cell = o.cell || Math.max(4.5, w / 120), a = sample(img, w, h, 0, cell * .45);
      const dl = (u, v) => (v * 315 + u * 585) / sp, jit = () => rnd() * 280 / sp;
      if (o.water) layers.push({ col: o.water, dx: 3 * cell / 4.5, dy: -2 * cell / 4.5, dots: screen(a, w, h, cell * .9, 15 * Math.PI / 180, (u, v) => .45 * Math.max(0, (v - .66) * 2.6) ** 1.4, .56, dl, jit) });
      layers.push({ col: o.ink, dx: 0, dy: 0, dots: screen(a, w, h, cell, 45 * Math.PI / 180, o.flat ? () => 1 : (u, v) => .5 + .5 * Math.min(1, .25 + 1.1 * u * u + .6 * v), .56, dl, jit) });
    } else {
      const img = await load(`${ROOT}img/brands/${o.b}.svg`);
      const cell = w / (o.n || 24), a = sample(img, w, h, Math.round(w * .1), cell * .15);
      const dl = u => (u * 260) / sp, jit = () => rnd() * 140 / sp;
      layers.push({ col: o.ink, dx: 0, dy: 0, dots: screen(a, w, h, cell, 45 * Math.PI / 180, () => 1, .58, dl, jit) });
      if (o.strike) cross = { col: o.strike, at: 420 / sp, dur: 300 / sp };
      dur = 300 / sp;
    }
    const end = Math.max(...layers.flatMap(L => L.dots.map(d => d.d))) + dur + (cross ? cross.at + cross.dur : 0);
    function paint(ms) {
      g.clearRect(0, 0, w, h);
      for (const L of layers) {
        g.fillStyle = L.col; g.beginPath();
        for (const d of L.dots) { const r = d.r * ease(clamp((ms - d.d) / dur)); if (r < .3) continue; g.moveTo(d.x + L.dx + r, d.y + L.dy); g.arc(d.x + L.dx, d.y + L.dy, r, 0, 6.2832); }
        g.fill();
      }
      if (cross) {
        const k = ease(clamp((ms - cross.at) / cross.dur));
        if (k > 0) { const ox = w * .033, y0 = h * .6 - h * .025, y1 = h * .4 - h * .025; g.strokeStyle = cross.col; g.lineWidth = w * .1; g.lineCap = 'butt'; g.beginPath(); g.moveTo(ox, y0); g.lineTo(ox + w * k, y0 + (y1 - y0) * k); g.stroke(); }
      }
    }
    return { paint, end };
  };
})();
