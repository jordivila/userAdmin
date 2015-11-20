
/***************************
REQUIREJS CONFIG
****************************/
requirejs.config({
    urlArgs: globals.crossLayer.queryParams.appVersion + "=" + globals.package.version,
    waitSeconds: 0,
    //baseUrl: "/" + globals.domainInfo.virtualDirectory + "public",
    baseUrl: "/" + globals.domainInfo.virtualDirectory,
    paths: {
        jquery: "public/bower_components/jquery/jquery.min",
        jqueryui: "public/scripts/modules/jquery.ui.custom.bundle",
        domReady: "public/bower_components/requirejs-domready/domReady",
        handlebars: "public/bower_components/handlebars/handlebars.min",
        history: 'public/bower_components/history.js/scripts/bundled/html4+html5/jquery.history',
        pPromises: 'public/bower_components/p-promise/p.min',
        es5Shim: 'public/bower_components/es5-shim',
        respond: 'public/bower_components/respond/dest/respond.src',
        querystring: 'public/bower_components/querystring/querystring.min',
        crossLayer: 'public/crossLayer',
        modernizr: "public/scripts/modules/modernizr.customBuild",
        scripts: "public/scripts",
        bower: 'public/bower_components',
        css:'public/css',
        
        helpdesk: "/" + globals.domainInfo.virtualDirectory + "helpdesk/talks",
        /**************************************************************
                    Globalize dependencies paths begin
        **************************************************************/
        cldr: "public/bower_components/cldrjs/dist/cldr",
        // Unicode CLDR JSON data.
        "cldr-data": "public/bower_components/cldr-data",
        // require.js plugin we'll use to fetch CLDR JSON content.
        json: "public/bower_components/requirejs-plugins/src/json",
        // text is json's dependency.
        text: "public/bower_components/requirejs-text/text",
        // Globalize.
        globalize: "public/bower_components/globalize/dist/globalize"
        /**************************************************************
                    Globalize dependencies paths end
        **************************************************************/
    },
    shim: {
        'jqueryui': {
            deps: ["jquery"]
        },
        'history': {
            deps: ["jquery"]
        },
        'respond': {
            deps: ['jquery']
        },
    }
});

/**********************************************
LAYOUT ENTRY POINT
***********************************************/

requirejs.onError = function (err) {
    console.log(err);
    if (err.requireType === 'timeout') {
        console.log('modules: ' + err.requireModules);
    }

    throw err;
};


require(
['scripts/modules/main'],
function (clientApp) {

    var loadMainModule = function () {

        jQuery(document).ready(function () {
            jQuery(globals.domIds.panelMain).page({
                cultureDatePicker: globals.globalization.cultureDatePicker,
                initComplete: function () {

                }
            });
        });
    };

    if (!(Modernizr.es5array && Modernizr.es5object)) {
        require(['scripts/modules/es5Shim'], function (es5Shim) {
            loadMainModule();
        });
    }
    else {
        loadMainModule();
    }

});