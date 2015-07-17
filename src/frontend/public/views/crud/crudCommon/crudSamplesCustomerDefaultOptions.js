define([
    "scripts/Template.App.Init",
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
                formInit: function (self, formOptions) {

                },
            };

            return r;
        };

        var crudCustomerDefaultFormOptions = function () {
            return jQuery.extend({}, crudCustomerDefaultOptions(), {
                gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {
                    switch (columnName) {
                        case "nombre":
                            $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                            $cell.find('a')
                                .click(function () {
                                    crudGridWidget._trigger('onEdit', null, dataItem);
                                });
                            break;
                        default: break;
                    }
                },
                gridSearchForEditMethod: customerAjax.ajax.customerSearchForEdit,

                formInit: function (crudWidget, $parent) {
                    jQuery($parent).prepend('<h3 class="ui-state-default">' + clientApp.i18n.texts.get("Views.Crud.CustomerDetailInfo") + '</h3>');
                },
                formModel: function () {
                    return [
                        {
                            id: "nombre",
                            displayName: clientApp.i18n.texts.get("Views.Crud.Name"),
                            input: { value: "" },
                        },
                        {
                            id: "numDocumento",
                            displayName: clientApp.i18n.texts.get("Views.Crud.IDCard"),
                            input: { value: "" },
                        },
                        {
                            id: "fechaNacimiento",
                            displayName: clientApp.i18n.texts.get("Views.Crud.Birthdate"),
                            input: { type: "date", value: "" },
                        }
                    ];
                }(),
                formBind: function (self, dataItem) {
                    // automatic model binding is done
                    // you can perform customizations here
                },
                formSaveMethod: customerAjax.ajax.customerSave,
                formValueGet: function (self, currentValue) {
                    // automatic model value retriving is done
                    // you can perform value modifications here
                    return currentValue;
                },
            });
        };

        return {
            crudCustomerDefaultOptions: crudCustomerDefaultOptions,
            crudCustomerDefaultFormOptions: crudCustomerDefaultFormOptions
        };

    });