import { html } from 'lit-html';
import { props, withComponent } from 'skatejs';
import Link from './link';

function matchRoute(url) {
    if (!url || !url.length) return [false];
    const pieces = url.split("/");
}

class Router extends withComponent() {
    static is = 'hnpwa-router'
    static get props() {
        return {
            title: props.string
        }
    }
    get title() {
        return this.props.title;
    }
    created() {
        this.props.title = window.title;
    }
    connected() {
        window.history.replaceState(this.state, this.title, window.location.href);
        this.renderRoot.addEventListener('click', e => {
            let el = e.target;
            if (el && el.matches(Link.is)) {
                const href = el.getAttribute('href');
                const [match, route, parts] = matchRoute(href);
                if (match) {
                    if (route === 'item') {
                        this.state.item = { id };
                    } else {
                        this.state.item = undefined;
                    }
                    if (route !== this.state.route) {
                        this.state.route = route;
                        window.history.pushState(this.state, this.title, href);
                    }
                }
                this.updated();
                e.preventDefault();
            }
        });
        window.onpopstate = (e) => {
            const state = e.state;
            if (state) {
                this.state = state;
                this.updated();
            }
        }
    }
    disconnected() {
        this.renderRoot.removeEventListener('click');
        window.onpopstate = undefined;
    }
}

export default Router;
