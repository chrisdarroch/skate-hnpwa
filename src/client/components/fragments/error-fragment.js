import { html } from 'lit-html';

export default (err) => html`
    <p>😭 Hmm, something went wrong.</p>
    <p>You may be offline... I just haven't handled the exact problem yet to tell you what happened.</p>
    <p>In the meantime, you'll get the cryptic errors below.</p>
    <pre><code>${JSON.stringify(err)}</code></pre>
`;
