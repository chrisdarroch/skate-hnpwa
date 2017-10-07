const fetch = require('node-fetch');
const HnItem = require('./hn-item');

class HnList {
    constructor(type) {
        this._type = type;
    }

    async getIds({ from, amount }) {
        from = parseInt(from, 10);
        amount = parseInt(amount, 10);

        return fetch(`https://hacker-news.firebaseio.com/v0/${this._type}.json`)
            .then(res => res.json())
            .then(ids => ids.slice(from, from + amount))
            .catch(err => {
                throw new Error(err);
            });
    }

    async getItems({ from, amount }) {
        let ids = await this.getIds({ from, amount });
        let promises = ids.map(id => {
            let item = new HnItem(id);
            return item.fetch()
        });
        return Promise.all(promises);
    }
}

module.exports = HnList;
