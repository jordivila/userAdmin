var config = require('nconf');
//

var p = 'src/config.json';
console.log(p);

config.argv()
    .env()
    .file({ file: p })// relative to application entry
;



module.exports = config;
