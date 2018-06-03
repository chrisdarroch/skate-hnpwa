console.log(`hi, is it me you're looking for?`);

const baseUrl = self.location.origin;

workbox.core.setCacheNameDetails({prefix: 'skate-hnpwa'});

workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerRoute(
    new RegExp(`^${baseUrl}/api/`),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "skate-hnpwa-data",
        plugins: []
    }),
    'GET'
);

// todo: pull from routes/index.js ...
// the problem is this file isn't currently compiled via webpack, and
// the google workbox plugin doesn't allow setting an entrypoint as the sw entry. Weird.
// note: the route whitelist and blacklist are matched on pathname + search,
//       whereas normal routes are matched on the full URL.
//       This incongruity seems odd.
// see: https://github.com/GoogleChrome/workbox/issues/1514
const appRoutes = [
    new RegExp(`^/?$`),
    new RegExp(`^/(top|new|best|show|ask|job)/?$`),
    new RegExp(`^/item/(\\d+)/?$`),
];
workbox.routing.registerNavigationRoute('/index.html', {
    whitelist: appRoutes
});
