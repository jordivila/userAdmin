/// <reference path="inv.ajax.js" />

jQuery.widget("ui.fieldItem", jQuery.ui.commonBaseWidget,
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

                if (jQuery(this).data("isInitialized") === undefined)
                {
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