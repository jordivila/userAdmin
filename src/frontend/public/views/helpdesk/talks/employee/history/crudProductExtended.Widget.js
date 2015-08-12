define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "scripts/crud/common.widget.crud",
    "crossLayer/dateHelper",
    "/helpdesk/talks/common/fakes/helpdeskCrudFakeData.js",
    "/helpdesk/talks/employee/common/helpdeskCommon.js",
    "crossLayer/models/dataResult",
],
function ($, jqUI, clientApp, wCrud, dateHelper, crudAjaxOpts, helpdeskCommon, DataResult) {

    jQuery.widget("ui.product", jQuery.ui.crud,
    {
        options: {
            filterModel: function (context) {

                return [{
                    id: "customerId",
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
                            return customerIdDomId.val();
                        },
                        onItemBind: function (parent, dataItem) {

                            var customerIdDomId = jQuery(parent).find('input.ui-productCrud-filter-custId:first');
                            var customerNameDomId = jQuery(parent).find('a.ui-productCrud-filter-custName:first');
                            var customerTrashDomId = jQuery(parent).find('div.ui-productCrud-filter-removeCustomerIcon:first');

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
                            { value: "", text: clientApp.i18n.texts.get("GeneralTexts.SelectFromList") },
                            { value: "2", text: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.Unread") },
                            { value: "1", text: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.PendingAnswer") },
                            { value: "0", text: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.OK") }
                        ]
                    },
                },
                {
                    id: "employeeId",
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
                            return employeeIdDomId.val();
                        },
                        onItemBind: function (parent, dataItem) {

                            var employeeIdDomId = jQuery(parent).find('input.ui-productCrud-filter-employeeId:first');
                            var employeeNameDomId = jQuery(parent).find('a.ui-productCrud-filter-employeeName:first');
                            var employeeTrashDomId = jQuery(parent).find('div.ui-productCrud-filter-removeEmployeeIcon:first');

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
                    cssClass: "ui-cancel-button",
                    icon: "fa fa-plus-circle",
                    click: function () {
                        //clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.subject()));
                        crudWidget.edit({});
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
                                clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.message(dataItem.idTalk)));
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
            //formInit: function (crudWidget, $parent) {

            //},


            gridSearchForEditMethod: function (dataItem) {


                // this is just a fake. As far as this crud widget does NOT edit elements. It just adds elements

                var self = this;
                var dfd = jQuery.Deferred();
                var dataResult = new DataResult(true, "", {
                    idTalk: null,
                    subject: '',
                });

                setTimeout(function () { dfd.resolve(dataResult); }, 1);

                return dfd.promise();

            },
            formInit: function (crudWidget, $parent) {

                var tBasicInfo = '' +
                    '<div>' +
                        'Indica el asunto y busca un cliente con el que entablar conversacion' +
                    '</div>' +
                    '<div class="ui-productCrud-form-type">' +
                        '<h3 class="ui-state-default">Informacion de la conversaion</h3>' +
                    '</div>';

                jQuery($parent).prepend(tBasicInfo);
            },
            formButtonsGet: function (self, defaultButtons) {
                return defaultButtons;
            },
            formBind: function (self, dataItem) {


            },
            formSaveMethod: null,//productAjax.ajax.productSave,
            formValueGet: function (self, currentValue) {
                return currentValue;
            },
            formModel: function () {
                return [{
                    id: "subject",
                    displayName: clientApp.i18n.texts.get("Helpdesk.Talks.History.GridColumns.Subject"),
                    input: { value: "" },
                }, {
                    id: "customerId",
                    displayName: clientApp.i18n.texts.get("Views.Crud.Customer"),
                    input: {
                        type: "custom",
                        value: null,
                        nullable: true,
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
                                    selfOption.onItemBind(jQuery(parent), { customerId: "", customerName: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.ClickToFilterByCustomer") });
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
                            var customerIdDomId = jQuery(parent).find('input.ui-productCrud-form-customerId:first').val();
                        },
                        onItemBind: function (parent, dataItem) {
                            //return jQuery(parent).find('span.someCustomValue').html(dataItem);

                            var customerIdDomId = jQuery(parent).find('input.ui-productCrud-form-customerId:first');
                            var customerNameDomId = jQuery(parent).find('a.ui-productCrud-form-customerName:first');
                            var customerTrashDomId = jQuery(parent).find('div.ui-productCrud-form-removeCustomerIcon:first');

                            if (dataItem === null) {
                                dataItem = {
                                    customerId: "",
                                    customerName: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.ClickToFilterByCustomer")
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
                }
                ];
            }(),

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
                if (this.options.filterModel[i].id == "customerId") {
                    this.options.filterModel[i].input.onItemBind(jQuery(this.element), custInfo);
                }
            }

        },
        filterSearchCustomer: function () {
            this._trigger('onSearchCustomer', null, null);
        },
        filterSetEmployee: function (employeeInfo) {
            for (var i = 0; i < this.options.filterModel.length; i++) {
                if (this.options.filterModel[i].id == "employeeId") {
                    this.options.filterModel[i].input.onItemBind(jQuery(this.element), employeeInfo);
                }
            }

        },
        filterSearchEmployee: function () {
            this._trigger('onSearchEmployee', null, null);
        },
        formSetCustomer: function (custInfo) {
            for (var i = 0; i < this.options.formModel.length; i++) {
                if (this.options.formModel[i].id == "customerId") {
                    this.options.formModel[i].input.onItemBind(jQuery(this.element), custInfo);
                }
            }
        },
        formSearchCustomer: function () {
            this._trigger('onSearchCustomer', null, null);
        },




    });

});