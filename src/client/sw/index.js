console.log(`hi, is it me you're looking for?`);

workbox.core.setCacheNameDetails({prefix: 'skate-hnpwa'});

workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerRoute(
    /^http:\/\/localhost:8000\/api\//,
    workbox.strategies.staleWhileRevalidate({
        cacheName: "skate-hnpwa-data",
        plugins: []
    }),
    'GET'
);
