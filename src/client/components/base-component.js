import { withComponent, props } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';
import { html } from 'lit-html';

class Component extends withComponent(withLitHtml()) {
    renderer(el, html) {
        super.renderer(el, html);

        let styled = el.querySelector('#hnpwa-styled');
        if (!styled) {
            let styled = document.createElement('style');
            styled.id = 'hnpwa-styled';
            styled.textContent = this.constructor.styles;
            el.appendChild(styled);
        }
    }
}

export default Component;
