define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "pPromises",
    "scripts/modules/crud",
    "scripts/jQuery.Plugins.scrollUtils",
    "text!css/ui-helpdeskChat.css",
],
function ($, jqUI, clientApp, P, crudModule, scrollUtils, helpdeskCss) {

    clientApp.utils.cssAdd("uiHelpdeskChatCss", helpdeskCss);

    jQuery.widget("ui.helpdeskChat", jQuery.ui.menuBase, {
        options: {
            idTalk: null,
            talkTitle: null,
            talkDescription: null,
            messageAdd: function () {
                var dfd = jQuery.Deferred();
                dfd.reject("{0}.{1}.messageAdd is an abstract option . It should be implemented and passed as a widget option".format(this.namespace, this.widgetName));
                return dfd.promise();
            },
            messageGetAll: function () {
                var dfd = jQuery.Deferred();
                dfd.reject("{0}.{1}.messageGetAll is an abstract option . It should be implemented and passed as a widget option".format(this.namespace, this.widgetName));
                return dfd.promise();
            },
            messageGetUnread: function () {
                var dfd = jQuery.Deferred();
                dfd.reject("{0}.{1}.messageGetAll is an abstract option . It should be implemented and passed as a widget option".format(this.namespace, this.widgetName));
                return dfd.promise();
            },
            messagesUnreadCheckMiliseconds: 1024, // interval time to wait untill next unreaded messages check call
            messageSendMaxAttempts: 10, // in case of error
            messageSendAttemptMilliseconds: 1024 
        },
        _create: function () {

            var widgetTemplate = function () {

                return '<div class="ui-helpdesk-talks-message-container ui-helper-hidden">' +
                        '<div class="ui-helpdesk-talks-message-window">' +
                            '<div class="subject">' +
                                '<h3></h3>' +
                                '<p>' +
                                    '<i class="ui-helpdesk-talks-subject-userIcon fa fa-question-circle ui-state-default"></i>' +
                                    '<span></span>' +
                                '</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="ui-helpdesk-talks-add-model ui-widget-content ui-state-default"></div>' +

                        '<div class="ui-helpdesk-talks-message-inputBox-template ui-helper-hidden">' +
                            '<div class="ui-helpdesk-talks-message-inputBox">' +
                                '<div class="block-compose">' +
                                    '<div class="buttons-left table-cell">' +
                                        '<button class="ui-button-smile "><i class="fa fa-smile-o"></i></button>' +
                                    '</div>' +
                                    '<div class="input-container table-cell">' +
                                        '<div dir="auto" contenteditable="true" class="input ui-widget-content" placeholder="Escribe un mensaje"></div>' +
                                    '</div>' +
                                    '<div class="buttons-right table-cell">' +
                                        '<span>' +
                                            '<button class="ui-button-micro "><i class="fa fa-microphone"></i></button>' +
                                            '<button class="ui-button-send ui-helper-hidden "><i class="fa fa-sign-in"></i></button>' +
                                        '</span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    '<div class="ui-helper-clearfix"></div>';

            };

            jQuery(this.element)
                .empty()
                .append(widgetTemplate());

            this._super();
        },
        _init: function () {

            this._super();

            var self = this;

            clientApp.globalizer.get()
             .done(function (Globalize) {

                 var $mainBox = jQuery(self.element).find('div.ui-helpdesk-talks-message-container:first');
                 var $messageWindow = jQuery(self.element).find('div.ui-helpdesk-talks-message-window:first');
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

                     return jQuery(self.element)
                                 .find("div.ui-helpdesk-talks-add-model")
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
                                                                     .find('div.ui-helpdesk-talks-message-inputBox-template:first')
                                                                     .html());

                                                     var $input = jQuery(parent)
                                                                     .find('div.ui-helpdesk-talks-message-inputBox:first')
                                                                         .find('div[contenteditable]:first');

                                                     inputKeyPressInit(parent, $input);
                                                     sendButtonInit(parent, $input);
                                                 },
                                                 onItemValue: function (parent) {

                                                     return jQuery(parent)
                                                             .find('div.ui-helpdesk-talks-message-inputBox:first')
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
                 var messageGetIdTalk = function () {
                     return self.options.idTalk;
                 };
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
                 var messageTemplate = function () {
                     return '<div class="ui-message ui-corner-all {0}">' +
                                 '<div class="ui-message-who">{1}</div><div class="ui-message-colon">:</div> ' +
                                 '<div class="ui-message-text">{2}</div>' +
                                 '<div class="ui-message-datePosted">{3}</div>' +
                                 '<div class="ui-helper-hidden" data-message-guid="{4}"></div>' +
                                 '<div class="ui-message-idMessage">{5}</div>' +
                                 '<div class="ui-helper-clearfix"></div>' +
                             '</div>';
                 }();
                 var messageClassName = function (isEmployee, isCurrentUser) {

                     var className = '';

                     if (isEmployee) {
                         className = 'ui-state-default';
                     }
                     else {
                         className = 'ui-isEmployee ui-state-highlight';
                     }


                     if (isCurrentUser) {
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
                         formValue.idTalk = messageGetIdTalk();
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
                         // 4.-force scroll to bottom as user is writing messages
                         $messageWindow.scrollToBottom();
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


                     var attempMax = self.options.messageSendMaxAttempts;
                     var attempTime = self.options.messageSendAttemptMilliseconds;//1024 * 5;
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

                         P.all([self.options.messageAdd(formValue)]).nodeify(function (e, data) {
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
                                             .html(Globalize.formatDate(dataResult.data.datePosted, { datetime: "short" }))
                                         .end()
                                         .find('div.ui-message-idMessage:first')
                                             .html(dataResult.data.idMessage)
                                         .end();

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
                         $mainBox.height((jQuery(window).height() - clientApp.utils.convertEmToPixels(4.2)));
                         $messageWindow.height((jQuery(window).height() - clientApp.utils.convertEmToPixels(11)));
                     };

                     jQuery(window)
                         .resize(function (e, ui) {
                             widgetResize();
                         });

                     widgetResize();

                 };
                 var messagesUnreadCheck = function (idTalk) {

                     P.all([self.options.messageGetUnread(idTalk, messagesUnreadLastIdAppended)]).nodeify(function (e, data) {

                         setTimeout(function () { messagesUnreadCheck(idTalk); }, self.options.messagesUnreadCheckMiliseconds);

                         if (e !== null) {
                             // ????????????????????
                         }
                         else {
                             messagesUnreadAppendDataResult(data[0]);
                         }

                     });

                 };
                 var messagesUnreadLastIdAppended = 0;
                 var messagesUnreadAppendViewModelItem = function (viewModelItem) {

                     $messageWindow.append(messageTemplate.format(
                         messageClassName(viewModelItem.whoPosted.isEmployee, viewModelItem.whoPosted.isCurrentUser),
                         viewModelItem.whoPosted.isCurrentUser === true ? '' : viewModelItem.whoPosted.name,
                         viewModelItem.message,
                         Globalize.formatDate(viewModelItem.datePosted, { datetime: "short" }),
                         '',
                         viewModelItem.idMessage));

                 };
                 var messagesUnreadAppendDataResult = function (dataResultPaginated) {

                     /*
                         how it works:
     
                         1.- detect if scroll is at bottom before adding bubbles to the window
                         2.- if scroll is NOT at bottom means user has previously scroll to top to read some other bubble
                         3.- if scroll is at bottom then add bubbles and force scroll to continue at bottom
                     */

                     var scrollWasAtBottom = $messageWindow.isScrollNearBottom(1);

                     for (var i = 0; i < dataResultPaginated.data.data.length; i++) {
                         messagesUnreadAppendViewModelItem(dataResultPaginated.data.data[i]);
                         messagesUnreadLastIdAppended = dataResultPaginated.data.data[i].idMessage;
                     }

                     if (scrollWasAtBottom) {
                         $messageWindow.scrollToBottom();
                     }

                 };
                 var messagesSubjectSet = function () {

                     var hasTitle = self.options.talkTitle === null;
                     var hasDesc = self.options.talkDescription === null;

                     $messageWindow
                         .find('div.subject')
                            .find('h3')
                                .html(self.options.talkTitle)
                                .addClass(hasTitle ? 'ui-helper-hidden' : '')
                            .end()
                            .find('p')
                                .find('span')
                                    .html(self.options.talkDescription)
                                .end()
                                .addClass(hasDesc ? 'ui-helper-hidden' : '')
                            .end()
                            .addClass(((hasTitle === false) && (hasDesc === false)) ? '' : 'ui-helper-hidden')
                        .end();
                 };
                 var messageWidgetInit = function () {

                     var idTalk = messageGetIdTalk();

                     messagesSubjectSet();
                     messageWidgetResizeInit();

                     P.all([self.options.messageGetAll(idTalk)]).nodeify(function (e, data) {

                         if (e !== null) {
                             // ????????????????????
                         }
                         else {
                             messagesUnreadAppendDataResult(data[0]);
                         }

                         $mainBox.removeClass('ui-helper-hidden');
                         // force scroll to bottom as widget is initiating
                         $messageWindow.scrollToBottom();


                         messageSendCheckQueue();
                         messagesUnreadCheck(idTalk);


                         //messageScrollInit();

                     });



                 };

                 messageWidgetInit();

             });

        },
        destroy: function () {

            this._super();


            jQuery(window).unbind('resize');

        },
    });

});