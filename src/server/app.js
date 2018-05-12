const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');
const path = require('path');

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
        if (ctx.params && ctx.params.hasOwnProperty('from')) {
            from = ctx.params.from;
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
            let item = getItem(ctx.params.id);
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

// Serve the index page and raw assets
(function() {
    const staticFolder = path.resolve(process.cwd(), 'public');
    app.use(KoaStatic(staticFolder));
}());

// middleware: x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// middleware: logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - HTTP ${ctx.response.status} - ${ms}ms`);
});

// Register all the things
app.use(router.routes())
app.use(router.allowedMethods());

// Start the server!
app.listen(PORT);
