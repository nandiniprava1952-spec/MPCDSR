/* MPCDSR service worker: offline-capable app shell + controlled updates.
   Cloud (Apps Script) calls are never cached.
   RELEASING: change VERSION below on every release (e.g. mpcdsr-v32). Browsers detect a new version
   by a change in this file, which is what makes the in-app "Update available" card appear. */
const VERSION = 'mpcdsr-v53';
const INDEX = './index.html';
const OTHERS = ['./manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const EST_INDEX = 2950000;   // fallback size (bytes) of index.html for progress when the server sends no length

async function notify(msg){
  const cs = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  cs.forEach(c => c.postMessage(msg));
}

// Download index.html while reporting progress (0..1). Returns a Response ready for the cache.
async function fetchIndex(onFrac){
  const res = await fetch(new Request(INDEX, { cache: 'reload' }));
  if(!res.ok) throw new Error('HTTP ' + res.status);
  if(!res.body || !res.body.getReader){ onFrac(1); return res; }
  const enc = res.headers.get('content-encoding'), len = +res.headers.get('content-length') || 0;
  const total = (!enc && len) ? len : EST_INDEX;
  const reader = res.body.getReader(), chunks = []; let got = 0;
  for(;;){
    const r = await reader.read();
    if(r.done) break;
    chunks.push(r.value); got += r.value.length; onFrac(Math.min(0.99, got / total));
  }
  const h = new Headers(res.headers); h.delete('content-length'); h.delete('content-encoding');
  onFrac(1);
  return new Response(new Blob(chunks), { status: res.status, statusText: res.statusText, headers: h });
}

// No skipWaiting() here: a new version waits until the person taps "Update" in the app.
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    let idx = 0, oth = 0, last = -1;
    const report = () => {
      const pct = Math.min(100, Math.round((idx * 0.9 + (oth / OTHERS.length) * 0.1) * 100));
      if(pct !== last){ last = pct; notify({ type: 'MP_PROGRESS', version: VERSION, pct }); }
    };
    const page = await fetchIndex(f => { idx = f; report(); });
    await cache.put(INDEX, page.clone());
    await cache.put('./', page);
    for(const u of OTHERS){
      const r = await fetch(new Request(u, { cache: 'reload' }));
      if(!r.ok) throw new Error('HTTP ' + r.status + ' ' + u);
      await cache.put(u, r); oth++; report();
    }
    notify({ type: 'MP_PROGRESS', version: VERSION, pct: 100 });
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if(e.data === 'SKIP_WAITING' || (e.data && e.data.type === 'SKIP_WAITING')) self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Google Apps Script, CDNs: always straight to network

  // Page loads: network first (so updates arrive), fall back to the cached copy when offline/slow.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(VERSION);
      try {
        const fresh = await Promise.race([
          fetch(req),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
        ]);
        if (fresh && fresh.ok) cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (_) {
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Other same-origin files (icons, manifest): cache first, refresh in background.
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req);
    const net = fetch(req).then(r => { if (r && r.ok) cache.put(req, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});
