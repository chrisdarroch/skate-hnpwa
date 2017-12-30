import NewsList from '../components/news-list';

document.body.classList.remove('no-js');

const list = document.createElement('hnpwa-list');
list.type = 'top';

document.getElementById('page').appendChild(list);
