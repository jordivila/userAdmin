define([
    "scripts/Template.App.ClientApp",
],
function (clientApp) {


    var productFilterModelGet = function (context) {

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
                            selfOption.onItemBind(jQuery(parent), { id: "", nombre: clientApp.i18n.texts.get("Views.Crud.CrudExtended.ClickToFilterByCustomer") });
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

                    customerIdDomId.val(dataItem.id);
                    customerNameDomId.html(dataItem.nombre);

                    if (dataItem.id !== "") {
                        customerTrashDomId.show();
                    }
                    else {
                        customerTrashDomId.hide();
                    }

                }
            },
        },
        {
            id: "productType",
            displayName: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.TalkStatus"),
            input: {
                type: "list",
                value: null,
                listValues: [
                    { value: "", text: clientApp.i18n.texts.get("GeneralTexts.SelectFromList") },
                    { value: "", text: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.Unread") },
                    { value: "", text: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.PendingAnswer") },
                    { value: "", text: clientApp.i18n.texts.get("Helpdesk.Talks.History.Filter.OK") }
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
    };

    return productFilterModelGet;

});