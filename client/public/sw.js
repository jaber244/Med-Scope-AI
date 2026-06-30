self.addEventListener('install', (e) => {
  console.log('HealthScope SW Installed');
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});