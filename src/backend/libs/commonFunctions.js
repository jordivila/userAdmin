var util = require('util');

// -> A port of jQuery.extend that actually works on node.js
var jQueryExtendPort = require('node.extend'); //https://github.com/dreamerslab/node.extend



module.exports.extend = extend;
module.exports.extendDeep = extendDeep;


function extend(obj1, obj2) {
    /*
        Uses native nodeJS private method _extend 
        Extends does NOT create a new instance
        Extends does NOT create deep copies
    */
    return util._extend(obj1, obj2);
}



function extendDeep(origin, add) {
    return jQueryExtendPort(true, origin, add);
}