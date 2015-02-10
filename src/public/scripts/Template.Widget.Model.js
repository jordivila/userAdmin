

jQuery('#pp')
    .click(function () {

        jQuery('*[data-widget="widgetModel"]').widgetModel('value');

    });


jQuery.widget("ui.widgetModel", jQuery.ui.widgetBase,
{
    options: {
        displayName: null,
        formItems: null
    },
    _create: function () {

        this._super();

        jQuery(this.element)
            .attr('data-widget', this.widgetName)
            .addClass('ui-corner-all ui-widget-content')
            .append(this._templateFormat());
        
        var $body = jQuery(this.element).find('div.ui-widgetModel-content:first');

        if (this.options.formItems !== null)
        {
            for (var i = 0; i < this.options.formItems.length; i++) {
                var $f = jQuery('<div></div>');
                $body.append($f);
                $f.widgetModelItem(this.options.formItems[i]);
            }
        }
    },
    _init: function () {

        this._super();
    },
    destroy: function () {

        this._super();
    },
    _template: function () {

        return "<div class='ui-corner-top ui-widget-header'>{0}</div><div class='ui-corner-bottom ui-widget-content ui-widgetModel-content'></div>";

    },
    _templateFormat: function () {
        return this._template().format(this.options.displayName);
    },
    value: function () {

        for (var i = 0; i < this.options.formItems.length; i++) {
            console.log(jQuery('*[data-widgetModelItem-id="{0}"]'.format(this.options.formItems[i].id)).widgetModelItem('val'));
            //console.log("{0}={1}".format(
            //    this.options.formItems[i].id,
            //    jQuery('*[data-widgetModelItem-id="{0}"]'.format(this.options.formItems[i].id).widgetModelItem('val'))));
        }
    }
});


jQuery.widget("ui.widgetModelItem", jQuery.ui.widgetBase,
{
    options: {
        id: null,
        displayName: null,
        input: { type: null, value: null, nullable: false }
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
            })
            .change(function () {
                jQuery(self.element).removeClass('ui-state-error').find('div.ui-widgetModel-inputError').remove();
                self._trigger('changed', null, jQuery(this).attr('id'));
            });

    },
    _init: function () {

        this._super();

    }, 
    destroy: function () {

        this._super();
    },
    _template: function () {
        return "<div class='ui-widgetModel-inputLabel'>{1}</div>" +
                "<div class='ui-widgetModel-inputValue'></div>" +
                "<div class='ui-widgetModel-inputError ui-hidden'>" +
                    "{2}" +
                "</div>" +
                "<div class='ui-carriageReturn'></div>";
    },
    _templateFormat: function () {
        return this._template().format(this.options.id, this.options.displayName, []);
    },
    _formItemBuild: function ($parent) {

        var self = this;
        var t = '';

        switch (this.options.input.type) {
            case "date":

                t = '<input id="{1}" name="{1}" type="text" />'.format(this.options.input.value, this.options.id);

                jQuery($parent)
                    .append(t)
                    .find('#{0}'.format(this.options.id))
                    .widgetModelItemDate({
                        value: this.options.input.value
                    });

                this.val = function () {
                    alert("valor de fecha");
                };

                break;
            case "float":

                t = '<input id="{1}" name="{1}" type="text" value="{0}" />'.format(this.options.input.value, this.options.id);

                jQuery($parent).append(t);

                this.val = function () {
                    alert("valor de float");
                };

                
                break;
            case "bool":

                t = '<input id="{0}" name="{0}" type="checkbox" value="true" />'.format(this.options.id);

                jQuery($parent)
                    .append(t)
                    .find('#{0}'.format(this.options.id))
                    .widgetModelItemBool({
                        value: self.options.input.value,
                        nullable: self.options.input.nullable,
                        id: self.options.id
                    });

                this.val = function () {
                    alert("valor booleano");
                };

                break;
            default:
                res = "";
                break;
        }

        
    },
    val: function () {
        throw new Error("{0}.val is an abstract function".format(this.widgetName));
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

