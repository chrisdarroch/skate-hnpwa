import { withComponent, props } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';

class Component extends withComponent(withLitHtml()) {
    // Turn off the shadow DOM until I figure out how to inject
    // styles in to the resulting components in a webpack- or parceljs-friendly way.
    get renderRoot() {
        return this;
      }
}

export default Component;
