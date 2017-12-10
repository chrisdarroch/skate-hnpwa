import { html } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';
import { until } from 'lit-html/lib/until';
import { withComponent, props } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';

const Component = withComponent(withLitHtml());

function getItems(type) {
    // todo: set or inject the base URL during compilation.
    const url = `//localhost:8000/api/${type}`;
    return fetch(url)
        .then(resp => resp.json())
        .then(data => data.items);
}

export default class Lister extends Component {
    static props = {
        type: props.string
    };
    constructor(type) {
        super();
        this.props.type = type;
    }
    render() {
        return html`
        ${until(
            getItems(this.props.type).then(items => {
                return html`
                    <ul class="hnlist">
                        ${repeat(
                        items,
                        item => item.id,
                        item => {
                            return html`<li class="hnlist--item">${item.title}</li>`;
                        }
                        )}
                    </ul>
                `;
            }),
            html`
                <span>💁‍ Getting some stories...</span>
            `
        )}`;
    }
};
