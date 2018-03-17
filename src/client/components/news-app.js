import { html } from 'lit-html';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';
import NewsList from './news-list';
import NewsItem from './news-item';
import { Router, Route, Link } from './routing';
import './news-app.css';

const menu = [
    ['top', 'Hacker News'],
    ['new', 'Newest'],
    ['best', 'Best'],
    ['show', 'Show'],
    ['ask', 'Ask'],
    ['job', 'Jobs']
];

export default class NewsApp extends BaseComponent {
    static is = 'hnpwa-app'
    state = {
        route: 'top'
    }
    render({ state }) {
        return html`
        <hnpwa-router>
            <header id="header">
                <nav id="navigation">
                    <ul>
                        ${menu.map(([url, name]) => {
                            let selected = (state.route === url);
                            return html`
                            <li>
                                <hnpwa-link class="${selected ? 'selected' : '' }" href="/${url}">${name}</hnpwa-link>
                            </li>
                            `
                        })}
                    </ul>
                </nav>
            </header>
            <section id="content">
                ${menu.map(([url, name]) => {
                    return html`<hnpwa-route path="/${url}" component="${NewsList}" />`
                })}
                <hnpwa-route path="/item/:id" component="${NewsItem}" />
            </section>
        </hnpwa-router>`
    }
}

define(Router);
define(Route);
define(Link);
define(NewsApp);
