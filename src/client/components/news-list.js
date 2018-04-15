import { html } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';
import { until } from 'lit-html/lib/until';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';
import NewsItem from './news-item';
import itemFragment from './fragments/news-item-fragment';
import errorFragment from './fragments/error-fragment';
import './news-list.css';
import './news-item.css';

function getPage(type, start = 0) {
    const offset = (start > 0) ? `/${start}` : '';
    // todo: set or inject the base URL during compilation.
    const url = `//localhost:8000/api/${type}${offset}`;
    return fetch(url)
        .then(resp => resp.json());
}

function itemsFragment(items) {
    return html`
        <ul class="hnlist">
            ${repeat(items, item => item.id, (props, i) => itemFragment(props))}
        </ul>
    `;
}

function paginationFragment(type, data) {
    const { start, end, amount, total } = data;
    const prev = start - amount;
    const atStart = (prev < 0);
    const atEnd = (end >= total);

    const prevUrl = prev ? `/${type}/${prev}` : `/${type}`;
    const nextUrl = `/${type}/${end}`;

    let prevLink = html`<a href="${prevUrl}" aria-label="Show ${prev} to ${start}">Previous</a>`;
    let nextLink = html`<a href="${nextUrl}" aria-label="Show ${end} to ${end + amount}">Ńext</a>`;

    return html`
    <nav role="navigation" aria-label="Pagination navigation">
        <p>Showing ${start + 1} to ${end} of ${total} stories.</p>
        <ul>
            <li>${atStart ? html`Previous` : prevLink}</li>
            <li>${atEnd   ? html`Next`     : nextLink}</li>
        </ul>
    </nav>
    `;
}

export default class NewsList extends BaseComponent {
    static is = 'hnpwa-list'
    static get props() {
        return {
            type: props.string,
            start: props.number,
        };
    }
    render({ props, state }) {
        return html`
        ${until(
            getPage(props.type, props.start)
                .then(data => {
                    return html`
                        ${itemsFragment(data.items)}
                        ${paginationFragment(props.type, data)}
                    `;
                })
                .catch(errorFragment)
            ,
            html`
                <span>📖 Getting some stories...</span>
            `
        )}`;
    }
};

define(NewsList);