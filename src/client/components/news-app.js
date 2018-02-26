import { html } from 'lit-html';
import { define, name, props } from 'skatejs';
import { Route, Router, Link } from '@skatejs/sk-router';
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

class RoutedNewsList extends NewsList {
    static is = 'hnpwa-routed-newslist'
    render({ props, state }) {
        let { params } = props;
        let type = params && params.type || 'top';
        return super.render({ props: { type }, state });
    }
}
define(RoutedNewsList);

export default class NewsApp extends BaseComponent {
    static is = 'hnpwa-app'
    render({ state }) {
        return html`
        <header id="header">
            <nav id="navigation">
                <ul>
                    ${menu.map(([url, name]) => {
                        let selected = (state.route === url);
                        return html`
                        <li>
                            <sk-link classNames="${selected ? 'selected' : '' }" href="/${url}">${name}</a>
                        </li>
                        `
                    })}
                </ul>
            </nav>
        </header>
        <section id="content">
            <sk-router>
                <sk-route path="/item/:id" page="${NewsItem}"></sk-route>
                <sk-route path="/:type" page="${RoutedNewsList}"></sk-route>
                <sk-route path="/" page="${RoutedNewsList}"></sk-route>
            </sk-router>
        </section>
        `
    }
}

define(NewsApp);
