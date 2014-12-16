(function(module) {

	"use strict";

	module.exports = ErrorHandled;

	var DataResultModel = require('./dataResult');

	function ErrorHandled(message, opts) {
		this.name = "ErrorHandled";
		this.message = message || "";
		this.options = opts || {};
	}

	ErrorHandled.prototype = new Error();

	ErrorHandled.prototype.toDataResult = function() {
		return new DataResultModel(false, this.message, this.options);
	};

})(module);