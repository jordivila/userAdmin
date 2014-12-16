var config = require('nconf');
//

var p = 'src/config.json';

config.argv()
	.env()
	.file({
		file: p
	}) // relative to application entry
;



module.exports = config;