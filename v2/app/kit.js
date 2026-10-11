/* Idyll app mockups: chrome, brand marks, halftone prints (the site's code, drawn still), the clean sites. */
(() => {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const BLUE = '#2d5bff', CREAM = '#fff6ee';
  const ROOT = window.IDYLL_ROOT || '../../';

  /* Icons. */
  const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-home" viewBox="0 0 24 24"><path d="M3.5 10.5 12 3.8l8.5 6.7V20a.5.5 0 0 1-.5.5h-5v-6h-6v6H4a.5.5 0 0 1-.5-.5z"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.6"/><path d="m15.8 15.8 4.6 4.6"/></symbol>
  <symbol id="i-chev" viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6"/></symbol>
  <symbol id="i-chevl" viewBox="0 0 24 24"><path d="m14.5 6-6 6 6 6"/></symbol>
  <symbol id="i-back" viewBox="0 0 24 24"><path d="M19.5 12h-15M10.5 6l-6 6 6 6"/></symbol>
  <symbol id="i-share" viewBox="0 0 24 24"><path d="M12 15V3.5M8 7.5l4-4 4 4M7 10.5H5.5v10h13v-10H17"/></symbol>
  <symbol id="i-reload" viewBox="0 0 24 24"><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4v4.5H15"/></symbol>
  <symbol id="i-sliders" viewBox="0 0 24 24"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></symbol>
  <symbol id="i-mic" viewBox="0 0 24 24"><rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/></symbol>
  <symbol id="i-subs" viewBox="0 0 24 24"><rect x="3.5" y="7.5" width="17" height="12.5" rx="2"/><path d="M6 4.5h12M10.5 11v5.5l4.5-2.75z"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.2c1.3-2 3.2-3 5.5-3s4.2 1 5.5 3"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-more" viewBox="0 0 24 24"><circle cx="12" cy="5.5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="18.5" r="1.3"/></symbol>
  <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3.3-3.3a4 4 0 0 0-5.7-5.7L12 6.3M14 10a4 4 0 0 0-5.7 0L5 13.3A4 4 0 0 0 10.7 19l1.3-1.3"/></symbol>
  <symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5h4"/></symbol>
  <symbol id="i-msg" viewBox="0 0 24 24"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2A8.5 8.5 0 1 1 20.5 11.5z"/></symbol>
  </svg>`;
  document.body.insertAdjacentHTML('afterbegin', sprite);
  window.I = (n, cls = '') => `<svg class="ic ${cls}"><use href="#i-${n}"/></svg>`;

  /* Status bar, island, home indicator. */
  const SB = '<svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".7" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx=".7" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx=".7" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx=".7" fill="currentColor"/></svg><svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.4 6.8a6.5 6.5 0 0 1 9.2 0l-1.4 1.4a4.5 4.5 0 0 0-6.4 0zM1 4.4a9.9 9.9 0 0 1 14 0l-1.4 1.4a7.9 7.9 0 0 0-11.2 0z" fill="currentColor"/></svg><svg width="27" height="13" viewBox="0 0 27 12"><rect x=".5" y=".5" width="23" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor"/><path d="M25 4v4c.8-.3 1.3-1.1 1.3-2S25.8 4.3 25 4z" fill="currentColor" opacity=".45"/></svg>';
  $$('.phone').forEach(p => p.insertAdjacentHTML('beforeend', `<div class="sb"><span>9:41</span><span class="ri">${SB}</span></div><span class="island"></span>${p.classList.contains('nohi') ? '' : '<span class="hi"></span>'}`));

  /* Only one screen, for the PNG export. */
  const only = new URLSearchParams(location.search).get('only');
  $$('.cell').forEach((c, i) => { c.dataset.n = i + 1; const cap = c.querySelector('.cap'); if (cap && !cap.querySelector('b')) cap.insertAdjacentHTML('afterbegin', `<b>${String(i + 1).padStart(2, '0')}</b>`); });
  if (only) { document.body.classList.add('only'); const c = $$('.cell')[+only - 1]; if (c) c.classList.add('on'); }

  /* The clean sites. */
  const AVC = [['#ffe1ef', '#a8105c'], ['#e3e9ff', '#1a3fd6'], ['#ffe8d4', '#9a4a12'], ['#ddf3e6', '#1f6b45']];
  const im = id => `<img src="${ROOT}img/photos/${id}.jpg" alt="">`;
  window.YT = (dark) => {
    const r = (ph, dur, l, c, t, ch, m) => `<div class="res"><div class="th">${im(ph)}<span class="dur">${dur}</span></div><div class="meta"><span class="av" style="background:${AVC[c][0]};color:${AVC[c][1]}">${l}</span><div><b>${t}</b><small>${ch} · ${m}</small></div>${I('more')}</div></div>`;
    return `<div class="yt site${dark ? ' dark' : ''}">
      <div class="sbar">${I('back')}<div class="q"><span>loading 35mm film</span>${I('x')}</div><span class="mic">${I('mic')}</span></div>
      <div class="chips"><span class="on">All</span><span>Videos</span><span>Unwatched</span><span>Recently uploaded</span></div>
      ${r(250, '8:14', 'G', 2, 'Loading 35mm film without the fuss', 'Grain and Glass', '212K views · 2 years ago')}
      ${r(57, '14:02', 'W', 0, 'One roll of Portra on a New York morning', 'Wren Walks', '48K views · 5 months ago')}
      ${r(122, '11:37', 'L', 3, 'Shooting film at night in London', 'Lowlight Club', '91K views · 1 year ago')}
      <div class="nav"><span>${I('search')}Search</span><span>${I('subs')}Subscriptions</span><span>${I('user')}You</span></div>
    </div>`;
  };
  window.RD = () => {
    const p = (t, v, c, ph, ago) => `<div class="post"><div><div class="sub"><i></i>r/AnalogCommunity · ${ago}</div><b>${t}</b><small>${v} votes · ${c} comments</small></div>${im(ph)}</div>`;
    return `<div class="rd">
      <div class="sbar">${I('back')}<div class="q"><span class="chipc"><i style="width:18px;height:18px;border-radius:50%;background:#ff4500;display:inline-block"></i>r/AnalogCommunity</span>first roll</div></div>
      <div class="tabs"><span class="on">Posts</span><span>Comments</span><span>Media</span><span>People</span></div>
      <div class="sort"><span>Relevance</span><span>All time</span></div>
      ${p("My first roll ever. Dad's old Pentax, no idea what I was doing", '1.2K', '86', 57, '3d')}
      ${p('First roll through a camera I found at a car boot sale', '412', '37', 76, '2w')}
      ${p('Is it normal for the first frames of a roll to be blank?', '64', '22', 250, '1mo')}
      ${p('First roll of Portra 400, London after dark', '388', '19', 122, '2mo')}
    </div>`;
  };
  $$('[data-site]').forEach(el => { el.outerHTML = el.dataset.site === 'reddit' ? RD() : YT(el.dataset.site === 'yt-dark'); });


  /* The week, honest and thin: one series, today picked out, only the peak and today labelled. */
  $$('[data-week]').forEach(el => {
    const v = [34, 41, 28, 37, 22, 19, 23], max = Math.max(...v), H = +el.dataset.h || 140, ink = el.dataset.ink || 'var(--ink)', hi = el.dataset.hi || 'var(--pink)', lab = el.dataset.lab || 'var(--soft)', rule = el.dataset.rule || ink;
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'Today'];
    const col = (x, i) => { const h = Math.round(x / max * (H - 24)), last = i === 6, show = last || x === max;
      return `<div style="position:relative;height:100%"><div style="position:absolute;left:30%;right:30%;bottom:0;height:${h}px;background:${last ? hi : ink};border-radius:4px 4px 0 0"></div>${show ? `<span style="position:absolute;left:0;right:0;bottom:${h + 6}px;text-align:center;font:400 11.5px/1 var(--mono);color:${last ? hi : 'inherit'}">${x}</span>` : ''}</div>`; };
    el.innerHTML = `<div style="height:${H}px;display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid ${rule}">${v.map(col).join('')}</div><div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-top:8px;font:400 11.5px/1 var(--mono);color:${lab}">${days.map((d, i) => `<span${i === 6 ? ' style="color:inherit"' : ''}>${d}</span>`).join('')}</div>`;
  });

  /* Tiles: <span class="tile" data-t="youtube"></span> */
  $$('[data-t]').forEach(el => { el.classList.add('tile', el.dataset.t); el.innerHTML = `<i class="bm" data-b="${el.dataset.t}"></i>`; });

  /* Brand marks: official, unmodified, inlined so they can take their own colour or the ink. */
  const BRAND = { youtube: '#FF0000', instagram: '#000000', facebook: '#0866FF', x: '#000000', snapchat: '#FFFFFF', tiktok: '#000000', reddit: '#FF4500', linkedin: '#0A66C2', threads: '#000000' };
  const cache = {};
  const getSvg = b => cache[b] || (cache[b] = fetch(`${ROOT}img/brands/${b}.svg`).then(r => r.text()).then(t => (t.match(/ d="([^"]+)"/) || [])[1]));
  const marks = Promise.all($$('.bm').map(async el => {
    const b = el.dataset.b, d = await getSvg(b);
    const mono = el.closest('.mono') && !el.closest('.colour');
    const fill = mono ? 'currentColor' : BRAND[b];
    const stroke = !mono && b === 'snapchat' ? ' stroke="#000" stroke-width="1.1" stroke-linejoin="round"' : '';
    el.innerHTML = `<svg viewBox="-.6 -.6 25.2 25.2" role="img" aria-label="${b}"><path d="${d}" fill="${fill}"${stroke}/></svg>`;
  }));

  /* Prints: each silhouette is sampled through a rotated screen and printed as dots. */
  function screen(a, w, h, c, ang, tone, rk) {
    const out = [], ca = Math.cos(ang), sa = Math.sin(ang), cx = w / 2, cy = h / 2, n = Math.ceil(Math.hypot(w, h) / c / 2) + 2;
    for (let j = -n; j <= n; j++) for (let i = -n; i <= n; i++) {
      const x = cx + (i * ca - j * sa) * c, y = cy + (i * sa + j * ca) * c;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const v = a[((y | 0) * w + (x | 0)) * 4 + 3] / 255 * tone(x / w, y / h);
      if (v < .05) continue;
      out.push({ x, y, r: c * rk * Math.sqrt(Math.min(v, 1)) });
    }
    return out;
  }
  function sample(img, w, h, inset, blur) {
    const m = document.createElement('canvas'); m.width = w; m.height = h;
    const g = m.getContext('2d', { willReadFrequently: true });
    g.filter = `blur(${blur}px)`; g.drawImage(img, inset, inset, w - 2 * inset, h - 2 * inset);
    return g.getImageData(0, 0, w, h).data;
  }
  const load = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  async function print(el) {
    const cv = document.createElement('canvas'); el.appendChild(cv);
    const kind = el.dataset.print, dpr = +el.dataset.dpr || Math.min(devicePixelRatio || 1, 3);
    const cw = el.clientWidth, w = Math.round(cw * dpr), h = Math.round(el.clientHeight * dpr);
    if (!w || !h) return;
    cv.width = w; cv.height = h;
    const g = cv.getContext('2d'), ink = el.dataset.ink || CREAM;
    const dots = (L) => { g.fillStyle = L.col; g.beginPath(); for (const d of L.dots) { if (d.r < .3) continue; g.moveTo(d.x + L.dx + d.r, d.y + L.dy); g.arc(d.x + L.dx, d.y + L.dy, d.r, 0, 6.2832); } g.fill(); };
    if (kind === 'cygnet') {
      const img = await load(`${ROOT}img/cygnet-mark.svg`); if (!img) return;
      const cell = (+el.dataset.cell || Math.max(4.5, cw / 120)) * dpr;
      const a = sample(img, w, h, 0, cell * .45);
      const water = el.dataset.water === 'none' ? null : (el.dataset.water || BLUE);
      if (water) dots({ col: water, dx: 3 * dpr, dy: -2 * dpr, dots: screen(a, w, h, cell * .9, 15 * Math.PI / 180, (u, v) => .45 * Math.max(0, (v - .66) * 2.6) ** 1.4, .56) });
      const flat = el.dataset.flat != null;
      dots({ col: ink, dx: 0, dy: 0, dots: screen(a, w, h, cell, 45 * Math.PI / 180, flat ? () => 1 : (u, v) => .5 + .5 * Math.min(1, .25 + 1.1 * u * u + .6 * v), .56) });
      if (el.dataset.line != null) {
        /* The waterline from the app icon: one row of dots that fades at both ends. */
        const y = h * .985, n = Math.round(w / cell * 1.15); g.fillStyle = ink; g.beginPath();
        for (let i = 0; i <= n; i++) { const u = i / n, k = Math.min(1, Math.min(u, 1 - u) * 7), r = cell * .42 * k; if (r < .4) continue; const x = w * (.02 + .96 * u); g.moveTo(x + r, y); g.arc(x, y, r, 0, 6.2832); }
        g.fill();
      }
    } else if (kind === 'mark') {
      const img = await load(`${ROOT}img/brands/${el.dataset.b}.svg`); if (!img) return;
      const cell = cw / (+el.dataset.n || 22) * dpr;
      const a = sample(img, w, h, Math.round(w * .1), cell * .15);
      dots({ col: ink, dx: 0, dy: 0, dots: screen(a, w, h, cell, 45 * Math.PI / 180, () => 1, .58) });
      if (el.dataset.strike !== 'none') {
        const ox = 2 * dpr * (cw / 60), oy = -1.5 * dpr, y0 = h * .6 + oy, y1 = h * .4 + oy;
        g.strokeStyle = el.dataset.strike || BLUE; g.lineWidth = w * .1; g.lineCap = 'butt'; g.beginPath();
        g.moveTo(ox, y0); g.lineTo(ox + w, y1); g.stroke();
      }
    }
  }
  window.IdyllPrint = print;
  if (window.IDYLL_NO_AUTO) return;
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => marks).then(() => Promise.all($$('.print').map(print))).then(() => { document.documentElement.dataset.ready = '1'; });
})();
