console.log(`hi, is it me you're looking for?`);

const baseUrl = self.location.origin;
const ourCacheNames = {
    ITEMS: 'skate-hnpwa-items',
    LISTS: 'skate-hnpwa-list'
}

workbox.core.setCacheNameDetails({prefix: 'skate-hnpwa'});

workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerRoute(
    new RegExp(`^${baseUrl}/api/item/(\\d+)`),
    workbox.strategies.cacheFirst({
        cacheName: ourCacheNames.ITEMS,
    }),
    'GET'
);

workbox.routing.registerRoute(
    new RegExp(`^${baseUrl}/api/(?!item)`),
    workbox.strategies.staleWhileRevalidate({
        cacheName: ourCacheNames.LISTS,
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [200]
            }),
            {
            // Take the collection of items returned in the list response, then individually
            // cache each item in the collection.
            // todo: set appropriate cache + date headers in the request and response objects.
            // note: I'm using cacheWillUpdate instead of cacheDidUpdate because of a bug in workbox.
            // see: https://github.com/GoogleChrome/workbox/issues/1515
            cacheWillUpdate: babelHelpers.asyncToGenerator(
                function* ({ request, response }) {
                    const cachedResponse = response && response.clone();
                    if (!cachedResponse) {
                        return;
                    }

                    const newResponse = cachedResponse.clone()
                    const data = yield cachedResponse.json();
                    if (data && data.items) {
                        const cache = yield caches.open(ourCacheNames.ITEMS);
                        for (let i = 0, ii = data.items.length; i < ii; i++) {
                            let item = data.items[i];
                            let body = JSON.stringify(item);
                            let { headers, referrerPolicy, vary } = request;
                            let req = new Request(`${baseUrl}/api/item/${item.id}`, {
                                headers,
                                referrer: `/item/${item.id}`,
                                referrerPolicy,
                                vary,
                            });
                            let res = new Response(body, {
                                headers: new Headers({
                                    'Content-Type': 'application/json',
                                    'Content-Length': body.length,
                                    'Date': new Date().toUTCString(),
                                })
                            });
                            cache.put(req, res);
                        }
                    }

                    return newResponse;
                }
            ),
        }]
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
