import { html } from 'lit-html';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';
import NewsList from './news-list';
import NewsItem from './news-item';
import { menuItems, routes } from '../routing/routes';
import router from '../routing/router';
import './news-app.css';

export default class NewsApp extends BaseComponent {
    static is = 'hnpwa-app'
    state = {
        result: html`<p class="loading">Awaiting orders</p>`,
    }
    constructor() {
        super();
        const result = (htmlResult) => {
            this.state.result = htmlResult;
            this.updated();
        }

        // Set up the routes to render stuff.
        menuItems.forEach(function({id, path}) {
            router.handle(`${path}/:start?`, (ctx) => result(html`<hnpwa-list type="${id}" start="${ctx.params.start}" />`));
        });
        router.handle(routes.root.path, () => result(html`<hnpwa-list type="top" />`));
        router.handle(routes.item.path, (ctx) => result(html`<hnpwa-item id="${ctx.params.id}" />`));
    }
    connected() {
        router.start();
    }
    disconnected() {
        router.stop();
    }
    render({ state }) {
        return html`
        <header id="header">
            <nav id="navigation">
                <ul>
                    ${menuItems.map(({title, path}) => {
                        let selected = (router.current === path);
                        return html`
                        <li>
                            <a class="${selected ? 'selected' : '' }" href="${path}">${title}</a>
                        </li>
                        `
                    })}
                </ul>
            </nav>
        </header>
        <section id="content">
            ${state.result}
        </section>
        `
    }
}

define(NewsApp);
