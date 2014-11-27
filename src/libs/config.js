var nconf = require('nconf');
//
nconf.argv()
    .env()
    .file({ file: './src/config.json' });// relative to application entry

module.exports = nconf;
