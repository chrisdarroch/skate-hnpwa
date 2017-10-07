const restify = require('restify');
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

['top', 'new', 'best', 'ask', 'show', 'job'].forEach(type => {
    let router = require(`./routes/${type}`);
    server.get(`/api/${type}`, respondWith(router));
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
