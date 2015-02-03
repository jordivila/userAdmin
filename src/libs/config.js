var config = require('nconf');
//

var p = 'src/config.json';

config
    .argv()
	.env()
    .file({
    file: p
}); // relative to application entry


config.set('port', process.env.PORT || config.get('port'));


module.exports = config;