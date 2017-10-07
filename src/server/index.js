const restify = require('restify');
const topRoute = require('./routes/top');

const PORT = process.env.PORT || 8000;

const server = restify.createServer({
    name: 'skate-hnpwa',
    version: '1.0.0'
});
server.use(restify.plugins.queryParser());

server.get('/api/top', async (req, res, next) => {
    let { from = 0, amount = 30 } = req.query;
    let result = await topRoute.getItems({ from, amount });
    res.send(result);
    return next();
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
