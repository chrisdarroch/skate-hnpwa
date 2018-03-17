import '!file-loader?name=ce-es5-shim.js!./fills/ce-es5-shim.js';
import '!file-loader?name=ce-sd-fill.js!./fills/ce-sd-fill.js';
import './app/index.css';

function mount() {
    import('./app/index.js');
}

function script(src, done) {
    var scr = document.createElement('script');
    scr.async = false;
    scr.onload = done;
    scr.src = src;
    document.head.appendChild(scr);
}

if (window.customElements) {
    script('/ce-es5-shim.js', mount);
} else {
    script('/ce-sd-fill.js', mount);
}
