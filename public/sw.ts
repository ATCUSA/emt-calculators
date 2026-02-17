// Enhanced service worker for EMT Calculator Tools - PWA support
// TypeScript version with proper type definitions

declare let self: ServiceWorkerGlobalScope;

// Service Worker Types
// Note: CacheOptions interface reserved for future cache configuration features

interface InstallEvent extends ExtendableEvent {
  waitUntil(f: Promise<any>): void;
}

interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
}

interface ActivateEvent extends ExtendableEvent {
  waitUntil(f: Promise<any>): void;
}

// Version and Cache Configuration
const APP_VERSION: string = '1.2.0';
const CACHE_NAME: string = `emt-calc-v${APP_VERSION}`;
const RUNTIME_CACHE_NAME: string = `emt-calc-runtime-v${APP_VERSION}`;

// Essential files to cache immediately for full offline functionality
const ESSENTIAL_FILES: readonly string[] = [
  '/',
  '/o2-calculator',
  '/igel-calculator',
  '/gcs-calculator',
  '/vital-signs-calculator',
  '/apgar-calculator',
  '/stroke-assessment',
  '/cpap-reference',
  '/iv-catheter-reference',
  '/iv-drip-calculator',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-maskable.png',
  '/icon-512-maskable.png',
  '/apple-touch-icon.png',
  '/icon.svg',
  '/favicon.svg',
  '/favicon.ico'
] as const;

// Additional assets that should be cached (CSS, JS will be handled by runtime caching)
const PRECACHE_URLS: readonly string[] = [
  '/',
  '/o2-calculator/',
  '/o2-calculator/index.html',
  '/igel-calculator/',
  '/igel-calculator/index.html',
  '/gcs-calculator/',
  '/gcs-calculator/index.html',
  '/vital-signs-calculator/',
  '/vital-signs-calculator/index.html',
  '/apgar-calculator/',
  '/apgar-calculator/index.html',
  '/stroke-assessment/',
  '/stroke-assessment/index.html',
  '/vital-signs-reference/',
  '/vital-signs-reference/index.html',
  '/cpap-reference/',
  '/cpap-reference/index.html',
  '/iv-catheter-reference/',
  '/iv-catheter-reference/index.html',
  '/iv-drip-calculator/',
  '/iv-drip-calculator/index.html',
  '/calculators/',
  '/calculators/index.html',
  '/references/',
  '/references/index.html',
  '/about/',
  '/about/index.html'
] as const;

// Install event - cache all essential files and pages for offline use
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[SW] Install event - version', APP_VERSION);

  const installEvent = event as InstallEvent;

  installEvent.waitUntil(
    Promise.all([
      // Cache essential files
      caches.open(CACHE_NAME).then((cache: Cache) => {
        console.log('[SW] Caching essential files');
        return cache.addAll([...ESSENTIAL_FILES, ...PRECACHE_URLS]);
      }),
      // Skip waiting to immediately activate new service worker
      self.skipWaiting()
    ]).then(() => {
      console.log('[SW] All files cached successfully');
    }).catch((error: Error) => {
      console.error('[SW] Failed to cache files during install:', error);
    })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[SW] Activate event - version', APP_VERSION);

  const activateEvent = event as ActivateEvent;

  activateEvent.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames: string[]) => {
        return Promise.all(
          cacheNames.map((cacheName: string) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      }),
      // Immediately claim control of all pages
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Service worker activated and claimed all clients');
    }).catch((error: Error) => {
      console.error('[SW] Activation failed:', error);
    })
  );
});

// Fetch event - serve from cache with fallback strategies
self.addEventListener('fetch', (event: ExtendableEvent) => {
  const fetchEvent = event as FetchEvent;
  const request: Request = fetchEvent.request;
  const url: URL = new URL(request.url);

  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || !url.hostname.includes('localhost') && !url.hostname.includes('emt-calc')) {
    return;
  }

  fetchEvent.respondWith(
    handleRequest(request)
      .catch((error: Error) => {
        console.error('[SW] Fetch handler error:', error);
        return new Response('Offline - content not available', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// Request handling strategy
async function handleRequest(request: Request): Promise<Response> {
  const url: URL = new URL(request.url);
  const pathname: string = url.pathname;

  try {
    // Try cache first for essential files and pages
    if (isEssentialResource(pathname)) {
      const cachedResponse: Response | undefined = await caches.match(request);
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', pathname);
        return cachedResponse;
      }
    }

    // Try network first for dynamic content
    console.log('[SW] Attempting network request for:', pathname);
    const networkResponse: Response = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok && shouldCache(request)) {
      const cache: Cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request.clone(), networkResponse.clone()).catch((error: Error) => {
        console.warn('[SW] Failed to cache response:', error);
      });
    }

    return networkResponse;

  } catch (networkError) {
    console.log('[SW] Network failed, trying cache for:', pathname);

    // Fallback to cache
    const cachedResponse: Response | undefined = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse: Response | undefined = await caches.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }

    throw networkError;
  }
}

// Check if a resource is essential and should be cached
function isEssentialResource(pathname: string): boolean {
  return ESSENTIAL_FILES.some((file: string) => pathname === file || pathname === file + '/') ||
         PRECACHE_URLS.some((url: string) => pathname === url || pathname === url.replace(/\/$/, ''));
}

// Determine if a request should be cached
function shouldCache(request: Request): boolean {
  const url: URL = new URL(request.url);
  const pathname: string = url.pathname;

  // Don't cache external resources
  if (!url.hostname.includes('localhost') && !url.hostname.includes('emt-calc')) {
    return false;
  }

  // Cache static assets
  if (pathname.match(/\.(js|css|png|svg|jpg|jpeg|gif|webp|woff2?|ttf|eot)$/)) {
    return true;
  }

  // Cache pages and API endpoints
  if (pathname.endsWith('/') || pathname.includes('calculator') || pathname.includes('about')) {
    return true;
  }

  return false;
}

// Handle messages from the main app
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  const data = event.data;

  if (data?.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }

  if (data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({
      type: 'VERSION_INFO',
      version: APP_VERSION,
      cacheNames: [CACHE_NAME, RUNTIME_CACHE_NAME]
    });
  }
});

// Export version for external access
export { APP_VERSION, CACHE_NAME };