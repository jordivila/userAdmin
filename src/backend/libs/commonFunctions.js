var util = require('util');

module.exports.extend = extend;

/*
    Uses nodeJS private method _extend 
    Extends does NOT create a new instance
*/
function extend(obj1, obj2) {
    return util._extend(obj1, obj2);
}