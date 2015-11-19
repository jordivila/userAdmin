define([
    "scripts/Template.App.ClientApp",
    "../common/helpdeskCrudFakeDataEmployee.js",
],
    function (clientApp, customerAjax) {

        var crudCustomerDefaultOptions = function () {

            var r = {
                filterModel: [
                    {
                        id: "customerName",
                        displayName: clientApp.i18n.texts.get("Views.Crud.Name_BussinesName"),
                        input: { value: "" },
                    },
                    {
                        id: "customerCardId",
                        displayName: clientApp.i18n.texts.get("Views.Crud.IDCard"),
                        input: { value: "" }
                    }
                ],
                gridExpand: true,
                gridFilterVisibleAlways: true,
                gridCustomOptions: {
                    //example: see code below
                    //onSelect: function (e, dataItem) {
                    //    var $crudParent = jQuery(e.target).parents('div.ui-crud:first');
                    //    $crudParent.customer('fireCustomEvent', dataItem);
                    //}
                },
                gridSearchMethod: customerAjax.ajax.customerSearch,
                gridModel: [
                    {
                        key: "customerName",
                        displayName: clientApp.i18n.texts.get("Views.Crud.Name_BussinesName")
                    },
                    {
                        key: "customerCardId",
                        displayName: clientApp.i18n.texts.get("Views.Crud.IDCard")
                    }
                ],
                gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {
                    switch (columnName) {
                        case "customerName":
                            $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                            $cell.find('a')
                                .click(function () {
                                    crudGridWidget._trigger('onSelect', null, dataItem);
                                });
                            break;
                        default: break;
                    }
                },
                gridButtonsGet: function (self, defaultButtons) {
                    for (var i = 0; i < defaultButtons.length; i++) {
                        if (defaultButtons[i].id == "search") {
                            defaultButtons[i].text = clientApp.i18n.texts.get("Views.Crud.SearchCustomers");
                        }
                    }

                    return defaultButtons;
                },
                gridPagerInit: function () {
                    return {
                        pageSize: 30,
                    };
                },
                formInit: function (self, formOptions) {

                },
            };

            return r;
        };

        return {
            crudCustomerDefaultOptions: crudCustomerDefaultOptions,
        };

    });