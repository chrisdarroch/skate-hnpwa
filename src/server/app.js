const Koa = require('koa');
const KoaRouter = require('koa-router');
const PORT = process.env.PORT || 8080;

// Spin some things up
const app = new Koa();
const router = new KoaRouter();

// Construct the API routes for retrieving HN story lists
['top', 'new', 'best', 'ask', 'show', 'job'].forEach(type => {
    const handler = require(`./routes/${type}`);
    const responder = async (ctx, next) => {
        let req = ctx.request;
        let res = ctx.response;
        let { from = 0, amount = 30 } = req.query;
        if (req.params && req.params.hasOwnProperty('from')) {
            from = req.params.from;
        }
        try {
            let result = await handler.getItems({ from, amount });
            res.body = result;
        } catch (e) {
            console.error("something went wrong serving the request for", req.url.href, e);
            res.status = 500;
            res.body = JSON.stringify({message: e.message});
        }
        await next();
    };
    router.get(`/api/${type}`, responder);
    router.get(`/api/${type}/:from`, responder);
});

// Construct a route for retrieving individual news stories
(function () {
    const getItem = require('./routes/item');
    const responder = async (ctx, next) => {
        let req = ctx.request;
        let res = ctx.response;
        try {
            let item = getItem(req.params.id);
            let result = await item.getArticle();
            res.body = result;
        } catch (e) {
            console.error("something went wrong serving the request for", req.url.href, e);
            res.status = 500;
            res.body = JSON.stringify({message: e.message});
        }
        await next();
    };
    router.get('/api/item/:id', responder);
}());

// Register all the things
app.use(router.routes())
app.use(router.allowedMethods());

// Start the server!
app.listen(PORT);
