// Module definition https://github.com/umdjs/umd/blob/master/returnExports.js

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.crossLayer = factory();
    }
}(this, function () {


    var crossLayer = {
        queryParams: {
            seoRequest: "sr",
            appVersion: "av"
        },
        cookies: {
            currency: "curId",
            i18nLocale: "i18nL",
            theme: "th"
        }
    };


    return crossLayer;



}));






















///*
//Sharing JavaScript code between the browser and node.js
//http://markdawson.tumblr.com/post/17212439857/sharing-javascript-code-between-the-browser-and
//*/

///*
//// when common.js is loaded, node wraps it in a function definition
//// and passed in an exports object e.g.
////(function (exports, require, module, __filename, __dirname){
//*/

//(function() {

//    var crossLayer = {
//        queryParams: {
//            seoRequest: "sr",
//            appVersion: "av"
//        },
//        cookies:{
//          currency: "curId",
//          i18nLocale: "i18nL",
//          theme: "th"
//        }
//    };


//  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
//    module.exports = crossLayer;
//  }
//  else {
//    if (typeof define === 'function' && define.amd) {
//      define([], function() {
//        return crossLayer;
//      });
//    }
//    else {
//      window.crossLayer = crossLayer;
//    }
//  }

//})();