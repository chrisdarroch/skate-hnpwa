import { html } from 'lit-html';
import { until } from 'lit-html/lib/until';

const handler = (err) => html`
    <p class="error">😭 Hmm, something went wrong.</p>
    <p>You may be offline... I just haven't handled the exact problem yet to tell you what happened.</p>
    ${err ? html`
        <p>In the meantime, you'll get the cryptic errors below.</p>
        <pre><code>${err.message ? err.message : JSON.stringify(err)}</code></pre>
    ` : ''}
`;

export default (err) => {
    if (err instanceof Promise) {
        return html`${until(
            err.then(handler).catch(handler),
            handler()
        )}`;
    } else if (err instanceof Error) {
        return handler(err.message)
    } else {
        return handler(err);
    }
}
