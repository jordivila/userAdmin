
jQuery.widget("ui.widgetModel", jQuery.ui.widgetBase,
{
    options: {
        modelItems: null,
        markOnChange: false // set a highlight class when item changed. Primarly used in filter objects
    },
    _create: function () {

        this._super();

        //jQuery(this.element)
        //.attr('data-widget', this.widgetName);
        //.addClass('ui-corner-all ui-widget-content');

        this._bindModelSchema(this.options.modelItems);
    },
    _init: function () {

        this._super();
    },
    destroy: function () {

        this._super();
    },
    _template: function () {
        return "<div class='ui-corner-bottom ui-widgetModel-content '></div>";


        //var valSummary = '' +
        //'<div class="ui-widgetForm-ValidationSummary ui-state-error ui-corner-all" data-widget="widgetFormSummary">' +
        //    '<span>Por favor, revise el formulario</span>' +
        //    '<ul>' +
        //        '<li modelKey="Email">El campo "Correo electrónico" es obligatorio</li>' +
        //        '<li modelKey="Password">El campo "Contraseña" es obligatorio</li>' +
        //    '</ul>' +
        //'</div>';

        //return "<div class='ui-corner-top ui-widget-header'>{0}</div><div class='ui-corner-bottom ui-widget-content ui-widgetModel-content'></div>" + valSummary;
    },
    _templateFormat: function () {
        return this._template();
    },
    val: function () {
        var o = this.cloneObject(this.options.modelItems);
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
