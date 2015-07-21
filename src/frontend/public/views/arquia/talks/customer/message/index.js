define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",
    "pPromises",

    "scripts/modules/crud",
    "/arquia/talks/customer/arquiaCommon/arquiaCrudFakeData.js",
],
function ($, jqUI, clientApp, P, crudModule, crudAjaxOpts) {

    clientApp.view = {
        main: function () {
            //ui-arquia-talks-message-next

            var $mainBox = jQuery('div.ui-arquia-talks-message-container:first');
            var $errorsBox = jQuery('div.ui-arquia-talks-boxError:first');
            var $infoBox = jQuery('div.ui-arquia-talks-boxInfo:first');
            var $modelWidget = function () {

                return jQuery("div.ui-arquia-talks-add-model")
                                            .widgetModel({
                                                modelItems: [{
                                                    id: "someCustomValue",
                                                    displayName: '',
                                                    input: {
                                                        type: "custom",
                                                        value: null,
                                                        nullable: true,
                                                        onItemBuild: function (widget, parent) {

                                                            jQuery(parent)
                                                                .append(jQuery($mainBox)
                                                                            .find('div.ui-arquia-talks-message-inputBox-template:first')
                                                                            .html());

                                                            var $input = jQuery(parent)
                                                                            .find('div.ui-arquia-talks-message-inputBox:first')
                                                                                .find('div[contenteditable]:first');

                                                            $input.keypress(function (event) {

                                                                if (event.which == 13) {

                                                                    event.preventDefault();
                                                                    
                                                                    var text = $input.text();

                                                                    if (text.trim().length > 0)
                                                                    {
                                                                        alert("go !!");
                                                                    }
                                                                }

                                                            });
                                                        },
                                                        onItemValue: function (parent) {

                                                            return jQuery(parent)
                                                                    .find('div.ui-arquia-talks-message-inputBox:first')
                                                                        .find('div[contenteditable]:first')
                                                                            .text()
                                                                        .end()
                                                                    .end();
                                                        },
                                                        onItemBind: function (parent, dataItem) {
                                                            // nothing to bind here
                                                            //return jQuery(parent).find('span.someCustomValue').html(dataItem);
                                                        }
                                                    },
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
                clientApp.template.loadByUrl('../messages/' + dataResult.data.editData.id);
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
                .find('div.ui-arquia-talks-message-buttonsBox:first')
                    .find('button:first')
                        .button()
                        .click(function () {

                            var formValue = $modelWidget.widgetModel('valAsObject');

                            console.log(formValue);

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
                .end()
                .removeClass('ui-helper-hidden');
        }
    };

    return clientApp;

});
