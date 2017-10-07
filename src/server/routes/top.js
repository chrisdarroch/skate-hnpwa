const fetch = require('node-fetch');
const items = require('./item');

exports.getIds = async function({ from, amount }) {
    from = parseInt(from, 10);
    amount = parseInt(amount, 10);

    return fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        .then(res => res.json())
        .then(ids => ids.slice(from, from + amount))
        .catch(err => {
            throw new Error(err);
        });
};

exports.getItems = async function({ from, amount }) {
    let ids = await exports.getIds({ from, amount });
    let promises = ids.map(items.getItem);
    return Promise.all(promises);
};
