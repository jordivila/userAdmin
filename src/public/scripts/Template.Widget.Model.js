jQuery.widget("ui.widgetModel", jQuery.ui.widgetBase,
{
    options: {
        modelItems: null
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
        return "<div class='ui-corner-bottom ui-widget-content ui-widgetModel-content'></div>";


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
            var propValue = jQuery('div[data-widgetModelItem-id="{0}"]:first'.format(propName)).widgetModelItem('val');
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

            var onItemChanged = function () {

                var clearedErrors = true;

                for (var i = 0; i < self.options.modelItems.length; i++) {
                    if (jQuery('div[data-widgetModelItem-id="{0}"]:first'.format(self.options.modelItems[i].id))
                        .hasClass('ui-state-error')) {
                        clearedErrors = false;
                        break;
                    }
                }

                if (clearedErrors)
                {
                    alert("errors cleared");
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

        for (var i = 0; i < keyValueArray.length; i++) {
            jQuery('div[data-widgetModelItem-id="{0}"]:first'.format(keyValueArray[i].key))
                .widgetModelItem('setErrors', keyValueArray[i].value)
                .addClass('ui-state-error');
        }
    },
    bindValue: function (dataItem) {
        for (var i in dataItem) {
            for (var j = 0; j < this.options.modelItems.length; j++) {
                if (this.options.modelItems[j].id == i) {


                    console.log('div[data-widgetModelItem-id="{0}"]:first'.format(i));
                    jQuery('div[data-widgetModelItem-id="{0}"]:first'.format(i)).widgetModelItem('setValue', dataItem[i]);
                }
            }
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
            .addClass('ui-widget-content')
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
                "<div class='ui-widgetModel-inputError ui-hidden'>" +
                    "{1}" +
                "</div>" +
                "<div class='ui-carriageReturn'></div>";
    },
    _templateFormat: function () {

        return this._template().format(
            this.options.displayName,
            this.options.errors.join('<br/>'));
    },
    _formItemBuild: function ($parent) {

        var self = this;
        var t = '';
        var jqSelector = '#{0}'.format(this.options.id);

        switch (this.options.input.type) {
            case "date":

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
                    return jQuery(jqSelector).val();
                };
                this.setValue = function (value) {
                    return jQuery(jqSelector).widgetModelItemDate('setDate', value);
                };

                break;
            case "float":

                t = '<input id="{1}" name="{1}" type="text" value="{0}" />'.format(this.options.input.value, this.options.id);

                jQuery($parent)
                    .append(t)
                    .find(jqSelector)
                    .change(function () {
                        self.change();
                    });

                this.val = function () {
                    return jQuery(jqSelector).val();
                };
                this.setValue = function (value) {
                    return jQuery(jqSelector).val(value);
                };

                break;
            case "bool":

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
                    return jQuery(jqSelector).widgetModelItemBool('val');
                };
                this.setValue = function (value) {
                    return jQuery(jqSelector).widgetModelItemBool('setValue', value);
                };


                break;
            case "list":

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
                    return jQuery(jqSelector).val();
                };
                this.setValue = function (value) {
                    return jQuery(jqSelector).val(value);
                };
                break;

            case "custom":
                this.options.input.onItemBuild(jQuery(this.element), $parent);
                this.val = function () {
                    return self.options.input.onItemValue($parent);
                };
                this.setValue = function (value) {
                    return self.options.input.onItemBind($parent, value);
                };
                break;
            default:

                t = '<input id="{1}" name="{1}" type="text" value="{0}" />'.format(this.options.input.value, this.options.id);

                jQuery($parent)
                    .append(t)
                    .find(jqSelector)
                    .change(function () {
                        self.change();
                    });

                this.val = function () {
                    return jQuery(jqSelector).val();
                };
                this.setValue = function (value) {
                    return jQuery(jqSelector).val(value);
                };

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
                .removeClass('ui-hidden');
        }
        else {
            jQuery(this.element)
                .find('div.ui-widgetModel-inputError:first')
                .removeClass('ui-state-error')
                .empty()
                .addClass('ui-hidden');
        }
    },
    val: function () {
        throw new Error("{0}.val is an abstract function".format(this.widgetName));
    },
    setValue: function () {
        throw new Error("{0}.setValue is an abstract function".format(this.widgetName));
    }
});

jQuery.widget("ui.widgetModelSummary", jQuery.ui.widgetBase,
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
    deleteByKey: function (key) {
        jQuery(this.element).find('li[modelkey="' + key + '"]').remove();
        if (jQuery(this.element).find('ul').find('li').length === 0) {
            jQuery(this.element).hide();
        }
    }
});