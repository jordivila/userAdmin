define([
    "jquery",
    "scripts/Template.App.Init",
    "scripts/url/UrlHelper",
    "scripts/Template.App.Page.Init",
    "pPromises",
],
    function ($, VsixMvcAppResult, urlHelper, pInit, P) {


        jQuery(document).ready(function () {
            jQuery.ajaxSetup({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr, settings) {

                    var urlHelper = new UrlHelper(settings.url);

                    if (urlHelper.hostname == window.location.hostname) {
                        settings.url = new UrlHelper(settings.url).paramSet("appVersion", VsixMvcAppResult.Widgets.PageOptions.appVersion).href;
                        settings.url = new UrlHelper(settings.url).paramSet("seoRequest", false).href;
                    }
                }
            });
        });

        VsixMvcAppResult.Ajax = {};

        VsixMvcAppResult.Ajax.UserMenu = function (cbErrFirst) {
            return P(jQuery.ajax({
                url: "/api/user/menu",
                type: "GET",
                data: {},
                cache: false
            })).nodeify(function (error, value) {
                cbErrFirst(error, value);
            });
        };

        VsixMvcAppResult.Ajax.ViewHtml = function (templUrl) {
            return jQuery.ajax({
                url: templUrl,
                type: "GET",
                dataType: "html",
                cache: true,
            });
        };

        VsixMvcAppResult.Ajax.ViewModel = function (templUrl) {
            return jQuery.ajax({
                url: templUrl + 'index.handlebars.json',
                type: "GET",
                dataType: "json",
                cache: false,    // view model MUST NOT be chached
            });
        };

        VsixMvcAppResult.Ajax.View = function (templUrl, cbErrFirst) {
            return P.all([
                VsixMvcAppResult.Ajax.ViewHtml(templUrl),
                VsixMvcAppResult.Ajax.ViewModel(templUrl),
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
                            function (VsixMvcAppResult) {
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

        return VsixMvcAppResult;
    });