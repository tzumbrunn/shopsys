importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

workbox.setConfig({
    debug: true
});

workbox.precaching.precacheAndRoute([
    '/pages/offline.html',
    '/pages/404.html',
], {
    directoryIndex: null,
    cleanUrls: false,
});

// Cache js files via  cacheFirst strategy with js-cache name
workbox.routing.registerRoute(
    /\.(?:js|json).*$/,
    new workbox.strategies.CacheFirst({
        cacheName: 'js-cache',
    })
);

// Cache css and fonts files via  cacheFirst strategy with css-cache name
workbox.routing.registerRoute(
    /\.(?:css|woff).*$/,
    new workbox.strategies.CacheFirst({
        // Use a custom cache name.
        cacheName: 'css-cache',
    })
);

// Cache images files via  cacheFirst strategy with image-cache name
workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif).*$/,
    new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                // Cache only 20 images.
                maxEntries: 20,
                // Cache for a maximum of a week.
                maxAgeSeconds: 7 * 24 * 60 * 60,
            })
        ],
    })
);

const allPagesHandler = new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'pages-cache',
    plugins: [
        new workbox.cacheableResponse.Plugin({
            statuses: [0, 200],
        })
    ]
});

    workbox.routing.registerRoute(new RegExp('^((?!wdt).)*$'), args => {
    return allPagesHandler.handle(args).then(response => {
        if (response.status === 404) {
            return caches.match('pages/404.html');
        }
        return response;
    }).catch(() => {
        return caches.match('pages/offline.html');
    });
});

// Push notification listener
self.addEventListener('push', event => {
    const title = 'Push notification alert';
    const options = {
        body: event.data.text(),
        icon: 'assets/frontend/images/favicon-32x32.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            { action: 'explore', title: 'Explore this new world' },
            { action: 'close', title: 'Close' },
        ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Enable background sync
const queue = new workbox.backgroundSync.Queue('backgroundSyncQueue');
self.addEventListener('fetch', event => {
    const promiseChain = fetch(event.request.clone())
        .catch(err => {
            if (event.request.url.includes(('_wdt'))) {
                return;
            }

            console.log(err);
            return queue.pushRequest({request: event.request});
        });
    event.waitUntil(promiseChain);
});