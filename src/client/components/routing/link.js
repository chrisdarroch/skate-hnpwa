import { html } from 'lit-html';
import { define, props, withComponent } from 'skatejs';

class Link extends withComponent() {
    static is = 'hnpwa-link'
    render({ props }) {
        return html`
            <a href="${props.href}" class="${props.class}">
                <slot></slot>
            </a>
        `;
    }
};

export default Link;