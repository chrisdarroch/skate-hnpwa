const fetch = require('node-fetch');

class HnItem {
    constructor(id) {
        this._id = id;
    }

    fetch() {
        return fetch(`https://hacker-news.firebaseio.com/v0/item/${this._id}.json`)
            .then(res => res.json())
            .then(data => data)
            .catch(err => {
                throw new Error(err);
            })
    };    
}

module.exports = HnItem;
