/// <reference path="VsixMvcAppResult.A.Intellisense.js" />

jQuery.widget("ui.widgetModelItemBool", jQuery.ui.widgetBase,
{
    options: {
        id: null,
        value: null,
        nullable: null,
        $container:null
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

                                    jQuery(this)
                                        .find('span')
                                        .removeClass(self.options.icons.join(" "))
                                        .addClass(nextClassName);

                                    switch (nextClassName) {
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

        var b = ('<button class="ui-button-icon-only ui-button ui-state-default ui-corner-all" ' +
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
    }

});