jQuery.widget("ui.widgetForm", jQuery.ui.widgetBase,
{
    options: {
        displayName: null,
        formItems: null
    },
    _create: function () {

        this._super();


        jQuery(this.element)
            .attr('data-widget', 'widgetBase')
            .addClass('ui-corner-all ui-widget-content')
            .append(this._templateFormat());

        
        var $body = jQuery(this.element).find('div.ui-widgetForm-content:first');

        if (this.options.formItems !== null)
        {
            for (var i = 0; i < this.options.formItems.length; i++) {
                var $f = jQuery('<div></div>');
                $body.append($f);
                $f.widgetFormItem(this.options.formItems[i]);
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

        return "<div class='ui-corner-top ui-widget-header'>{0}</div><div class='ui-corner-bottom ui-widget-content ui-widgetForm-content'></div>";

    },
    _templateFormat: function () {
        return this._template().format(this.options.displayName);
    },
});


jQuery.widget("ui.widgetFormItem", jQuery.ui.widgetBase,
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
            .attr('data-widget', 'widgetModelItem')
            .addClass('ui-widgetFormItem ui-widgetForm-' + this.options.id)
            .append(this._templateFormat())
            .find(':input')
            .addClass('ui-widget-content')
            .focus(function () {
                jQuery(this).addClass('ui-state-focus');
            })
            .blur(function () {
                jQuery(this).removeClass('ui-state-focus');
            })
            .change(function () {
                jQuery(self.element).removeClass('ui-state-error').find('div.ui-widgetForm-inputError').remove();
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

        //return "<div data-widget='widgetModelItem' class='ui-widgetFormItem ui-widgetForm-{0} '>" +
        //            "<div class='ui-widgetForm-inputLabel'>{1}</div>" +
        //            "<div class='ui-widgetForm-inputValue'>{2}</div>" +
        //            "<div class='ui-widgetForm-inputError ui-hidden'>" +
        //                "{3}" +
        //            "</div>" +
        //            "<div class='ui-carriageReturn'></div>" +
        //        "</div>";


        return "<div class='ui-widgetForm-inputLabel'>{1}</div>" +
                "<div class='ui-widgetForm-inputValue'>{2}</div>" +
                "<div class='ui-widgetForm-inputError ui-hidden'>" +
                    "{3}" +
                "</div>" +
                "<div class='ui-carriageReturn'></div>";
    },
    _templateFormat: function () {
        return this._template().format(this.options.id, this.options.displayName, this._formItemBuild(), []);
    },
    _formItemBuild: function () {

        var self = this;
        var res = "";

        switch (this.options.input.type) {
            case "date":
                res = '<input data-value="{0}" data-widget="dateSelector" id="{1}" name="{1}" type="text" />'
                    .format(this.options.input.value,
                            this.options.id);
                break;
            case "float":
                res = '<input id="{1}" name="{1}" type="text" value="{0}" />'
                    .format(this.options.input.value,
                            this.options.id);
                break;
            case "bool":

                res = '<div data-widget="ui-widgetBoolean" data-widget-nullable="{3}">' +
                                '<button class="ui-button-icon-only ui-button ui-state-default ui-corner-all" ' +
                                        'data-textOnly="true" ' +
                                        'data-widget="widgetButton" ' +
                                        'type="button">' +
                                            '<span class="ui-button-text">&nbsp;</span>' +
                                            '<span class="{2} ui-button-icon-primary ui-icon"></span>' +
                                '</button>' +
                                '<input id="{0}" name="{0}" type="checkbox" value="true" {1} />' +
                                '<input name="{0}" type="hidden" value="false" />' +
                       '</div>';

                var icon = "";
                var getNonNullableIcon = function()
                {
                    return (self.options.input.value === true ? "ui-icon-check" : "ui-icon-closethick");
                };
        
                if (self.options.input.nullable === true) {
                    if (self.options.input.value !== null) {
                        icon = getNonNullableIcon();
                    }
                    else {
                        icon = "ui-icon-help";
                    }
                }
                else {
                    icon = getNonNullableIcon();
                }

                console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP");
                console.log(icon);

                res = res.format(this.options.id,
                            (this.options.input.value === true ? " checked='true' " : ""),
                            icon,
                            (this.options.input.nullable === true ? "true" : "false"));

                break;
            default:
                res = "";
                break;
        }

        return res;
    }
});

jQuery.widget("ui.widgetFormSummary", jQuery.ui.widgetBase,
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

