const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware')

const PORT = process.env.PORT || 8000;

function respondWith(route) {
    return async (req, res, next) => {
        let { from = 0, amount = 30 } = req.query;
        let result = await route.getItems({ from, amount });
        res.send(result);
        return next();
    }
}

const server = restify.createServer({
    name: 'skate-hnpwa',
    version: '1.0.0'
});
server.use(restify.plugins.queryParser());

const cors = corsMiddleware({
    origins: [
        'http://localhost',
        'http://localhost:8080',
    ],
});

server.pre(cors.preflight);
server.use(cors.actual);

['top', 'new', 'best', 'ask', 'show', 'job'].forEach(type => {
    let router = require(`./routes/${type}`);
    server.get(`/api/${type}`, respondWith(router));
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
