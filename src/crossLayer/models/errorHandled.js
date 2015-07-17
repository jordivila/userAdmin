// Module definition https://github.com/umdjs/umd/blob/master/returnExports.js

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['crossLayer/models/dataResult'], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory(require('./dataResult'));
	} else {
		// Browser globals (root is window)
		root.ErrorHandled = factory(root.DataResultModel);
	}
}(this, function (DataResultModel) {


    // Module code 

    function ErrorHandled(message, details) {
		this.name = "ErrorHandled";
		this.message = message || "";
		this.details = details || {};
	}

	ErrorHandled.prototype = new Error();

	ErrorHandled.prototype.toDataResult = function () {
		return new DataResultModel(false, this.message, this.details);
	};

	return ErrorHandled;




}));