(function(module) {

	"use strict";

	module.exports = ErrorHandled;

	function ErrorHandled(message, opts) {

		this.message = message;

		if (opts) this.options = opts;
	}

	ErrorHandled.prototype.toJson = function() {
		return {
			isValid: false,
			messages: [this.message]
		};
	};

})(module);