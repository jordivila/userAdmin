﻿var nconf = require('nconf');
var crossLayer = require('../../crossLayer/config');
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

// override i18n:cookieName and use crossLayer.cookies.i18nLocale
nconf.set('i18n:cookieName', crossLayer.cookies.i18nLocale);


if (nconf.get('NODE_ENV') === 'test')
{
    // I use different connections for dev, test & production environments
    // If you do not want to use different cnn strings for dev & test simply comment the next line
    //nconf.set('mongoose:uri', 'mongodb://77.0.33.61:27017/helpdeskTest');
    nconf.set('mongoose:uri', 'mongodb://localhost:27017/junceumTest');

    nconf.set('helpdesk:api:host', 'localhost');
    nconf.set('helpdesk:api:port', 80);
    nconf.set('helpdesk:api:basePath', "/ArquiaXXI.BackOffice.WCF.Services/HelpdeskServices/HelpdeskService.svc/wb/");

}

if (nconf.get('IsTestEnv') === false) {
    nconf.set('clientApp:usePreCompiled', true);
}
else {
    nconf.set('domainInfo:virtualDirectory', '');
}

module.exports = nconf;