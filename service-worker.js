const CACHE_NAME = 'capsulo-v15';
const STATIC = [
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(STATIC);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('message', function(e){
  if(e.data && e.data.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', function(e){
  var url = e.request.url;

  // API calls — always network
  if(url.includes('supabase.co') || url.includes('anthropic.com')){
    e.respondWith(fetch(e.request).catch(function(){
      return new Response('{}', {headers:{'Content-Type':'application/json'}});
    }));
    return;
  }

  // index.html — network first, cache fallback
  // questo garantisce che gli aggiornamenti arrivino subito
  if(url.includes('capsulo.netlify.app') || url.endsWith('/') || url.endsWith('/index.html')){
    e.respondWith(
      fetch(e.request).then(function(response){
        // aggiorna la cache con la versione fresca
        var clone=response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(e.request, clone); });
        return response;
      }).catch(function(){
        // offline: usa cache
        return caches.match(e.request).then(function(cached){
          return cached || caches.match('/index.html');
        });
      })
    );
    return;
  }

  // CDN assets — cache first (non cambiano mai)
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).then(function(response){
        var clone=response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(e.request, clone); });
        return response;
      });
    }).catch(function(){
      return caches.match('/index.html');
    })
  );
});
