
/*
var productAjax = {
    ajax: {
        _ajaxBaseAddress: "/crud/",
        _ajaxMergeConfig: function (ajaxProperties) {

            var _ajaxOptions = {
                cache: false,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            };

            return jQuery.extend({}, _ajaxOptions, ajaxProperties);
        },
        productSearch: function (filter) {

            var self = this;
            var dfd = jQuery.Deferred();

            var ajaxConfig = self._ajaxMergeConfig({
                url: self._ajaxBaseAddress + 'ProductSearch',
                type: "POST",
                data: JSON.stringify({
                    filter: filter
                })
            });

            jQuery.when(jQuery.ajax(ajaxConfig))
                    .then(
                        function (result, statusText, jqXHR) {
                            dfd.resolve(result.d, statusText, jqXHR);
                        },
                        function (jqXHR, textStatus, errorThrown) {
                            dfd.reject(jqXHR, textStatus, errorThrown);
                        });

            return dfd.promise();
        },
        productSearchTypesAvailable: function () {

            var self = this;
            var dfd = jQuery.Deferred();

            if (productAjax.cache.productSearchTypes === null) {
                var action = function () {

                    var ajaxConfig = self._ajaxMergeConfig({
                        url: self._ajaxBaseAddress + 'productTypes',
                        type: "GET"
                    });

                    return jQuery.when(jQuery.ajax(ajaxConfig))
                            .then(
                                function (result, statusText, jqXHR) {
                                    productAjax.cache.productSearchTypes = result;
                                    dfd.resolve(productAjax.cache.productSearchTypes, statusText, jqXHR);
                                },
                                function (jqXHR, textStatus, errorThrown) {
                                    dfd.reject(jqXHR, textStatus, errorThrown);
                                });
                };

                action();

                return dfd.promise();
            }
            else {
                dfd.resolve(productAjax.cache.productSearchTypes);
                return dfd.promise();
            }
        },
        productSearchForEdit: function (dataItem) {

            var self = this;
            var dfd = jQuery.Deferred();

            var ajaxConfig = self._ajaxMergeConfig({
                url: self._ajaxBaseAddress + 'productSearchForEdit',
                type: "POST",
                data: JSON.stringify({
                    dataItem: dataItem
                })
            });

            jQuery.when(jQuery.ajax(ajaxConfig))
                    .then(
                        function (result, statusText, jqXHR) {
                            dfd.resolve(result.d, statusText, jqXHR);
                        },
                        function (jqXHR, textStatus, errorThrown) {
                            dfd.reject(jqXHR, textStatus, errorThrown);
                        });

            return dfd.promise();
        },
        productSave: function (dataItem) {

            var self = this;
            var dfd = jQuery.Deferred();
            var ajaxConfig = self._ajaxMergeConfig({
                url: self._ajaxBaseAddress + 'ProductSave',
                type: "POST",
                data: JSON.stringify({
                    form: dataItem
                })
            });

            jQuery.when(jQuery.ajax(ajaxConfig))
                    .then(
                        function (result, statusText, jqXHR) {
                            dfd.resolve(result.d, statusText, jqXHR);
                        },
                        function (jqXHR, textStatus, errorThrown) {
                            dfd.reject(jqXHR, textStatus, errorThrown);
                        });

            return dfd.promise();
        }
    },
    cache: {
        productSearchTypes: null
    }
};
*/

/*FAKE PRODUCTS*/

