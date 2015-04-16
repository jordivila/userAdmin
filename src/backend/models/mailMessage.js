(function(module) {

	"use strict";

	module.exports = MailMessage;

	function MailMessage() {
		this._from = '';
		this._bcc = [];
		this._subject = '';
		this._body = '';
	}

	MailMessage.prototype.From = function(from) {
		if (from) {
			this._from = from;
		}

		return this._from;
	};

	MailMessage.prototype.Bcc = function(emailAddress) {
		if (emailAddress) {
			this._bcc.push(emailAddress);
		}

		return this._bcc;
	};

	MailMessage.prototype.Subject = function(subject) {
		if (subject) {
			this._subject = subject;
		}

		return this._subject;
	};

	MailMessage.prototype.Body = function(body) {
		if (body) {
			this._body = body;
		}

		return this._body;
	};

})(module);