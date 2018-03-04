import { html } from 'lit-html';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';
import NewsList from './news-list';
import NewsItem from './news-item';
import './news-app.css';

const menu = [
    ['top', 'Hacker News'],
    ['new', 'Newest'],
    ['best', 'Best'],
    ['show', 'Show'],
    ['ask', 'Ask'],
    ['job', 'Jobs']
];

const routes = new RegExp("^/(.*?)(?:/(.*?)$|$)");

export default class NewsApp extends BaseComponent {
    static is = 'hnpwa-app'
    state = {
        route: 'top'
    }
    connected() {
        window.history.replaceState(this.state, 'Skate HNPWA', window.location.href);
        this.renderRoot.addEventListener('click', e => {
            let el = e.target;
            if (el && el.matches('a[href^="/"]')) {
                const href = el.getAttribute('href');
                const [match, route, id] = routes.exec(href);
                if (route) {
                    if (route === 'item') {
                        this.state.item = { id };
                    } else {
                        this.state.item = undefined;
                    }
                    if (route !== this.state.route) {
                        this.state.route = route;
                        window.history.pushState(this.state, 'Skate HNPWA', href);
                    }
                }
                this.updated();
                e.preventDefault();
            }
        });
        window.onpopstate = (e) => {
            const state = e.state;
            if (state) {
                this.state = state;
                this.updated();
            }
        }
    }
    disconnected() {
        this.renderRoot.removeEventListener('click');
        window.onpopstate = undefined;
    }
    render({ state }) {
        return html`
        <header id="header">
            <nav id="navigation">
                <ul>
                    ${menu.map(([url, name]) => {
                        let selected = (state.route === url);
                        return html`
                        <li>
                            <a class="${selected ? 'selected' : '' }" href="/${url}">${name}</a>
                        </li>
                        `
                    })}
                </ul>
            </nav>
        </header>
        <section id="content">
        ${state.item
            ? html`<hnpwa-item id="${state.item.id}" />`
            : html`<hnpwa-list type="${state.route}" />`
        }
        </section>
        `
    }
}

define(NewsApp);
