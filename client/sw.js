const CACHE_NAME = 'uhome-v1';
const STATIC_ASSETS = [
  './',
  './glav.html',
  './chat.html',
  './profile.html',
  './neighbor.html',
  './news.html',
  './rules.html',
  './css/style.css',
  './css/chat.css',
  './css/profile.css',
  './js/glav.js',
  './js/chat.js',
  './js/profile.js'
];

// Установка: кэшируем статику
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Активация: удаляем старые кэши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Запросы: сначала кэш, потом сеть
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('./glav.html'));
    })
  );
});