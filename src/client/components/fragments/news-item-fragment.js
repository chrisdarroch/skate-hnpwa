import { html } from 'lit-html';
import timeFragment from './time-fragment';

export default function renderItem(props, renderCommentLink = true) {
    return html`
        <li class="hnitem">
            <a href="${props.url}" rel="external">
                <h1 class="hnitem__title">${props.title}</h1>
            </a>
            <ul class="hnitem__metadata">
                <li class="metadata__author">by <span>${props.by}</span></li>
                <li class="metadata__time">${timeFragment(props.time)}</li>
                <li class="metadata__score"><span>${props.score}</span> points</li>
                ${renderCommentLink
                    ? html`<li class="metadata__comments"><a href="/item/${props.id}">comments</a></li>`
                    : ''
                }
            </ul>
        </li>
    `;
}
