define([
    "jquery",
    "jqueryui",
    "handlebars",
    "history",
    "scripts/Template.Widget.Menu.nav",
    "pPromises",
    "crossLayer/config",
    "scripts/Template.App.Init"
],
function ($, jqUI, Handlebars, hist, nav, P, crossLayer, clientApp) {

    jQuery.widget("ui.page", jQuery.ui.widgetBase, {
        options: {
            cultureDatePicker: null,
            texts: {
                loadingTmpl: "Loading template",
                loadingI18n: "Loading i18n data",
                errLoadingTmpl: "Error loading template",
                errLoadingI18nData: "Unhandled error getting data. Unable to continue loading site.",
                errInModule: "The module loaded has thrown an unhandled exception"
            },
        },
        _init: function () {

            var self = this;

            this._super();



            var a = [
                self.i18nDataInit(),
                self.historyInit(),
                self.handlebarsInit(),

            ];

            P.all(a).nodeify(function (e, data) {
                if (e !== null) {
                    self.errorDisplay(e);
                }
                else {
                    self.menuNavInit();
                }
            });



            //self.i18nDataInit()
            //    .done(function () {
            //        self.historyInit()
            //            .done(function () {
            //                self.handlebarsInit()
            //                    .done(function () {
            //                        self.menuNavInit();
            //                    })
            //                    .fail(function (eMsg) {
            //                        self.errorDisplay(eMsg);
            //                    });
            //            })
            //            .fail(function (eMsg) {
            //                self.errorDisplay(eMsg);
            //            });
            //    })
            //    .fail(function (eMsg) {
            //        self.errorDisplay(eMsg);
            //    });

        },
        _create: function () {
            this._super();
        },
        destroy: function () {

            this._super();

        },
        i18nDataInit: function () {

            var self = this;
            var dfd = jQuery.Deferred();
            var currentCulture = clientApp.utils.getCookie(crossLayer.cookies.i18nLocale);

            dfd.notify(self.options.texts.loadingI18n);

            clientApp.ajax.i18nData(currentCulture, function (err, data) {

                if (err !== null) {
                    console.error(err);
                    dfd.reject(self.options.texts.errLoadingI18nData);
                }
                else {

                    if (data.i18nDatepicker !== null) {
                        jQuery.datepicker.setDefaults(jQuery.datepicker.regional[self.options.cultureDatePicker]);
                    }

                    clientApp.i18n.texts.data = data.I18nTexts;
                    clientApp.globalizer.i18nTexts = data.I18nTexts;

                    dfd.resolve();
                }
            });

            return dfd.promise();
        },
        menuNavInit: function () {

            var self = this;

            jQuery(this.element).find('div[data-widget="userActivity"]:first').menuNav({
                complete: function () {
                    self._trigger('initComplete', null, null);
                },
                selected: function (e, ui) {
                    History.pushState(null, null, ui.url);
                }
            });
        },
        historyInit: function () {

            var self = this;
            var dfd = jQuery.Deferred();

            History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate



                var state = History.getState(); // Note: We are using History.getState() instead of event.state



                History.debug('statechange:', state.data, state.title, state.url);





                self.handlebarsLoadTemplate(state)
                        .progress(function (msg) {
                            self.progressShow(msg);
                        })
                        .fail(function (msg) {
                            jQuery('div.ui-siteContent:first').html('<div class="ui-state-error ui-site-templateInfo">{0}</div>'.format(msg));
                        })
                        .always(function () {
                            self.progressHide();
                        });
            });

            dfd.resolve();

            return dfd.promise();

        },
        handlebarsInit: function () {

            var dfd = jQuery.Deferred();



            Handlebars.registerHelper('__', function (context, options) {
                // register i18n helper function

                if (Object.keys(options.data.root.i18nTexts).indexOf(context) > -1) {
                    return options.data.root.i18nTexts[context];
                }
                else {
                    return context;
                }
            });



            dfd.resolve();

            return dfd.promise();


        },
        handlebarsLoadTemplate: function (state) {

            var self = this;
            var $siteContent = jQuery('div.ui-siteContent:first');

            var dfd = jQuery.Deferred();

            $siteContent.empty();


            dfd.notify(self.options.texts.loadingTmpl);

            clientApp.ajax.view(state, function (err, data) {

                if (err !== null) {

                    console.error(err);

                    dfd.reject("{0}: {1} - error - {2}".format(
                         self.options.texts.errLoadingTmpl,
                         err.status ? err.status : '',
                         err.statusText ? err.statusText : ''
                        ));
                }
                else {

                    var html = data[0] + "{{#each cssFiles}}<link href='{{this}}' rel='Stylesheet' type='text/css' />{{/each}}";
                    var model = data[1];
                    var hasEntry = data[2];
                    var template = Handlebars.compile(html);
                    var templateContext = {};
                    var handlebarTemplate = template(jQuery.extend({}, model, templateContext));

                    if (model.title) {
                        jQuery('body')
                            .find('h1:first')
                                .html(model.title);
                    }

                    $siteContent.html(handlebarTemplate);

                    if (hasEntry) {

                        try {
                            clientApp.view.main();
                            dfd.resolve();
                        }
                        catch (e) {
                            console.error(e);
                            dfd.reject(self.options.texts.errInModule);
                        }
                    }
                    else {
                        dfd.resolve();
                    }
                }
            });

            return dfd.promise();
        },
    });
});