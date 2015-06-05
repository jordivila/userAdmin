
 'use strict'
 define(["jquery", "jqueryui", "history", "handlebars"],function (jQuery, jqUI, historyReq, Handlebars) { var appVersion = "0.0.6860";  jQuery.noConflict();// Source: src/frontend/public/scripts/Template.ExtendPrototypes.js

if (!window.console) {
    console = {
        log: function (msg) {

        }
    };
}

// C# String.Format-> "Hello {0}".format("world")
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}



if (!String.prototype.padIndex)
{
    String.prototype.padIndex = function (maxLength, repeatChar) {

        if (!repeatChar) {
            repeatChar = '0';
        }

        function pad(str, max) {
            str = str.toString();
            return str.length < max ? pad(repeatChar + str, max) : str;
        }

        return pad(this.toString(), maxLength);
    };
}

/*jslint evil: true */
String.prototype.toDateFromAspNet = function () {
    var dte = eval("new " + this.replace(/\//g, '') + ";");
    dte.setMinutes(dte.getMinutes() - dte.getTimezoneOffset());
    return dte;
};

String.prototype.toBoolean = function () {
    return (/^true$/i).test(this);
};

function parseBoolean(value) {
    return value.toBoolean();
}
;// Source: src/frontend/public/scripts/Template.App.Init.js
define([],
       function () {


           var VsixMvcAppResult = {};

           //    return VsixMvcAppResult;
           //});

           VsixMvcAppResult.Utils = {

               getCookie: function (cname) {
                   var name = cname + "=";
                   var ca = document.cookie.split(';');
                   for (var i = 0; i < ca.length; i++) {
                       var c = ca[i];
                       while (c.charAt(0) == ' ') c = c.substring(1);
                       if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
                   }
                   return "";
               }

           };

           return VsixMvcAppResult;

       });;// Source: src/frontend/public/scripts/Template.App.Ajax.Init.js
define(["jquery", "scripts/Template.App.Init", "scripts/url/UrlHelper"],
       function ($, VsixMvcAppResult) {


           jQuery(document).ready(function () {
               jQuery.ajaxSetup({
                   type: "GET",
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   beforeSend: function (xhr, settings) {

                       var urlHelper = new UrlHelper(settings.url);

                       if (urlHelper.hostname == window.location.hostname) {
                           settings.url = new UrlHelper(settings.url).paramSet("appVersion", appVersion).href;
                           settings.url = new UrlHelper(settings.url).paramSet("seoRequest", false).href;
                       }
                   }
               });
           });

           VsixMvcAppResult.Ajax = {};

           VsixMvcAppResult.Ajax.onOkKoComplete = function (opts, onOK, onKO, onComplete) {

               var jqxhr = jQuery.ajax(opts)
                                   .done(function (data, textStatus, jqXHR) {
                                       onOK(data);
                                   })
                                   .fail(function (jqXHR, textStatus, errorThrown) {
                                       onKO(jqXHR);
                                   })
                                   .always(function (jqXHR, textStatus, errorThrown) {
                                       onComplete();
                                   });

               return jqxhr;
           };

           VsixMvcAppResult.Ajax.UserMenu = function (onOK, onKO, onComplete) {
               VsixMvcAppResult.Ajax.onOkKoComplete({
                   url: "/api/user/menu",
                   type: "GET",
                   data: {},
                   cache: false
               }, onOK, onKO, onComplete);
           };

           return VsixMvcAppResult;
       });;// Source: src/frontend/public/scripts/Template.App.Widgets.Init.js
define(["scripts/Template.App.Init"],
       function (VsixMvcAppResult) {

           VsixMvcAppResult.Widgets = {};

           return VsixMvcAppResult;

       });;// Source: src/frontend/public/scripts/Template.App.Resources.Init.js
define(["scripts/Template.App.Init"],
       function (VsixMvcAppResult) {

           VsixMvcAppResult.Resources = {
               accept: "Aceptar",
               cancel: "Cancelar",
               clickToPickDate: "Click aqui para seleccionar una fecha",
               close: "Cerrar",
               confirmToContinue: "Porfavor, confirma para continuar",
               email: "Email",
               emailFormatNotValid: "Formato de email incorrecto",
               errorsInForm: "Existen errores en el formulario",
               mandatoryField: "Campo obligatorio",
               minLengthIs: "el mínimo número de caracteres es ",
               noResultsFound: "No se encontraron resultados",
               password: "Contraseña",
               passwordsDoNotMatch: "Las contraseñas no correspondes",
               siteTitle: "Template MVC III",
               unExpectedError: "Ha ocurrido un error no controlado",
               userName: "Usuario",
               validate: "Validar"
           };


           return VsixMvcAppResult;
       });
;// Source: src/frontend/public/scripts/Template.Widget.Base.js

var progressBoxSelector = "#progressFeedBack";

define(["jquery", "jqueryui", "scripts/Template.ExtendPrototypes"],
       function ($, jqUI) {

           jQuery.widget("ui.widgetBase",
           {
               options: {
                   allowClose: false,      // creates a close button on the top-right of a widget
                   allowCollapse: false,   // creates a collapse button
                   isCollapsed: false,     // initializes as a collapsed item
                   onCollapsed: function (e, isVisible) { },      // callback used when onCollapsed is fired 

                   errorDOMId: null,       // in case widget needs feedback error messages
                   messagesDOMId: null     // in case widget needs feedback success messages

               },
               _create: function () {

                   this._super();

                   jQuery(this.element).addClass(this.namespace + '-' + this.widgetName);


                   this.progressInit();

                   //this.log(this.element);
                   //this.log(this.namespace + "." + this.widgetName + " -> create");
               },
               _init: function () {

                   this._super();

                   this.allowClose();
                   this.allowCollapse();


                   //this.log(this.element);
                   this.log("{0}.{1}->Init->{2}".format(this.namespace, this.widgetName, jQuery(this.element)[0].className));

                   var widgetName = this.namespace + '.' + this.widgetName;
                   var dataWidgetInitialized = widgetName + ".IsInitialized";

                   if (jQuery(this.element).data(dataWidgetInitialized) === undefined) {
                       jQuery(this.element).data(dataWidgetInitialized, true);
                   }
                   else {
                       throw new Error("Widget is already initialized. Reinitializing would duplicate events." + widgetName);
                   }


               },
               destroy: function () {

                   this._super();

                   //jQuery.removeData(jQuery(this.element)); // ??

                   this.log(this.namespace + "." + this.widgetName + " -> destroy");


               },
               log: function (logMessage) {
                   if (window.console) {
                       console.log(logMessage);
                   }
               },
               boxButtonsContainerGet: function () {
                   var self = this;

                   if (jQuery(this.element)
                       .find('div.ui-widget-header:first')
                           .find('div.ui-widget-boxButtons:first')
                           .length === 0) {
                       jQuery(this.element)
                           .find('div.ui-widget-header:first')
                               .wrapInner("<div class='ui-widget-headerText'></div>")
                               .append('<div class="ui-widget-boxButtons"></div>');
                   }

                   return jQuery(this.element)
                           .find('div.ui-widget-header:first')
                               .find('div.ui-widget-boxButtons:first');
               },
               allowClose: function () {

                   if (this.options.allowClose) {

                       var self = this;

                       var $p = self.boxButtonsContainerGet();

                       $p.append('<div class="ui-widget-close ui-corner-all ui-icon ui-icon-close"></div>')
                         .find('div.ui-widget-close:first')
                           .click(function () {
                               jQuery(self.element).toggle();
                           })
                           .show();
                   }
               },
               allowCollapse: function () {

                   if (this.options.allowCollapse) {
                       var self = this;

                       var collapseFunc = function () {
                           var $content = jQuery(self.element).find('div.ui-widget-content');
                           $content.toggle();
                           jQuery(self.element).find('div.ui-widget-collapse:first').toggleClass('ui-icon-triangle-1-n', $content.is(':visible')).toggleClass('ui-icon-triangle-1-s', !$content.is(':visible'));
                           self._trigger('onCollapsed', null, ($content.is(':visible') ? true : false));
                       };

                       var $p = self.boxButtonsContainerGet();

                       $p.append('<div class="ui-widget-collapse ui-corner-all ui-icon ui-icon-triangle-1-s"></div>')
                         .find('div.ui-widget-collapse:first')
                         .click(function (e) {

                             var $c = jQuery(e.target);

                             if ($c.is("div") && $c.hasClass("ui-widget-collapse")) {
                                 collapseFunc();
                             }
                             else {
                                 if ($c.is("span") && $c.parents("div:first").hasClass("ui-widget-collapse")) {
                                     collapseFunc();
                                 }
                             }
                         })
                         .removeClass('ui-icon-triangle-1-n')
                         .addClass('ui-icon-triangle-1-s')
                         .show();

                       if (self.options.isCollapsed) {
                           collapseFunc();
                       }
                   }
               },


               progressInit: function () {

                   // only one progressFeedback per page
                   var self = this;

                   if (jQuery(progressBoxSelector).length === 0) {
                       jQuery('body').prepend('<div id="progressFeedBack" class="ui-progress-feedback ui-widget-overlay"><div class="ui-widget ui-widget-content ui-state-active ">Please wait while loading</div></div>');

                       /*
                       // these lines do not work on mobile
                       jQuery(document)
                           .click(function (e) {
                               jQuery(progressBoxSelector).find('div:first').css('top', (e.clientY + 20));
                           });
                       */
                   }
               },
               progressShow: function (msg) {

                   console.log("Info->" + msg);

                   var $p = jQuery(progressBoxSelector);

                   $p
                   .addClass('ui-front')
                   .find('div:first')
                       .html(msg)
                   .end()
                   .show();
               },
               progressHide: function () {
                   jQuery(progressBoxSelector).removeClass('ui-front').hide();
               },

               errorInit: function (parent) {

                   if (parent) {

                       var errorCustomDOMClassName = this.namespace + '-' + this.widgetName + '-errDisplayBox';
                       var highlightCustomDOMClassName = this.namespace + '-' + this.widgetName + '-highlightDisplayBox';


                       var template = '<div class="ui-crud-error {0} ui-state-error ui-helper-hidden"></div>' +
                                      '<div class="ui-crud-info {1} ui-state-highlight ui-helper-hidden"></div>';

                       template = template.format(errorCustomDOMClassName, highlightCustomDOMClassName);

                       jQuery(this.element).find(parent).append(template);

                       this.options.errorDOMId = jQuery(this.element).find('div.' + errorCustomDOMClassName + ':first');
                       this.options.messagesDOMId = jQuery(this.element).find('div.' + highlightCustomDOMClassName + ':first');

                       this.errorHide();
                       this.messageHide();
                   }
               },
               errorDisplay: function (msg, cb) {

                   console.log("Error->" + msg);

                   jQuery(this.options.errorDOMId)
                           .addClass('ui-state-error')
                           .html(msg)
                           .fadeTo('slow', 1, function () {
                               if (jQuery.isFunction(cb)) {
                                   cb();
                               }
                           });
               },
               errorHide: function (cb) {

                   var self = this;

                   jQuery(this.options.errorDOMId)
                       .removeClass('ui-state-error')
                       .html('')
                       .fadeTo('slow', 0, function () {
                           if (jQuery.isFunction(cb)) {
                               cb();
                           }
                       });
               },

               messageDisplay: function (msg, cb) {
                   jQuery(this.options.messagesDOMId)
                       .addClass('ui-state-highlight')
                       .html(msg)
                       .fadeTo('slow', 1, function () {
                           if (jQuery.isFunction(cb)) {
                               cb();
                           }
                       });
               },
               messageHide: function (cb) {

                   var self = this;

                   jQuery(this.options.messagesDOMId)
                       .removeClass('ui-state-highlight')
                       .html('')
                       .fadeTo('slow', 0, function () {
                           if (jQuery.isFunction(cb)) {
                               cb();
                           }
                       });
               },
               messagedisplayAutoHide: function (msg, miliseconds) {

                   var time = 3000;
                   var self = this;

                   if (miliseconds) {
                       time = miliseconds;
                   }

                   this.messageDisplay(msg,
                       function () {
                           jQuery(self.options.messagesDOMId)
                               .delay(time)
                               .fadeTo(time, 0, function () { self.messageHide(); });
                       });
               },

           });

       });;// Source: src/frontend/public/scripts/Template.Widget.Model.js
define(["jquery", "jqueryui", "scripts/Template.Widget.Base", "scripts/Template.Widget.ModelItem"],
       function ($, jqUI) {


           jQuery.widget("ui.widgetModel", jQuery.ui.widgetBase,
           {
               options: {
                   modelItems: null,
                   markOnChange: false // set a highlight class when item changed. Primarly used in filter objects
               },
               _create: function () {

                   this._super();

                   this._bindModelSchema(this.options.modelItems);
               },
               _init: function () {

                   this._super();
               },
               destroy: function () {

                   this._super();
               },
               _template: function () {
                   return "<div class='ui-corner-bottom ui-widgetModel-content'></div>";
               },
               _templateFormat: function () {
                   return this._template();
               },
               val: function () {

                   // clone array so widget model value properties are not updated
                   var o = jQuery.extend([], this.options.modelItems, []);

                   for (var i = 0; i < o.length; i++) {
                       var propName = o[i].id;
                       var propValue = jQuery(this.element).find('div[data-widgetModelItem-id="{0}"]:first'.format(propName)).widgetModelItem('val');
                       o[i].currentValue = propValue;
                   }
                   return o;
               },
               valAsObject: function () {

                   var r = this.val();
                   var o = {};
                   for (var i = 0; i < r.length; i++) {
                       o[r[i].id] = r[i].currentValue;
                   }
                   return o;
               },
               _bindModelSchema: function () {

                   var self = this;

                   jQuery(this.element)
                       .empty()
                       .append(this._templateFormat());

                   var $body = jQuery(this.element).find('div.ui-widgetModel-content:first');

                   if (this.options.modelItems !== null) {

                       var onItemChanged = function (e, ui) {

                           var clearedErrors = true;

                           for (var i = 0; i < self.options.modelItems.length; i++) {
                               if (jQuery(self.element).find('div[data-widgetModelItem-id="{0}"]:first'.format(self.options.modelItems[i].id))
                                   .hasClass('ui-state-error')) {
                                   clearedErrors = false;
                                   break;
                               }
                           }

                           if (clearedErrors) {
                               self._trigger('errorsCleared', null, null);
                           }

                       };

                       for (var i = 0; i < this.options.modelItems.length; i++) {
                           var $f = jQuery('<div></div>');
                           $body.append($f);

                           $f.widgetModelItem(jQuery.extend({}, { change: onItemChanged }, this.options.modelItems[i]));
                       }
                   }
               },
               bindErrors: function (keyValueArray) {
                   var self = this;
                   for (var i = 0; i < keyValueArray.length; i++) {
                       jQuery(self.element).find('div[data-widgetModelItem-id="{0}"]:first'.format(keyValueArray[i].key))
                           .widgetModelItem('setErrors', keyValueArray[i].value)
                           .addClass('ui-state-error');
                   }
               },
               bindValue: function (dataItem) {

                   var self = this;

                   this._clearErrors();
                   this.resetForm();

                   for (var i in dataItem) {
                       for (var j = 0; j < this.options.modelItems.length; j++) {
                           if (this.options.modelItems[j].id == i) {
                               jQuery(self.element).find('div[data-widgetModelItem-id="{0}"]:first'.format(i))
                                   .widgetModelItem('setValue', dataItem[i]);

                           }
                       }
                   }
               },
               _clearErrors: function () {
                   jQuery(this.element)
                       .find('div.ui-widgetModelItem')
                           .removeClass('ui-state-error')
                           .find('div.ui-widgetModel-inputError')
                               .empty()
                               .addClass('ui-helper-hidden')
                           .end()
                       .end();
               },
               resetForm: function () {
                   for (var j = 0; j < this.options.modelItems.length; j++) {
                       jQuery(this.element).find('div[data-widgetModelItem-id="{0}"]:first'
                               .format(this.options.modelItems[j].id))
                               .widgetModelItem('setValue', null);
                   }
               }
           });


       });;// Source: src/frontend/public/scripts/Template.Widget.ModelItem.js
define([
    "jquery",
    "jqueryui",
    "scripts/Template.Widget.Base",
    "scripts/Template.Widget.ModelBool",
    "scripts/Template.Widget.ModelDate",
],
function ($, jqUI) {

    jQuery.widget("ui.widgetModelItem", jQuery.ui.widgetBase,
    {
        options: {
            id: null,
            displayName: null,
            input: {
                type: null,
                value: null,
                nullable: false,
                onItemBuild: function (parent) {
                    throw new Error("{0}.onItemBuild callback is an abstract function and should be overriden when type='custom'".format(this.widgetName));
                },
                onItemValue: function () {
                    throw new Error("{0}.onItemValue callback is an abstract function and should be overriden when type='custom'".format(this.widgetName));
                },
                listValues: [], //[{ value: "", text: "" }]
            },
            errors: []
        },
        _create: function () {

            this._super();

            var self = this;

            jQuery(this.element)
                .attr('data-widget', this.widgetName)
                .attr('data-{0}-id'.format(this.widgetName), this.options.id)
                .addClass('{0}-{1}-{2}'.format(this.namespace, this.widgetName, this.options.id))
                .append(this._templateFormat())
                .find('div.ui-widgetModel-inputValue:first')
                    .each(function () {
                        jQuery(this).append(self._formItemBuild(jQuery(this)));
                    })
                .end()
                .find(':input')
                //.addClass('ui-widget-content')
                .addClass('ui-state-default')
                .focus(function () {
                    jQuery(this).addClass('ui-state-focus');
                })
                .blur(function () {
                    jQuery(this).removeClass('ui-state-focus');
                });


            this.setErrors(this.options.errors);

        },
        _init: function () {

            this._super();

        },
        destroy: function () {

            this._super();
        },
        change: function () {

            var self = this;

            jQuery(self.element).removeClass('ui-state-error');

            self.setErrors([]);
            self._trigger('change', null, self.options.id);
        },
        _template: function () {
            return "<div class='ui-widgetModel-inputLabel'>{0}</div>" +
                    "<div class='ui-widgetModel-inputValue'></div>" +
                    "<div class='ui-widgetModel-inputError ui-helper-hidden'>" +
                        "{1}" +
                    "</div>" +
                    "<div class='ui-helper-clearfix'></div>";
        },
        _templateFormat: function () {

            return this._template().format(
                this.options.displayName,
                this.options.errors.join('<br/>'));
        },

        _formItemBuildDate: function ($parent) {

            var self = this;
            var t = '';
            var jqSelector = '#{0}'.format(this.options.id);


            t = '<input id="{1}" name="{1}" type="text" />'.format(this.options.input.value, this.options.id);

            jQuery($parent)
                .append(t)
                .find(jqSelector)
                .widgetModelItemDate({
                    value: this.options.input.value,
                    change: function () {
                        self.change();
                    }
                });

            this.val = function () {
                //return jQuery(jqSelector).widgetModelItemDate('getDate');
                return jQuery($parent).find(jqSelector).val();
            };
            this.setValue = function (value) {
                return jQuery($parent).find(jqSelector).widgetModelItemDate('setDate', value);
            };

        },
        _formItemBuildFloat: function ($parent) {

            var self = this;
            var t = '';
            var jqSelector = '#{0}'.format(this.options.id);

            t = '<input id="{1}" name="{1}" type="text" value="{0}" />'
                .format(isNaN(parseFloat(this.options.input.value)) ? "" : this.options.input.value,
                        this.options.id);

            jQuery($parent)
                .append(t)
                .find(jqSelector)
                .change(function () {
                    self.change();
                });

            this.val = function () {
                return jQuery($parent).find(jqSelector).val();
            };
            this.setValue = function (value) {
                return jQuery($parent).find(jqSelector).val(value);
            };

        },
        _formItemBuildBool: function ($parent) {

            var self = this;
            var t = '';
            var jqSelector = '#{0}'.format(this.options.id);

            t = '<input id="{0}" name="{0}" type="checkbox" value="true" />'.format(this.options.id);

            jQuery($parent)
                .append(t)
                .find(jqSelector)
                .widgetModelItemBool({
                    value: self.options.input.value,
                    nullable: self.options.input.nullable,
                    id: self.options.id,
                    change: function () {
                        self.change();
                    }
                });

            this.val = function () {
                return jQuery($parent).find(jqSelector).widgetModelItemBool('val');
            };
            this.setValue = function (value) {
                return jQuery($parent).find(jqSelector).widgetModelItemBool('setValue', value);
            };


        },
        _formItemBuildList: function ($parent) {

            var self = this;
            var t = '';
            var jqSelector = '#{0}'.format(this.options.id);

            t = '<select id="{0}" name="{0}" />'.format(this.options.id);

            var opts = '';

            if (jQuery.isArray(this.options.input.listValues)) {
                for (var i = 0; i < this.options.input.listValues.length; i++) {
                    opts += "<option value='{0}'>{1}</option>".format(this.options.input.listValues[i].value, this.options.input.listValues[i].text);
                }
            }


            jQuery($parent)
                .append(t)
                .find(jqSelector)
                    .append(opts)
                    .change(function () {
                        self.change();
                    });

            this.val = function () {
                return jQuery($parent).find(jqSelector).val();
            };
            this.setValue = function (value) {
                return jQuery($parent).find(jqSelector).val(value);
            };


        },
        _formItemBuildCustom: function ($parent) {

            var self = this;
            var t = '';
            var jqSelector = '#{0}'.format(this.options.id);

            this.options.input.onItemBuild(jQuery(this.element), $parent);
            this.val = function () {
                return self.options.input.onItemValue($parent);
            };
            this.setValue = function (value) {
                return self.options.input.onItemBind($parent, value);
            };

        },
        _formItemBuildText: function ($parent) {

            var self = this;
            var t = '';
            var jqSelector = '#{0}'.format(this.options.id);

            t = '<input id="{1}" name="{1}" type="text" value="{0}" />'.format(this.options.input.value, this.options.id);

            jQuery($parent)
                .append(t)
                .find(jqSelector)
                .change(function () {
                    self.change();
                });

            this.val = function () {
                return jQuery($parent).find(jqSelector).val();
            };
            this.setValue = function (value) {
                return jQuery($parent).find(jqSelector).val(value);
            };

        },
        _formItemBuild: function ($parent) {

            var self = this;

            switch (this.options.input.type) {
                case "date":
                    self._formItemBuildDate($parent);
                    break;
                case "float":
                    self._formItemBuildFloat($parent);
                    break;
                case "bool":
                    self._formItemBuildBool($parent);
                    break;
                case "list":
                    self._formItemBuildList($parent);
                    break;
                case "custom":
                    self._formItemBuildCustom($parent);
                    break;
                default:
                    self._formItemBuildText($parent);
                    break;
            }
        },
        setErrors: function (errors) {

            var errVisible = jQuery.isArray(errors) && (errors.length > 0);

            if (errVisible) {
                jQuery(this.element)
                    .find('div.ui-widgetModel-inputError:first')
                    .addClass('ui-state-error')
                    .html(errors.join('<br/>'))
                    .removeClass('ui-helper-hidden');
            }
            else {
                jQuery(this.element)
                    .find('div.ui-widgetModel-inputError:first')
                    .removeClass('ui-state-error')
                    .empty()
                    .addClass('ui-helper-hidden');
            }

            return this;
        },
        val: function () {
            throw new Error("{0}.val is an abstract function".format(this.widgetName));
        },
        setValue: function () {
            throw new Error("{0}.setValue is an abstract function".format(this.widgetName));
        }
    });


});;// Source: src/frontend/public/scripts/Template.Widget.ModelDate.js
define([
    "jquery",
    "jqueryui",
    "scripts/Template.Widget.Base",
    "scripts/Template.App.Resources.Init"
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

       });;// Source: src/frontend/public/scripts/Template.Widget.ModelBool.js
define(["jquery", "jqueryui", "scripts/Template.Widget.Base"],
       function ($, jqUI) {


           jQuery.widget("ui.widgetModelItemBool", jQuery.ui.widgetBase,
           {
               options: {
                   id: null,
                   value: null,
                   nullable: null,
                   $container: null
               },
               _create: function () {

                   this._super();

                   this.options.icons = ['ui-icon-check', 'ui-icon-closethick'];
                   this.options.values = [true, false];

                   if (this.options.nullable) {
                       this.options.icons.push('ui-icon-help');
                       this.options.values.push(null);
                   }

                   this._wrapInput();
               },
               _init: function () {

                   this._super();

                   var self = this;
                   var $el = this.options.$container;
                   var icons = null;
                   var values = null;

                   this.options.$container
                                       .find('button')
                                           .click(function () {

                                               var nextIndex = self._getNextIndex();
                                               var nextClassName = self.options.icons[nextIndex];

                                               self._setValueByClassName(nextClassName);
                                               self._trigger('change', null, {});
                                           });
               },
               destroy: function () {
                   this._super();
               },
               _wrapInput: function () {

                   var self = this;
                   var icon = "";
                   var getNonNullableIcon = function () {
                       return (self.options.value === true ? "ui-icon-check" : "ui-icon-closethick");
                   };

                   if (self.options.nullable === true) {
                       if (self.options.value !== null) {
                           icon = getNonNullableIcon();
                       }
                       else {
                           icon = "ui-icon-help";
                       }
                   }
                   else {
                       icon = getNonNullableIcon();
                   }

                   var b = ('<button class="ui-button-icon-only ui-button ui-corner-all" ' +
                                   'data-textOnly="true" ' +
                                   'type="button">' +
                                       '<span class="ui-button-text">&nbsp;</span>' +
                                       '<span class="{0} ui-button-icon-primary ui-icon"></span>' +
                           '</button>')
                       .format(icon);

                   jQuery(this.element)
                       .wrap('<div class="{0}-{1}"></div>'.format(this.namespace, this.widgetName));


                   this.options.$container = jQuery(this.element).parent('div.{0}-{1}:first'.format(this.namespace, this.widgetName));

                   this.options.$container.append(b);
                   this.options.$container.append('<input name="{0}" type="hidden" value="{1}" />'
                       .format(this.options.id,
                               (this.options.value === false ? "false" : "")
                       ));


               },
               _getCurrentIndex: function () {

                   //var $el = jQuery(this.element);
                   var currentValue = null;
                   var result = 0;

                   if (this.options.nullable) {
                       if (this.options.$container.find('input[type="checkbox"]').attr('checked') == 'checked') {
                           currentValue = true;
                       }
                       else {
                           if (this.options.$container.find('input[type="hidden"]').val() == "false") {
                               currentValue = false;
                           }
                       }
                   }
                   else {
                       currentValue = this.options.$container.find('input[type="checkbox"]').attr('checked') == 'checked';
                   }

                   for (var i = 0; i < this.options.values.length; i++) {
                       if (currentValue == this.options.values[i]) {
                           result = i;
                           break;
                       }
                   }

                   return result;
               },
               _getNextIndex: function () {
                   var i = this._getCurrentIndex();
                   var result = (i + 1) >= (this.options.values.length) ? 0 : (i + 1);
                   return result;
               },
               _setValueByClassName: function (className) {

                   var self = this;
                   var $el = this.options.$container;

                   jQuery(this.options.$container)
                       .find('button')
                       .find('span')
                       .removeClass(self.options.icons.join(" "))
                       .addClass(className);

                   switch (className) {
                       case 'ui-icon-check':
                           $el.find(':checkbox').attr('checked', 'checked');
                           if (self.options.nullable) { $el.find('input[type="hidden"]').val(''); }
                           break;
                       case 'ui-icon-closethick':
                           $el.find(':checkbox').removeAttr('checked');
                           if (self.options.nullable) { $el.find('input[type="hidden"]').val('false'); }
                           break;
                       case 'ui-icon-help':
                           $el.find(':checkbox').removeAttr('checked');
                           if (self.options.nullable) { $el.find('input[type="hidden"]').val(''); }
                           break;
                   }
               },
               val: function () {
                   return this.options.values[this._getCurrentIndex()];
               },
               setValue: function (value) {

                   var currentIndex = -1;

                   for (var i = 0; i < this.options.values.length; i++) {
                       if (value == (this.options.values[i])) {
                           currentIndex = i;
                       }
                   }

                   if (currentIndex != -1) {
                       this._setValueByClassName(this.options.icons[currentIndex]);
                   }
               }

           });

       });;// Source: src/frontend/public/scripts/Template.Widget.Menu.base.js
define(["jquery", "jqueryui", "scripts/Template.Widget.Base"],
       function ($, jqUI) {


           jQuery.widget("ui.menuBase", jQuery.ui.widgetBase, {
               options: {
                   IMenuModel: null
               },
               _create: function () {

                   this._super();

               },
               _init: function () {

                   this._super();

                   jQuery(this.element).addClass('ui-state-default');
               },
               destroy: function () {

                   jQuery(this.element).empty();

                   this._super();
               },
               _dataBound: function () {

                   var w = this;

                   jQuery(this.element)
                       .addClass('ui-menuList ui-widget-content ui-corner-all')
                       .find('div.ui-menuList-itemLink')
                           .bind('click', function (e) {

                               var $node = jQuery(this).parents('li:first');
                               var liData = $node.data('dataItem');

                               if (liData.childs === undefined) {
                                   w._beforeSelected();
                                   w._setSelectedCss($node);
                                   w._trigger('selected', null, liData);
                               }
                               else {

                                   var b = $node.find('ul:first').is(':visible');
                                   if (b) w.closeNode($node);
                                   else w.openNode($node);
                               }
                           });

                   jQuery(this.element)
                       .find('ul')
                           .each(function () {
                               jQuery(this).children().last().addClass('ui-menuList-item-last');
                           });

                   w._trigger('dataBound', null, { IMenuModel: w.options.IMenuModel });

               },
               _beforeSelected: function () {
                   var self = this;
                   var dfd = jQuery.Deferred();
                   //dfd.notify("message...");
                   //dfd.resolve();
                   dfd.reject("{0}.{1}._beforeSelected is an abstract method and should be imlpemented in child class".format(this.namespace, this.widgetName));
                   return dfd.promise();
               },
               _build: function () {
                   var self = this;
                   var dfd = jQuery.Deferred();
                   //dfd.notify("message...");
                   //dfd.resolve();
                   dfd.reject("{0}.{1}._build is an abstract method and should be imlpemented in child class".format(this.namespace, this.widgetName));
                   return dfd.promise();
               },
               bind: function (IMenuModel) {

                   var self = this;

                   /* // IMenuModel sample
                   var k = [{
                       url: null,
                       text: "menu item 1",
                       childs: [{
                           url: "/anUrl",
                           text: "submenu item 1 "
                       }]
           
                   }, {
                       url: "/anUrl2",
                       text: "Menu item 2 with no childs",
                   }];
                   */

                   this.options.IMenuModel = IMenuModel;
                   this._build()
                       .progress(function (status) {

                       })
                       .fail(function (args) {
                           throw new Error(args);
                       })
                       .always(function () {

                       })
                       .done(function () {
                           self._dataBound();
                           self.collapseAll();
                           self._trigger('done', null, null);
                       });
               },
               _setSelectedCss: function ($node) {
                   $node.find('div.ui-menuList-itemLink:first').addClass('ui-state-highlight');
               },
           });



       });;// Source: src/frontend/public/scripts/Template.Widget.Menu.tree.js
define(["jquery", "jqueryui", "scripts/Template.Widget.Menu.base"],
       function ($, jqUI) {


           jQuery.widget("ui.menuTree", jQuery.ui.menuBase, {
               options: {

               },
               _create: function () {

                   this._super();

               },
               _init: function () {

                   this._super();

               },
               destroy: function () {

                   this._super();
               },
               openNode: function ($lisOpen) {
                   if ($lisOpen) {
                       $lisOpen.each(function () {
                           jQuery(this)
                           //.removeClass('ui-state-default')
                           .children('ul')
                               .addClass('ui-state-active')
                               .show('blind')
                           .end()
                           .find('div.ui-menuList-itemLink:first')
                               .addClass('ui-state-active')
                               .find('div.ui-menuList-toggle')
                                   .addClass('ui-state-active')
                                   .removeClass('ui-icon-triangle-1-e')
                                   .addClass('ui-icon ui-icon-triangle-1-s')
                               .end()
                           .end();
                       });
                   }
               },
               closeNode: function ($lisClose) {

                   if ($lisClose) {
                       $lisClose
                           //.addClass('ui-state-default')
                           .children('ul')
                               .hide('blind')
                               .removeClass('ui-state-active')
                           .end()
                           .find('div.ui-menuList-itemLink:first')
                               .removeClass('ui-state-active')
                               .find('div.ui-menuList-toggle')
                                   .removeClass('ui-state-active')
                                   .addClass('ui-icon ui-icon-triangle-1-e')
                                   .removeClass('ui-icon-triangle-1-s')
                               .end()
                           .end();

                       if ($lisClose.find('li').length > 0) {
                           this.closeNode($lisClose.find('li'));
                       }
                   }
               },
               collapseAll: function () {
                   this.closeNode(jQuery(this.element).find('li'));
               },
               _beforeSelected: function () {
                   jQuery(this.element)
                       .find('div.ui-menuList-itemLink')
                           .removeClass('ui-state-highlight')
                       .end();
               },

               _build: function () {

                   var self = this;
                   var dfd = jQuery.Deferred();

                   var menuItemRender = function (IMenuItem) {
                       var $li = jQuery('<li class="ui-menuList-item ui-widget-content ui-corner-all ui-state-default"></li>');


                       $li.html('<div class="ui-menuList-itemLink ui-state-default"><span class="ui-menuList-link">{0}</span><div class="ui-helper-clearfix" /></div>'.format(IMenuItem.text));
                       $li.data('dataItem', IMenuItem);

                       if (IMenuItem.childs) {
                           var $ul = jQuery('<ul class="ui-menuList-childs"></ul>');

                           $li.find('div.ui-menuList-itemLink')
                                   .find('div.ui-helper-clearfix:first')
                                       .before('<div class="ui-menuList-toggle ui-state-default ui-icon ui-icon-triangle-1-e"></div>')
                                   .end()
                              .end();

                           for (var i = 0; i < IMenuItem.childs.length; i++) {
                               $ul.append(menuItemRender(IMenuItem.childs[i]));
                           }
                           $li.append($ul);
                       }

                       return $li;
                   };

                   var menuRender = function () {
                       for (var i = 0; i < self.options.IMenuModel.length; i++) {
                           jQuery(self.element).append(menuItemRender(self.options.IMenuModel[i]));
                       }

                       dfd.resolve();
                   };

                   menuRender();


                   return dfd.promise();
               },
           });


       });;// Source: src/frontend/public/scripts/Template.Widget.Menu.slides.js
define(["jquery", "jqueryui", "scripts/Template.Widget.Menu.base"],
       function ($, jqUI) {


           jQuery.widget("ui.menuSlides", jQuery.ui.menuBase, {
               options: {
                   //slidesOpened: [], //http://bugs.jqueryui.com/ticket/8645
                   slidesOpened: null, //since jQuery.ui 1.9 array options are static. So initialized them on create event,
                   texts: {
                       back: "Back"
                   }
               },
               _create: function () {

                   this._super();

                   this.options.slidesOpened = [];

                   jQuery(this.element).prepend('<div class="ui-menuSlide-backButton ui-helper-hidden ui-state-default"><span class="ui-icon ui-icon-triangle-1-w"></span><span>' + this.options.texts.back + '</span><div class="ui-helper-clearfix"></div></div>');

               },
               _init: function () {
                   this._super();
                   this._initBackButton();
               },
               _initBackButton: function () {

                   var self = this;
                   var $backButton = jQuery(this.element).find('div.ui-menuSlide-backButton:first');


                   $backButton
                       .click(function () {

                           var $selectedItem = jQuery(self.element).find('div.ui-menuList-itemLink.ui-state-highlight:first').parents('li:first');

                           if ($selectedItem.length > 0) {
                               var itemPath = self._itemPath($selectedItem, []);



                               for (var i = 0; i < itemPath.length; i++) {
                                   jQuery(itemPath[i]).find('div.ui-menuList-itemLink:first').addClass('ui-state-active');
                               }
                           }


                           jQuery(self.element)
                               .find('ul.ui-menuList-childs:visible:first')
                               .each(function () {

                                   var theListToHide = jQuery(this);
                                   var theListToShow = self.options.slidesOpened[self.options.slidesOpened.length - 1];
                                   self._animatePanel(theListToHide, theListToShow, false, function () {
                                       self.options.slidesOpened.splice(self.options.slidesOpened.length - 1, 1);
                                       if (self.options.slidesOpened.length === 0) {
                                           $backButton.addClass('ui-helper-hidden');
                                       }
                                   });
                               });
                       });
               },
               destroy: function () {
                   this._super();
               },
               _beforeSelected: function () {
                   jQuery(this.element)
                       .find('div.ui-menuList-itemLink')
                           .removeClass('ui-state-highlight ui-state-active')
                       .end();
               },
               _animatePanel: function ($hidingList, $showingList, forward, cb) {

                   if (forward) {
                       $hidingList.hide('drop', function () {
                           $showingList.show('slide', function () {
                               cb();
                           });
                       });
                   }
                   else {
                       $hidingList.hide('drop', function () {
                           $showingList.show('slide', function () {
                               cb();
                           });
                       });
                   }

               },
               openNode: function ($lisOpen) {

                   var self = this;

                   var matches = function ($ul) {
                       for (var i = 0; i < $lisOpen.length; i++) {
                           if (jQuery($ul.data('parentNode'))[0] == $lisOpen[0]) {
                               return true;
                           }
                       }
                       return false;
                   };


                   jQuery(self.element)
                       .find('ul.ui-menuList-childs')
                       .each(function () {

                           if (matches(jQuery(this))) {

                               var theListToShow = jQuery(this);

                               jQuery(self.element)
                                   .find('ul.ui-menuList-childs:visible:first')
                                       .each(function () {
                                           var theListToHide = jQuery(this);
                                           self.options.slidesOpened.push(theListToHide);
                                           self._animatePanel(theListToHide, theListToShow, true, function () {

                                               jQuery(self.element)
                                                   .find('div.ui-menuSlide-backButton:first')
                                                   .removeClass('ui-helper-hidden');

                                           });
                                       });
                           }
                       });
               },
               closeNode: function ($lisClose) {

               },
               collapseAll: function () {

                   jQuery(this.element)
                       .find('ul.ui-menuList-childs')
                       .each(function () {
                           if (jQuery(this).data('parentNode') !== undefined) {
                               jQuery(this).hide();
                           }
                       });
               },
               _build: function () {

                   var self = this;
                   var dfd = jQuery.Deferred();

                   var menuItemRender = function (IMenuItem) {
                       var $li = jQuery('<li class="ui-menuList-item ui-widget-content ui-corner-all ui-state-default"></li>');
                       $li.html('<div class="ui-menuList-itemLink ui-state-default"><span class="ui-menuList-link">{0}</span><div class="ui-helper-clearfix" /></div>'.format(IMenuItem.text));
                       $li.data('dataItem', IMenuItem);

                       if (IMenuItem.childs) {

                           $li.find('div.ui-menuList-itemLink')
                                   .find('div.ui-helper-clearfix:first')
                                       .before('<div class="ui-menuList-toggle ui-state-default ui-icon ui-icon-triangle-1-e"></div>')
                                   .end()
                              .end();

                           menuLevelRender(IMenuItem.childs, $li);
                       }
                       return $li;
                   };

                   var menuLevelRender = function (ImenuLevel, $parentLevel) {

                       var $ul = jQuery('<ul class="ui-menuList-childs"></ul>');

                       if (jQuery($parentLevel).length > 0) {
                           $ul.data('parentNode', $parentLevel);
                       }

                       jQuery(self.element).append($ul);

                       for (var i = 0; i < ImenuLevel.length; i++) {
                           $ul.append(menuItemRender(ImenuLevel[i]));
                       }

                   };

                   var menuRender = function () {

                       menuLevelRender(self.options.IMenuModel);

                       dfd.resolve();
                   };

                   menuRender();


                   return dfd.promise();
               },
               _itemPath: function ($li, currentPath) {

                   if ($li) {

                       currentPath.push($li);

                       if ($li.parents('ul:first').length > 0) {
                           return this._itemPath($li.parents('ul:first').data('parentNode'), currentPath);
                       }
                       else {
                           return currentPath;
                       }

                   }
                   else {
                       return currentPath;
                   }
               },
               _itemSlidesPath: function ($currentSlideUl, currentSlidePath) {

                   currentSlidePath.push($currentSlideUl);

                   var $pNode = $currentSlideUl.data('parentNode');

                   if ($pNode) {
                       return this._itemSlidesPath(jQuery($pNode).parents('ul.ui-menuList-childs:first'), currentSlidePath);
                   }
                   else {
                       // top parent found
                       return currentSlidePath.reverse();
                   }
               },
               _itemSlidesPathInit: function () {

                   for (var i = 0; i < this.options.slidesOpened.length; i++) {
                       jQuery(this.options.slidesOpened[i]).hide();
                   }

                   jQuery(this.options.slidesOpened[this.options.slidesOpened.length - 1]).show();

                   if (this.options.slidesOpened.length > 1) {
                       jQuery(this.element)
                           .find('div.ui-menuSlide-backButton:first')
                           .removeClass('ui-helper-hidden');
                   }

               },

               select: function (setSelected) {

                   var self = this;

                   self.options.slidesOpened = [];

                   var slidesPath = [];

                   jQuery(self.element)
                       .find('li.ui-menuList-item')
                           .each(function () {
                               if (setSelected(jQuery(this).data('dataItem'))) {
                                   self._setSelectedCss(jQuery(this));
                                   self.options.slidesOpened = self._itemSlidesPath(jQuery(this).parents('ul.ui-menuList-childs:first'), []);
                                   self._itemSlidesPathInit();
                                   self.options.slidesOpened.pop();
                               }
                           });
               }
           });


       });;// Source: src/frontend/public/scripts/Template.Widget.Menu.nav.js
define([
    "jquery",
    "jqueryui",
    "handlebars",
    "history",
    "scripts/Template.App.Ajax.Init",
    "scripts/Template.Widget.Menu.slides"],
       function ($, jqUI, Handlebars, hist, VsixMvcAppResult) {


           jQuery.widget("ui.menuNav", jQuery.ui.widgetBase, {
               options: {
                   texts: {
                       loadingTmpl: "Loading template",
                       errLoadingTmpl: "Error loading template"
                   }
               },
               _create: function () {
                   this._super();
               },
               _init: function () {

                   this._super();

                   this._initMenuNav();
               },
               destroy: function () {
                   this._super();
               },
               _errMsgSet: function (selector, msg) {
                   jQuery(selector)
                       .append("<div class='userActiviyErrMsg ui-state-error'></div><div class='ui-helper-clearfix'></div>")
                       .find("div.userActiviyErrMsg:first")
                       .html(msg);
               },
               _initMenuNav: function () {

                   //TODO: load async Menu based on user identity
                   var self = this;
                   var $sitePage = jQuery('div.ui-sitePage:first');
                   var $siteContent = jQuery('div.ui-siteContent:first');
                   var $panelMenu = jQuery('#panelMenu');
                   var $panelMenuList = jQuery($panelMenu).find('div.ui-menuBase:first');
                   var $panelMenuToggle = jQuery('div.ui-mainMenuToggle');

                   var panelMenuHide = function (cb) {
                       $sitePage.show();
                       $panelMenu.hide('slide', function () {
                           $panelMenu.removeClass('ui-front');

                           if (jQuery.isFunction(cb)) {
                               cb();
                           }
                       });
                   };
                   var panelMenuShow = function (cb) {
                       $panelMenu
                           .addClass('ui-front')
                           .show('drop', function () {
                               $sitePage.hide();

                               if (jQuery.isFunction(cb)) {
                                   cb();
                               }
                           });
                   };
                   var panelMenuToggleOnClick = function (cb) {
                       if ($panelMenu.is(':visible')) {
                           panelMenuHide(cb);
                       }
                       else {
                           panelMenuShow(cb);
                       }
                   };

                   var loadTemplate = function (State) {

                       var templUrl = State.hash;

                       $siteContent.empty();

                       // ask for the template
                       jQuery.ajax({
                           url: templUrl,
                           type: "GET",
                           dataType: "html",
                       })
                       .done(function (data, textStatus, jqXHR) {

                           var templatePartialCssFiles = "{{#each CssFiles}}<link href='{{this}}' rel='Stylesheet' type='text/css' />{{/each}}";
                           var templatePartialJsFiles = "";
                           var template = Handlebars.compile(data + templatePartialCssFiles + templatePartialJsFiles);
                           var templateContext = {};


                           // ask for the template context
                           jQuery.ajax({
                               url: templUrl + 'index.handlebars.json',
                               type: "GET",
                               dataType: "json",
                           })
                           .done(function (dataJson, textStatusJson, jqXHRJson) {

                               if (dataJson.Title) {
                                   jQuery('body')
                                       .find('h1:first')
                                           .html(dataJson.Title);
                               }

                               var html = template(jQuery.extend({}, dataJson, templateContext));

                               $siteContent.html(html);

                               if (dataJson.ViewEntryPoint && dataJson.ViewEntryPoint !== null)
                               {
                                   require(
                                       //{
                                       //// requirejs cachea los scripts por nombre
                                       //// mediante bust=State.url prevenimos
                                       //// que cache tome como cacheado un script que se llame igual en otra vista o carpeta
                                       //// 
                                       //urlArgs: "bust=" + 
                                       //},
                                       [State.url + dataJson.ViewEntryPoint],
                                       function (VsixMvcAppResult) {
                                           VsixMvcAppResult.View.main();
                                       },
                                       function (errRequiring) {
                                           console.error(errRequiring);
                                       });
                               }


                           })
                           .fail(function (jqXHR, textStatus, errorThrown) {

                               // specific template context fail to load. 
                               // try transform with basic template context
                               var html = template(templateContext);
                               $siteContent.html(html);
                           })
                           .always(function () {
                               self.progressHide();
                           });

                       })
                       .fail(function (jqXHR, textStatus, errorThrown) {

                           console.error("Error lading template '{0}' ->".format(templUrl), {
                               jqXHR: jqXHR,
                               textStatus: textStatus,
                               errorThrown: errorThrown
                           });

                           $siteContent.html('<div class="ui-state-error ui-site-templateInfo">' + self.options.texts.errLoadingTmpl + ': {0} - {1} - {2} </div>'.format(jqXHR.status, textStatus, errorThrown));

                       })
                       .always(function () {
                           self.progressHide();
                       });

                   };



                   History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate

                       self.progressShow(self.options.loadingTmpl);

                       // Log the State
                       var State = History.getState(); // Note: We are using History.getState() instead of event.state
                       History.log('statechange:', State.data, State.title, State.url);


                       loadTemplate(State);
                   });




                   $panelMenu.hide();

                   $panelMenuList.menuSlides({
                       selected: function (e, templ) {

                           var templGetFunc = function () {

                               var templUrl = templ.url;

                               History.pushState(null, null, templUrl);

                               //loadTemplate(templUrl);
                           };

                           if ($panelMenuToggle.is(':visible')) {
                               panelMenuHide(setTimeout(function () {
                                   templGetFunc();
                               },
                               500));
                           }
                           else {
                               templGetFunc();
                           }
                       },
                       done: function (e) {
                           self._initMenuSelected($panelMenuList);
                       }
                   });


                   /* Begin Ensure panel animations:
                       1.- prevent clicking twice the same toggle button before panel animations are done
                       2.- prevent adding click events twice
                   */
                   var panelMenuToggleClickBind = null;

                   panelMenuToggleClickBind = function () {
                       $panelMenuToggle
                           .one('click', function () {
                               $panelMenuToggle.unbind('click');
                               panelMenuToggleOnClick(function () {
                                   panelMenuToggleClickBind();
                               });
                           });
                   };

                   panelMenuToggleClickBind();
                   /* End Ensure panel animations */


                   VsixMvcAppResult.Ajax.UserMenu(
                       function (data, textStatus, jqXHR) {
                           $panelMenuList.menuSlides('bind', data);
                       },
                       function (jqXHR, textStatus, errorThrown) {
                           self._errMsgSet($panelMenu, VsixMvcAppResult.Resources.unExpectedError);
                       },
                       function () {
                           self._trigger('complete', null, null);
                       });
               },
               _initMenuSelected: function ($widgetMenuList) {

                   var pathName = location.pathname;

                   $widgetMenuList.menuSlides('select', function (menuItem) {

                       if (menuItem.url == pathName) {
                           return true;
                       }
                   });


               },

           });


       });
;// Source: src/frontend/public/scripts/Template.Widget.ItemPicker.js
define(["jquery", "jqueryui", "scripts/Template.Widget.Base"],
       function ($, jqUI) {


           jQuery.widget("ui.itemPicker", jQuery.ui.widgetBase,
           {
               options: {
                   itemsSelector: null,
                   itemsAttrId: null,
                   messageBoxSelector: null,
                   itemApllyingMsg: null,
                   itemApllyingFailUnhandledMsg: '',
                   itemServerPut: function (itemId) {
                       return jQuery.ajax({
                           url: "",
                           type: "PUT",
                           data: JSON.stringify({ itemId: itemId }),
                           cache: false
                       });
                   },
                   itemServerPutOk: function (result) {

                   },
               },
               _create: function () {

                   var self = this;

                   this._super();

               },
               _init: function () {

                   var self = this;

                   this._super();

                   jQuery(self.element)
                       .find(self.options.itemsSelector)
                           .click(function (e, ui) {
                               var itemSelected = jQuery(this).attr(self.options.itemsAttrId);
                               self.errorHide();
                               self.applyItem(itemSelected);
                           })
                       .end()
                       .find(self.options.messageBoxSelector)
                           .each(function () {
                               self.errorInit(jQuery(this));
                           })
                       .end();

               },
               destroy: function () {

                   this._super();

               },
               applyItem: function (itemId) {

                   var self = this;

                   self._applyItem(itemId)
                           .progress(function (status) {
                               self.progressShow(status);
                           })
                           .fail(function (args) {
                               self.progressHide();
                               self.errorDisplay(args);
                           })
                           .always(function () {
                               self.progressHide();
                           });
               },
               _applyItem: function (itemId) {

                   var self = this;
                   var dfd = jQuery.Deferred();

                   dfd.notify(self.options.itemApllyingMsg);

                   jQuery.when(self.options.itemServerPut(itemId))
                       .then(
                           function (result, statusText, jqXHR) {
                               if (result.isValid) {
                                   dfd.resolve();

                                   self.options.itemServerPutOk(result);
                               }
                               else {
                                   dfd.reject(result.messages[0]);
                               }
                           },
                           function (jqXHR, textStatus, errorThrown) {
                               dfd.reject(self.options.itemApllyingFailUnhandledMsg);
                           })
                       .done(function () {

                       });

                   return dfd.promise();
               }
           });

       });;// Source: src/frontend/public/scripts/crud/common.widget.fieldItem.js
define(["jquery", "jqueryui", "scripts/Template.Widget.Base"],
       function ($, jqUI) {


           jQuery.widget("ui.fieldItem", jQuery.ui.widgetBase,
           {
               options: {
                   wrapElement: null
               },
               _create: function () {

                   this._super();

                   this.options.wrapElement = '<div class="ui-field-box">' +
                                                   '<div class="ui-fieldName"></div>' +
                                                   '<div class="ui-fieldValue"></div>' +
                                                   '<div class="ui-helper-clearfix"></div>' +
                                               '</div>';
               },
               _init: function () {

                   this._super();

                   var self = this;

                   jQuery(self.element)
                       .find(':input[data-fieldItem], div[data-fieldItem]')
                       .each(function (index, ui) {

                           if (jQuery(this).data("isInitialized") === undefined) {
                               var box = jQuery(self.options.wrapElement).insertBefore(jQuery(this));
                               box.find("div.ui-fieldName:first").html(jQuery(this).attr('data-fieldItem-name'));

                               jQuery(this).appendTo(box.find("div.ui-fieldValue:first"));

                               jQuery(this).data("isInitialized", true);
                           }

                       });
               },
               destroy: function () {
                   this._super();
               }

           });

       });;// Source: src/frontend/public/scripts/crud/common.widget.crud.base.js
define(["jquery", "jqueryui", "scripts/Template.Widget.Base"],
       function ($, jqUI) {

           jQuery.widget("ui.crudBase", jQuery.ui.widgetBase,
           {
               options: {

               },
               _create: function () {

                   this._super();
               },
               _init: function () {
                   this._super();
               },
               destroy: function () {

                   this._super();
               },
               _initButton: function (widgetInstance, theButtonOptions, buttonsBox) {

                   var self = this;

                   var theButton = jQuery('<button type="button" class="{0}">{1}</button>'
                                       .format(theButtonOptions.cssClass,
                                               theButtonOptions.text));

                   jQuery(buttonsBox).append(theButton);

                   theButton
                       .button({
                           icons: {
                               primary: theButtonOptions.icon
                           }
                       });

                   if (theButtonOptions.click) {
                       theButton.click(function () {
                           theButtonOptions.click(widgetInstance);
                       });
                   }
               },
           });

       });;// Source: src/frontend/public/scripts/crud/common.widget.crud.js
define(["jquery",
        "jqueryui",
        "scripts/crud/common.widget.crud.base",
        "scripts/crud/common.widget.crud.grid",
        "scripts/crud/common.widget.crud.filter",
        "scripts/crud/common.widget.crud.form",
        "scripts/crud/common.widget.grid.pagination",
        "scripts/crud/common.widget.fieldItem",
],
function ($, jqUI) {


    jQuery.widget("ui.crud", jQuery.ui.crudBase,
    {
        options: {
            crudHeaderDomId: null,
            gridButtonsDOMId: null,
            gridDOMId: null,
            gridFilterDOMId: null,
            gridFilterObject: null,
            gridFilterVisibleAlways: false,
            gridFilterButtonsInit: function (widgetFilter, defaultButtons) {
                return defaultButtons;
            },

            texts: {
                gridSearchNotifyBeginMsg: "Searching...",
                gridSearchNotifyFailMsg: "Unhandled Error searching...",
                gridSearchEditNotifyBeginMsg: "Searching item for edit...",
                gridSearchEditNotifyFailMsg: "Unhandled Error searching item for edit...",
            },

            formDOMId: null,


            gridCustomOptions: {},
            gridSearchMethod: null,
            gridFilterInit: function (crudWidget, filterOptions) {
                jQuery(crudWidget.options.gridFilterDOMId).crudFilter(jQuery.extend({}, filterOptions, { Model: crudWidget.options.filterModel }));
            },
            gridModel: [],
            gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

            },
            gridSearchForEditMethod: null,
            gridButtonsGet: function (crudWidget, defaultButtons) {
                return defaultButtons;
            },
            gridPagerInit: function () {
                // overrides default pagination mode
                return {
                    pageSize: 10,
                    pagerTop: {
                        paginationShow: false,
                        totalRowsShow: false,
                        pageSizeShow: false,
                    },
                    pagerBottom: {
                        paginationShow: true,
                        totalRowsShow: true,
                        pageSizeShow: true,
                    }
                };
            },

            formInit: function (crudWidget, formOptions) {
                throw new Error(crudWidget.namespace + '.' + crudWidget.widgetName + ".formInit is an abstract method. Child class method must be implemented");
            },
        },
        _create: function () {

            var self = this;

            this._super();

            var gridFilterClass = 'ui-{0}Crud-filter'.format(this.widgetName);
            var gridButtonsClass = 'ui-{0}Crud-gridButtons'.format(this.widgetName);
            var gridControlClass = 'ui-{0}Crud-gridControl'.format(this.widgetName);
            var formControlClass = 'ui-{0}Crud-form'.format(this.widgetName);

            self._templateInit(gridFilterClass, gridButtonsClass, gridControlClass, formControlClass);
            self._templateSetSelectors(gridFilterClass, gridButtonsClass, gridControlClass, formControlClass);
        },
        _init: function () {

            var self = this;

            this._super();
            this._gridButtonsInit();


            var gridOptions = jQuery.extend(
                {},
                {
                    gridModel: self.options.gridModel,
                    gridViewCellBound: self.options.gridViewCellBound,
                    gridPagerInit: self.options.gridPagerInit,

                    errorDisplay: function (e, msg) {
                        self.errorDisplay(msg);
                    },
                    dataBound: function () {
                        if (jQuery(self.options.gridFilterDOMId).is(':visible')) {
                            if (self.options.gridFilterVisibleAlways === false) {
                                self._actionSet(self._actions.list);
                            }
                        }
                    },
                    paginated: function (e, pagination) {
                        self.options.gridFilterObject.Page = pagination.pageIndex;
                        self.options.gridFilterObject.PageSize = pagination.pageSize;

                        self.errorHide();
                        self._search();
                    },
                    onSelect: function (e, dataItem) {
                        self.errorHide();
                        self._trigger('onSelect', null, dataItem);
                    },
                    onEdit: function (e, dataItem) {
                        self.errorHide();
                        self._searchForEdit(dataItem);
                    }
                },
                self.options.gridCustomOptions);



            var crudEmptyDataResult = {
                Data: [],
                IsValid: true,
                Message: null,
                Page: 0,
                PageSize: self.options.gridPagerInit().pageSize,
                SortAscending: false,
                SortBy: "",
                TotalRows: 0
            };

            jQuery(this.options.gridDOMId).crudGrid(gridOptions);
            jQuery(this.options.gridDOMId).crudGrid('bind', crudEmptyDataResult);

            this.options.gridFilterInit(self, {
                Model: self.options.filterModel,
                PageSize: self.options.gridPagerInit().pageSize,
                gridFilterVisibleAlways: self.options.gridFilterVisibleAlways,
                filterButtonsInit: self.options.gridFilterButtonsInit,
                errorDisplay: function (e, msg) {
                    self.errorDisplay(msg);
                },
                change: function (e, filter) {
                    self.options.gridFilterObject = filter;
                    self.errorHide();
                    self._search();
                },
                cancel: function () {
                    self.errorHide();
                    self._actionSet(self._actions.list);
                },
                done: function () {

                    var crudWidget = self;

                    jQuery(crudWidget.options.formDOMId)
                        .crudForm(jQuery.extend({}, {
                            messagedisplayAutoHide: function (e, msg) {
                                self.messagedisplayAutoHide(msg);
                            },
                            messageDisplay: function (e, msg) {
                                self.messageDisplay(msg);
                            },
                            errorDisplay: function (e, msg) {
                                self.errorDisplay(msg);
                            },
                            errorHide: function () {
                                self.errorHide();
                            },
                            change: function (e, formValue) {
                                self.errorHide();
                                self._search();
                            },
                            dataBound: function () {
                                self.errorHide();
                                self._actionSet(self._actions.form);
                            },
                            cancel: function () {
                                self.errorHide();
                                self._actionSet(self._actions.list);
                            },
                        },
                            {
                                formModel: crudWidget.options.formModel,
                                formButtonsGet: crudWidget.options.formButtonsGet,
                                formBind: crudWidget.options.formBind,
                                formValueGet: crudWidget.options.formValueGet,
                                formSaveMethod: crudWidget.options.formSaveMethod
                            }));

                    jQuery(crudWidget.options.formDOMId)
                        .find('div.ui-crudForm-modelBinding:first')
                            .widgetModel({
                                modelItems: crudWidget.options.formModel,
                                errorsCleared: function () {
                                    crudWidget.errorHide();
                                }
                            })
                        .end();

                    self.options.formInit(self, jQuery(crudWidget.options.formDOMId).find('div.ui-crudForm-formContent:first'));

                    jQuery(crudWidget.options.formDOMId).fieldItem();

                }
            });


            this._actionSet(this._actions.list);
        },
        destroy: function () {
            this._super();
        },
        _templateInit: function (gridFilterClass, gridButtonsClass, gridControlClass, formControlClass) {

            var self = this;

            jQuery(this.element)
                .addClass('ui-crud ui-widget-content')
                .append(self._templateGet(gridFilterClass, gridButtonsClass, gridControlClass, formControlClass))
                .find('div.ui-crud-messages:first')
                    .each(function () {
                        self.options.crudHeaderDomId = jQuery(this);
                        self.errorInit(jQuery(this));
                    });


        },
        _templateGet: function (gridFilterClass, gridButtonsClass, gridControlClass, formControlClass) {

            var template = '<div class="ui-crud-messages ui-state-default ui-helper-hidden"></div>' +
                            '<div class="{0}"></div>' +
                            '<div class="{1} ui-ribbonButtons  ui-state-default"></div>' +
                            '<div class="{2}"></div>' +
                            '<div class="{3}"></div>';

            return template
                .format(gridFilterClass,
                        gridButtonsClass,
                        gridControlClass,
                        formControlClass);
        },
        _templateSetSelectors: function (gridFilterClass, gridButtonsClass, gridControlClass, formControlClass) {
            this.options.gridFilterDOMId = jQuery(this.element).find('div.{0}:first'.format(gridFilterClass));
            this.options.gridDOMId = jQuery(this.element).find('div.{0}:first'.format(gridControlClass));
            this.options.gridButtonsDOMId = jQuery(this.element).find('div.{0}:first'.format(gridButtonsClass));
            this.options.formDOMId = jQuery(this.element).find('div.{0}:first'.format(formControlClass));
        },

        _actions: {
            list: 1,
            filter: 2,
            form: 3
        },
        _actionSet: function (actionSelected) {

            var self = this;

            self._hidePanels();

            if (actionSelected === self._actions.filter) {
                self._actionSetFilter();
            }

            if (actionSelected === self._actions.list) {
                self._actionSetList();
            }

            if (actionSelected === self._actions.form) {
                self._actionSetForm();
            }
        },
        _actionSetForm: function () {

            var self = this;

            jQuery(self.options.formDOMId).removeClass('ui-helper-hidden').fadeTo('slow', 1);
        },
        _actionSetList: function () {

            var self = this;

            jQuery(self.options.gridDOMId).removeClass('ui-helper-hidden').fadeTo('slow', 1);

            if (self.options.gridFilterVisibleAlways) {
                jQuery(self.options.gridFilterDOMId).removeClass('ui-helper-hidden').show();
                jQuery(self.options.gridButtonsDOMId).hide();
            }
            else {
                jQuery(self.options.gridFilterDOMId).addClass('ui-helper-hidden');
                jQuery(self.options.gridButtonsDOMId).show();
            }
        },
        _actionSetFilter: function () {

            var self = this;

            jQuery(self.options.gridFilterDOMId).removeClass('ui-helper-hidden').fadeTo('slow', 1);
        },
        _hidePanels: function () {
            jQuery(this.options.gridFilterDOMId).hide();
            jQuery(this.options.gridButtonsDOMId).hide();
            jQuery(this.options.gridDOMId).hide();
            jQuery(this.options.formDOMId).hide();
        },
        _search: function () {

            var self = this;

            self._gridSearch()
                    .progress(function (status) {
                        self.progressShow(status);
                    })
                    .fail(function (args) {
                        self.progressHide();
                        self.errorDisplay(args);
                    })
                    .always(function () {
                        self.progressHide();
                    });
        },
        _gridSearch: function () {

            var self = this;
            var dfd = jQuery.Deferred();

            dfd.notify(self.options.texts.gridSearchNotifyBeginMsg);

            if (self.options.gridSearchMethod === null) {
                dfd.reject(self.namespace + '.' + self.widgetName + "options.gridSearchMethod is an abstract method. Child class must implement");
            }
            else {

                jQuery.when(self.options.gridSearchMethod(self.options.gridFilterObject))
                    .then(
                        function (result, statusText, jqXHR) {
                            if (result.IsValid) {
                                jQuery(self.options.gridDOMId).crudGrid('bind', result.Data);
                                dfd.resolve();
                            }
                            else {
                                dfd.reject(result.Message);
                            }
                        },
                        function (jqXHR, textStatus, errorThrown) {
                            dfd.reject(self.options.texts.gridSearchNotifyFailMsg);
                        })
                    .done(function () {

                    });
            }

            return dfd.promise();
        },
        _searchForEdit: function (dataItem) {

            var self = this;

            self._gridEditSearch(dataItem)
                    .progress(function (status) {
                        self.progressShow(status);
                    })
                    .fail(function (args) {
                        self.progressHide();
                        self.errorDisplay(args);
                    })
                    .always(function () {
                        self.progressHide();
                    });
        },
        _gridEditSearch: function (dataItem) {

            var self = this;
            var dfd = jQuery.Deferred();

            dfd.notify(self.options.texts.gridSearchEditNotifyBeginMsg);

            if (self.options.gridSearchForEditMethod === null) {
                dfd.reject(self.namespace + '.' + self.widgetName + ".options.gridSearchForEditMethod is an abstract method. Child class must implement");
            }
            else {

                jQuery.when(self.options.gridSearchForEditMethod(dataItem))
                        .then(
                            function (result, statusText, jqXHR) {
                                if (result.IsValid) {
                                    jQuery(self.options.formDOMId).crudForm('bind', result.Data);

                                    dfd.resolve();
                                }
                                else {
                                    dfd.reject(result.Message);
                                }
                            },
                            function (jqXHR, textStatus, errorThrown) {
                                dfd.reject(self.options.texts.gridSearchEditNotifyFailMsg);
                            })
                        .done(function () {

                        });
            }

            return dfd.promise();


        },
        _gridButtonsInit: function () {

            var defaultButtons = this.options.gridButtonsGet(this, [{
                id: "search",
                text: "Buscar",
                cssClass: "ui-crud-search",
                icon: "ui-icon-search",
                click: function (self) {
                    self.errorHide();
                    self._actionSet(self._actions.filter);
                }
            }]);

            for (var i = 0; i < defaultButtons.length; i++) {
                this._initButton(this, defaultButtons[i], jQuery(this.options.gridButtonsDOMId));
            }

        },
        //public methods
        gridSearch: function () {

            jQuery(this.element)
                .find('div.ui-crudFilter-buttons')
                    .find('button.ui-search-button')
                        .click()
                    .end()
                .end();

            return this;
        },
        gridButtonsVisible: function (trueOrFalse) {

            var $dom = jQuery(this.element).find('div.ui-crudCrud-gridButtons');

            if (trueOrFalse) {
                $dom.show();
            }
            else {
                $dom.hide();
            }

            return this;
        },
        gridPagerVisible: function (trueOrFalse) {

            var $dom = jQuery(this.element).find('div.ui-crudGrid-pager');

            if (trueOrFalse) {
                $dom.show();
            }
            else {
                $dom.hide();
            }

            return this;
        }
    });


});;// Source: src/frontend/public/scripts/crud/common.widget.crud.filter.js
define([
    "jquery",
    "jqueryui",
    "scripts/crud/common.widget.crud.base",
    "scripts/Template.Widget.Model"
],
       function ($, jqUI) {

           jQuery.widget("ui.crudFilter", jQuery.ui.crudBase,
           {
               options: {
                   Page: 0,
                   PageSize: 10,
                   SortBy: "",
                   SortAscending: false,
                   filterButtonsInit: function (self, defaultButtons) {
                       return defaultButtons;
                   },
                   gridFilterVisibleAlways: false,

                   texts: {
                       buttonCancelText: "Cancel",
                       buttonSearchText: "Search",
                   }
               },
               _create: function () {

                   this._super();

                   jQuery(this.element).widgetModel({
                       modelItems: this.options.Model
                   });

                   jQuery(this.element)
                       .addClass('ui-crudFilter ui-helper-hidden')
                           .children()
                           .wrapAll('<div class="ui-crudFilter-form " />')
                           .end()
                   .prepend('<div class="ui-crudFilter-buttons ui-ribbonButtons  ui-state-default"></div>');

                   this._filterButtonsInit();
               },
               _init: function () {

                   this._super();

                   this._done();
               },
               _done: function () {
                   this._trigger('done', null, null);
               },
               _filterButtonsInit: function () {

                   var self = this;

                   var defaultButtonsArray = [];

                   if (!self.options.gridFilterVisibleAlways) {
                       defaultButtonsArray.push(
                       {
                           id: "cancel",
                           text: self.options.texts.buttonCancelText,
                           cssClass: "ui-cancel-button ui-state-default",
                           icon: "ui-icon-circle-arrow-w",
                           click: function (self) {
                               self._trigger('cancel', null, null);
                           }
                       });
                   }

                   defaultButtonsArray.push(
                   {
                       id: "filter",
                       text: self.options.texts.buttonSearchText,
                       cssClass: "ui-search-button ui-state-default",
                       icon: "ui-icon-search",
                       click: function (self) {
                           var filter = self.val();
                           self._trigger('change', null, filter);
                       }
                   });

                   var defaultButtons = self.options.filterButtonsInit(this, defaultButtonsArray);

                   var $buttonsBox = jQuery(this.element).find('div.ui-crudFilter-buttons:first');

                   for (var i = 0; i < defaultButtons.length; i++) {
                       this._initButton(this, defaultButtons[i], $buttonsBox);
                   }

                   jQuery($buttonsBox).append('<div class="ui-helper-clearfix"></div>');
               },
               destroy: function () {

                   this._super();

                   ///TODO: unbind select change events + button events
               },
               val: function () {

                   var self = this;

                   var model = {

                       Filter: jQuery(this.element).widgetModel('valAsObject'),
                       Page: 0,
                       PageSize: this.options.PageSize,
                       SortBy: this.options.SortBy,
                       SortAscending: this.options.SortAscending
                   };

                   return model;
               }
           });


       });;// Source: src/frontend/public/scripts/crud/common.widget.crud.grid.js
