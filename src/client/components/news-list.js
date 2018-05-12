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
    const url = `/api/${type}${offset}`;
    return fetch(url)
        .then(resp => {
            if (!resp.status || resp.status >= 400) {
                throw resp.json();
            }
            return resp.json();
        });
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
    <nav class="hnpage" role="navigation" aria-label="Pagination navigation">
        <p class="hnpage__showing">Showing ${start + 1} to ${end} of ${total} stories.</p>
        <ul class="hnpage__links">
            <li class="hnpage__links--prev">${atStart ? html`The beginning` : prevLink}</li>
            <li class="hnpage__links--next">${atEnd   ? html`The end`       : nextLink}</li>
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
                <p class="loading">📚 Getting some stories...</p>
            `
        )}`;
    }
};

define(NewsList);