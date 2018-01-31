const HnItem = require('../entities/hn-item');

module.exports = function(id) {
    return new HnItem(id);
};
