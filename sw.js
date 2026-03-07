// sw.js: Service Worker para Caché Offline de la app (PWA)

const CACHE_NAME = 'jamaica-cache-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/base.css',
    '/css/layout.css',
    '/css/components.css',
    '/css/modals.css',
    '/js/app.js',
    '/js/admin.js',
    '/js/cart.js',
    '/js/pdf.js',
    '/js/products.js',
    '/js/state.js',
    '/js/ui.js',
    '/productos.json'
];

// Instalamos el Service Worker y abrimos el Caché
self.addEventListener('install', event => {
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
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - devuelve la respuesta
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Actualizando Caché (Limpieza de versiones antiguas)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
