var nconf = require('nconf');
//
nconf.argv()
    .file({ file: './src/config.json' })
    .env();// relative to application entry

module.exports = nconf;
