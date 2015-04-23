var nconf = require('nconf');
var folder = 'src/backend/libs/';


// 
// Setup nconf to use (in-order): 
//   1. Command-line arguments 
//   2. Environment variables 
//   3. A file located at 'path/to/config.json' 
nconf.argv()
     .env()
     .file({ file: folder + 'config.json' });


nconf.set('port', process.env.PORT || nconf.get('port'));
nconf.set('mongoose:uri', (process.env.CUSTOMCONNSTR_MONGOLAB_URI || nconf.get('mongoose:uri')));
nconf.set('IsTestEnv', (nconf.get('NODE_ENV') === 'test') || (nconf.get('NODE_ENV') === 'dev'));



nconf.set('sendGrid:userName', (process.env.SendGridUserName || 'sendGridUserFakeName'));
nconf.set('sendGrid:userPassword', (process.env.SendGridUserPassword || 'sendGridUserFakePassword'));


if (nconf.get('NODE_ENV') === 'test')
{
    nconf.set('mongoose:uri', 'mongodb://localhost:27017/testAPI_TestEnv');
}

module.exports = nconf;