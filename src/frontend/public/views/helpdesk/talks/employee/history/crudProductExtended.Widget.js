define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "scripts/modules/crud",
    "crossLayer/dateHelper",
    "../common/helpdeskCrudFakeData.js",
    "../common/helpdeskCommon.js",
    "crossLayer/models/dataResult",
    'crossLayer/helpdesk',
],
function ($, jqUI, clientApp, wCrud, dateHelper, crudAjaxOpts, helpdeskCommon, DataResult, helpdeskCrossLayer) {

    jQuery.widget("ui.product", jQuery.ui.crud,
    {
        options: {
            stateStorageId: "helpdeskHistoryTalksCrud",
            stateStorageDeserialize: function (currentValue) {

                if (currentValue.gridData && currentValue.gridData !== null) {
                    for (var i = 0; i < currentValue.gridData.data.length; i++) {
                        currentValue.gridData.data[i].dateLastMessage = new Date(currentValue.gridData.data[i].dateLastMessage);
                    }

                }

                return currentValue;
            },
            filterModel: function (context) {

                return [{
                    id: "customerInfo",
                    displayName: clientApp.i18n.texts.get("Views.Crud.Customer"),
                    input: {
                        type: "custom",
                        value: null,
                        nullable: true,
                        onItemBuild: function (widget, parent) {
                            var selfOption = this;

                            var _templateGet = function () {
                                return '' +
                                    '<input type="hidden" class="ui-productCrud-filter-custId" />' +
                                    '<a href="javascript:void(0);" class="ui-productCrud-filter-custName"></a>' +
                                    '<div class="ui-productCrud-filter-removeCustomerIcon ui-state-error">' +
                                        '<span class="ui-icon ui-icon-close"></span>' +
                                    '</div>';
                            };

                            jQuery(parent).append(_templateGet());

                            var customerNameDomId = jQuery(parent).find('a.ui-productCrud-filter-custName:first');
                            var customerTrashDomId = jQuery(parent).find('div.ui-productCrud-filter-removeCustomerIcon:first');

                            customerTrashDomId
                                .click(function () {
                                    selfOption.onItemBind(jQuery(parent), { customerId: "", customerName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.ClickToFilterByCustomer") });
                                });

                            customerNameDomId
                                .click(function () {
                                    jQuery(parent)
                                        .parents('div.ui-crud:first')
                                            .product('filterSearchCustomer');
                                });

                            customerTrashDomId.click();
                        },
                        onItemValue: function (parent) {
                            var customerIdDomId = jQuery(parent).find('input.ui-productCrud-filter-custId:first');
                            var customerNameDomId = jQuery(parent).find('a.ui-productCrud-filter-custName:first');

                            return {
                                customerId: customerIdDomId.val(),
                                customerName: customerNameDomId.html()
                            };

                        },
                        onItemBind: function (parent, dataItem) {

                            var customerIdDomId = jQuery(parent).find('input.ui-productCrud-filter-custId:first');
                            var customerNameDomId = jQuery(parent).find('a.ui-productCrud-filter-custName:first');
                            var customerTrashDomId = jQuery(parent).find('div.ui-productCrud-filter-removeCustomerIcon:first');

                            if (dataItem === null) {
                                dataItem = {
                                    customerId: ""
                                };
                            }

                            customerIdDomId.val(dataItem.customerId);
                            customerNameDomId.html(dataItem.customerName);

                            if (dataItem.customerId !== "") {
                                customerTrashDomId.show();
                            }
                            else {
                                customerTrashDomId.hide();
                            }

                        }
                    },
                },
                {
                    id: "lastMessageStatus",
                    displayName: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.TalkStatus"),
                    input: {
                        type: "list",
                        value: null,
                        listValues: [
                            { value: '', text: clientApp.i18n.texts.get("GeneralTexts.All") },
                            { value: helpdeskCrossLayer.talkStatus.notRead, text: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.Unread") },
                            { value: helpdeskCrossLayer.talkStatus.pendingAnswer, text: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.PendingAnswer") },
                            { value: helpdeskCrossLayer.talkStatus.Ok, text: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.OK") }
                        ]
                    },
                },
                {
                    id: "employeeInfo",
                    displayName: clientApp.i18n.texts.get("Helpdesk.Talks.Employee"),
                    input: {
                        type: "custom",
                        value: null,
                        nullable: true,
                        onItemBuild: function (widget, parent) {
                            var selfOption = this;

                            var _templateGet = function () {
                                return '' +
                                    '<input type="hidden" class="ui-productCrud-filter-employeeId" />' +
                                    '<a href="javascript:void(0);" class="ui-productCrud-filter-employeeName"></a>' +
                                    '<div class="ui-productCrud-filter-removeEmployeeIcon ui-state-error">' +
                                        '<span class="ui-icon ui-icon-close"></span>' +
                                    '</div>';
                            };

                            jQuery(parent).append(_templateGet());

                            var employeeNameDomId = jQuery(parent).find('a.ui-productCrud-filter-employeeName:first');
                            var employeeTrashDomId = jQuery(parent).find('div.ui-productCrud-filter-removeEmployeeIcon:first');

                            employeeTrashDomId
                                .click(function () {
                                    selfOption.onItemBind(jQuery(parent), { employeeId: "", employeeName: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.ClickToFilterByEmployee") });
                                });

                            employeeNameDomId
                                .click(function () {
                                    jQuery(parent)
                                        .parents('div.ui-crud:first')
                                            .product('filterSearchEmployee');
                                });

                            employeeTrashDomId.click();
                        },
                        onItemValue: function (parent) {
                            var employeeIdDomId = jQuery(parent).find('input.ui-productCrud-filter-employeeId:first');
                            var employeeNameDomId = jQuery(parent).find('a.ui-productCrud-filter-employeeName:first');

                            return {
                                employeeId: employeeIdDomId.val(),
                                employeeName: employeeNameDomId.html()
                            };

                        },
                        onItemBind: function (parent, dataItem) {

                            var employeeIdDomId = jQuery(parent).find('input.ui-productCrud-filter-employeeId:first');
                            var employeeNameDomId = jQuery(parent).find('a.ui-productCrud-filter-employeeName:first');
                            var employeeTrashDomId = jQuery(parent).find('div.ui-productCrud-filter-removeEmployeeIcon:first');


                            if (dataItem === null) {
                                dataItem = {
                                    employeeId: ""
                                };
                            }

                            employeeIdDomId.val(dataItem.employeeId);
                            employeeNameDomId.html(dataItem.employeeName);

                            if (dataItem.employeeId !== "") {
                                employeeTrashDomId.show();
                            }
                            else {
                                employeeTrashDomId.hide();
                            }

                        }
                    },
                }];
            }(this),
            gridExpand: true,
            gridSearchMethod: crudAjaxOpts.ajax.talkSearch,
            gridModel: function () {
                return [
                    {
                        key: "subject",
                        displayName: clientApp.i18n.texts.get("Helpdesk.Talks.History.GridColumns.Subject")
                    },
                    {
                        key: "dateLastMessage",
                        displayName: clientApp.i18n.texts.get("Helpdesk.Talks.History.GridColumns.Date")
                    }
                ];
            }(),
            gridFilterVisibleAlways: false,
            gridButtonsGet: function (crudWidget, defaultButtons) {
                for (var i = 0; i < defaultButtons.length; i++) {
                    if (defaultButtons[i].id == "search") {
                        defaultButtons[i].text = clientApp.i18n.texts.get("Template.Widget.Crud.Search");
                    }
                }

                defaultButtons.push({
                    id: "add",
                    text: clientApp.i18n.texts.get("Helpdesk.Talks.History.AddTalk"),
                    cssClass: "ui-add-button",
                    icon: "fa fa-plus-circle",
                    click: function () {
                        //clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.subject()));
                        crudWidget.add({ isNew: true });
                    }
                });

                return defaultButtons;
            },
            gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

                switch (columnName) {
                    case "subject":
                        $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                        $cell.find('a')
                            .click(function () {
                                crudGridWidget._trigger('onEdit', null, dataItem);
                            });
                        break;
                    case "dateLastMessage":

                        $cell.html('');

                        clientApp.globalizer.get()
                         .done(function (Globalize) {

                             var dateDescr = function () {

                                 var diff = dateHelper.getDifferenceDays(new Date(), dataItem[columnName]);
                                 if (diff === 0) {
                                     return Globalize.formatDate(dataItem[columnName], { time: "short" });
                                 }
                                 else {
                                     return Globalize.formatDate(dataItem[columnName], { date: "short" });
                                 }
                             };

                             var strDate = dataItem[columnName] !== null ? dateDescr() : '';
                             var strUnread = '<div class="ui-text-circle {0}">{1}</div>'.format(
                                 dataItem.nMessagesUnread > 0 ? 'ui-state-active' : 'ui-helper-invisible',
                                 dataItem.nMessagesUnread);

                             $cell.html(strDate + strUnread);

                         });


                        break;
                    default: break;
                }

            },
            gridCustomOptions: {
                texts: {
                    gridEmptyData: clientApp.i18n.texts.get("Helpdesk.Talks.History.EmptyData"),
                },
            },
            gridPagerInit: function () {
                return {
                    pageSize: 30,
                };
            },
            gridSearchForEditMethod: crudAjaxOpts.ajax.talkGetById,

            formInit: function (crudWidget, $parent) {

                var tBasicInfo = '' +
                    '<div class="formDescription">' +
                    '</div>' +
                    '<div class="formTitle">' +
                        '<h3 class="ui-state-default">' +
                        '</h3>' +
                    '</div>';

                jQuery($parent).prepend(tBasicInfo);
            },
            formButtonsGet: function (self, defaultButtons) {

                defaultButtons.push({
                    id: "chat",
                    text: clientApp.i18n.texts.get("Helpdesk.Talks.History.Chat"),
                    cssClass: "ui-chat-button",
                    icon: "fa fa-comment",
                });

                return defaultButtons;
            },
            formBind: function (widgetCrud, widgetForm, dataItem) {

                clientApp.globalizer.get()
                 .done(function (Globalize) {

                     // CUSTOMER INFO WILL ONLY BE EDITABLE WHEN ADDING A TALK
                     // begin customer info block
                     // set customer info in case is an edit form

                     widgetCrud.formSetCustomer(
                                  dataItem.isNew === true ?
                                     null
                                       :
                                        {
                                            customerId: dataItem.editData.customerInfo.customerId,
                                            customerName: dataItem.editData.customerInfo.customerName
                                        });

                     jQuery(widgetCrud.element)
                         //.product('formSetCustomer',
                         //         dataItem.isNew === true ?
                         //            null
                         //              :
                         //               {
                         //                   customerId: dataItem.editData.customerInfo.idPeople,
                         //                   customerName: dataItem.editData.customerInfo.name
                         //               }
                         //)
                         .find(widgetForm.element)
                             // show customer selector in case form is in Add mode. Hide when Edit
                             .find('div.ui-widgetModelItem-customerInfo:first')
                                .addClass(dataItem.isNew === true ? '' : 'ui-helper-hidden')
                                .removeClass(dataItem.isNew === true ? ' ui-helper-hidden ' : '')
                             .end()
                             // hide customer readonly name in case form is in Add mode. Show when Edit
                             .find('div.ui-widgetModelItem-customerReadonly:first')
                                .addClass(dataItem.isNew === true ? 'ui-helper-hidden' : '')
                                .removeClass(dataItem.isNew === true ? '' : 'ui-helper-hidden')
                                .find('div.ui-widgetModel-inputValue:first')
                                    .html(
                                        dataItem.isNew === true ? '' : dataItem.editData.customerInfo.customerName
                                    )
                                .end()
                             .end()
                        .end();



                     jQuery(widgetForm.element)
                         // set Form descriptions based on Edit or Add features
                         .find('div.formDescription')
                             .html(
                                 dataItem.isNew === true ?
                                     clientApp.i18n.texts.get("Helpdesk.Talks.History.Form.NewTalkDescription") :
                                     clientApp.i18n.texts.get("Helpdesk.Talks.History.Form.EditTalkDescription")
                             )
                         .end()
                         .find('div.formTitle')
                             .find('h3')
                                 .html(
                                     dataItem.isNew === true ?
                                         clientApp.i18n.texts.get("Helpdesk.Talks.History.Form.NewTalkTitle") :
                                         clientApp.i18n.texts.get("Helpdesk.Talks.History.Form.EditTalkTitle")
                                 )
                             .end()
                         .end()
                         // hide chat button in case of new item 
                         .find('button.ui-chat-button')
                             .addClass(dataItem.isNew === true ? 'ui-helper-hidden' : '')
                             .removeClass(dataItem.isNew === true ? '' : 'ui-helper-hidden')
                             // unbind everytime. Otherwise click events are fired one after the other
                             .unbind('click')
                             .click(function () {
                                 if (dataItem.isNew === true) {
                                     alert("Please save form before trying to chat");
                                 }
                                 else {
                                     clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.message(dataItem.editData.idTalk)));
                                 }
                             })
                         .end();







                 });

            },
            formSaveMethod: crudAjaxOpts.ajax.talkSavedByEmployee,
            formValueGet: function (self, currentValue) {

                return currentValue;
            },
            formModel: function () {
                return [
                    {
                        id: "idTalk",
                        displayName: "",
                        input: {
                            type: "custom",
                            value: null,
                            nullable: true,
                            onItemBuild: function (widget, parent) {

                                var selfOption = this;

                                var _templateGet = function () {
                                    return '<input type="hidden" class="ui-productCrud-form-idTalk" />';
                                };

                                jQuery(parent).append(_templateGet());
                            },
                            onItemValue: function (parent) {
                                return jQuery(parent).find('input.ui-productCrud-form-idTalk:first').val();
                            },
                            onItemBind: function (parent, dataItem) {

                                jQuery(parent).find('input.ui-productCrud-form-idTalk:first').val(dataItem);
                            }
                        },
                    },
                    {
                        id: "subject",
                        displayName: clientApp.i18n.texts.get("Helpdesk.Talks.History.GridColumns.Subject"),
                        input: { value: "", nullable: false },
                    }, {
                        id: "customerInfo",
                        displayName: clientApp.i18n.texts.get("Views.Crud.Customer"),
                        input: {
                            type: "custom",
                            value: null,
                            nullable: false,
                            onItemBuild: function (widget, parent) {


                                var selfOption = this;

                                var _templateGet = function () {
                                    return '' +
                                        '<input type="hidden" class="ui-productCrud-form-customerId" />' +
                                        '<a href="javascript:void(0);" class="ui-productCrud-form-customerName"></a>' +
                                        '<div class="ui-productCrud-form-removeCustomerIcon ui-state-error">' +
                                            '<span class="ui-icon ui-icon-close"></span>' +
                                        '</div>';
                                };

                                jQuery(parent).append(_templateGet());

                                var customerNameDomId = jQuery(parent).find('a.ui-productCrud-form-customerName:first');
                                var customerTrashDomId = jQuery(parent).find('div.ui-productCrud-form-removeCustomerIcon:first');

                                customerTrashDomId
                                    .click(function () {
                                        selfOption.onItemBind(jQuery(parent), { customerId: "", customerName: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.ClickToAddCustomer") });
                                    });

                                customerNameDomId
                                    .click(function () {
                                        jQuery(parent)
                                            .parents('div.ui-crud:first')
                                                .product('formSearchCustomer');
                                    });

                                customerTrashDomId.click();



                                //jQuery(parent)
                                //    .append('<p>' + clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeReadonlyValue") + '-><span class="someCustomValue">2</span></p>')
                                //    .find('p:first')
                                //        .click(function () {
                                //            jQuery(widget).widgetModelItem('change');
                                //        });
                            },
                            onItemValue: function (parent) {
                                var customerIdDomId = jQuery(parent).find('input.ui-productCrud-form-customerId:first');
                                var customerNameDomId = jQuery(parent).find('a.ui-productCrud-form-customerName:first');

                                return {
                                    customerId: customerIdDomId.val(),
                                    customerName: customerNameDomId.html()
                                };
                            },
                            onItemBind: function (parent, dataItem) {
                                //return jQuery(parent).find('span.someCustomValue').html(dataItem);

                                var customerIdDomId = jQuery(parent).find('input.ui-productCrud-form-customerId:first');
                                var customerNameDomId = jQuery(parent).find('a.ui-productCrud-form-customerName:first');
                                var customerTrashDomId = jQuery(parent).find('div.ui-productCrud-form-removeCustomerIcon:first');

                                if (dataItem === null) {
                                    dataItem = {
                                        customerId: "",
                                        customerName: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.ClickToAddCustomer")
                                    };
                                }

                                customerIdDomId.val(dataItem.customerId);
                                customerNameDomId.html(dataItem.customerName);

                                if (dataItem.customerId !== "") {
                                    customerTrashDomId.show();
                                }
                                else {
                                    customerTrashDomId.hide();
                                }

                                jQuery(customerIdDomId)
                                    .parents('div.ui-widgetModelItem')
                                        .widgetModelItem('change')
                                    .end();

                            }
                        },
                    }, {
                        id: "customerReadonly",
                        displayName: clientApp.i18n.texts.get("Views.Crud.Customer"),
                        input: {
                            type: "custom",
                            value: null,
                            nullable: true,
                            onItemBuild: function (widget, parent) {


                                var selfOption = this;

                            },
                            onItemValue: function (parent) {
                                return this.value;
                            },
                            onItemBind: function (parent, dataItem) {

                            }
                        },
                    }
                ];
            }()
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
        filterSetCustomer: function (custInfo) {
            for (var i = 0; i < this.options.filterModel.length; i++) {
                if (this.options.filterModel[i].id == "customerInfo") {
                    this.options.filterModel[i].input.onItemBind(jQuery(this.element), custInfo);
                }
            }

        },
        filterSearchCustomer: function () {
            this._trigger('onSearchCustomer', null, null);
        },
        filterSetEmployee: function (employeeInfo) {
            for (var i = 0; i < this.options.filterModel.length; i++) {
                if (this.options.filterModel[i].id == "employeeInfo") {
                    this.options.filterModel[i].input.onItemBind(jQuery(this.element), employeeInfo);
                }
            }

        },
        filterSearchEmployee: function () {
            this._trigger('onSearchEmployee', null, null);
        },
        formSetCustomer: function (custInfo) {
            for (var i = 0; i < this.options.formModel.length; i++) {
                if (this.options.formModel[i].id == "customerInfo") {
                    this.options.formModel[i].input.onItemBind(jQuery(this.element), custInfo);
                }
            }
        },
        formSearchCustomer: function () {
            this._trigger('onSearchCustomer', null, null);
        },




    });

});