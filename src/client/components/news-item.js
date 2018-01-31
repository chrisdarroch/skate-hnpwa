import { html } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';
import { until } from 'lit-html/lib/until';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';
import './news-item.css';

export function renderItem(props, renderCommentLink = true) {
    return html`
        <li class="hnitem">
            <a href="${props.url}">
                <h1 class="hnitem__title">${props.title}</h1>
            </a>
            <ul class="hnitem__metadata">
                <li class="metadata__author">by <span>${props.by}</a></li>
                <li class="metadata__time"><time datetime="${props.time}">${new Date(props.time * 1000)}</time></li>
                <li class="metadata__score"><span>${props.score}</span> points</li>
                ${renderCommentLink
                    ? html`<li class="metadata__comments"><a href="/item/${props.id}">comments</a></li>`
                    : ''
                }
            </ul>
        </li>
    `;
}

function getArticle(id) {
    // todo: set or inject the base URL during compilation.
    const url = `//localhost:8000/api/item/${id}`;
    return fetch(url)
        .then(resp => resp.json())
        .then(data => data);
}

export default class NewsItem extends BaseComponent {
    static is = 'hnpwa-item'
    static props = {
        id: props.id,
        title: props.string,
        url: props.string,
    }
    constructor(props) {
        super();
        Object.assign(this.props, props);
    }
    render() {
        if (!this.props.id) {
            return html`<p>I can't render that, Hal.</p>`;
        }
        return html`
        ${until(
            getArticle(this.props.id).then(article =>
                html`<article class="hnitem">${renderItem(article, false)}</article>`
            ),
            html`📖 let's see what people have to say about this...`
        )}
        `;
    }
}

define(NewsItem);
