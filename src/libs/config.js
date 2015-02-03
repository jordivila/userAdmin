var config = require('nconf');
//

var p = 'src/config.json';

config.argv()
	.file({
		file: p
    }) // relative to application entry
    .env();



module.exports = config;