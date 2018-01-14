const fetch = require('node-fetch');
const HnItem = require('./hn-item');
const Cache = require('./cache');

const typeCache = new Cache({ expire: 30 });

class HnList {
    constructor(type) {
        this._type = type;
    }

    fetch() {
        const type = this._type;
        // Check the cache first before heading off to the interwebs.
        const cachedResults = typeCache.get(type);
        if (!!cachedResults) {
            return Promise.resolve(cachedResults);
        }
        // Fetch from firebase and add to the cache if retrieved successfully.
        return fetch(`https://hacker-news.firebaseio.com/v0/${type}.json`)
            .then(res => res.json())
            .then(data => {
                typeCache.set(type, data);
                return data;
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    async getIds({ from, amount }) {
        amount = parseInt(amount, 10);
        let start = parseInt(from, 10);
        let end = start + amount;

        let all = await this.fetch();
        let total = all.length;
        let items = all.slice(start, end);

        return {
            start,
            end,
            amount,
            items,
            total
        };
    }

    async getItems({ from, amount }) {
        let response = await this.getIds({ from, amount });
        let promises = response.items.map(id => {
            let item = new HnItem(id);
            return item.fetch()
        });
        response.items = await Promise.all(promises);
        return response;
    }
}

module.exports = HnList;
