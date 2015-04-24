jQuery.widget("ui.crudBase", jQuery.ui.commonBaseWidget,
{
    options: {
        errorDOMId: null,
        messagesDOMId: null
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