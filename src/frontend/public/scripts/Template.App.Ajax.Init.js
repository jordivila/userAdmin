define([
    "jquery",
    "scripts/url/UrlHelper",
    "pPromises",
    "crossLayer/config"
],
    function ($, urlHelper, P, crossLayer) {

        function Ajax() {
            this.setDefaults();
        }

        Ajax.prototype.setDefaults = function () {
            //jQuery(document).ready(function () {
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
                                            globals.package.version).href;

                        settings.url = urlHelper
                                        .bind(settings.url)
                                        .paramSet(crossLayer.queryParams.seoRequest, false).href;
                    }
                }
            });
            //});
        };

        Ajax.prototype.UserMenu = function (cbErrFirst) {
            return P(jQuery.ajax({
                url: "/api/user/menu",
                type: "GET",
                data: {},
                cache: false
            })).nodeify(function (error, value) {
                cbErrFirst(error, value);
            });
        };

        Ajax.prototype.ViewHtml = function (templUrl) {
            return jQuery.ajax({
                url: templUrl,
                type: "GET",
                dataType: "html",
                cache: true,
            });
        };

        Ajax.prototype.ViewModel = function (templUrl) {
            return jQuery.ajax({
                url: templUrl + 'index.handlebars.json',
                type: "GET",
                dataType: "json",
                cache: false,    // view model MUST NOT be chached
            });
        };

        Ajax.prototype.View = function (historyState, cbErrFirst) {

            var self = this;

            return P.all([
                self.ViewHtml(historyState.cleanUrl),
                self.ViewModel(historyState.cleanUrl)
            ]).nodeify(function (e, data) {

                if (e !== null) {
                    cbErrFirst(e, data);
                }
                else {

                    var model = data[1];
                    var hasEntry = (model.ViewEntryPoint && model.ViewEntryPoint !== null);
                    var viewEntryPointScript = null;

                    data.push(hasEntry);

                    if (hasEntry) {

                        viewEntryPointScript = historyState.cleanUrl + model.ViewEntryPoint + "?_=" + (new Date()).getTime();

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
                        cbErrFirst(null, data);
                    }
                }
            });
        };

        Ajax.prototype.I18nDatepicker = function (currentCulture) {

            return jQuery.ajax({
                url: '/public/bower_components/jquery-ui/ui/minified/i18n/jquery.ui.datepicker-' + currentCulture + '.min.js',
                type: "GET",
                dataType: "script",
                cache: true
            });
        };

        Ajax.prototype.I18nAppMessages = function (currentCulture) {

            return jQuery.ajax({
                url: "/public/locales/" + currentCulture + "/clientMessages.json",
                type: "GET",
                dataType: "json",
                cache: true
            });
        };

        Ajax.prototype.I18nData = function (currentCulture, cbErrFirst) {

            var a = [];

            if (currentCulture !== 'en') {
                a.push(this.I18nDatepicker(currentCulture));
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

            a.push(this.I18nAppMessages(currentCulture));

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

        return Ajax;
    });