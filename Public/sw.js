// Service Worker for Fast Navigation
const CACHE_NAME = 'manvaasam-fast-nav-v1';
const STATIC_CACHE_NAME = 'manvaasam-static-v1';

// Critical routes to cache for instant navigation
const CRITICAL_ROUTES = [
  '/',
  '/login/farmer',
  '/login/transport',
  '/login/retail',
  '/dashboard/retail',
  '/dashboard/transport',
  '/privacy',
  '/terms',
  '/support'
];

// Static assets to cache
const STATIC_ASSETS = [
  '/bg-agri.png',
  '/manifest.json',
  '/_next/static/css/',
  '/_next/static/js/'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache critical routes
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(CRITICAL_ROUTES);
      }),
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS.filter(asset => !asset.includes('/')));
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache for instant navigation
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests (page loads)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache immediately
          fetch(request).then((networkResponse) => {
            // Update cache in background
            if (networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse.clone());
              });
            }
          }).catch(() => {
            // Network failed, cached version is still good
          });
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            // Cache successful responses
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Handle static assets
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.includes('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Handle prefetch requests for instant navigation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PREFETCH_ROUTE') {
    const { route } = event.data;
    
    // Prefetch and cache the route
    fetch(route).then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(route, response);
        });
      }
    }).catch(() => {
      // Prefetch failed, ignore
    });
  }
});

// Background sync for offline navigation
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync critical routes when back online
      Promise.all(
        CRITICAL_ROUTES.map((route) => {
          return fetch(route).then((response) => {
            if (response.ok) {
              return caches.open(CACHE_NAME).then((cache) => {
                return cache.put(route, response);
              });
            }
          }).catch(() => {
            // Sync failed, will retry
          });
        })
      )
    );
  }
});