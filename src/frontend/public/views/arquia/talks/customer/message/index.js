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

            var $mainBox = jQuery('div.ui-arquia-talks-message-container:first');
            //var $errorsBox = jQuery('div.ui-arquia-talks-boxError:first');
            //var $infoBox = jQuery('div.ui-arquia-talks-boxInfo:first');
            var $messageWindow = jQuery('div.ui-arquia-talks-message-window:first');
            var $messageModelWidget = function () {

                var sendButtonInit = function ($parent, $input) {

                    $parent
                        .find('button.ui-button-send')
                        .click(function () {
                            messageSend($parent, $input);
                        });

                };
                var inputKeyPressInit = function ($parent, $input) {

                    $input.keyup(function (event) {

                        var text = $input.text();

                        if (event.which == 13) {

                            event.preventDefault();

                            messageSend($parent, $input);
                        }
                        else {

                            if (text.trim().length > 0) {
                                messageSendButtonShow($parent);

                            } else {
                                messageSendButtonHide($parent);
                            }

                        }
                    });
                };

                return jQuery("div.ui-arquia-talks-add-model")
                                            .widgetModel({
                                                modelItems: [{
                                                    id: "message",
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

                                                            inputKeyPressInit(parent, $input);
                                                            sendButtonInit(parent, $input);
                                                        },
                                                        onItemValue: function (parent) {

                                                            return jQuery(parent)
                                                                    .find('div.ui-arquia-talks-message-inputBox:first')
                                                                        .find('div[contenteditable]:first')
                                                                            .text();
                                                            //.end()
                                                            //.end();
                                                        },
                                                        onItemBind: function (parent, dataItem) {
                                                            // nothing to bind here
                                                            //return jQuery(parent).find('span.someCustomValue').html(dataItem);
                                                        }
                                                    },
                                                }],
                                                errorsCleared: function () {
                                                    //$errorsBox.fadeOut(function () {
                                                    //    jQuery(this).addClass('ui-helper-hidden');
                                                    //});
                                                }
                                            });

            }();
            //var showMessage = function ($box, message) {

            //    $box.html(message)
            //        .fadeOut(1, function () {
            //            jQuery(this).removeClass('ui-helper-hidden').fadeIn();
            //        });

            //};
            //var showDataResultOK = function (dataResult) {
            //    dataResult.addMessage(clientApp.i18n.texts.get("Views.Layout.PleaseWaitYouAreBeingRedirected"));
            //    showMessage($infoBox, dataResult.messages.join('<br/>'));
            //    console.log(dataResult);
            //    //clientApp.template.loadByUrl('../messages/' + dataResult.data.editData.id);
            //};
            //var showDataResultKO = function (dataResult) {
            //    showMessage($errorsBox, dataResult.messages.join('<br/>'));
            //    $messageModelWidget.widgetModel('bindErrors', dataResult.data.modelState);
            //};
            //var showUnhandled = function (e) {
            //    console.error(e);
            //    showMessage($errorsBox, clientApp.i18n.texts.get("Views.Layout.UnExpectedError"));
            //};
            var messageSendButtonHide = function ($parent) {

                $parent
                    .find('button.ui-button-send')
                        .addClass('ui-helper-hidden')
                    .end()
                    .find('button.ui-button-micro')
                        .removeClass('ui-helper-hidden')
                    .end();

            };
            var messageSendButtonShow = function ($parent) {

                $parent
                    .find('button.ui-button-send')
                        .removeClass('ui-helper-hidden')
                    .end()
                    .find('button.ui-button-micro')
                        .addClass('ui-helper-hidden')
                    .end();

            };


            var messageScrollMoveToBottom = function () {
                $messageWindow[0].scrollTop = $messageWindow[0].scrollHeight;
            };

            var messageTemplate = function () {
                return '<div class="ui-message ui-corner-all {0}">' +
                  '<h3 class="ui-message-who">{1}</h3>' +
                  '<div class="ui-message-text">{2}</div>' +
                  '<div class="ui-message-datePosted">{3}</div>' +
                  '<div class="ui-helper-hidden" data-message-guid="{4}"></div>' +
                '</div>';
            }();


            var messageSend = function ($parent, $input) {


                // 1.- get data
                var formValue = $messageModelWidget.widgetModel('valAsObject');
                formValue.idTalk = 0;
                formValue.messageGuid = clientApp.utils.guid();
                // 2.- clean input
                $input.empty();
                messageSendButtonHide($parent);
                // 3.- add message to window
                $messageWindow.append(messageTemplate.format(
                    'ui-isCurrentUser ui-state-highlight',
                    'Fermin',
                    formValue.message,
                    '<i class="fa fa-clock-o"></i><i class="fa fa-spin fa-refresh"></i>',
                    formValue.messageGuid));

                // 4.-update scroll
                messageScrollMoveToBottom();
                // 5.- send message and setInterval until messageSendData succeeds


                if (formValue.message.trim().length > 0) {

                    P.all([crudAjaxOpts.ajax.messageAdd(formValue)]).nodeify(function (e, data) {


                        /*
                        actualizar el bubble de texto dependiendo del resultado
                        */


                        if (e !== null) {
                            //showUnhandled(e);
                            console.error(e);
                        }
                        else {
                            try {
                                var dataResult = data[0];

                                if (dataResult.isValid === true) {

                                    $messageWindow
                                        .find('div[data-message-guid="' + formValue.messageGuid + '"]:first')
                                            .parents('div.ui-message:first')
                                                .find('div.ui-message-datePosted:first')
                                                    .html(new Date().toDateString())
                                                .end()
                                            .end()
                                        .end();

                                } else {
                                    //showDataResultKO(dataResult);
                                }
                            } catch (eII) {
                                console.error(eII);
                                //showUnhandled(eII);
                            }
                        }

                    });

                }





            };



            var widgetResize = function () {

                function convertEmToPixels(value) {
                    return value * (parseFloat(getComputedStyle(document.documentElement).fontSize));
                }

                $mainBox.height((jQuery(window).height() - convertEmToPixels(8.7)));
                //$messageWindow.height(jQuery(window).height() - convertEmToPixels(31.7));
            };

            jQuery(window)
                .resize(function (e, ui) {
                    widgetResize();
                });

            $mainBox
                .find('div.ui-arquia-talks-message-buttonsBox:first')
                    .find('button:first')
                        .button()
                        .click(function () {

                        })
                    .end()
                .end()
                .removeClass('ui-helper-hidden');

            widgetResize();
        }
    };

    return clientApp;

});
