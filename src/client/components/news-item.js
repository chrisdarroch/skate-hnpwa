import { html } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';
import { until } from 'lit-html/lib/until';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';
import newsItemFragment from './fragments/news-item-fragment';
import unrenderableFragment from './fragments/unrenderable-fragment';
import errorFragment from './fragments/error-fragment';
import './comment';
import itemStyles from 'raw-loader!./news-item.css';

function getArticle(id) {
    // todo: set or inject the base URL during compilation.
    const url = `//localhost:8000/api/item/${id}`;
    return fetch(url)
        .then(resp => {
            if (!resp.status || resp.status >= 400) {
                throw resp.json();
            }
            return resp.json();
        });
}

function articleFragment(article) {
    return html`
    <article class="hnitem">${newsItemFragment(article, false)}</article>
    <section class="hnitem__comments">
        ${repeat(article.kids, id => id, id => html`<hnpwa-comment id=${id} />`)}
    </section>
    `;
}

export default class NewsItem extends BaseComponent {
    static is = 'hnpwa-item'
    static styles = itemStyles
    static get props() {
        return {
            id: props.id,
            title: props.string,
            url: props.string,
        };
    }
    render({ props, state }) {
        if (!props.id) {
            return unrenderableFragment();
        }
        return html`
        ${until(
            getArticle(props.id)
                .then(articleFragment)
                .catch(errorFragment)
            ,
            html`
                <p class="loading">📖 let's see what people have to say about this...</p>
            `
        )}
        `;
    }
}

define(NewsItem);