var productAjax = {
    ajax: {
        _ajaxBaseAddress: null,
        _ajaxMergeConfig: null,
        _fakeDataGrid: null,
        _fakeDataGridInit: function () {

            productAjax.ajax._fakeDataGrid = [];

            var i = 0;
            var d = new Date();

            for (i = 0; i < 1000; i++) {

                d = new Date();

                productAjax.ajax._fakeDataGrid.push({
                    fechaDesde: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                    fechaHasta: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                    nombre: "person {0}".format(i),
                    productId: (i.toString() + "").padIndex(4, '0'),
                    productType: "PRSP1",
                    productTypeDesc: "Prestamo garantia personal-1",
                });
            }



            i++;
            d = new Date();



            productAjax.ajax._fakeDataGrid.push({
                fechaDesde: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                fechaHasta: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                nombre: "person {0}".format(i),
                productId: i,
                productType: "PRSP1",
                productTypeDesc: "Prestamo garantia personal-1",
            });


        },
        _fakeDataEdit: null,
        _fakeDataEditInit: function () {

            productAjax.ajax._fakeDataEdit = [];

            for (var i = 0; i < 1000; i++) {

                var d = new Date();

                productAjax.ajax._fakeDataEdit.push({
                    SomeString: "alguna cadena asdjhaskd -> {0}".format(i),
                    SomeDate: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                    SomeFloat: i,
                    SomeBoolean: i % 2 === true,
                    SomeBooleanNullable: null,
                    SomeStringFromList: "",
                    SomeCustomValue: i,
                });
            }
        },
        _fakeDelay: 1000,
        productSearch: function (filter) {

            var self = this;
            var dfd = jQuery.Deferred();


            if (productAjax.ajax._fakeDataGrid === null) {
                productAjax.ajax._fakeDataGridInit();
                productAjax.ajax._fakeDataEditInit();
            }

            var dataResult = {
                "IsValid": true,
                "Message": "",
                "MessageType": 0,
                "Data":
                    {
                        //"TotalPages": null,
                        "TotalRows": productAjax.ajax._fakeDataGrid.length,
                        "Page": filter.Page,
                        "PageSize": filter.PageSize,
                        "SortBy": "",
                        "SortAscending": false,
                        "Data": [],
                        "IsValid": true,
                        "Message": null,
                        "MessageType": 0
                    }
            };

            for (var i = (filter.Page * filter.PageSize) ; i < ((filter.Page * filter.PageSize) + filter.PageSize) ; i++) {
                if (i < productAjax.ajax._fakeDataGrid.length) {
                    dataResult.Data.Data.push(productAjax.ajax._fakeDataGrid[i]);
                }
            }

            setTimeout(function () { dfd.resolve(dataResult); }, productAjax.ajax._fakeDelay);

            return dfd.promise();
        },
        productSearchTypesAvailable: function () {

            var productTypesFakeGet = function () {

                return {
                    "IsValid": true,
                    "Message": "",
                    "MessageType": 0,
                    "Data": [{
                        "Id": "AN",
                        "Description": "Anticipo de nomina",
                        "Childs": [
                            {
                                "Id": "AN",
                                "Description": "Anticipo Nomina", "Childs": null
                            }]
                    }, {
                        "Id": "AVL",
                        "Description": "Avales",
                        "Childs": [
                            {
                                "Id": "AVL",
                                "Description": "Avales", "Childs": []
                            }]
                    }, {
                        "Id": "DEDL",
                        "Description": "Descuentos de efectos",
                        "Childs": [
                            {
                                "Id": "DLDL",
                                "Description": "Descuento de Efectos",
                                "Childs": []
                            }]
                    }, {
                        "Id": "DH",
                        "Description": "Anticipo de honorarios",
                        "Childs": [
                            {
                                "Id": "DH",
                                "Description": "Anticipo de honorarios",
                                "Childs": []
                            }]
                    }, {
                        "Id": "LEA",
                        "Description": "Leasing",
                        "Childs": [
                            {
                                "Id": "LEA", "Description": "Leasing",
                                "Childs": []
                            }]
                    }, {
                        "Id": "LEAH",
                        "Description": "Leasing hipotecario",
                        "Childs": [
                            {
                                "Id": "LEAH",
                                "Description": "Leasing hipotecario",
                                "Childs": []
                            }]
                    }, {
                        "Id": "PC",
                        "Description": "Polizas de credito",
                        "Childs": [
                            {
                                "Id": "PCCH",
                                "Description": "Pol. credito Gtia. hipotecaria",
                                "Childs": []
                            }, {
                                "Id": "PCEH",
                                "Description": "Pol. credito E.crecientes G.H.",
                                "Childs": []
                            }, {
                                "Id": "PCPC",
                                "Description": "Pol. credito Gtia. personal",
                                "Childs": []
                            }]
                    }, {
                        "Id": "PRS",
                        "Description": "Prestamos",
                        "Childs": [
                            {

                                "Id": "PRSCS",
                                "Description": "Prestamo campana lounge",
                                "Childs": []
                            }, {

                                "Id": "PRSD",
                                "Description": "Prestamo con otras garantias",
                                "Childs": []
                            }, {

                                "Id": "PRSEH",
                                "Description": "Prestamo int.fijo construccion",
                                "Childs": []
                            }, {

                                "Id": "PRSFH",
                                "Description": "Prestamo hipotecario fijo",
                                "Childs": []
                            }, {

                                "Id": "PRSGD",
                                "Description": "Prestamo con gtias. deposito",
                                "Childs": []
                            }, {

                                "Id": "PRSGH",
                                "Description": "Prestamo con gtia. hipotecaria",
                                "Childs": []
                            }, {

                                "Id": "PRSGV",
                                "Description": "Prestamo con gtias. de valores",
                                "Childs": []
                            }, {

                                "Id": "PRSIH",
                                "Description": "Prestamo int.vble.construccion",
                                "Childs": []
                            }, {

                                "Id": "PRSJH",
                                "Description": "Prestamo hipot. cuota fija",
                                "Childs": []
                            }, {

                                "Id": "PRSP1", "Description": "Prestamo garantia personal-1",
                                "Childs": []
                            }, {

                                "Id": "PRSP2", "Description": "Prestamo garantia personal-2",
                                "Childs": []
                            }, {

                                "Id": "PRSPD", "Description": "Prestamo ciud.digital (ico)",
                                "Childs": []
                            }, {

                                "Id": "PRSPE", "Description": "Prestamo g. personal empleados",
                                "Childs": []
                            }, {

                                "Id": "PRSPJ", "Description": "Prestamo joven",
                                "Childs": []
                            }, {

                                "Id": "PRSPT", "Description": "Prestamo tic (ico)",
                                "Childs": []
                            }, {

                                "Id": "PRSPU", "Description": "Prestamo jov-univ (ico)",
                                "Childs": []
                            }, {

                                "Id": "PRSPX", "Description": "Prestamo g. personal variable",
                                "Childs": []
                            }, {

                                "Id": "PRSS1", "Description": "Prestamo subvencionado",
                                "Childs": []
                            }]
                    }]
                };




            };

            var self = this;
            var dfd = jQuery.Deferred();
            var dataResult = productTypesFakeGet();
            setTimeout(function () { dfd.resolve(dataResult); }, productAjax.ajax._fakeDelay);
            return dfd.promise();
        },
        productSearchForEdit: function (dataItem) {

            var self = this;
            var dfd = jQuery.Deferred();
            var dataResult = null;

            for (var i = 0; i < productAjax.ajax._fakeDataGrid.length; i++) {
                if (productAjax.ajax._fakeDataGrid[i].productId === dataItem.productId) {
                    dataResult = {
                        Data: jQuery.extend({},
                                    productAjax.ajax._fakeDataGrid[i],
                                    {
                                        EditData: productAjax.ajax._fakeDataEdit[i]
                                    }),
                        IsValid: true,
                        Message: null,
                        MessageType: 0,
                    };
                }
            }

            setTimeout(function () { dfd.resolve(dataResult); }, productAjax.ajax._fakeDelay);

            return dfd.promise();
        },
        productSave: function (dataItem) {


            var dfd = jQuery.Deferred();

            var dataResult = null;
            var modelErrors = [];

            if (dataItem.FormData.SomeStringFromList === "") {
                modelErrors.push({ key: "SomeStringFromList", value: ["este es un campo requerido"] });
            }

            if (isNaN(dataItem.FormData.SomeFloat)) {
                modelErrors.push({ key: "SomeFloat", value: ["Se esperaba un número"] });
            }

            if (modelErrors.length > 0) {
                dataResult = {
                    Data: { ModelState: modelErrors },
                    IsValid: false,
                    Message: "Existen errores en el formulario",
                };
            }
            else {
                // Simulate saving data
                dataItem.EditData.SomeBoolean = dataItem.FormData.SomeBoolean;
                dataItem.EditData.SomeBooleanNullable = dataItem.FormData.SomeBooleanNullable;
                dataItem.EditData.SomeCustomValue = dataItem.FormData.SomeCustomValue;
                dataItem.EditData.SomeDate = dataItem.FormData.SomeDate !== "" ? Globalize.parseDate(dataItem.FormData.SomeDate) : null;
                dataItem.EditData.SomeFloat = parseFloat(dataItem.FormData.SomeFloat);
                dataItem.EditData.SomeString = dataItem.FormData.SomeString;
                dataItem.EditData.SomeStringFromList = dataItem.FormData.SomeStringFromList;

                productAjax.ajax._fakeDataEdit[dataItem.productId] = dataItem.EditData;
                // Simulate server response
                dataItem.FormData = undefined;

                dataResult = {
                    Data: dataItem,
                    IsValid: true,
                    Message: "Producto guardado",
                    MessageType: 0,
                };
            }

            setTimeout(function () { dfd.resolve(dataResult); }, productAjax.ajax._fakeDelay);

            return dfd.promise();
        }
    },
    cache: {
        productSearchTypes: null
    }
};



