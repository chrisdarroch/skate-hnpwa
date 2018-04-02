import routes from '../../routes';

const menuItems = Object.keys(routes)
    .filter(route => routes[route].menu)
    .map(route => routes[route]);

export { menuItems, routes };
