define([
    "jquery",
    "jqueryui",
    "/public/scripts/Template.Widget.Menu.nav.js",
    "/public/scripts/Template.App.Widgets.Init.js",
    "/public/scripts/Template.App.Globalize.Init.js"
],
function ($, jqUI, nav, VsixMvcAppResult, VsixMvcAppResult2) {

           /*******************************************************************************
                                           WIDGET DEFINITION
           ********************************************************************************/

           jQuery.widget("ui.page", jQuery.ui.widgetBase, {
               options: {
                   cultureGlobalization: null,
                   cultureDatePicker: null,
                   defaultTheme: null
               },
               _init: function () {

                   var self = this;

                   this._super();


                   VsixMvcAppResult.Globalizer.init(this.options.cultureGlobalization)
                    .done(function () {
                        
                        self.initDatepicker();
                        self.initMenuNav();

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

                   jQuery.datepicker.setDefaults(jQuery.datepicker.regional[this.options.cultureDatePicker]);

               },
           });


           /*******************************************************************************
                                           HELPER PUBLIC METHODS
           ********************************************************************************/

           VsixMvcAppResult.Widgets.PageOptions = {
               selector: null,
               cultureGlobalization: null,
               cultureDatePicker: null,
               _initCallbacks: [],
               onInit: function (callBack) {
                   this._initCallbacks.push(callBack);
               },
               Init: function () {
                   var self = this;
                   jQuery(this.selector).page({
                       cultureGlobalization: this.cultureGlobalization,
                       cultureDatePicker: this.cultureDatePicker,
                       initComplete: function () {

                           for (var i = 0; i < self._initCallbacks.length; i++) {
                               self._initCallbacks[i]();
                           }
                       }
                   });
               }
           };

           return VsixMvcAppResult;

       });