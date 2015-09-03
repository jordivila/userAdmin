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
            theme: "th",

            helpdeskCustomerId: "hcid",
            helpdeskEmployeeId: "heid",
        } 
    };


    return crossLayer;



}));