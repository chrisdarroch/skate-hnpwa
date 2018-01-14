const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware')

const PORT = process.env.PORT || 8000;

// A helper function that constructs the route handler for a given
// type of HN story list. Extracts # of items and starting point for
// retrieving stories at, then defers to the route and responds async
// with appropriate JSON (or throws an interesting Error).
function respondWith(route) {
    return async (req, res, next) => {
        let { from = 0, amount = 30 } = req.query;
        let result = await route.getItems({ from, amount });
        res.send(result);
        return next();
    }
}

// Create the REST server. Allow parsing of params in the URL search string.
const server = restify.createServer({
    name: 'skate-hnpwa',
    version: '1.0.0'
});
server.use(restify.plugins.queryParser());

// Allow CORS requests during development to allow the server and client to
// be controlled by different services (e.g., webpack-dev-server for the UI)
const cors = corsMiddleware({
    origins: [
        'http://localhost',
        'http://localhost:8080',
    ],
});
server.pre(cors.preflight);
server.use(cors.actual);

// Construct the API routes for retrieving HN story lists
['top', 'new', 'best', 'ask', 'show', 'job'].forEach(type => {
    let route = `/api/${type}`;
    let router = require(`./routes/${type}`);
    server.get(route, respondWith(router));
});

// Start the server!
server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
