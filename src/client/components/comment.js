import { html } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';
import { until } from 'lit-html/lib/until';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';
import './comment.css';
import unrenderableFragment from './fragments/unrenderable-fragment';
import timeFragment from './fragments/time-fragment';

function getArticle(id) {
    // todo: set or inject the base URL during compilation.
    const url = `/api/item/${id}`;
    return fetch(url)
        .then(resp => {
            if (!resp.status || resp.status >= 400) {
                throw resp.json();
            }
            return resp.json();
        });
}

function commentFragment(article) {
    let commentBody = document.createElement('div');
    commentBody.className = 'hncomment__content';
    commentBody.innerHTML = article.text;
    return html`
        <div class="hncomment">
            <ul class="hnitem__metadata">
                <li class="metadata__author">by <span>${article.by}</span></li>
                <li class="metadata__time">${timeFragment(article.time)}</li>
            </ul>
            ${commentBody}
            ${renderReplies(article)}
        </div>
    `;
}

function renderReplies(article) {
    if (article && article.kids) {
        return html`<div class="hncomment__replies">
            ${repeat(article.kids, id => id, id => html`<hnpwa-comment id=${id} />`)}
        </div>`;
    }
    return '';
}

function retryCommentFragment(err) {
    return html`
        <div class="hncomment hncomment--error">
            <p class="error">😭 We couldn't load that comment.</p>
            <button class="hncomment__action hncomment__action--retry" type="button">Retry</button>
        </div>
    `;
}

export default class Comment extends BaseComponent {
    static is = 'hnpwa-comment'
    static props = {
        id: props.number
    }
    connected() {
        this.__retryHandler = e => {
            let el = e.target;
            if (el.classList.contains('hncomment__action--retry')) {
                this.updated(); // trigger a new render
            }
        };
        this.addEventListener('click', this.__retryHandler);
    }
    disconnected() {
        this.removeEventListener('click', this.__retryHandler);
    }
    render({ props, state }) {
        if (!this.props.id) {
            return unrenderableFragment();
        }
        return html`
        ${until(
            getArticle(this.props.id)
                .then(commentFragment)
                .catch(retryCommentFragment)
            ,
            html`
                <p class="loading">🤔 let's see what people said in response...</p>
            `
        )}
        `;
    }
}

define(Comment);
