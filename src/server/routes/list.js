const HnList = require('../entities/hn-list');

module.exports = function(type) {
    return new HnList(`${type}stories`);
}