define(["jquery", "jqueryui", "scripts/crud/common.widget.crud.base"],
       function ($, jqUI) {

           jQuery.widget("ui.crudGrid", jQuery.ui.crudBase,
           {
               options: {
                   gridBodyDOMId: null,
                   gridPagerDOMId: null,

                   gridModel: [],
                   gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {
                       // use this option to customize row's display items, events, etc

                       //throw new Error(crudGridWidget.namespace + '.' + crudGridWidget.widgetName + ".options.gridViewCellBound is an abstract method. Child class method must be implemented");
                   },
                   gridRowAlternateClass: '',
                   gridPagerInit: function () {
                       return {};
                       //return {
                       //    pagerTop: {
                       //        paginationShow: false,
                       //        totalRowsShow: false,
                       //        pageSizeShow: false,
                       //    },
                       //    pagerBottom: {
                       //        paginationShow: true,
                       //        totalRowsShow: true,
                       //        pageSizeShow: true,
                       //    }
                       //};
                   },

                   texts: {
                       emptyRowText: "No data found here",
                       gridBindingError:"Unhandled error binding data"
                   }
               },
               _create: function () {

                   this._super();

                   jQuery(this.element)
                       .addClass('ui-crudGrid ui-widgetGrid')
                       .append(this._gridTemplate());

                   this.options.gridBodyDOMId = jQuery(this.element).find('div.ui-crudGrid-body:first');
                   this.options.gridPagerDOMId = jQuery(this.element).find('div.ui-crudGrid-pager');

               },
               _init: function () {

                   this._super();

                   var self = this;

                   var pagerOpts = {
                       change: function (e, pagination) {
                           self._trigger('paginated', null, pagination);
                       },
                   };

                   var pagerConfig = jQuery.extend({},
                       {
                           pagerTop: {
                               paginationShow: false,
                               totalRowsShow: false,
                               pageSizeShow: false,
                           },
                           pagerBottom: {
                               paginationShow: true,
                               totalRowsShow: true,
                               pageSizeShow: true,
                           }
                       },
                       this.options.gridPagerInit());


                   jQuery(self.options.gridPagerDOMId)
                           .first()
                               .gridPagination(jQuery.extend({}, pagerOpts, pagerConfig.pagerTop))
                           .end()
                           .last()
                               .gridPagination(jQuery.extend({}, pagerOpts, pagerConfig.pagerBottom))
                           .end();
               },
               destroy: function () {

                   this._super();

               },
               bind: function (data) {

                   try {
                       this._bindRows(data);
                       this._bindPagination(data);
                       this._trigger('dataBound', null, data);
                   } catch (e) {

                       console.error(e);
                       this._trigger('errorDisplay', null, this.options.texts.gridBindingError);
                   }
                   
               },
               _gridTemplate: function () {

                   return '<div class="ui-crudGrid-container">' +
                               '<div class="ui-crudGrid-pager ui-crudGrid-pager-top ui-state-default"></div>' +
                               '<div class="ui-helper-clearfix" ></div>' +

                               '<div class="ui-crudGrid-header ui-widgetGrid-header ui-state-default">' +
                                   '<div class="ui-widgetGrid-row" >' +
                                       this._gridHeaderTemplate() +
                                   '</div>' +
                               '</div>' +
                               '<div class="ui-helper-clearfix" ></div>' +
                               '<div class="ui-crudGrid-body ui-widgetGrid-body ui-helper-clearfix" >' +

                               '</div>' +
                               '<div class="ui-helper-clearfix" ></div>' +
                               '<div class="ui-crudGrid-pager ui-crudGrid-pager-bottom ui-state-default"></div>' +
                               '<div class="ui-helper-clearfix" ></div>' +
                           '</div>'
                   ;
               },
               _gridHeaderTemplate: function () {

                   var str = '';

                   for (var i = 0; i < this.options.gridModel.length; i++) {
                       str += '<div class="ui-crudGrid-{0} ui-widgetGrid-column">{1}</div>'.format(this.options.gridModel[i].key, this.options.gridModel[i].displayName);
                   }

                   return str;
               },
               _gridRowTemplate: function (dataItem) {

                   var str = '';

                   for (var i = 0; i < this.options.gridModel.length; i++) {
                       str += '<div class="ui-crudGrid-{0} ui-widgetGrid-column ui-state-default {2}"><div class="ui-widgetGrid-column-content">{1}</div></div>'
                           .format(
                                   this.options.gridModel[i].key,
                                   dataItem[this.options.gridModel[i].key],
                                   (i == (this.options.gridModel.length - 1) ? 'ui-crudGrid-column-last' : ''));
                   }

                   return str;
               },
               _bindRowAlternatedColor: function () {

                   var self = this;

                   jQuery(self.options.gridBodyDOMId)
                       .children('div')
                           .each(function (i, ui) {
                               if (((i % 2) == 1)) {
                                   //jQuery(this).addClass('');
                               }
                               else {
                                   jQuery(this).addClass(self.options.gridRowAlternateClass);
                               }
                           });
               },
               _bindRows: function (data) {

                   var self = this;

                   jQuery(self.options.gridBodyDOMId).empty();

                   if (data.Data.length > 0) {

                       for (var i = 0; i < data.Data.length; i++) {
                           var dataItem = data.Data[i];
                           var $row = jQuery('<div class="ui-crudGrid-dataRow ui-widgetGrid-row ui-state-default {1}">{0}</div>'
                                       .format(self._gridRowTemplate(dataItem),
                                               (i == (data.Data.length - 1) ? 'ui-crudGrid-row-last' : '')));

                           for (var j = 0; j < this.options.gridModel.length; j++) {

                               var $cell = $row.find('div.ui-crudGrid-{0}:first'.format(this.options.gridModel[j].key))
                                               .find('div.ui-widgetGrid-column-content');


                               self.options.gridViewCellBound(this, $row, $cell, dataItem, this.options.gridModel[j].key);
                           }

                           jQuery(self.options.gridBodyDOMId).append($row);

                           self._bindRowAlternatedColor();
                       }
                   }
                   else {
                       var $emtpyRow = '<div class="ui-widgetGrid-emptyRow ui-widgetGrid-column  ui-state-active"><div class="ui-widgetGrid-column-content">{0}</div></div>'
                                           .format(self.options.texts.emptyRowText);

                       jQuery(self.options.gridBodyDOMId).append($emtpyRow);
                   }
               },
               _bindPagination: function (data) {

                   var self = this;

                   jQuery(self.options.gridPagerDOMId).gridPagination('bind', data.Page, data.PageSize, data.TotalRows);
               }
           });

       });;// Source: src/frontend/public/scripts/crud/common.widget.crud.form.js
