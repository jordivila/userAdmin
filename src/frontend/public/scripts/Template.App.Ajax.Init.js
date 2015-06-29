define([
    "jquery",
    "scripts/Template.App.Init",
    "scripts/url/UrlHelper",
    "scripts/Template.App.Page.Init",
    "pPromises",
],
    function ($, clientApp, urlHelper, pInit, P) {


        jQuery(document).ready(function () {
            jQuery.ajaxSetup({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr, settings) {

                    var urlHelper = new UrlHelper(settings.url);

                    if (urlHelper.hostname == window.location.hostname) {
                        settings.url = new UrlHelper(settings.url).paramSet("appVersion", clientApp.Widgets.PageOptions.appVersion).href;
                        settings.url = new UrlHelper(settings.url).paramSet("seoRequest", false).href;
                    }
                }
            });
        });

        clientApp.Ajax = {};

        clientApp.Ajax.UserMenu = function (cbErrFirst) {
            return P(jQuery.ajax({
                url: "/api/user/menu",
                type: "GET",
                data: {},
                cache: false
            })).nodeify(function (error, value) {
                cbErrFirst(error, value);
            });
        };

        clientApp.Ajax.ViewHtml = function (templUrl) {
            return jQuery.ajax({
                url: templUrl,
                type: "GET",
                dataType: "html",
                cache: true,
            });
        };

        clientApp.Ajax.ViewModel = function (templUrl) {
            return jQuery.ajax({
                url: templUrl + 'index.handlebars.json',
                type: "GET",
                dataType: "json",
                cache: false,    // view model MUST NOT be chached
            });
        };

        clientApp.Ajax.View = function (templUrl, cbErrFirst) {
            return P.all([
                clientApp.Ajax.ViewHtml(templUrl),
                clientApp.Ajax.ViewModel(templUrl),
            ]).nodeify(function (e, data) {

                if (e !== null) {
                    cbErrFirst(e, data);
                }
                else {

                    var model = data[1];
                    var hasEntry = function(){
                    
                        return model.ViewEntryPoint && model.ViewEntryPoint !== null;

                    };
                    data.push({ hasEntry: hasEntry() });

                    if (hasEntry()) {

                        require(
                            /*
                            1.- require will cache ViewEntryPoints
                            2.- forcing views to execute viewEntryPoint."main" previously loaded
                            3.- using urlArgs=bust+ (new Date()).getTime() is not an potion
                                 as far as would load every script again and again
                            4.- best solution is to add .getTime() to viewEntryPoint url.
                                This way viewEntryPoint will always be overriden to the last script loaded
                                Bu keeps caching viewEntrypoint dependencies
                            */
                            [model.ViewEntryPoint + "?_=" + (new Date()).getTime()],
                            function (clientApp) {
                                cbErrFirst(e, data);
                            },
                            function (errRequiring) {
                                cbErrFirst(errRequiring, data);
                            });
                    }
                    else {
                        cbErrFirst(e, data);
                    }


                }
            });
        };

        return clientApp;
    });