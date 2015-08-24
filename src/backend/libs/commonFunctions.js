var util = require('util');

// -> A port of jQuery.extend that actually works on node.js
var jQueryExtendPort = require('node.extend'); //https://github.com/dreamerslab/node.extend



module.exports.extend = extend;
module.exports.extendDeep = extendDeep;
module.exports.stringFormatCSharp = stringFormatCSharp;



function extend(obj1, obj2) {
    /*
        Uses native nodeJS private method _extend 
        Extends does NOT create a new instance
        Extends does NOT create deep copies
    */
    return util._extend(obj1, obj2);
}



function extendDeep(origin, add) {

    // creates a new instance => extendDeep({}, somehtng)
    // not creates a new instance => extendDeep(someInstance, somehtng)

    return jQueryExtendPort(true, origin, add);
}







function stringFormatCSharp() {
    var string = arguments[0];
    var params = arguments;
    var args = function () {
        var r = [];
        for (var i = 1; i < params.length; i++) {
            r.push(params[i]);
        }
        return r;
    }();

    return string.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
}