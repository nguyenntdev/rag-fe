// Service Worker for Heritage Web PWA
// Version: 1.0.0

const CACHE_NAME = 'heritage-web-v1';
const RUNTIME_CACHE = 'heritage-runtime-v1';
const IMAGE_CACHE = 'heritage-images-v1';
const DATA_CACHE = 'heritage-data-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/vite.svg',
  '/logo.png'
];

// API endpoints to cache
const API_CACHE_URLS = [
  '/api/heritages',
  '/api/festivals',
  '/api/people',
  '/api/quiz'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Precaching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Install complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Precache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, DATA_CACHE];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => !currentCaches.includes(cacheName))
            .map((cacheName) => {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

// Check if request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);
  return request.destination === 'image' ||
         /\.(jpg|jpeg|png|gif|webp|svg|avif|ico)$/i.test(url.pathname);
}

// Check if request is for API
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

// Check if request is a navigation request
function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         request.destination === 'document';
}

// Handle image requests - cache first, then network
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Return cached image and update cache in background
    updateImageCache(request, cache);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[ServiceWorker] Image fetch failed:', error);
    // Return a placeholder image or empty response
    return new Response('', {
      status: 404,
      statusText: 'Image not found'
    });
  }
}

// Update image cache in background
async function updateImageCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silently fail - we already have cached version
  }
}

// Handle API requests - network first, fallback to cache
async function handleAPIRequest(request) {
  const cache = await caches.open(DATA_CACHE);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] API fetch failed, trying cache:', request.url);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline data response
    return new Response(JSON.stringify({
      error: 'offline',
      message: 'Không có kết nối mạng. Dữ liệu không khả dụng.',
      messageEn: 'No network connection. Data not available.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle navigation requests - network first, fallback to cached index.html or offline page
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful navigation responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] Navigation fetch failed, trying cache...');
    const cache = await caches.open(CACHE_NAME);

    // Try to serve cached version of the requested page
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to cached index.html for SPA routing
    const indexResponse = await cache.match('/index.html');
    if (indexResponse) {
      return indexResponse;
    }

    // Last resort: serve offline page
    const offlineResponse = await cache.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }

    return new Response('Offline - Page not available', {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle static asset requests - stale-while-revalidate
async function handleStaticRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);

  // Start fetching from network
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  // Return cached response if available, otherwise wait for network
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }

  return new Response('Resource not available offline', {
    status: 503
  });
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }

  if (event.data && event.data.type === 'CACHE_DATA') {
    event.waitUntil(cacheOfflineData(event.data.data));
  }
});

// Cache offline data
async function cacheOfflineData(data) {
  const cache = await caches.open(DATA_CACHE);

  if (data.heritages) {
    const heritagesResponse = new Response(JSON.stringify(data.heritages));
    await cache.put('/api/heritages', heritagesResponse);
  }

  if (data.festivals) {
    const festivalsResponse = new Response(JSON.stringify(data.festivals));
    await cache.put('/api/festivals', festivalsResponse);
  }

  if (data.people) {
    const peopleResponse = new Response(JSON.stringify(data.people));
    await cache.put('/api/people', peopleResponse);
  }

  if (data.quiz) {
    const quizResponse = new Response(JSON.stringify(data.quiz));
    await cache.put('/api/quiz', quizResponse);
  }

  console.log('[ServiceWorker] Offline data cached successfully');
}

// Background sync for deferred actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

async function syncUserData() {
  // Placeholder for syncing user data when back online
  console.log('[ServiceWorker] Syncing user data...');
}

// Push notification handling (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || 'Có thông tin mới về di sản văn hóa',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      },
      actions: [
        {
          action: 'view',
          title: 'Xem ngay'
        },
        {
          action: 'close',
          title: 'Đóng'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Di sản Văn hóa Cà Mau',
        options
      )
    );
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // Check if there is already a window/tab open with the target URL
          for (const client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // If not, open a new window/tab
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});
