
//var progressBoxSelector = "#progressFeedBack";

jQuery.widget("ui.commonBaseWidget", jQuery.ui.widgetBase,
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
    //progressInit: function () {

    //    // only one progressFeedback per page
    //    var self = this;

    //    if (jQuery(progressBoxSelector).length === 0) {
    //        jQuery('body').prepend('<div id="progressFeedBack" class="ui-progress-feedback ui-widget-overlay"><div class="ui-widget ui-widget-content ui-state-active ">Please wait while loading</div></div>');

    //        /*
    //        // these lines do not work on mobile
    //        jQuery(document)
    //            .click(function (e) {
    //                jQuery(progressBoxSelector).find('div:first').css('top', (e.clientY + 20));
    //            });
    //        */
    //    }
    //},
    //progressShow: function (msg) {

    //    console.log("Info->" + msg);

    //    var $p = jQuery(progressBoxSelector);

    //    $p
    //    .addClass('ui-front')
    //    .find('div:first')
    //        .html(msg)
    //    .end()
    //    .show();
    //},
    //progressHide: function () {
    //    jQuery(progressBoxSelector).removeClass('ui-front').hide();
    //},
    //dfdFillCombo: function (selector, KeyValuePairArray) {
    //    var dfd = jQuery.Deferred();
    //    try {
    //        var $domObj = jQuery(selector);

    //        $domObj.find('option').remove();

    //        for (var i = 0; i < KeyValuePairArray.length; i++) {
    //            $domObj.append(jQuery("<option />").val(KeyValuePairArray[i].value).text(KeyValuePairArray[i].name));
    //        }

    //        dfd.resolve();
    //    }
    //    catch (e) {
    //        dfd.reject("Error inicializando el formulario: " + e.message);
    //    }
    //    return dfd.promise();
    //}
});