var productFilterModelGet = function (context) {

    return [{
        id: "productId",
        displayName: "Num. Producto",
        input: { value: "" },
    }, {
        id: "productType",
        displayName: "Tipo",
        input: { type: "list", value: null, listValues: [{ value: "", text: "Select from list" }] },
    }, {
        id: "customerId",
        displayName: "Cliente",
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
                            '<span class="ui-icon ui-icon-trash"></span>' +
                        '</div>';
                };

                jQuery(parent).append(_templateGet());

                var customerNameDomId = jQuery(parent).find('a.ui-productCrud-filter-custName:first');
                var customerTrashDomId = jQuery(parent).find('div.ui-productCrud-filter-removeCustomerIcon:first');

                customerTrashDomId
                    .click(function () {
                        selfOption.onItemBind(jQuery(parent), { id: "", nombre: "Click para filtrar por cliente" });
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

var productFormModelGet = function () {
    return [{
        id: "SomeString",
        displayName: "String",
        input: { value: "" },
    }, {
        id: "SomeDate",
        displayName: "Date",
        input: { type: "date", value: "" },
    }, {
        id: "SomeFloat",
        displayName: "Float",
        input: { type: "float", value: null },
    }, {
        id: "SomeBoolean",
        displayName: "Bool",
        input: { type: "bool", value: null },
    }, {
        id: "SomeBooleanNullable",
        displayName: "Null of Bool",
        input: { type: "bool", value: null, nullable: true },
    }, {
        id: "SomeStringFromList",
        displayName: "List of string",
        input: { type: "list", value: null, listValues: [{ value: "", text: "Select from list" }, { value: "1", text: "First value" }] },
    }, {
        id: "SomeCustomValue",
        displayName: "Custom Value",
        input: {
            type: "custom",
            value: null,
            nullable: true,
            onItemBuild: function (widget, parent) {
                jQuery(parent)
                    .append('<p>some readOnly value-><span class="SomeCustomValue">2</span></p>')
                    .find('p:first')
                        .click(function () {
                            jQuery(widget).widgetModelItem('change');
                        });
            },
            onItemValue: function (parent) {
                return jQuery(parent).find('span.SomeCustomValue').html();
            },
            onItemBind: function (parent, dataItem) {
                return jQuery(parent).find('span.SomeCustomValue').html(dataItem);
            }
        },
    },
    ];
};


jQuery.widget("ui.product", jQuery.ui.crud,
{
    options: {
        filterModel: productFilterModelGet(this),
        gridSearchMethod: productAjax.ajax.productSearch,
        gridSearchForEditMethod: productAjax.ajax.productSearchForEdit,
        gridButtonsGet: function (crudWidget, defaultButtons) {
            for (var i = 0; i < defaultButtons.length; i++) {
                if (defaultButtons[i].id == "search") {
                    defaultButtons[i].text = "Buscar productos";
                }
            }
            return defaultButtons;
        },
        //gridHeaderTemplate: function (crudGridWidget) {
        //    return '<div class="ui-productGrid-productId ui-widgetGrid-column">Nº</div>' +
        //            '<div class="ui-productGrid-productTypeDesc ui-widgetGrid-column">Producto</div>' +
        //            '<div class="ui-productGrid-fechaDesde ui-widgetGrid-column">Fecha alta</div>';
        //},
        //gridRowTemplate: function (crudGridWidget) {

        //    return '<div class="ui-productGrid-productId ui-widgetGrid-column ui-widget-content ui-state-default"><div class="ui-widgetGrid-column-content"><a href="javascript:void(0);"></a></div></div>' +
        //            '<div class="ui-productGrid-productTypeDesc ui-widgetGrid-column ui-widget-content ui-state-default"><div class="ui-widgetGrid-column-content"></div></div>' +
        //            '<div class="ui-productGrid-fechaDesde ui-widgetGrid-column ui-widget-content ui-state-default"><div class="ui-widgetGrid-column-content"></div></div>' +
        //            '';
        //    //'<td class="ui-productGrid-gridCommand">' +
        //    //    '<div class="ui-crudGrid-action ui-crudGrid-actionEdit ui-widget-content" title="Editar">' +
        //    //        '<span class="ui-icon ui-state-default ui-icon-pencil"></span>' +
        //    //    '</div>' +
        //    //'</td>';
        //},
        //gridBindRowColumns: function (crudGridWidget, $row, dataItem) {

        //    var templateRowSetValue = function (node, valueString) {
        //        jQuery(node).attr('title', valueString).html(valueString);
        //    };

        //    $row.data("dataItem", dataItem);

        //    templateRowSetValue($row.find('div.ui-productGrid-productId:first').find('div.ui-widgetGrid-column-content').find('a'), dataItem.productId);
        //    templateRowSetValue($row.find('div.ui-productGrid-productTypeDesc:first').find('div.ui-widgetGrid-column-content'), dataItem.productTypeDesc);
        //    templateRowSetValue($row.find('div.ui-productGrid-fechaDesde:first').find('div.ui-widgetGrid-column-content'), dataItem.fechaDesde !== null ? Globalize.format(dataItem.fechaDesde, 'd') : '');
        //},
        gridModel: [
            {
                key: "productId",
                displayName: "Nº"
            },
            {
                key: "productTypeDesc",
                displayName: "Producto"
            },
            {
                key: "fechaDesde",
                displayName: "Fecha alta"
            },
        ],
        gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

            switch (columnName) {
                case "productId":

                    $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                    $cell.find('a')
                        .click(function () {
                            crudGridWidget._trigger('onEdit', null, dataItem);
                        });


                    break;
                case "fechaDesde":

                    $cell.html(dataItem.fechaDesde !== null ? Globalize.format(dataItem.fechaDesde, 'd') : '');

                    break;
                default: break;
            }
        },


        formInit: function (crudWidget, $parent) {

            var tBasicInfo = '' +
                '<div class="ui-productCrud-form-searchOutput">' +
                    '<h3 class="ui-state-default">Información básica</h3>' +
                    '<div data-fielditem="productId" data-fielditem-name="Num. Producto"></div>' +
                    '<div data-fielditem="productTypeDesc" data-fielditem-name="Producto"></div>' +
                    '<div data-fielditem="nombre" data-fielditem-name="Nombre/Razón Social"></div>' +
                    '<div data-fielditem="fechaDesde" data-fielditem-name="Fecha desde"></div>' +
                    '<div data-fielditem="fechaHasta" data-fielditem-name="Fecha hasta"></div>' +
                '</div>' +
                '<div class="ui-productCrud-form-type">' +
                    '<h3 class="ui-state-default">Información detallada del préstamo</h3>' +
                '</div>';

            jQuery($parent).prepend(tBasicInfo);


            //jQuery(crudWidget.options.formDOMId)
            //    .append(tBasicInfo)
            //    .fieldItem();


            //jQuery(crudWidget.options.formDOMId)
            //    .crudForm(jQuery.extend({}, formOptions,
            //        {
            //            formModel: crudWidget.options.formModel,
            //            formButtonsGet: crudWidget.options.formButtonsGet,
            //            formBind: crudWidget.options.formBind,
            //            formValueGet: crudWidget.options.formValueGet,
            //            formSaveMethod: crudWidget.options.formSaveMethod
            //        }));

            //jQuery(crudWidget.options.formDOMId)
            //    .find('div.ui-crudForm-modelBinding:first')
            //        .widgetModel({
            //            modelItems: crudWidget.options.formModel,
            //            errorsCleared: function () {
            //                crudWidget.errorHide();
            //            }
            //        })
            //    .end();



        },
        formButtonsGet: function (self, defaultButtons) {
            return defaultButtons;
        },
        formBind: function (self, dataItem) {

            jQuery(self.element)
                .find('div.ui-productCrud-form-searchOutput')
                    .find('div[data-fieldItem="productId"]').html(dataItem.productId)
                    .end()
                    .find('div[data-fieldItem="nombre"]').html(dataItem.nombre)
                    .end()
                    .find('div[data-fieldItem="productTypeDesc"]').html(dataItem.productTypeDesc)
                    .end()
                    .find('div[data-fieldItem="fechaDesde"]').html(dataItem.fechaDesde !== null ? Globalize.format(dataItem.fechaDesde, 'd') : '')
                    .end()
                    .find('div[data-fieldItem="fechaHasta"]').html(dataItem.fechaHasta !== null ? Globalize.format(dataItem.fechaHasta, 'd') : '')
                    .end();
        },
        formSaveMethod: productAjax.ajax.productSave,
        formValueGet: function (self, currentValue) {
            return currentValue;
        },
        formModel: productFormModelGet(),
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

});