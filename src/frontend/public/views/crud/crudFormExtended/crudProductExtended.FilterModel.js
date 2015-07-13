define([
    "scripts/Template.App.Init",
],
function (clientApp) {


    var productFilterModelGet = function (context) {

        return [{
            id: "productId",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.ProductNum"),
            input: { value: "" },
        }, {
            id: "productType",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.ProductType"),
            input: { type: "list", value: null, listValues: [{ value: "", text: clientApp.i18n.texts.get("Views.Crud.SelectFromList") }] },
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
        }];
    };

    return productFilterModelGet;

});