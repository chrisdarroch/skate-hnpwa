# Skate.js HNPWA

An demonstration of how to use [Skate.js][1] to implement an [HNPWA][2]
(aka: a HackerNews Progressive Web App).

## Running locally

The project is set up to use:

* [Node][101] version 8.x or 9.x
* [Yarn][102] version 1.x

After installing the various project dependencies via `yarn install`,
you can run `yarn start`, which will:

1. Build the front-end using Webpack, then
2. Run the front-end at http://localhost:8080, and
3. Boot up a REST server at http://localhost:8000 (for serving hackernews data)

## Developing locally

If you want to develop the client-side code, you can run `yarn start/dev`. This
does largely the same things as `yarn start`, except it will run webpack in watch mode.

As you make changes to the client-side code, you will need to save and reload the browser.
Be sure to clear your browser cache to clear out the old Service Worker.

This project does not use `webpack-dev-server` to develop the client-side, so there's
no hot module reloading. This is because of a tradeoff between using `sw-precache` as
a basis for our Service Worker as built through Webpack: the files that the SW should cache
must exist on the filesystem, but `webpack-dev-server` keeps file contents in-memory.

## A breakdown of the app

### The good

Skate's helpers for stamping out custom elements and hooking up props in an element's
lifecycle make building web components pretty joyful. It gets out of the way, and focus can go
straight to the application logic.

Using lit-html has been great too, given its extended helpers for rendering in response to
a Promise object resolving or rejecting.

### The bad

The local server I created for this app was not well considered. As such, many of the
requests are merely a pass-through of the responses received from the hackernews firebase API,
except with a short-term cache, but no real consideration of how or when this data should be
invalidated.

### The ugly

With a local server, single-page app client, and a service worker, the business logic
for routes and navigation is strewn across three discrete places. Each place handles routing
and HTTP responses differently. In terms of staying DRY, this has been the single largest source of pain.

The benefit of a PWA is in how well it handles "error states" -- whether it lets you
consume content or use the application when things aren't ideal. This requires careful architectural
planning. Throwing Google's Workbox at this part of the problem before thinking through
the problem space has led to architectural rigidity and a sub-par user experience.
Some re-thinking for the service worker and HTTP responses is required to make this app more
usable when offline, as well as when the app code updates.

## Incomplete things

* All caching needs to be reconsidered. Attention needs to be paid to:
    * The HTTP response headers from the hackernews firebase API.
* When app code updates (e.g., the skeleton CSS), the service worker should update its version, too.

[1]: https://skatejs.netlify.com/
[2]: https://hnpwa.com/
[101]: https://nodejs.org
[102]: https://yarnpkg.com
