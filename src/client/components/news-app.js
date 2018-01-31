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
        this.renderRoot.addEventListener('click', e => {
            let el = e.target;
            if (el && el.nodeName === 'A') {
                e.preventDefault();
                let [match, route, id] = routes.exec(el.getAttribute('href'));
                if (route === 'item') {
                    this.state.item = { id };
                } else {
                    this.state.item = undefined;
                }
                this.state.route = route;
                this.updated();
            }
        });
    }
    disconnected() {
        this.renderRoot.removeEventListener('click');
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
        ${state.item
            ? html`<hnpwa-item id="${state.item.id}" />`
            : html`<hnpwa-list type="${state.route}" />`
        }
        `
    }
}

define(NewsApp);
