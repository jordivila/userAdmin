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
        root.DataResult = factory();
    }
}(this, function () {


    // Module code 

    function DataResult(isValid, message, data) {

        this.isValid = isValid;
        this.messages = [];
        if (Array.isArray(message)) {
            for (var i = 0; i < message.length; i++) {
                this.messages.push(message[i]);
            }
        } else {
            this.messages.push(message);
        }

        if (data) {
            this.data = data;
        }
        else {
            this.data = {};
        }
    }

    DataResult.prototype.addMessage = function (message) {
        if (message)
            this.messages.push(message);
    };

    return DataResult;



}));