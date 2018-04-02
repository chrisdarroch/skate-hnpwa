import page from 'page';

const routeHandlers = {};
const missing = () => console.warn('No idea how to handle that route, mate!');

export default {
    current: () => page.current,
    start: () => page.start({ click: false, dispatch: true, popstate: true }),
    stop: () => page.stop(),
    show: (path) => page.show(path),
    handle: function (path, handler = missing) {
        return page(path, handler);
    },
};