define(["jquery", "jqueryui", "scripts/crud/common.widget.crud.base"],
       function ($, jqUI) {

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
                       buttonCancelText: "Cancel",
                       buttonSaveText: "Save changes",
                       UnhandledBindingError: "Unhandled error ocurred binding form data",
                       SaveBeginText: "Saving data...",
                       SavingErrorUnhandled: "Unhandled error ocurred saving data"
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
                               .widgetModel('bindValue', dataItem.EditData)
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
                                   if (result.IsValid) {
                                       self._trigger('messagedisplayAutoHide', null, result.Message, 50);
                                       self._trigger('change', null, result.Data);
                                       self.bind(result.Data);
                                       dfd.resolve();
                                   }
                                   else {
                                       if (result.Data) {

                                           jQuery(self.element)
                                               .find('div.ui-crudForm-modelBinding:first')
                                               .widgetModel('bindErrors', result.Data.ModelState);
                                       }
                                       dfd.reject(result.Message);
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
                   var result = jQuery.extend({}, dataItem, { FormData: formData });
                   return this.options.formValueGet(this, result);
               }

           });



       });;// Source: src/frontend/public/scripts/crud/common.widget.grid.pagination.js
define(["jquery", "jqueryui", "scripts/Template.Widget.Base"],
       function ($, jqUI) {

           jQuery.widget("ui.gridPagination", jQuery.ui.widgetBase,
           {
               options: {
                   paginationShow: true,
                   totalRowsShow: true,
                   pageSizeShow: true,
                   nPagesInPaginator: 3,
                   pageSize: 10,

                   texts: {
                       showingData: "Showing {0}-{1} of {2}",
                       showXPerPage: "per page"
                   }
               },
               _create: function () {

                   this._super();
               },
               _init: function () {

                   this._super();

                   this.bind(0, this.options.pageSize, 0);

               }, destroy: function () {

                   this._super();
               },
               _onChange: function (pageIndex) {

                   this._trigger('change', null,
                       {
                           pageIndex: parseInt(pageIndex),
                           pageSize: parseInt(jQuery(this.element).find('div.ui-gridPagination-pageSizePicker:first').find('select:first').val())
                       });
               },
               _buildPage: function (page, currentPage, isNavigationItem, text) {
                   var cssClass = ((currentPage == page) && (!isNavigationItem)) ? "ui-state-highlight" : "ui-state-default";
                   return "<td class='" + cssClass + "' value='" + page + "'>" + text + "</td>";
               },
               _getCurrentPage: function (currentPage) {
                   return parseInt(currentPage === null ? 0 : currentPage);
               },
               _getStartPage: function (nPagesInPaginators, totalPages, currentPage) {
                   var startPage = (currentPage > 0) ?
                                       (currentPage > (nPagesInPaginators / 2)) ?
                                           ((currentPage + 1) - Math.ceil((nPagesInPaginators / 2))) : 1 : 1;

                   if ((startPage + nPagesInPaginators) > totalPages) {
                       startPage = totalPages - nPagesInPaginators;
                   }

                   if (startPage < 1) {
                       startPage = 1;
                   }

                   return parseInt(startPage);
               },
               _getEndPage: function (nPagesInPaginators, totalPages, startPage) {
                   var endPage = startPage + nPagesInPaginators;
                   endPage = endPage > totalPages ? totalPages : endPage;
                   return parseInt(endPage);
               },
               _getNPagesInPaginator: function (nPagesInPaginators) {

                   var defaultNPages = 4;

                   if (isNaN(nPagesInPaginators)) {
                       return defaultNPages;
                   }
                   else {
                       if (nPagesInPaginators < defaultNPages) {
                           return defaultNPages;
                       }
                       else {
                           return parseInt(nPagesInPaginators) - 1;
                       }
                   }
               },
               _buildPagination: function (Page, PageSize, TotalRows, TotalPages) {

                   var self = this;

                   if (TotalPages > 1) {
                       var nPagesInPaginator = self._getNPagesInPaginator(this.options.nPagesInPaginator);
                       var start = self._getStartPage(nPagesInPaginator, TotalPages, self._getCurrentPage(Page));
                       var end = self._getEndPage(nPagesInPaginator, TotalPages, start);
                       var tPager = jQuery("<table></table>");
                       var $firstColumn = jQuery(self._buildPage(0, self._getCurrentPage(Page), true, "&lt;&lt;", null));

                       $firstColumn.addClass('ui-gridPagination-navBar-firstCol');
                       tPager.append($firstColumn);

                       tPager.append(self._buildPage(self._getCurrentPage(Page) - 1 < 0 ? 0 : self._getCurrentPage(Page) - 1, self._getCurrentPage(Page), true, "&lt;", null));

                       for (var i = start; i <= end; i++) {
                           tPager.append(self._buildPage(i - 1, self._getCurrentPage(Page), false, i.toString(), null));
                       }

                       tPager.append(self._buildPage(self._getCurrentPage(Page) + 1 >= TotalPages ? self._getCurrentPage(Page) : self._getCurrentPage(Page) + 1, self._getCurrentPage(Page), true, "&gt;", null));


                       var $lastColumn = jQuery(self._buildPage(TotalPages - 1, self._getCurrentPage(Page), true, "&gt;&gt;", null));
                       $lastColumn.addClass('ui-gridPagination-navBar-lastCol');
                       tPager.append($lastColumn);

                       jQuery(self.element)
                               .append(tPager)
                               .find('table:first')
                                   .wrapAll("<div class='ui-gridPagination-navBar'/>")
                                   .find('td')
                                       .click(function () {
                                           self._onChange(jQuery(this).attr('value'));
                                       });
                   }

               },
               bind: function (pageIndex, pageSize, totalRows) {

                   var self = this;

                   jQuery(self.element).empty();

                   //try {

                   pageSize = pageSize || this.options.pageSize;

                   var Page = parseInt(pageIndex);
                   var PageSize = parseInt(pageSize);
                   var TotalRows = parseInt(totalRows);
                   var TotalPages = ((totalRows / pageSize) | 0) + (((totalRows % pageSize) === 0) ? 0 : 1);


                   if (this.options.paginationShow === true) {

                       self._buildPagination(Page, PageSize, TotalRows, TotalPages);
                   }







                   // Building totals

                   var $totalsBox = null;

                   jQuery(self.element)
                       .append("<div class='ui-gridPagination-totals ui-state-default'></div>")
                       .find('div.ui-gridPagination-totals:first')
                       .each(function () {
                           $totalsBox = jQuery(this);
                       });


                   //Showing results begin...

                   $totalsBox
                           .append(function () {

                               var str = "<div class='ui-gridPagination-totalRows'>" + self.options.texts.showingData + "</div>";

                               return str.format(((Page * PageSize) + 1), (((Page + 1) * PageSize)), TotalRows);

                           });



                   //Showing pagesize begin...
                   $totalsBox
                           .append("<div class='ui-gridPagination-pageSizePicker'><select></select> " + self.options.texts.showXPerPage + "</div>"
                               .format(PageSize));



                   var strOptions = '';

                   for (var iPageSize = 10; iPageSize < 60; (iPageSize += 10)) {
                       strOptions += "<option value='{0}'>{0}</option>".format(iPageSize);
                   }


                   var $select = $totalsBox
                                   .find('div.ui-gridPagination-pageSizePicker')
                                       .find('select');

                   $select.append(strOptions);

                   if ($select.find('option[value="{0}"]'.format(PageSize)).length === 0) {
                       $select.prepend('<option value="{0}">{0}</option>'.format(PageSize));
                   }

                   $select
                       .val(PageSize)
                       .change(function () {
                           self._onChange(0);
                       });

                   $totalsBox.append('<div class="ui-helper-clearfix" />');

                   if ((this.options.totalRowsShow === false) && (this.options.pageSizeShow === false)) {
                       jQuery(this.element)
                           .find('div.ui-gridPagination-totals:first')
                               .hide()
                           .parents('div.{0}-{1}:first'.format(this.namespace, this.widgetName))
                               .addClass('ui-helper-hidden');

                   }
                   else {
                       if (this.options.totalRowsShow === false) {
                           jQuery(this.element).find('div.ui-gridPagination-totalRows:first').hide();
                       }

                       if (this.options.pageSizeShow === false) {
                           jQuery(this.element).find('div.ui-gridPagination-pageSizePicker:first').hide();
                       }
                   }

               }
           });

       });;// Source: src/frontend/public/scripts/url/urlHelper.js
