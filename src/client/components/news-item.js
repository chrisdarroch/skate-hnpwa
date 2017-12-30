import { html } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';
import { until } from 'lit-html/lib/until';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';

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
        return html`
        <article class="hnitem">
            <a href="${this.url}">
                <h1 class="hnitem--title">${this.title}</h1>
            </a>
        </article>
        `
    }
}

define(NewsItem);
