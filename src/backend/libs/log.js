var winston = require('winston');

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/');



    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                label: path
            })
            /*,
                        new(winston.transports.File)({
                            filename: 'somefile.log',
                            level: 'debug',
                        }) // -> this is not working in azure site
                        */
        ]
    });
}

module.exports = getLogger;