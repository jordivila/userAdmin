define([
    "jquery",
    "scripts/Template.App.Init",
    "scripts/url/UrlHelper",
    "scripts/Template.App.Page.Init",
    "pPromises",
    "crossLayer/config"
],
    function ($, clientApp, urlHelper, pInit, P, crossLayer) {


        jQuery(document).ready(function () {
            jQuery.ajaxSetup({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr, settings) {

                    var urlHelper = new UrlHelper(settings.url);

                    if (urlHelper.hostname == window.location.hostname) {
                        settings.url = urlHelper
                                        .bind(settings.url)
                                        .paramSet(
                                            crossLayer.queryParams.appVersion,
                                            clientApp.Widgets.PageOptions.appVersion).href;

                        settings.url = urlHelper
                                        .bind(settings.url)
                                        .paramSet(crossLayer.queryParams.seoRequest, false).href;
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

        clientApp.Ajax.View = function (historyState, cbErrFirst) {

            console.log(historyState);

            return P.all([
                clientApp.Ajax.ViewHtml(historyState.cleanUrl),
                clientApp.Ajax.ViewModel(historyState.cleanUrl)
            ]).nodeify(function (e, data) {

                if (e !== null) {
                    cbErrFirst(e, data);
                }
                else {

                    var model = data[1];
                    var hasEntry = (model.ViewEntryPoint && model.ViewEntryPoint !== null);

                    data.push(hasEntry);

                    if (hasEntry) {

                        var viewEntryPointScript = historyState.cleanUrl + model.ViewEntryPoint + "?_=" + (new Date()).getTime();

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
                            [viewEntryPointScript],
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

        clientApp.Ajax.I18nDatepicker = function (currentCulture) {

            return jQuery.ajax({
                url: '/public/bower_components/jquery-ui/ui/minified/i18n/jquery.ui.datepicker-' + currentCulture + '.min.js',
                type: "GET",
                dataType: "script",
                cache: true
            });
        };

        clientApp.Ajax.I18nAppMessages = function (currentCulture) {

            return jQuery.ajax({
                url: "/public/locales/" + currentCulture + "/clientMessages.json",
                type: "GET",
                dataType: "json",
                cache: true
            });
        };

        clientApp.Ajax.I18nData = function (currentCulture, cbErrFirst) {

            var a = [];

            if (currentCulture !== 'en') {
                a.push(clientApp.Ajax.I18nDatepicker(currentCulture));
            }
            else {
                // simulate as far as datepicker is not needed for english
                var fakeDatepickerI18n = function () {
                    var dfd = jQuery.Deferred();
                    dfd.resolve(null);
                    return dfd.promise();
                };

                a.push(fakeDatepickerI18n());
            }

            a.push(clientApp.Ajax.I18nAppMessages(currentCulture));

            return P.all(a).nodeify(function (e, data) {
                if (e !== null) {
                    cbErrFirst(e, data);
                }
                else {

                    cbErrFirst(null, {
                        I18nDatepicker: data[0],
                        I18nTexts: data[1]
                    });
                }
            });

        };

        return clientApp;
    });