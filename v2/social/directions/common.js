// Shared by the direction mockups. Picks the piece from ?p=, sizes the canvas, lays out screen crops, then sets window.ready.
(() => {
  const p = new URLSearchParams(location.search).get('p') || 'feed';
  const H = p === 'feed' ? 1350 : 1920;
  document.documentElement.dataset.p = p;
  const c = document.getElementById('c');
  c.style.height = H + 'px';
  document.querySelectorAll('[data-piece]').forEach(el => { if (el.dataset.piece !== p) el.remove(); });
  // <div class="crop" data-src data-x data-y data-w data-h data-s>: a window onto a 1080 x 2340 screen at scale s.
  const imgs = [];
  document.querySelectorAll('.crop[data-src]').forEach(el => {
    const d = el.dataset, s = +d.s;
    el.style.width = (+d.w * s) + 'px'; el.style.height = (+d.h * s) + 'px';
    const i = new Image(); i.src = d.src; i.style.width = (1080 * s) + 'px';
    i.style.left = (-d.x * s) + 'px'; i.style.top = (-d.y * s) + 'px';
    el.prepend(i); imgs.push(i.decode().catch(() => {}));
  });
  document.querySelectorAll('img').forEach(i => imgs.push(i.decode().catch(() => {})));
  Promise.all([document.fonts.ready, ...imgs]).then(() => setTimeout(() => { window.ready = true; }, 300));
})();