function UrlHelper(strURI) {
    return this.bind(strURI);
}


UrlHelper.prototype.bind = function (strURI) {

    var a = document.createElement('a');
    a.href = strURI;

    this.hash = a.hash;
    this.host = a.host;
    this.hostname = a.hostname;
    this.href = a.href;
    this.origin = a.origin;
    this.pathname = a.pathname;
    this.port = a.port;
    this.protocol = a.protocol;
    this.search = a.search;

    return this;
};

UrlHelper.prototype.isValid = function () {
    throw new Error("Not implemented extension");
};

UrlHelper.prototype.paramSet = function (key, value) {

    if (arguments.length == 2) {

        var addOrReplaceUrlParameter = function (url, paramName, paramValue) {
            var hashSplit = url.split('#');
            var paramSplit = hashSplit[0].split('?');
            var encodedParamName = encodeURIComponent(paramName);
            var encodedParamValue = encodeURIComponent(paramValue);
            if (paramSplit[1]) {
                if (paramSplit[1].match(new RegExp("(^|\\&)" + encodedParamName + "="))) {
                    var match = new RegExp('(' + encodedParamName + ')' + "=.*?(\\&|$)");
                    paramSplit[1] = paramSplit[1].replace(match, '$1=' + encodedParamValue + '$2');
                } else {
                    paramSplit[1] += "&" + encodedParamName + '=' + encodedParamValue;
                }
            } else {
                paramSplit.push(encodedParamName + '=' + encodedParamValue);
            }
            return paramSplit.join('?') + (hashSplit[1] ? "#" + hashSplit[1] : '');
        };

  
        return this.bind(addOrReplaceUrlParameter(this.href, key, value));

    }
    else {
        throw new Error("Argument exception");
    }
};



;// Source: src/frontend/public/scripts/Template.Widget.Page.js
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

          

       }); return VsixMvcAppResult; });