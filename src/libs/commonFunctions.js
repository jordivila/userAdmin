var util = require('util');

module.exports.extend = extend;

function extend(obj) {
    return util._extend(obj, {});
}