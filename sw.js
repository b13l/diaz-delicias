const CACHE = 'diaz-pdv-v2';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => 
      c.add('./DiazDelicias_PDV.html').catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Ignorar requests que não sejam http/https (ex: chrome-extension)
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    fetch(e.request)
      .then(resp => {
        // Só cachear respostas válidas de http/https
        if (resp && resp.status === 200 && e.request.url.startsWith('http')) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone).catch(() => {}));
        }
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
