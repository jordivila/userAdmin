define([
    "scripts/Template.App.ClientApp",
    "./crudSamplesCustomerData.js",
],
    function (clientApp, customerAjax) {

        var crudCustomerDefaultOptions = function () {

            var r = {
                filterModel: [
                    {
                        id: "nombre",
                        displayName: clientApp.i18n.texts.get("Views.Crud.Name_BussinesName"),
                        input: { value: "" },
                    },
                    {
                        id: "dni",
                        displayName: clientApp.i18n.texts.get("Views.Crud.IDCard"),
                        input: { value: "" }
                    }
                ],
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
                        key: "nombre",
                        displayName: clientApp.i18n.texts.get("Views.Crud.Name_BussinesName")
                    },
                    {
                        key: "numDocumento",
                        displayName: clientApp.i18n.texts.get("Views.Crud.IDCard")
                    }
                ],
                gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

                    switch (columnName) {
                        case "nombre":
                            $cell.html('<span>{0}</span>'.format(dataItem[columnName]));
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