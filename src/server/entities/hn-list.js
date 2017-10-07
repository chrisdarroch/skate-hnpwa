const fetch = require('node-fetch');
const HnItem = require('./hn-item');

class HnList {
    constructor(type) {
        this._type = type;
    }

    fetch() {
        return fetch(`https://hacker-news.firebaseio.com/v0/${this._type}.json`)
            .then(res => res.json())
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
        let { start, end, items, total } = response;
        let promises = items.map(id => {
            let item = new HnItem(id);
            return item.fetch()
        });
        items = await Promise.all(promises);
        return {
            start,
            end,
            amount,
            items,
            total
        };
    }
}

module.exports = HnList;
