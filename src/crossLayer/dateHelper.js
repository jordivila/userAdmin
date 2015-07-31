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
        root.dateHelper = factory();
    }
}(this, function () {


    var SECONDS = 1000;
    var MINUTES = SECONDS * 60;
    var HOURS = MINUTES * 60;
    var DAYS = HOURS * 24;

    dateHelper = {
        getDate: function (stringDate) {
            if (!stringDate) {
                return this.getCurrentDate();
            }
            return new Date(Date.parse(stringDate));
        },
        getCurrentDate: function () {
            return new Date();
        },
        getDifference: function (date1, date2) {
            return date1 - date2;
        },
        getDifferenceSeconds: function (date1, date2) {
            var diff = this.getDifference(date1, date2);
            return Math.floor(diff / SECONDS);
        },
        getDifferenceMinutes: function (date1, date2) {
            var diff = this.getDifference(date1, date2);
            return Math.floor(diff / MINUTES);
        },
        getDifferenceHours: function (date1, date2) {
            var diff = this.getDifference(date1, date2);
            return Math.floor(diff / HOURS);
        },
        getDifferenceDays: function (date1, date2) {
            var diff = this.getDifference(date1, date2);
            return Math.floor(diff / DAYS);
        },
        SECONDS: SECONDS,
        MINUTES: MINUTES,
        HOURS: HOURS,
        DAYS: DAYS

    };


    return dateHelper;



}));