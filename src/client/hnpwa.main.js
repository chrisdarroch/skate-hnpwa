import '../../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js';

function mount() {
    import('./app/index.js');
}

window.addEventListener('WebComponentsReady', mount);
