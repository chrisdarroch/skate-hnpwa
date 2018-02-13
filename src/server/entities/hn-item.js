const fetch = require('node-fetch');
const Cache = require('./cache');

const itemCache = new Cache({ expire: 60 });

class HnItem {
    constructor(id) {
        this._id = id;
    }

    fetch() {
        const id = this._id;
        // Check the cache first before heading off to the interwebs.
        const cachedResults = itemCache.get(id);
        if (!!cachedResults) {
            return Promise.resolve(cachedResults);
        }
        return fetch(`https://hacker-news.firebaseio.com/v0/item/${this._id}.json`)
            .then(res => res.json())
            .then(data => {
                itemCache.set(id, data);
                return data;
            })
            .catch(err => {
                throw new Error(err);
            })
    };

    async getArticle() {
        let data = await this.fetch();
        return data;
    }
}

module.exports = HnItem;
