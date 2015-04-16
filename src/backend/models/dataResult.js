(function(module) {

	"use strict";

	module.exports = DataResult;

	var util = require('util');

	function DataResult(isValid, message, data) {

		this.isValid = isValid;
		this.messages = [];
		if (util.isArray(message)) {
			for (var i = 0; i < message.length; i++) {
				this.messages.push(message[i]);
			}
		} else {
			this.messages.push(message);
		}

		if (data) {
			this.data = data;
		}
	}

	DataResult.prototype.addMessage = function(message) {
		if (message)
			this.messages.push(message);
	};

})(module);