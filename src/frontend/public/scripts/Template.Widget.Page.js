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

                   //VsixMvcAppResult.Globalizer.init(this.options.cultureGlobalization)
                    //.done(function () {
                        
                        self.initDatepicker();
                        self.initMenuNav();

                    //});

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

                   jQuery.datepicker.setDefaults(jQuery.datepicker.regional[this.options.cultureDatePicker]);

               },
           });

          

       });