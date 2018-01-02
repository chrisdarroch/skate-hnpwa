import { html } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';
import { until } from 'lit-html/lib/until';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';

export function renderItem(props) {
    return html`
        <li class="hnitem">
            <a href="${props.url}">
                <h1 class="hnitem__title">${props.title}</h1>
            </a>
            <ul class="hnitem__metadata">
                <li class="metadata__author">by <span>${props.by}</a></li>
                <li class="metadata__time"><time datetime="${props.time}">${new Date(props.time * 1000)}</time></li>
                <li class="metadata__score"><span>${props.score}</span> points</li>
                <li class="metadata__comments"><a href="/item/${props.id}">comments</a></li>
            </ul>
        </li>
    `;
}

export default class NewsItem extends BaseComponent {
    static is = 'hnpwa-item'
    static props = {
        title: props.string,
        url: props.string,
    }
    constructor(props) {
        super();
        Object.assign(this.props, props);
    }
    render() {
        return html`<article class="hnitem">${renderItem(this)}</article>`
    }
}

define(NewsItem);
