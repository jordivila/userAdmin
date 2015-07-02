(function (module) {

    "use strict";

    var express = require('express');
    var config = require('../libs/config');

    module.exports.setRoutes = function (app) {


        /**********************

        Use nginx in Front of Node
        http://www.sitepoint.com/10-tips-make-node-js-web-app-faster/
        Nginx is a tiny and lightweight web server that can be used to reduce the load on your Node.js server. Instead of serving static files from Node, you can configure nginx to serve static content. You can also set up nginx to compress the response using gzip so that the overall response size is small. So, if you are running a production app you might want to use nginx to improve the speed.

        **********************/
        
        var isTest = config.get('IsTestEnv');
        var cacheMaxAge = (!isTest) ? config.get('clientApp:cachemaxAgeDefault') : 0;

        //if (isTest) {
        //    app.use('/public/scripts', express.static(app.get('root') + 'scripts', {
        //        maxAge: cacheMaxAge
        //    }));

        //    app.use('/scripts', express.static(app.get('root') + 'scripts', {
        //        maxAge: cacheMaxAge
        //    }));
        //    app.use('/public/bower_components', express.static(app.get('bower_components'), {
        //        maxAge: cacheMaxAge
        //    }));
        //    app.use('/public/bower', express.static(app.get('bower_components'), {
        //        maxAge: cacheMaxAge
        //    }));
        //    app.use('/public/cdn', express.static(app.get('root') + 'cdn', {
        //        maxAge: cacheMaxAge
        //    }));
        //    app.use('/public/fonts', express.static(app.get('bower_components') + 'components-font-awesome/fonts', {
        //        maxAge: cacheMaxAge
        //    }));
        //    app.use('/public/images', express.static(app.get('root') + 'images', {
        //        maxAge: cacheMaxAge
        //    }));
        //}
        //else {
            app.use('/public/scripts', express.static(app.get('root') + 'scripts', {
                maxAge: cacheMaxAge
            }));
            app.use('/public/bower_components', express.static(app.get('bower_components'), {
                maxAge: cacheMaxAge
            }));
            app.use('/public/cdn', express.static(app.get('root') + 'cdn', {
                maxAge: cacheMaxAge
            }));
            app.use('/public/fonts', express.static(app.get('bower_components') + 'components-font-awesome/fonts', {
                maxAge: cacheMaxAge
            }));
            app.use('/public/images', express.static(app.get('root') + 'images', {
                maxAge: cacheMaxAge
            }));
        //}
    };

})(module);