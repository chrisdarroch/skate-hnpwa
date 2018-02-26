import { html } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';
import { until } from 'lit-html/lib/until';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';
import './comment.css';

function getArticle(id) {
    // todo: set or inject the base URL during compilation.
    const url = `//localhost:8000/api/item/${id}`;
    return fetch(url)
        .then(resp => resp.json())
        .then(data => data);
}

function renderReplies(article) {
    if (article && article.kids) {
        return html`<div class="hncomment__replies">
            ${repeat(article.kids, id => id, id => html`<hnpwa-comment id=${id} />`)}
        </div>`;
    }
    return '';
}

export default class Comment extends BaseComponent {
    static is = 'hnpwa-comment'
    static get props() {
        return { id: props.id };
    }
    render({ props, state }) {
        if (!this.props.id) {
            return html`<p>I can't render that, Hal.</p>`;
        }
        return html`
        ${until(
            getArticle(this.props.id).then(article => {
                let commentBody = document.createElement('div');
                commentBody.className = 'hncomment__content';
                commentBody.innerHTML = article.text;
                return html`
                    <div class="hncomment">
                        <ul class="hnitem__metadata">
                            <li class="metadata__author">by <span>${article.by}</span></li>
                            <li class="metadata__time"><time datetime="${article.time}">${new Date(article.time * 1000)}</time></li>
                        </ul>
                        ${commentBody}
                        ${renderReplies(article)}
                    </div>
                `;
            }),
            html`📖 let's see what people said in response...`
        )}
        `;
    }
}

define(Comment);
