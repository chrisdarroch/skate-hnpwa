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

[1]: https://skatejs.netlify.com/
[2]: https://hnpwa.com/
[101]: https://nodejs.org
[102]: https://yarnpkg.com
