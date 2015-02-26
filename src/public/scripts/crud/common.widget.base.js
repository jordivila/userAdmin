/// <reference path="inv.ajax.js" />

jQuery.widget("ui.commonBaseWidget", /*jQuery.ui.widgetBase,*/
{
    options: {
        progressFeedbackDOMId: null,
        errorDOMId: null,
        errorCustomDOM: false, // errors are shown in a custom DOM element,
        messagesDOMId: null
    },
    _create: function () {

        this._super();

        this.progressInit();
        this.errorInit();

    },
    _init: function () {

        this._super();

        var widgetName = this.namespace + '.' + this.widgetName;

        console.log("Init->" + widgetName);

        var dataWidgetInitialized = widgetName + ".IsInitialized";


        if (jQuery(this.element).data(dataWidgetInitialized) === undefined) {
            jQuery(this.element).data(dataWidgetInitialized, true);
        }
        else {
            throw new Error("Se ha intentado crear una instancia de widget que ya estaba creada. Podrian duplicarse eventos." + widgetName);
        }
    },
    destroy: function () {

        this._super();
    },
    progressInit: function () {

        // only one progressFeedback per page

        if (jQuery('#progressFeedBack').length === 0) {
            jQuery('body').prepend('<div id="progressFeedBack" class="ui-progress-feedback ui-widget ui-widget-content ui-state-active">Please wait while loading</div>');
        }

        this.options.progressFeedbackDOMId = jQuery('#progressFeedBack');

    },
    progressShow: function (msg) {
        console.log("Info->" + msg);
        jQuery(this.options.progressFeedbackDOMId).html(msg).show();
    },
    progressHide: function () {
        jQuery(this.options.progressFeedbackDOMId).hide();
    },
    errorInit: function () {

        if (this.options.errorCustomDOM) {

            var errorCustomDOMClassName = this.namespace + '-' + this.widgetName + '-errDisplayBox';
            var highlightCustomDOMClassName = this.namespace + '-' + this.widgetName + '-highlightDisplayBox';

            var template = '';
            template += '<div class="ui-widget-error ' + errorCustomDOMClassName + ' ui-state-error "></div>';
            template += '<div class="ui-widget-info ' + highlightCustomDOMClassName + ' ui-state-highlight "></div>';

            jQuery(this.element).prepend(template);

            this.options.errorDOMId = jQuery(this.element).find('div.' + errorCustomDOMClassName + ':first');
            this.options.messagesDOMId = jQuery(this.element).find('div.' + highlightCustomDOMClassName + ':first');

            this.errorHide();
            this.messageHide();
        }
    },
    errorDisplay: function (msg) {
        console.log("Error->" + msg);
        jQuery(this.options.errorDOMId).html(msg).fadeTo('slow', 1);
    },
    errorHide: function () {
        jQuery(this.options.errorDOMId).html('').fadeTo('slow', 0);
    },
    messageDisplay: function (msg) {
        jQuery(this.options.messagesDOMId).html(msg).fadeTo('slow', 1);
    },
    messageHide: function () {
        jQuery(this.options.messagesDOMId).html('').fadeTo('slow', 0);
    },
    messagedisplayAutoHide: function (msg, miliseconds) {

        var time = 3000;

        if (miliseconds) {
            time = miliseconds;
        }

        jQuery(this.options.messagesDOMId).html(msg)
            .fadeTo(500, 1, function () {
                jQuery(this).delay(time).fadeTo(time, 0);
            });
    },
    dfdFillCombo: function (selector, KeyValuePairArray) {
        var dfd = jQuery.Deferred();
        try {
            var $domObj = jQuery(selector);

            $domObj.find('option').remove();

            for (var i = 0; i < KeyValuePairArray.length; i++) {
                $domObj.append(jQuery("<option />").val(KeyValuePairArray[i].value).text(KeyValuePairArray[i].name));
            }

            dfd.resolve();
        }
        catch (e) {
            dfd.reject("Error inicializando el formulario: " + e.message);
        }
        return dfd.promise();
    }
});