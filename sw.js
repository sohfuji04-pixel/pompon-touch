// オフラインでも遊べるようにするサービスワーカー（ネット優先・つながらない時はキャッシュ）
const CACHE='pompon-v1';
const CORE=['./','index.html','app.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','icons/favicon-32.png'];
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{})); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET') return;
  if(u.origin===location.origin&&u.pathname.endsWith('version.json')) return;
  const key=u.origin===location.origin?new Request(u.origin+u.pathname):e.request;
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(key,cp)); } return r; })
    .catch(()=>caches.match(key,{ignoreSearch:true}).then(r=>r||caches.match(new Request(u.origin+(u.pathname.replace(/[^/]*$/,'')+'app.html'))))));
});
