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

    function DataResultPaginated() {

        this.isValid = true;
        this.messages = [];
        this.messageType = 0;
        this.data = {
            totalRows: 0,
            page: 0,
            pageSize: 10,
            sortBy: "",
            sortAscending: false,
            data: [],
        };

    }

    DataResultPaginated.prototype.clone = function (instance) {

        // usefull when server sends DataResultPaginatedModel
        // and client needs to use prototype methods
        // 
        // as far as data from server contains just the model with no methods
        this.isValid = instance.isValid;
        this.messages = instance.messages;
        this.data = instance.data;
        this.messageType = 0;
    };

    DataResultPaginated.prototype.addMessage = function (message) {
        if (message)
            this.messages.push(message);
    };

    return DataResultPaginated;

}));