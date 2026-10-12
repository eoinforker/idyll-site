// Render Idyll social pieces through the Chrome DevTools protocol (plain headless --screenshot hangs on this machine).
//   node render.mjs video <url> <framesDir> <fps> <seconds> [width height]
//   node render.mjs shot  <url> <out.png> <width> <height>
// Pages set window.ready = true when loaded; videos also expose window.seek(t).
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [mode, url, out, a, b, c, d] = process.argv.slice(2);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const ownProfile = !process.env.CDP_PROFILE, profile = process.env.CDP_PROFILE || join(tmpdir(), `idyll-cdp-${port}`);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--force-color-profile=srgb', '--no-first-run', '--no-default-browser-check', '--window-size=1080,1920', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* Chrome leaves its profile behind; remove ours once Chrome has exited, also on Ctrl-C. */
const exited = new Promise(r => chrome.once('exit', r));
async function cleanup() {
  chrome.kill('SIGKILL'); await Promise.race([exited, sleep(3000)]);
  if (ownProfile) for (let i = 0; i < 5; i++) { try { rmSync(profile, { recursive: true, force: true }); break; } catch { await sleep(200); } }
}
for (const sig of ['SIGINT', 'SIGTERM']) process.once(sig, () => cleanup().finally(() => process.exit(130)));

let ws, seq = 0; const pending = new Map();
function send(method, params = {}) { const id = ++seq; ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => pending.set(id, { res, rej })); }
async function evaluate(expression) { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; }

try {
  let ver;
  for (let i = 0; i < 100 && !ver; i++) { try { ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch { await sleep(100); } }
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  const W = +(mode === 'video' ? (c || 1080) : a), H = +(mode === 'video' ? (d || 1920) : b);
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.navigate', { url });
  for (let i = 0; i < 300; i++) { if (await evaluate('window.ready === true').catch(() => false)) break; await sleep(100); }
  const frame = () => evaluate('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(1))))');
  const shot = async () => Buffer.from((await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale: 1 } })).data, 'base64');
  if (mode === 'video') {
    const fps = +a, n = Math.round(+b * fps); mkdirSync(out, { recursive: true });
    for (let i = 0; i < n; i++) {
      await evaluate(`window.seek(${(i / fps).toFixed(5)})`); await frame();
      writeFileSync(join(out, `f${String(i).padStart(5, '0')}.png`), await shot());
      if (i % 60 === 0) process.stdout.write(`frame ${i}/${n}\n`);
    }
  } else {
    await frame(); await sleep(150); await frame();
    writeFileSync(out, await shot());
  }
} catch (e) { console.error(e); process.exitCode = 1; }
finally { try { ws && ws.close(); } catch {} await cleanup(); }
