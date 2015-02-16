jQuery.widget("ui.buttonRibbon", jQuery.ui.widgetBase,
{
    options: {

    },
    _create: function () {

        this._super();

        jQuery(this.element)
            .attr('data-widget', this.widgetName)
            .addClass('ui-corner-all ui-widget-content');
    },
    _init: function () {

        this._super();
    },
    destroy: function () {

        this._super();
    },
});