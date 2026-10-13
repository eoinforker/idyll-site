// Shared by the premium B pages. ?n=<piece> keeps one piece; the canvas takes its height from the piece's data-h (1350 or 1920).
// <div class="crop" data-src data-x data-y data-w data-h data-s [data-dpw]>: a window onto a render, in the app's dp,
// at s pixels per dp. The renders are 360 dp wide at 4x, so s up to 4 is drawn from real pixels.
(() => {
  const q = new URLSearchParams(location.search);
  const n = q.get('n');
  const c = document.getElementById('c');
  const pieces = [...document.querySelectorAll('[data-piece]')];
  const keep = pieces.find(el => el.dataset.piece === n) || pieces[0];
  pieces.forEach(el => { if (el !== keep) el.remove(); });
  const H = +(keep.dataset.h || (keep.dataset.piece.startsWith('s') ? 1920 : 1350));
  c.style.height = H + 'px';
  document.title = keep.dataset.piece;
  const imgs = [];
  document.querySelectorAll('.crop[data-src]').forEach(el => {
    const d = el.dataset, s = +d.s, dpw = +(d.dpw || 360);
    el.style.width = (+d.w * s) + 'px'; el.style.height = (+d.h * s) + 'px';
    const i = new Image(); i.src = d.src; i.style.width = (dpw * s) + 'px';
    i.style.left = (-d.x * s) + 'px'; i.style.top = (-d.y * s) + 'px';
    el.prepend(i); imgs.push(i.decode().catch(() => {}));
  });
  document.querySelectorAll('img').forEach(i => imgs.push(i.decode().catch(() => {})));
  Promise.all([document.fonts.ready, ...imgs]).then(() => setTimeout(() => { window.ready = true; }, 300));
})();
