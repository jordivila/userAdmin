define([
    "jquery",
    "jqueryui",
    "/public/scripts/Template.Widget.Base.js",
    "/public/scripts/Template.App.Resources.Init.js"
],
       function ($, jqUI, wBase, VsixMvcAppResult) {


           jQuery.widget("ui.widgetModelItemDate", jQuery.ui.widgetBase,
           {
               options: {
                   value: null,
                   text: VsixMvcAppResult.Resources.clickToPickDate
               },
               _create: function () {
                   this._super();
               },
               _init: function () {

                   var self = this;

                   this._super();

                   if (!jQuery(this.element).hasClass('hasDatepicker')) {

                       jQuery(this.element)
                           .hide()
                           .datepicker({
                               showButtonPanel: true,
                               changeMonth: true,
                               changeYear: true,
                               gotoCurrent: true,
                               onSelect: function () {
                                   self._setDateLabel();
                                   self._change();
                               }
                           });



                       if (jQuery(this.element).attr('data-isWrapped') === undefined) {
                           jQuery(this.element).wrap('<div class="ui-widgetModelItemDate ui-helper-clearfix"></div>')
                                               .parents('div.ui-widgetModelItemDate:first')
                                               .append('<div class="ui-state-error ui-widget-close ui-corner-all ui-icon ui-icon-close" style="display: block;"></div>')
                                               .find('div.ui-state-error')
                                                   .hide()
                                               .end()
                                               .append('<div class="ui-widgetModelItemDate-text"><a href="javascript:void(0);">' + self.options.text + '</a></div>')

                           //.append('<div class="ui-state-error"><span class="ui-icon ui-icon-circle-close"></span></div>')
                           ;
                       }

                       jQuery(this.element)
                           .parents('div:first')
                               .find('div.ui-state-error')
                                   .click(function () {
                                       jQuery(this).hide();
                                       jQuery(self.element)
                                               .val('')
                                               .parents('div:first')
                                                   .find('a')
                                                       .html(self.options.text);
                                       self._change();

                                   })
                               .end()
                               .find('a')
                                   .click(function () {
                                       jQuery(self.element).datepicker('show');
                                   });

                       jQuery(this.element).datepicker('setDate', self.options.value);
                       if (self.options.value !== null) {
                           self._setDateLabel();
                       }
                   }
               },
               destroy: function () {

                   jQuery(this.element).unwrap();

                   this._super();
               },
               _change: function () {

                   this._trigger('change', null, {});

               },
               _setDateLabel: function () {
                   var self = this;

                   var d = jQuery(self.element).datepicker('getDate');

                   jQuery(self.element)
                       .parents('div:first')
                       .find('a')
                           .html(d === null ? self.options.text : Globalize.format(d, "D"))
                       .end()
                       .find('div')
                           .show();
               },
               getDate: function () {
                   if (jQuery(this.element).find('input').val() !== '') {
                       return jQuery(this.element).datepicker('getDate');
                   }
                   else {
                       return null;
                   }
               },
               setDate: function (value) {
                   jQuery(this.element).datepicker('setDate', value);
                   this._setDateLabel();
               },
           });

       });