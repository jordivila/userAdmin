define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "scripts/crud/common.widget.crud.base"],
       function ($, jqUI, clientApp) {

           jQuery.widget("ui.crudForm", jQuery.ui.crudBase,
           {
               options: {
                   formButtonsDOMId: null,
                   formButtonsGet: function (self, defaultButtons) {
                       return defaultButtons;
                   },
                   formBind: function (self, dataItem) {
                       throw new Error(self.namespace + '.' + self.widgetName + ".formBind() is an abstract method. Child class method must be implemented");
                   },

                   texts: {
                       buttonCancelText: clientApp.i18n.texts.get("Template.Widget.Crud.Cancel"),
                       buttonSaveText: clientApp.i18n.texts.get("Template.Widget.Crud.SaveChanges"),
                       UnhandledBindingError: clientApp.i18n.texts.get("Template.Widget.Crud.UnhandledErrorBindingFormData"),
                       SaveBeginText: clientApp.i18n.texts.get("Template.Widget.Crud.SavingData"),
                       SavingErrorUnhandled: clientApp.i18n.texts.get("Template.Widget.Crud.UnhandledErrorSavingFormData")
                   }
               },
               _create: function () {

                   this._super();

                   jQuery(this.element)
                       .addClass('ui-crudForm ui-helper-hidden')
                       .append('<div class="ui-crudForm-modelBinding"></div>')
                       .children()
                           .wrapAll('<div class="ui-crudForm-formContent " />')
                       .end()
                       .prepend('<div class="ui-crudForm-buttons ui-ribbonButtons  ui-state-default">');

                   this.options.formButtonsDOMId = jQuery(this.element).find('div.ui-crudForm-buttons:first');

                   this._formButtonsInit();
               },
               _init: function () {

                   this._super();
               },
               _formButtonsInit: function () {

                   var self = this;

                   var defaultButtons = this.options.formButtonsGet(this, [{
                       id: "cancel",
                       text: self.options.texts.buttonCancelText,
                       cssClass: "ui-cancel-button",
                       icon: "ui-icon-circle-arrow-w",
                       click: function (self) {
                           self._trigger('cancel', null, null);
                       }
                   }, {
                       id: "save",
                       text: self.options.texts.buttonSaveText,
                       cssClass: "ui-save-button",
                       icon: "ui-icon-disk",
                       click: function (self) {
                           self._save();
                       }
                   }]);

                   for (var i = 0; i < defaultButtons.length; i++) {
                       this._initButton(this, defaultButtons[i], jQuery(this.options.formButtonsDOMId));
                   }

                   jQuery(this.options.formButtonsDOMId).append('<div class="ui-helper-clearfix"></div>');

               },
               destroy: function () {

                   this._super();
               },
               bind: function (dataItem) {
                   try {
                       jQuery(this.element)
                           .data('lastBoundItem', dataItem)
                           .find('div.ui-crudForm-modelBinding:first')
                               .widgetModel('bindValue', dataItem.editData)
                           .end();

                       this.options.formBind(this, dataItem);
                       this._trigger('dataBound', null, dataItem);
                   } catch (e) {
                       console.error(e);
                       this._trigger('errorDisplay', null, this.options.texts.UnhandledBindingError);
                   }
               },
               _save: function () {

                   var self = this;

                   self._formSave(this)
                           .progress(function (status) {
                               self.progressShow(status);
                           })
                           .fail(function (args) {
                               self.progressHide();
                               self._trigger('errorDisplay', null, args);
                           })
                           .always(function () {
                               self.progressHide();
                           });
               },
               _formSave: function () {

                   var self = this;
                   var dfd = jQuery.Deferred();

                   if (self.options.formSaveMethod === null) {
                       dfd.reject(self.namespace + '.' + self.widgetName + ".options.formSaveMethod is an abstract method. Child class must implement");
                   }
                   else {
                       dfd.notify(self.options.texts.SaveBeginText);

                       var viewModel = self._formValueGet();

                       jQuery.when(self.options.formSaveMethod(viewModel))
                       .then(
                               function (result, statusText, jqXHR) {


                                   console.log(result);

                                   if (result.isValid) {
                                       self._trigger('messagedisplayAutoHide', null, result.messages[0], 50);
                                       self._trigger('change', null, result.data);
                                       self.bind(result.data);
                                       dfd.resolve();
                                   }
                                   else {
                                       if (result.data) {

                                           jQuery(self.element)
                                               .find('div.ui-crudForm-modelBinding:first')
                                               .widgetModel('bindErrors', result.data.modelState);
                                       }
                                       dfd.reject(result.messages[0]);
                                   }
                               },
                               function (jqXHR, textStatus, errorThrown) {
                                   dfd.reject(self.options.texts.SavingErrorUnhandled);
                               })
                       .done(function () {

                       });
                   }
                   return dfd.promise();
               },
               _formValueGet: function () {
                   var dataItem = jQuery(this.element).data('lastBoundItem');
                   var formData = jQuery(this.element).find('div.ui-crudForm-modelBinding:first').widgetModel('valAsObject');
                   var result = jQuery.extend({}, dataItem, { formData: formData });
                   return this.options.formValueGet(this, result);
               }

           });



       });