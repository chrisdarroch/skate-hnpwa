import { html } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';
import { until } from 'lit-html/lib/until';
import { define, props } from 'skatejs';
import BaseComponent from './base-component';
import { NewsItem, renderItem } from './news-item';
import './news-list.css';
import './news-item.css';

function getItems(type) {
    // todo: set or inject the base URL during compilation.
    const url = `//localhost:8000/api/${type}`;
    return fetch(url)
        .then(resp => resp.json())
        .then(data => data.items);
}

export default class NewsList extends BaseComponent {
    static is = 'hnpwa-list'
    static get props() {
        return { type: props.string };
    }
    render({ props, state }) {
        return html`
        ${until(
            getItems(props.type).then(items => {
                return html`
                    <ul class="hnlist">
                        ${repeat(items, item => item.id, (props, i) => renderItem(props))}
                    </ul>
                `;
            }),
            html`
                <span>💁‍ Getting some stories...</span>
            `
        )}`;
    }
};

define(NewsList);