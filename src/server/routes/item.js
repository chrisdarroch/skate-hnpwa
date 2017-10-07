const fetch = require('node-fetch');

exports.getItem = function(id) {
    return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(res => res.json())
        .then(data => data)
        .catch(err => {
            throw new Error(err);
        })
};
