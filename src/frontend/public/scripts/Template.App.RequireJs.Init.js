
/***************************
REQUIREJS CONFIG
****************************/
requirejs.config({
    urlArgs: "bust=" + globals.package.version,
    waitSeconds: 0,
    baseUrl: "/public",
    paths: {
        jquery: "bower_components/jquery/jquery.min",
        jqueryui: "scripts/modules/jquery.ui.custom.bundle",
        domReady: "bower_components/requirejs-domready/domReady",
        handlebars: "bower_components/handlebars/handlebars.min",
        history: 'bower_components/history.js/scripts/bundled/html5/jquery.history',
        pPromises: 'bower_components/p-promise/p.min',
        es5Shim: 'bower_components/es5-shim',
        respond: 'bower_components/respond/dest/respond.src',
        crossLayer: 'crossLayer',
        /**************************************************************
                    Globalize dependencies paths begin
        **************************************************************/
        cldr: "bower_components/cldrjs/dist/cldr",
        // Unicode CLDR JSON data.
        "cldr-data": "bower_components/cldr-data",
        // require.js plugin we'll use to fetch CLDR JSON content.
        json: "bower_components/requirejs-plugins/src/json",
        // text is json's dependency.
        text: "bower_components/requirejs-text/text",
        // Globalize.
        globalize: "bower_components/globalize/dist/globalize"
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

require(
['scripts/modules/main'],
function (clientApp) {

    var loadMainModule = function () {

        jQuery(document).ready(function () {
            jQuery(globals.domIds.panelMain).page({
                cultureDatePicker: globals.globalization.cultureDatePicker,
                initComplete: function () {

                    jQuery(globals.domIds.panelMain).addClass('ui-display-table').removeClass("ui-helper-hidden");
                    jQuery(globals.domIds.panelProgress).addClass("ui-helper-hidden");

                    if (globals.viewEntryPoint) {
                        require([globals.viewEntryPoint],
                            function (clientApp) {
                                clientApp.View.main();
                            },
                            function (errRequiring) {
                                console.error(errRequiring);
                            });
                    }
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