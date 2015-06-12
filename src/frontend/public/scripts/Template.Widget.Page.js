define([
    "jquery",
    "jqueryui",
    "scripts/Template.Widget.Menu.nav",
    "scripts/Template.App.Globalize.Init"
],
function ($, jqUI, nav, VsixMvcAppResult) {

    jQuery.widget("ui.page", jQuery.ui.widgetBase, {
        options: {
            cultureGlobalization: null,
            cultureDatePicker: null,
            defaultTheme: null
        },
        _init: function () {

            var self = this;

            this._super();


            self.initDatepicker()
                .done(function () {
                    self.initMenuNav();
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
        initMenuNav: function () {

            var self = this;

            jQuery(this.element).find('div[data-widget="userActivity"]:first').menuNav({
                complete: function () {
                    self._trigger('initComplete', null, null);
                }
            });
        },
        initDatepicker: function () {

            var self = this;

            var dfd = jQuery.Deferred();

            if (self.options.cultureDatePicker !== 'en') {
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
    });



});