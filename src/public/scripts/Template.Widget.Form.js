/// <reference path="VsixMvcAppResult.A.Intellisense.js" />

jQuery.widget("ui.widgetFormItem", jQuery.ui.widgetBase,
{
    options: {

    },
    _create: function () {
        
        this._super();
        

        var self = this;

        jQuery(this.element)
            .find(':input')
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

