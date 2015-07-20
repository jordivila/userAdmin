define([
    "scripts/Template.App.Init",
    "./arquiaCrudFakeData.js",
],
    function (clientApp, crudAjaxOpts) {

        var crudCustomerDefaultOptions = function () {

            var r = {
                filterModel: [

                ],
                gridCustomOptions: {
                    //example: see code below
                    //onSelect: function (e, dataItem) {
                    //    var $crudParent = jQuery(e.target).parents('div.ui-crud:first');
                    //    $crudParent.customer('fireCustomEvent', dataItem);
                    //}
                },
                gridSearchMethod: crudAjaxOpts.ajax.gridSearch,
                gridModel: function () {
                    return [
                        {
                            key: "subject",
                            displayName: clientApp.i18n.texts.get("Arquia.Talks.History.GridColumns.Subject")
                        },
                        {
                            key: "dateLastMessage",
                            displayName: clientApp.i18n.texts.get("Arquia.Talks.History.GridColumns.Date")
                        }
                    ];
                }(),
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

                            clientApp.globalizer.get()
                             .done(function (Globalize) {
                                 $cell.html(dataItem[columnName] !== null ? Globalize.formatDate(dataItem[columnName]) : '');
                             });

                            break;
                        default: break;
                    }
                },
                gridButtonsGet: function (self, defaultButtons) {
                    for (var i = 0; i < defaultButtons.length; i++) {
                        if (defaultButtons[i].id == "search") {
                            defaultButtons[i].text = clientApp.i18n.texts.get("Arquia.Talks.History.SearchMessages");
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
                //gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {
                //    switch (columnName) {
                //        case "nombre":
                //            $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                //            $cell.find('a')
                //                .click(function () {
                //                    crudGridWidget._trigger('onEdit', null, dataItem);
                //                });
                //            break;
                //        default: break;
                //    }
                //},
                gridSearchForEditMethod: crudAjaxOpts.ajax.gridSearchForEdit,

                formInit: function (crudWidget, $parent) {

                    var tBasicInfo = '' +
                        '<div class="ui-productCrud-form-searchOutput">' +
                            '<h3 class="ui-state-default">' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.BasicInfo")) + '</h3>' +
                            '<div data-fielditem="subject" data-fielditem-name="' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.ProductNum")) + '"></div>' +
                            '<div data-fielditem="productTypeDesc" data-fielditem-name="' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.ProductTypeDescColumn")) + '"></div>' +
                            '<div data-fielditem="nombre" data-fielditem-name="' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.Name_BussinesName")) + '"></div>' +
                            '<div data-fielditem="fechaDesde" data-fielditem-name="' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.DateFrom")) + '"></div>' +
                            '<div data-fielditem="fechaHasta" data-fielditem-name="' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.DateTo")) + '"></div>' +
                        '</div>' +
                        '<div class="ui-productCrud-form-type">' +
                            '<h3 class="ui-state-default">' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.DetailInfo")) + '</h3>' +
                        '</div>';

                    jQuery($parent).prepend(tBasicInfo);


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
                formSaveMethod: crudAjaxOpts.ajax.formSave,
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