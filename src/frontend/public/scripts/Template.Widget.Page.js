define([
    "jquery",
    "jqueryui",
    "handlebars",
    "history",
    "scripts/Template.Widget.Menu.nav",
    "scripts/Template.App.Globalize.Init"
],
function ($, jqUI, Handlebars, hist, nav, clientApp) {

    jQuery.widget("ui.page", jQuery.ui.widgetBase, {
        options: {
            cultureDatePicker: null,
            texts: {
                loadingTmpl: "Loading template",
                errLoadingTmpl: "Error loading template"
            },
        },
        _init: function () {

            var self = this;

            this._super();

            self.datepickerInit()
                .done(function () {
                    self.historyInit()
                        .done(function () {
                            self.handlebarsInit()
                                .done(function () {
                                    self.menuNavInit();
                                })
                                .fail(function (eMsg) {
                                    self.errorDisplay(eMsg);
                                });
                        })
                        .fail(function (eMsg) {
                            self.errorDisplay(eMsg);
                        });
                })
                .fail(function (eMsg) {
                    self.errorDisplay(eMsg);
                });

        },
        _create: function () {
            this._super();
        },
        destroy: function () {

            this._super();

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
        datepickerInit: function () {

            var self = this;

            var dfd = jQuery.Deferred();

            if (self.options.cultureDatePicker !== 'en') {

                dfd.notify("Loading calendar...");

                require(['bower_components/jquery-ui/ui/minified/i18n/jquery.ui.datepicker-' + self.options.cultureDatePicker + '.min'],
                    function (d) {

                        jQuery.datepicker.setDefaults(jQuery.datepicker.regional[self.options.cultureDatePicker]);

                        dfd.resolve();

                    }, function (err) {

                        dfd.reject("Error loading datepicker culture");

                    });
            }
            else {
                dfd.resolve();
            }

            return dfd.promise();
        },
        historyInit: function () {

            var self = this;
            var dfd = jQuery.Deferred();

            History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate
                var state = History.getState(); // Note: We are using History.getState() instead of event.state
                History.log('statechange:', state.data, state.title, state.url);
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
            var templUrl = state.hash;

            var dfd = jQuery.Deferred();

            $siteContent.empty();

            clientApp.Ajax.View(templUrl, function (err, data) {

                if (err !== null) {
                    console.error(new Error("Error loading view data", arguments));
                    dfd.reject("Error getting view data");
                }
                else {

                    var html = data[0] + "{{#each cssFiles}}<link href='{{this}}' rel='Stylesheet' type='text/css' />{{/each}}";
                    var model = data[1];
                    var hasEntry = data[2];
                    var template = Handlebars.compile(html);
                    var templateContext = {};
                    var handlebarTemplate = template(jQuery.extend({}, model, templateContext));

                    if (model.Title) {
                        jQuery('body')
                            .find('h1:first')
                                .html(model.Title);
                    }


                    $siteContent.html(handlebarTemplate);


                    if (hasEntry) {

                        clientApp.View.main();

                        dfd.resolve();
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