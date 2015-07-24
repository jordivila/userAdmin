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
                            '<div class="ui-message-who">{1}</div><div class="ui-message-colon">:</div> ' +
                            '<div class="ui-message-text">{2}</div>' +
                            '<div class="ui-message-datePosted">{3}</div>' +
                            '<div class="ui-helper-hidden" data-message-guid="{4}"></div>' +
                            '<div class="ui-helper-clearfix"></div>' +
                        '</div>';
            }();
            var messageClassName = function (isEmployee, isCurrentUser) {

                var className = '';

                if (isEmployee) {
                    className = 'ui-state-default';
                }
                else {
                    className ='ui-isEmployee ui-state-highlight';
                }


                if (isCurrentUser)
                {
                    className += ' ui-isCurrentUser';
                }


                return className;
            };
            var messageSend = function ($parent, $input) {
                // 1.- get form data
                var formValue = $messageModelWidget.widgetModel('valAsObject');

                if (formValue.message.trim() === '') {
                    // do nothing
                }
                else {
                    formValue.idTalk = 0;
                    formValue.messageClientGuid = clientApp.utils.guid();
                    // 2.- clean input
                    $input.empty();
                    messageSendButtonHide($parent);
                    // 3.- add message to window
                    $messageWindow.append(messageTemplate.format(
                        messageClassName(false, true),
                        '', // no matter name because this is the current user
                        formValue.message,
                        '<i class="fa fa-clock-o"></i><i class="fa fa-spin fa-refresh"></i>',
                        formValue.messageClientGuid));
                    // 4.-update scroll
                    messageScrollMoveToBottom();
                    // 5.- set focus on input (some browsers like safari do not restore focus on $input after scroll)
                    $input.focus();
                    //6.- set message to be send
                    if (formValue.message.trim().length > 0) {
                        messagesPending.push([$parent, $input, formValue]);
                    }
                }
            };
            var messagesPending = [];
            var messageSendData = function ($parent, $input, formValue, attemptCount) {


                var $bubble = $messageWindow
                                .find('div[data-message-guid="' + formValue.messageClientGuid + '"]:first')
                                .parents('div.ui-message:first');


                var attempMax = 10;
                var attempTime = 500;//1024 * 5;
                var attempt = attemptCount < attempMax;
                var attemptIsLast = (attemptCount + 1 === attempMax);
                var attemptTryNext = function () {

                    setTimeout(function () {
                        messageSendData($parent, $input, formValue, attemptCount + 1);
                    }, attempTime);

                };
                var attempMarkAsError = function () {
                    $bubble.addClass('ui-state-error');
                };

                if (attempt) {

                    P.all([crudAjaxOpts.ajax.messageAdd(formValue)]).nodeify(function (e, data) {
                        if (e !== null) {
                            if (attemptIsLast) {
                                console.error(e);
                                attempMarkAsError();
                            }
                            else {
                                attemptTryNext();
                            }
                        }
                        else {

                            var dataResult = data[0];

                            if (dataResult.isValid === true) {

                                $bubble
                                    .find('div.ui-message-datePosted:first')
                                    .html(dataResult.data.editData.datePosted.toLocaleString());

                            } else {
                                console.error(new Error(dataResult.message));
                                attempMarkAsError();
                            }

                            messageSendCheckQueue();

                        }

                    });
                }
                else {
                    messageSendCheckQueue();
                }
            };
            var messageSendCheckQueue = function () {
                if (messagesPending.length > 0) {
                    var dataItem = messagesPending[0];
                    messagesPending.shift();
                    messageSendData(dataItem[0], dataItem[1], dataItem[2], 0);
                }
                else {
                    setTimeout(function () { messageSendCheckQueue(); }, 500);
                }
            };
            var messageWidgetResizeInit = function () {

                var widgetResize = function () {

                    function convertEmToPixels(value) {
                        return value * (parseFloat(getComputedStyle(document.documentElement).fontSize));
                    }

                    $mainBox.height((jQuery(window).height() - convertEmToPixels(9.7)));
                    $messageWindow.height((jQuery(window).height() - convertEmToPixels(19)));
                };

                jQuery(window)
                    .resize(function (e, ui) {
                        widgetResize();
                    });

                widgetResize();

            };
            var messageWidgetInit = function () {

                var idTalk = 1;

                P.all([crudAjaxOpts.ajax.messageGetAll(idTalk)]).nodeify(function (e, data) {


                    if (e !== null) {
                        // ????????????????????
                    }
                    else {

                        var dataResultPaginated = data[0];

                        for (var i = 0; i < dataResultPaginated.data.data.length; i++) {

                            $messageWindow.prepend(messageTemplate.format(
                                messageClassName(dataResultPaginated.data.data[i].whoPosted.isEmployee, dataResultPaginated.data.data[i].whoPosted.isCurrentUser),
                                dataResultPaginated.data.data[i].whoPosted.isCurrentUser === true ? '' : dataResultPaginated.data.data[i].whoPosted.name,
                                dataResultPaginated.data.data[i].message,
                                dataResultPaginated.data.data[i].datePosted.toLocaleString(),
                                ''));
                        }

                    }

                });


                messageWidgetResizeInit();


                $mainBox.removeClass('ui-helper-hidden');


                messageSendCheckQueue();






            };



            messageWidgetInit();
        }
    };

    return clientApp;

});
