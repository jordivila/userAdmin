define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "pPromises",
    "scripts/modules/crud",
    "scripts/jQuery.Plugins.scrollUtils",
    "crossLayer/dateHelper",
    "scripts/Template.ExtendPrototypes.ObservableObject",
    "scripts/Template.Class.UrlHelper",
    "text!css/ui-helpdeskChat.css",
],
function ($, jqUI, clientApp, P, crudModule, scrollUtils, dateHelper, observableArray, UrlHelper, helpdeskCss) {

    clientApp.utils.cssAdd("uiHelpdeskChatCss", helpdeskCss);

    jQuery.widget("ui.helpdeskChat", jQuery.ui.menuBase, {
        options: {
            idTalk: null,
            talkTitle: null,
            talkDescription: null,
            talkHelpUse: null,
            $header: jQuery('div.ui-site-header-box:first'),
            $mainBox: null,
            $messageWindow: null,
            $messageModelWidget: null,
            globalize: null,
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
            // interval time to wait untill next unreaded messages check call
            messagesUnreadCheckMiliseconds: 5000,
            // in case of error
            messageSendMaxAttempts: 10,
            messageSendAttemptMilliseconds: 1024,
            messagesUnreadCheckTimeOutId: null,
            // Prevents users to keep the window chat opened
            idleTimeInSecondsBeforeStopping: 120,
            // Date object when user wrote last message
            //messagesUnreadLastHasFinished: true,
            messagesUnreadLastIdAppended: 0,
            messagesPendingIdleTimeCurrent: null,
            messagesPending: null, // WARNING !!! this is an array. But array inizializations on widget options make this array static since jQuery.ui version xx. So, initialize the array on widget.create
            messagePendingIdleTimeIntervalChecker: null,
            messageTemplate: function () {
                return '<div class="ui-message ui-corner-all {0}">' +
                            '<div class="ui-message-who">{1}</div><div class="ui-message-colon">:</div> ' +
                            '<div class="ui-message-text">{2}</div>' +
                            '<div class="ui-message-datePosted">{3}</div>' +
                            '<div class="ui-helper-hidden" data-message-guid="{4}"></div>' +
                            '<div class="ui-message-idMessage">{5}</div>' +
                            '<div class="ui-helper-clearfix"></div>' +
                        '</div>';
            }(),
        },
        _create: function () {


            this.options.messagesPending = [];

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
                            '<div class="helpUseText">' +
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
             .done(function (globalize) {

                 self.options.messagesPendingIdleTimeCurrent = new Date();
                 self.options.globalize = globalize;
                 self.options.$mainBox = jQuery(self.element).find('div.ui-helpdesk-talks-message-container:first');
                 self.options.$messageWindow = jQuery(self.element).find('div.ui-helpdesk-talks-message-window:first');
                 self.options.$messageModelWidget = function () {

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
                                                         .append(jQuery(self.options.$mainBox)
                                                                     .find('div.ui-helpdesk-talks-message-inputBox-template:first')
                                                                     .html());

                                                     var $input = jQuery(parent)
                                                                     .find('div.ui-helpdesk-talks-message-inputBox:first')
                                                                         .find('div[contenteditable]:first');

                                                     self.inputKeyPressInit(parent, $input);
                                                     self.messageSendButtonInit(parent, $input);
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
                 self.messageWidgetInit();
             });

        },
        destroy: function () {

            Object.unobserve(this.options.messagesPending, this.messagesPendingChangeCallback);

            jQuery(this.element)
                .find('button.ui-button-send')
                    .unbind('click')
                .end()
                .find('div.ui-helpdesk-talks-message-inputBox:first')
                    .find('div[contenteditable]:first')
                        .unbind('keyup')
                    .end()
                .end();

            this.messageWindowSetIdleEvents(this);

            jQuery(window).unbind('resize');

            this._super();

        },
        messagesUnreadCheck: function (idTalk) {

            var self = this;

            P.all([self.options.messageGetUnread(idTalk, self.options.messagesUnreadLastIdAppended)]).nodeify(function (e, data) {

                self.options.messagesUnreadCheckTimeOutId = setTimeout(
                    function () {
                        self.messagesUnreadCheck(idTalk);
                    }, self.options.messagesUnreadCheckMiliseconds);

                if (e !== null) {
                    // ????????????????????
                }
                else {
                    self.messagesUnreadAppendDataResult(data[0]);
                }

            });

        },
        messagesUnreadAppendDataResult: function (dataResultPaginated) {

            /*
                how it works:

                1.- detect if scroll is at bottom before adding bubbles to the window
                2.- if scroll is NOT at bottom means user has previously scroll to top to read some other bubble
                3.- if scroll is at bottom then add bubbles and force scroll to continue at bottom
            */
            var self = this;
            var scrollWasAtBottom = self.options.$messageWindow.isScrollNearBottom(1);

            for (var i = 0; i < dataResultPaginated.data.data.length; i++) {
                self.messagesUnreadAppendViewModelItem(dataResultPaginated.data.data[i]);
                self.options.messagesUnreadLastIdAppended = dataResultPaginated.data.data[i].idMessage;
            }

            if (scrollWasAtBottom) {
                self.options.$messageWindow.scrollToBottom();
            }

        },
        messagesUnreadAppendViewModelItem: function (viewModelItem) {


            this.options.$messageWindow.append(this.options.messageTemplate.format(
                this.messageClassName(viewModelItem.whoPosted.isEmployee, viewModelItem.whoPosted.isCurrentUser),
                viewModelItem.whoPosted.isCurrentUser === true ? '' : viewModelItem.whoPosted.name,
                viewModelItem.message,
                this.options.globalize.formatDate(viewModelItem.datePosted, { datetime: "short" }),
                '',
                viewModelItem.idMessage));

        },
        messagesPendingChangeCallback: function (changes) {

            // When Object.observe calls this method context is losed
            // Thus, look for the widget

            jQuery('div.ui-helpdeskChat:first').helpdeskChat('option', 'messagesPendingIdleTimeCurrent', new Date());

        },
        messageWindowIsIdle: function () {
            return this.options.$messageWindow.find('div.ui-message-idle:first').length > 0;
        },
        messageWindowResize: function () {

            this.options.$mainBox.height(jQuery(window).height() - this.options.$header.height());

            this.options.$messageWindow.height(
                jQuery(window).height() -
                this.options.$header.height() -
                this.options.$messageModelWidget.height() -
                clientApp.utils.convertEmToPixels(1.5));
        },
        messageClassName: function (isEmployee, isCurrentUser) {

            var className = '';

            if (isEmployee) {
                className = ' ui-isEmployee ';
            }
            else {
                className = ' ';
            }


            if (isCurrentUser) {
                className += ' ui-isCurrentUser ui-state-highlight ';
            }
            else {
                className += ' ui-state-default ';
            }


            return className;
        },
        messageWindowSetInactiveMessage: function (widget) {
            var idleMessage = function () {

                return ('<div class="ui-message-idleChatMessage">' +
                            '{0}<br />' +
                            '{1}<br />' +
                            '<button class="ui-message-idleChatButton"><i class="fa fa-refresh"></i></button><br />' +
                       '</div>').format(
                    clientApp.i18n.texts.get("Helpdesk.Talks.Chat.IddleTimePassed"),
                    clientApp.i18n.texts.get("Helpdesk.Talks.Chat.IddleClickToActivate")
                    );
            }();


            widget.options.$messageWindow.append(
                widget.options.messageTemplate.format(
                    widget.messageClassName(false, true) + ' ui-message-idle ui-state-error',
                    '',
                    idleMessage,
                    new Date().toLocaleTimeString(),
                    clientApp.utils.guid(),
                    '')
                );

            widget.options.$messageWindow.scrollToBottom();
            widget.options.$messageWindow
                .find('button.ui-message-idleChatButton:first')
                   .click(function () {

                       widget.options.messagesPendingIdleTimeCurrent = new Date();

                       jQuery(this)
                           .unbind('click')
                           .parents('div.ui-message-idle:first')
                               .remove()
                           .end();



                       widget.messageWindowSetActiveEvents(widget);

                   });


        },
        messageWindowSetIdleEvents: function (widget) {

            clearTimeout(widget.options.messagesUnreadCheckTimeOutId);
            clearInterval(widget.options.messagePendingIdleTimeIntervalChecker);

            widget.messageWindowSetInactiveMessage(widget);

        },
        messageWindowSetActiveEvents: function (widget) {


            //console.log("became busyyyyyyyyyyyyyyyyyyyyyy");

            // Every time a message is send by the user
            // An interval begins
            // When the interval is bigger than 
            // this.options.idleTimeInSecondsBeforeStopping
            // The widget destroys itself
            var observer = Object.observe(
                               widget.options.messagesPending,
                               widget.messagesPendingChangeCallback);


            widget.messagesUnreadCheck(widget.options.idTalk);

            widget.options.messagePendingIdleTimeIntervalChecker = setInterval(function () {

                var diff = dateHelper.getDifferenceSeconds(new Date(), widget.options.messagesPendingIdleTimeCurrent);

                //console.log("SECOOOOOOOONSD");
                //console.log(diff);

                if (diff > widget.options.idleTimeInSecondsBeforeStopping) {
                    widget.messageWindowSetIdleEvents(widget);
                }

            }, 1000);
        },
        messagesSubjectSet: function () {
            var self = this;
            var hasTitle = self.options.talkTitle === null;
            var hasDesc = self.options.talkDescription === null;
            var hasHelpUse = self.options.talkHelpUse === null;

            self.options.$messageWindow
                .find('div.subject')
                   .find('h3')
                       .html(self.options.talkTitle)
                       .addClass(hasTitle ? 'ui-helper-hidden' : '')
                   .end()
                   .find('p')
                       .find('span')
                           .html(clientApp.i18n.texts.get("Helpdesk.Talks.History.GridColumns.Subject") + ' : ' + self.options.talkDescription)
                       .end()
                       .addClass(hasDesc ? 'ui-helper-hidden' : '')
                   .end()
                   .addClass(((hasTitle === false) && (hasDesc === false)) ? '' : 'ui-helper-hidden')
               .end()
                .find('div.helpUseText')
                    .html(self.options.talkHelpUse)
                .end();

        },
        messageSendData: function ($parent, $input, formValue, attemptCount) {

            var self = this;
            var $bubble = self.options.$messageWindow
                            .find('div[data-message-guid="' + formValue.messageClientGuid + '"]:first')
                            .parents('div.ui-message:first');


            var attempMax = self.options.messageSendMaxAttempts;
            var attempTime = self.options.messageSendAttemptMilliseconds;//1024 * 5;
            var attempt = attemptCount < attempMax;
            var attemptIsLast = (attemptCount + 1 === attempMax);
            var attemptTryNext = function () {

                setTimeout(function () {
                    self.messageSendData($parent, $input, formValue, attemptCount + 1);
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
                                    .html(self.options.globalize.formatDate(dataResult.data.datePosted, { datetime: "short" }))
                                .end()
                                .find('div.ui-message-idMessage:first')
                                    .html(dataResult.data.idMessage)
                                .end();

                        } else {
                            console.error(new Error(dataResult.message));
                            attempMarkAsError();
                        }

                        self.messageSendCheckQueue();

                    }

                });
            }
            else {
                self.messageSendCheckQueue();
            }
        },
        messageSendCheckQueue: function () {

            var self = this;

            if (self.options.messagesPending.length > 0) {
                var dataItem = self.options.messagesPending[0];
                self.options.messagesPending.shift();
                self.messageSendData(dataItem[0], dataItem[1], dataItem[2], 0);
            }
            else {
                setTimeout(function () { self.messageSendCheckQueue(); }, 500);
            }

        },
        messageWidgetResizeInit: function () {

            var self = this;

            jQuery(window)
                .resize(function (e, ui) {
                    self.messageWindowResize();
                });

            self.messageWindowResize();

        },
        messageSend: function ($parent, $input) {

            var self = this;

            if (!self.messageWindowIsIdle()) {

                // 1.- get form data
                var formValue = self.options.$messageModelWidget.widgetModel('valAsObject');

                if (formValue.message.trim() === '') {
                    // do nothing
                }
                else {
                    formValue.idTalk = self.options.idTalk;
                    formValue.messageClientGuid = clientApp.utils.guid();
                    // 2.- clean input
                    $input.empty();
                    self.messageSendButtonHide($parent);
                    // 3.- add message to window
                    self.options.$messageWindow.append(self.options.messageTemplate.format(
                        self.messageClassName(false, true),
                        '', // no matter name because this is the current user
                        formValue.message,
                        '<i class="fa fa-clock-o"></i><i class="fa fa-spin fa-refresh"></i>',
                        formValue.messageClientGuid));
                    // 4.-force scroll to bottom as user is writing messages
                    self.options.$messageWindow.scrollToBottom();
                    // 5.- set focus on input (some browsers like safari do not restore focus on $input after scroll)
                    $input.focus();
                    //6.- set message to be send
                    if (formValue.message.trim().length > 0) {
                        self.options.messagesPending.push([$parent, $input, formValue]);
                    }
                }
            }
        },
        messageSendButtonHide: function ($parent) {

            $parent
                .find('button.ui-button-send')
                    .addClass('ui-helper-hidden')
                .end()
                .find('button.ui-button-micro')
                    .removeClass('ui-helper-hidden')
                .end();

        },
        messageSendButtonShow: function ($parent) {

            $parent
                .find('button.ui-button-send')
                    .removeClass('ui-helper-hidden')
                .end()
                .find('button.ui-button-micro')
                    .addClass('ui-helper-hidden')
                .end();

        },
        messageSendButtonInit: function ($parent, $input) {

            var self = this;

            $parent
                .find('button.ui-button-send')
                .click(function () {
                    self.messageSend($parent, $input);
                });

        },
        inputKeyPressInit: function ($parent, $input) {

            var self = this;

            $input.keyup(function (event) {

                var text = $input.text();


                setTimeout(function () { self.messageWindowResize(); }, 1);

                if (event.which == 13) {

                    event.preventDefault();

                    self.messageSend($parent, $input);
                }
                else {

                    if (text.trim().length > 0) {
                        self.messageSendButtonShow($parent);

                    } else {
                        self.messageSendButtonHide($parent);
                    }

                }
            });
        },
        messageWidgetInit: function () {

            var self = this;

            self.messagesSubjectSet();

            P.all([self.options.messageGetAll(self.options.idTalk)]).nodeify(function (e, data) {

                if (e !== null) {
                    // ????????????????????
                }
                else {
                    self.messagesUnreadAppendDataResult(data[0]);
                }

                self.messageWindowSetActiveEvents(self);
                self.messageSendCheckQueue();
                self.options.$mainBox.removeClass('ui-helper-hidden');
                self.messageWidgetResizeInit();
                self.options.$messageWindow.scrollToBottom();
            });



        }
    });
});