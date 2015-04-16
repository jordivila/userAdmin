var util = require('util');

module.exports.extend = extend;

//function extend(obj) {
//    return util._extend(obj, {});
//}

function extend(obj1, obj2) {
    return util._extend(obj1, obj2);
}