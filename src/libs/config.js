var config = require('nconf');
//

var path = 'src/libs/config.json';

config
	.argv()
	.env()
    .file({
        file: path	// --> relative to application entry
    })
    ;

config.set('port', process.env.PORT || config.get('port'));

module.exports = config;