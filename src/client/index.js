import '!file-loader?name=ce-es5-shim.js!./fills/ce-es5-shim.js';
import '!file-loader?name=ce-sd-fill.js!./fills/ce-sd-fill.js';
import './app/index.css';

function mount() {
    import('./app/index.js')
        .then(() => script('https://www.googletagmanager.com/gtag/js?id=UA-121101247-1'))
}

function script(src, done) {
    var scr = document.createElement('script');
    scr.async = false;
    scr.onload = typeof done === 'function' ? done : undefined;
    scr.src = src;
    document.head.appendChild(scr);
}

if (window.customElements) {
    script('/ce-es5-shim.js', mount);
} else {
    script('/ce-sd-fill.js', mount);
}
