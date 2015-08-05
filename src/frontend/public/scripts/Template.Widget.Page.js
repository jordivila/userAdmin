define([
    "jquery",
    "jqueryui",
    "handlebars",
    "history",

    'scripts/Template.Widget.Breadcrumb',
    "scripts/Template.Widget.Menu.nav",
    "pPromises",
    "crossLayer/config",
    "scripts/Template.App.ClientApp",
    "crossLayer/handleBarsHelper"
],
function ($, jqUI, Handlebars, hist, rcrumbs, nav, P, crossLayerConfig, clientApp, handleBarsHelpers) {

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

            $siteContent: null,
            $breadcrumbBox: null,
            $menuNav: null
        },
        _create: function () {
            this._super();

            this.options.$siteContent = jQuery('div.ui-siteContent:first');
            this.options.$breadcrumbBox = jQuery(this.element).find('div.ui-breadcrumb-box:first');
            this.options.$menuNav = jQuery(this.element).find('div[data-widget="userActivity"]:first');
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

                    jQuery(globals.domIds.panelMain).addClass('ui-display-table').removeClass("ui-helper-hidden");
                    jQuery(globals.domIds.panelProgress).addClass("ui-helper-hidden");

                    var b = [
                        self.menuNavInit(),
                        self.viewEntryPointFirstLoad()
                    ];

                    P.all(b).nodeify(function (errB, data) {
                        self._trigger('initComplete', null, null);
                    });

                }
            });

        },
        destroy: function () {

            this._super();

        },
        i18nDataInit: function () {

            var self = this;
            var dfd = jQuery.Deferred();
            var currentCulture = clientApp.utils.getCookie(crossLayerConfig.cookies.i18nLocale);

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
        viewEntryPointFirstLoad: function () {

            var dfd = jQuery.Deferred();
            var self = this;

            if (globals.viewEntryPoint) {
                require([globals.viewEntryPoint],
                    function (clientApp) {

                        var layoutDataModel = [
                                self.options.$siteContent.html(),
                                globals,
                                true
                        ];

                        self.handlebarsLoadTemplateDataTry(dfd, layoutDataModel);
                    },
                    function (errRequiring) {
                        self.handlebarsLoadTemplateError(dfd, errRequiring);
                    });
            }
            else {
                self.breadcrumbRender(globals);
            }

            return dfd.promise();
        },
        menuNavInit: function () {

            var dfd = jQuery.Deferred();
            var self = this;

            this.options.$menuNav.menuNav({
                complete: function () {
                    dfd.resolve();
                },
                selected: function (e, ui) {
                    //clientApp.template.loadByUrl(ui.url);
                    History.pushState({ isMenuEvent: true }, null, ui.url);
                }
            });

            return dfd.promise();
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
                        .done(function () {
                            if (state.data.isMenuEvent === true) {
                                // in case isMenuEvent === true 
                                // no need to set active menu item as far as user has clicked on it
                            }
                            else {
                                // in case isMenuEvent !== true
                                // try setting active menu items
                                self.options.$menuNav.menuNav('setCurrentUrl');
                            }
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


            Handlebars.registerHelper('breadcrumbHelper', handleBarsHelpers.breadcrumbHelper);





            dfd.resolve();

            return dfd.promise();


        },
        handlebarsLoadTemplate: function (state) {

            var self = this;
            var dfd = jQuery.Deferred();

            this.options.$siteContent.empty();
            this.options.$breadcrumbBox.empty();

            dfd.notify(self.options.texts.loadingTmpl);

            clientApp.ajax.view(state, function (err, data) {

                if (err !== null) {
                    self.handlebarsLoadTemplateError(dfd, err);
                }
                else {
                    self.handlebarsLoadTemplateDataTry(dfd, data);
                }
            });

            return dfd.promise();
        },
        handlebarsLoadTemplateError: function (dfd, err) {
            console.error(err);

            jQuery('body')
                .find('h1:first')
                    .html(err.statusText ? err.statusText : '');

            this.breadcrumbRender({});

            dfd.reject("{0}: {1} - error - {2}".format(
                 this.options.texts.errLoadingTmpl,
                 err.status ? err.status : '',
                 err.statusText ? err.statusText : ''
                ));

        },
        handlebarsLoadTemplateDataTry: function (dfd, data) {
            try {
                this.handlebarsLoadTemplateData(data);
                dfd.resolve();
            }
            catch (errLoadigndata) {
                console.error(errLoadigndata);
                dfd.reject(this.options.texts.errInModule);
            }
        },
        handlebarsLoadTemplateData: function (data) {

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


            this.breadcrumbRender(model);
            this.options.$siteContent.html(handlebarTemplate);

            if (hasEntry) {
                clientApp.view.main();
            }

        },
        breadcrumbInitWidget: function () {
            jQuery(this.element).find("div.ui-breadcrumb:first").breadcrumb({
                select: function (event, url) {
                    History.pushState(null, null, url);
                }
            });
        },
        breadcrumbRender: function (model) {

            var self = this;
            var doRender = function () {
                var htmlBreadcrumb = '{{{ breadcrumbHelper this }}}';
                var modelBreadcrumb = model;
                var templateBreadcrumb = Handlebars.compile(htmlBreadcrumb);
                var handlebarBreadcrumbTemplate = templateBreadcrumb(jQuery.extend({}, modelBreadcrumb, {}));


                self.options.$breadcrumbBox.append(handlebarBreadcrumbTemplate);

                self.breadcrumbInitWidget();
            };

            if (Array.isArray(model.breadcrumb)) {
                doRender();
            }
            else {
                if (model.breadcrumb === true) {
                    model.breadcrumb = clientApp.view.breadcrumb();
                    doRender();
                }
                else {
                    this.options.$breadcrumbBox.empty();
                }
            }

        }
    });
});