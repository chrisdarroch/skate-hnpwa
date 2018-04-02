const routeList = [
    { id: 'item', title: 'Item', path: '/item/:id' },
    { id: 'top', title: 'Top', path: '/top', menu: true },
    { id: 'new', title: 'Newest', path: '/new', menu: true },
    { id: 'best', title: 'Best', path: '/best', menu: true },
    { id: 'show', title: 'Show', path: '/show', menu: true },
    { id: 'ask', title: 'Ask', path: '/ask', menu: true },
    { id: 'job', title: 'Jobs', path: '/job', menu: true },
    { id: 'root', title: 'Hacker News', path: '/' },
];

// Index by ID for ease of access.
const routes = {};
routeList.forEach(route => routes[route.id] = route);

export default routes;
