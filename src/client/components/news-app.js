import { html } from 'lit-html';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';
import NewsList from './news-list';

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
    connected() {
        this.renderRoot.addEventListener('click', e => {
            let el = e.target;
            if (el && el.nodeName === 'A') {
                e.preventDefault();
                this.state.route = el.getAttribute('href').replace(/^\//,'')
                this.updated();
            }
        });
    }
    disconnected() {
        this.renderRoot.removeEventListener('click');
    }
    render({ state }) {
        return html`
        <header>
            <nav>
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
        <hnpwa-list type="${state.route}" />
        `
    }
}

define(NewsApp);
