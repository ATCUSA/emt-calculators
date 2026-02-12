// Enhanced service worker for EMT Calculator Tools - PWA support
const APP_VERSION = '1.2.0';
const CACHE_NAME = `emt-calc-v${APP_VERSION}`;
const RUNTIME_CACHE_NAME = `emt-calc-runtime-v${APP_VERSION}`;

// Essential files to cache immediately for full offline functionality
const ESSENTIAL_FILES = [
  '/',
  '/o2-calculator',
  '/igel-calculator',
  '/gcs-calculator',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-maskable.png',
  '/icon-512-maskable.png',
  '/apple-touch-icon.png',
  '/icon.svg',
  '/favicon.svg',
  '/favicon.ico'
];

// Additional assets that should be cached (CSS, JS will be handled by runtime caching)
const PRECACHE_URLS = [
  '/',
  '/o2-calculator/',
  '/o2-calculator/index.html',
  '/igel-calculator/',
  '/igel-calculator/index.html',
  '/gcs-calculator/',
  '/gcs-calculator/index.html',
  '/calculators/',
  '/calculators/index.html',
  '/references/',
  '/references/index.html',
  '/about/',
  '/about/index.html'
];

// Install event - cache all essential files and pages for offline use
self.addEventListener('install', (event) => {
  console.log('[SW] Install event - version', APP_VERSION);
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);

        // Cache essential assets first
        console.log('[SW] Caching essential files...');
        await cache.addAll(ESSENTIAL_FILES);

        // Cache all important pages for offline use
        console.log('[SW] Precaching all pages for offline use...');
        await cache.addAll(PRECACHE_URLS);

        console.log('[SW] All essential content cached for offline use');
      } catch (error) {
        console.error('[SW] Failed to cache files:', error);
        // Log specific failed URLs
        for (const url of [...ESSENTIAL_FILES, ...PRECACHE_URLS]) {
          try {
            await fetch(url);
          } catch (fetchError) {
            console.error('[SW] Failed to fetch:', url, fetchError);
          }
        }
      }
    })()
  );
  // Take control immediately
  self.skipWaiting();
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event - version', APP_VERSION);
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(cacheName =>
        cacheName.startsWith('emt-calc-') &&
        cacheName !== CACHE_NAME &&
        cacheName !== RUNTIME_CACHE_NAME
      );

      await Promise.all(
        oldCaches.map(cacheName => {
          console.log('[SW] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })()
  );
  // Take control of all clients
  self.clients.claim();
});

// Fetch event - enhanced caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and non-GET requests
  if (url.origin !== self.location.origin || request.method !== 'GET') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (request.destination === 'document') {
    // Pages: Network first, cache fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (request.destination === 'script' || request.destination === 'style') {
    // JS/CSS: Cache first for performance
    event.respondWith(cacheFirstStrategy(request));
  } else if (request.destination === 'image') {
    // Images: Cache first with longer TTL
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // Everything else: Network first
    event.respondWith(networkFirstStrategy(request));
  }
});

// Network-first strategy for dynamic content
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.status === 200) {
      // Cache successful responses
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[SW] Network failed, trying cache for:', request.url);

    // Try exact match first
    let cachedResponse = await caches.match(request);

    // If no exact match, try common variations for SPA routing
    if (!cachedResponse && request.destination === 'document') {
      const url = new URL(request.url);
      const possibleMatches = [
        url.pathname,
        url.pathname + '/',
        url.pathname + '/index.html',
        url.pathname.replace(/\/$/, '') + '/index.html'
      ];

      for (const path of possibleMatches) {
        cachedResponse = await caches.match(path);
        if (cachedResponse) {
          console.log('[SW] Found cached page variant:', path);
          break;
        }
      }
    }

    if (cachedResponse) {
      return cachedResponse;
    }

    // If page request and no cache, return offline fallback
    if (request.destination === 'document') {
      const fallbackResponse = await caches.match('/');
      if (fallbackResponse) {
        console.log('[SW] Serving homepage as fallback for offline page');
        return fallbackResponse;
      }
    }

    throw error;
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache and network both failed for:', request.url);
    throw error;
  }
}

// Background cache update
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

// Show a message when the app is ready to work offline
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Show install prompt for PWA
self.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  // Store the event for later use
  self.deferredPrompt = event;
});

// Handle notification clicks (for future push notification support)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open-calculator') {
    event.waitUntil(
      clients.openWindow('/o2-calculator')
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle push messages (for future push notification support)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192.png',
    badge: '/icon-192-maskable.png',
    actions: [
      {
        action: 'open-calculator',
        title: 'Open Calculator'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('EMT Calculator Tools', options)
  );
});