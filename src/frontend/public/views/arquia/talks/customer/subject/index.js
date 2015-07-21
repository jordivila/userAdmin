﻿define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",
    "pPromises",

    "scripts/modules/crud",
    "/arquia/talks/customer/arquiaCommon/arquiaCrudFakeData.js",
    "/arquia/talks/customer/arquiaCommon/arquiaUrls.js",
],
function ($, jqUI, clientApp, P, crudModule, crudAjaxOpts, arquiaUrls) {

    clientApp.view = {
        main: function () {
            //ui-arquia-talks-subject-next

            var $mainBox = jQuery('div.ui-arquia-talks-subject-container:first');
            var $errorsBox = jQuery('div.ui-arquia-talks-boxError:first');
            var $infoBox = jQuery('div.ui-arquia-talks-boxInfo:first');
            var $modelWidget = function () {

                return jQuery("div.ui-arquia-talks-add-model")
                                            .widgetModel({
                                                modelItems: [{
                                                    id: "subject",
                                                    displayName: "Subject", //clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeString"),
                                                    input: { value: "" },
                                                }],
                                                errorsCleared: function () {
                                                    $errorsBox.fadeOut(function () {
                                                        jQuery(this).addClass('ui-helper-hidden');
                                                    });
                                                }
                                            });

            }();
            var showMessage = function ($box, message) {

                $box.html(message)
                    .fadeOut(1, function () {
                        jQuery(this).removeClass('ui-helper-hidden').fadeIn();
                    });

            };
            var showDataResultOK = function (dataResult) {
                dataResult.addMessage(clientApp.i18n.texts.get("Views.Layout.PleaseWaitYouAreBeingRedirected"));
                showMessage($infoBox, dataResult.messages.join('<br/>'));
                console.log(dataResult);
                clientApp.template.loadByUrl('../' + arquiaUrls.message(dataResult.data.editData.id));
            };
            var showDataResultKO = function (dataResult) {
                showMessage($errorsBox, dataResult.messages.join('<br/>'));
                $modelWidget.widgetModel('bindErrors', dataResult.data.modelState);
            };
            var showUnhandled = function (e) {
                console.error(e);
                showMessage($errorsBox, clientApp.i18n.texts.get("Views.Layout.UnExpectedError"));
            };

            $mainBox
                .find('button:first')
                    .button()
                    .click(function () {

                        var formValue = $modelWidget.widgetModel('valAsObject');

                        return P.all([crudAjaxOpts.ajax.talkAdd(formValue)]).nodeify(function (e, data) {

                            if (e !== null) {
                                showUnhandled(e);
                            }
                            else {
                                try {
                                    var dataResult = data[0];
                                    if (dataResult.isValid === true) {
                                        showDataResultOK(dataResult);
                                    } else {
                                        showDataResultKO(dataResult);
                                    }
                                } catch (eII) {
                                    showUnhandled(eII);
                                }
                            }
                        });
                    })
                .end()
                .removeClass('ui-helper-hidden');
        }
    };

    return clientApp;

});
