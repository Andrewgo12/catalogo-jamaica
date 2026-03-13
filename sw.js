// sw.js: Service Worker para Caché Offline de la app (PWA)

const CACHE_NAME = 'jamaica-cache-v20260313155400';
const urlsToCache = [
    './',
    './index.html',
    './css/base.css',
    './css/animations.css',
    './css/components.css',
    './css/modals.css',
    './css/responsive.css',
    './js/app.js',
    './js/admin.js',
    './js/cart.js',
    './js/pdf.js',
    './js/products.js',
    './js/state.js',
    './js/ui.js',
    './productos.json',
    './manifest.json'
];

// Instalamos el Service Worker y abrimos el Caché
self.addEventListener('install', event => {
    // Forzar activación inmediata saltando la espera
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Respondiendo con Caché cuando estemos offline
self.addEventListener('fetch', event => {
    const isJsonData = event.request.url.includes('productos.json');

    if (isJsonData) {
        // Para productos.json: NETWORK FIRST
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    } else {
        // Resto de los archivos: CACHE FIRST
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(networkResponse => {
                        return networkResponse;
                    }).catch(() => {
                        // Si falla la red y no hay caché, devolver respuesta vacía
                        return new Response('', { status: 408, statusText: 'Offline' });
                    });
                })
        );
    }
});

// Actualizando Caché (Limpieza de versiones antiguas)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Borrando caché antiguo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('SW: Controlando clientes inmediatamente');
            // Tomar el control de todas las pestañas abiertas inmediatamente
            return self.clients.claim();
        })
    );
});
