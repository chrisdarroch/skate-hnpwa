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

// todo: pull from routes/index.js ...
// the problem is this file isn't currently compiled via webpack, and
// the google workbox plugin doesn't allow setting an entrypoint as the sw entry. Weird.
const appRoutes = [
    new RegExp('/'),
    new RegExp('/(top|new|best|show|ask|job)/?'),
    new RegExp('/item/([^/]*)/?'),
];
workbox.routing.registerNavigationRoute('/index.html', {
    whitelist: appRoutes
});
