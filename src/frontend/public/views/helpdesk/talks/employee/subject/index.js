define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "pPromises",

    "scripts/modules/crud",
    "/helpdesk/talks/employee/common/helpdeskCrudFakeData.js",
    "/helpdesk/talks/employee/common/helpdeskCommon.js",
],
function ($, jqUI, clientApp, P, crudModule, crudAjaxOpts, helpdeskCommon) {

    clientApp.view = {
        breadcrumb: function () {

            return [{
                "title": clientApp.i18n.texts.get("Helpdesk.Talks.Summary.Title"),
                "url": "{0}{1}".format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.history())
            }];

        },

        main: function () {
            

            jQuery.widget("ui.viewWidget", jQuery.ui.widgetBase, {
                options: {

                },
                _create: function () {
                    this._super();
                },
                _init: function () {

                    var self = this;

                    this._super();


                    this._viewInit();
                },
                destroy: function () {

                    this._super();

                },
                _viewInit: function () {

                    var self = this;
                    var $mainBox = jQuery(this.element); //var $mainBox = jQuery('div.ui-helpdesk-talks-subject-container:first');
                    var $errorsBox = jQuery('div.ui-helpdesk-talks-boxError:first');
                    var $infoBox = jQuery('div.ui-helpdesk-talks-boxInfo:first');
                    var $modelWidget = function () {

                        return jQuery("div.ui-helpdesk-talks-add-model")
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
                        clientApp.template.loadByUrl('../' + helpdeskCommon.helpdeskUrls.message(dataResult.data.editData.idTalk));
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

                                self.progressShow(clientApp.i18n.texts.get('GeneralTexts.PleaseWait'));

                                return P.all([crudAjaxOpts.ajax.talkAdd(formValue)]).nodeify(function (e, data) {

                                    self.progressHide();

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
            });


            jQuery('div.ui-helpdesk-talks-subject-container:first').viewWidget();


        }
    };

    return clientApp;

});
























