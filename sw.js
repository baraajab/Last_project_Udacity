// Cache names
const CACHE_NAME = 'travel-planner-v1';
const API_CACHE_NAME = 'travel-planner-api-v1';
const IMG_CACHE_NAME = 'travel-planner-images-v1';

// Assets to cache immediately
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/main.js',
  '/main.css',
  '/js/app.js'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(CACHE_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  self.clients.claim();
  
  // Remove old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && 
              cache !== API_CACHE_NAME && 
              cache !== IMG_CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  // Handle API requests
  if (event.request.url.includes('/tripData') || 
      event.request.url.includes('api.geonames.org') || 
      event.request.url.includes('api.weatherbit.io')) {
    
    event.respondWith(
      caches.open(API_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // Cache a copy of the response
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => {
            // If network fails, try to serve from cache
            return caches.match(event.request);
          });
      })
    );
  }
  // Handle image requests
  else if (event.request.url.includes('pixabay.com') || 
           event.request.destination === 'image') {
    
    event.respondWith(
      caches.open(IMG_CACHE_NAME).then(cache => {
        return caches.match(event.request)
          .then(cachedResponse => {
            // Return cached response if available
            if (cachedResponse) {
              return cachedResponse;
            }

            // Otherwise fetch from network
            return fetch(event.request).then(networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
      })
    );
  }
  // Handle other requests (HTML, CSS, JS)
  else {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          return cachedResponse || fetch(event.request)
            .then(response => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseClone);
                });
              }
              return response;
            });
        })
        .catch(() => {
          // Return the offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        })
    );
  }
});