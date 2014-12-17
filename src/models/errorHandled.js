(function(module) {

	"use strict";

	module.exports = ErrorHandled;

	var DataResultModel = require('./dataResult');

	function ErrorHandled(message, details) {
		this.name = "ErrorHandled";
		this.message = message || "";
		this.details = details || {};
	}

	ErrorHandled.prototype = new Error();

	ErrorHandled.prototype.toDataResult = function() {
		return new DataResultModel(false, this.message, this.details);
	};

})(module);