const VERSION_URL = new URL('./version.json', self.registration.scope).href;
const OFFLINE_URL = new URL('./offline.html', self.registration.scope).href;
const CACHE = 'valoris-github-pages-v20';
const STATIC = [
  './','./index.html','./offline.html','./manifest.webmanifest','./logo.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./favicon.ico','./favicon-16.png','./favicon-32.png','./favicon-48.png','./favicon-180.png'
];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC.map(u => new URL(u, self.registration.scope).href))).then(()=>self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', event => { const req=event.request; if(req.method!=='GET') return; const url=new URL(req.url); if(url.origin!==self.location.origin) return; if(url.pathname.endsWith('/version.json')) return; if(req.mode==='navigate'){ event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match(new URL('./index.html',self.registration.scope).href).then(r=>r||caches.match(OFFLINE_URL)))); return; } event.respondWith(caches.match(req).then(c=>c||fetch(req).then(r=>{ if(r.ok && ['basic','cors'].includes(r.type)){ const copy=r.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); } return r; }).catch(()=>caches.match(OFFLINE_URL)))); });
