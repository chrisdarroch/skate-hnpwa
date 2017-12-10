import Lister from '../components/lister';

customElements.define('hnpwa-list', Lister);
const list = document.createElement('hnpwa-list');
list.type = 'top';

document.body.classList.remove('no-js');
document.body.appendChild(list);
