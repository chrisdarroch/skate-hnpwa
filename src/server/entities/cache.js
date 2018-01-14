const NodeCache = require('node-cache');

module.exports = function Cache({ expire = 10 }) {
    let cache = new NodeCache({ stdTTL: expire });

    this.get = function getVal(key) {
        return cache.get(key);
    }

    this.set = function setVal(key, val) {
        return cache.set(key, val);
    }
};
