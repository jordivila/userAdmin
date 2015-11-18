define([
    "jquery",
    "scripts/Template.Class.UrlHelper",
    "pPromises",
    "crossLayer/config"
],
    function ($, UrlHelper, P, crossLayer) {

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

                        //settings.url = urlHelper
                        //                .bind(settings.url)
                        //                .paramSet(crossLayer.queryParams.seoRequest, false).href;
                    }
                }
            });
            //});
        };

        Ajax.prototype.userMenu = function (callback) {

            return P(jQuery.ajax({
                url: "/" + globals.domainInfo.virtualDirectory + "api/user/menu",
                type: "GET",
                data: {},
                cache: false
            })).nodeify(function (error, value) {
                callback(error, value);
            });
        };

        Ajax.prototype.viewHtml = function (templUrl) {
            return jQuery.ajax({
                url: templUrl,
                type: "GET",
                dataType: "html",
                cache: true,
            });
        };

        Ajax.prototype.viewModel = function (templUrl) {

            var urlHelper = new UrlHelper(templUrl);

            return jQuery.ajax({
                url: "{0}index.handlebars.json{1}".format(urlHelper.pathname, urlHelper.search),
                type: "GET",
                dataType: "json",
                cache: false,    // view model MUST NOT be chached
            });
        };

        Ajax.prototype.view = function (historyState, callback) {

            var self = this;

            return P.all([
                self.viewHtml(historyState.cleanUrl),
                self.viewModel(historyState.cleanUrl)
            ]).nodeify(function (e, data) {

                if (e !== null) {
                    callback(e, data);
                }
                else {

                    var model = data[1];
                    var hasEntry = (model.viewEntryPoint && model.viewEntryPoint !== null);
                    var viewEntryPointScript = null;

                    data.push(hasEntry);

                    if (hasEntry) {

                        var urlHelper = new UrlHelper(historyState.cleanUrl);
                        
                        viewEntryPointScript = "{0}{1}{2}?_={3}".format(
                            urlHelper.origin,  //-> "http://localhost:3001"
                            urlHelper.pathname, //-> /some/url/route/"
                            model.viewEntryPoint, //-> index.js
                            (new Date()).getTime());    //-> 

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
                                callback(e, data);
                            },
                            function (errRequiring) {
                                callback(errRequiring, data);
                            });
                    }
                    else {
                        callback(null, data);
                    }
                }
            });
        };

        Ajax.prototype.i18nDatepicker = function (currentCulture) {

            return jQuery.ajax({
                url: '/' + globals.domainInfo.virtualDirectory + 'public/bower_components/jquery-ui/ui/minified/i18n/jquery.ui.datepicker-' + currentCulture + '.min.js',
                type: "GET",
                dataType: "script",
                cache: true
            });
        };

        Ajax.prototype.i18nAppMessages = function (currentCulture) {

            return jQuery.ajax({
                url: "/" + globals.domainInfo.virtualDirectory + "public/locales/" + currentCulture + "/clientMessages.json",
                type: "GET",
                dataType: "json",
                cache: true
            });
        };

        Ajax.prototype.i18nData = function (currentCulture, callback) {

            var a = [];

            if (currentCulture !== 'en') {
                a.push(this.i18nDatepicker(currentCulture));
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

            a.push(this.i18nAppMessages(currentCulture));

            return P.all(a).nodeify(function (e, data) {
                if (e !== null) {
                    callback(e, data);
                }
                else {

                    callback(null, {
                        I18nDatepicker: data[0],
                        I18nTexts: data[1]
                    });
                }
            });

        };

        return Ajax;
    });