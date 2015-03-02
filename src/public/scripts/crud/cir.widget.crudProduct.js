
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

            for (var i = 0; i < 1000; i++) {

                var d = new Date();

                productAjax.ajax._fakeDataGrid.push({
                    fechaDesde: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                    fechaHasta: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                    nombre: "person {0}".format(i),
                    productId: i,
                    productType: "PRSP1",
                    productTypeDesc: "Prestamo garantia personal-1",
                });
            }
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
                        "TotalPages": null,
                        "TotalRows": productAjax.ajax._fakeDataGrid.length - 10,
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

                dataResult.Data.Data.push(productAjax.ajax._fakeDataGrid[i]);
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

            if (dataItem.SomeStringFromList === "") {
                //modelErrors.push({ key: "SomeStringFromList", value: ["este es un campo requerido"] });
            }

            if (dataItem.SomeBooleanNullable === "") {
                //modelErrors.push({ key: "SomeBooleanNullable", value: ["por favor informa 'si' o 'no'"] });
            }

            for (var i in dataItem) {
                modelErrors.push({ key: i, value: ["este es un campo requerido"] });
            }

            if (modelErrors.length > 0) {
                dataResult = {
                    Data: { ModelState: modelErrors },
                    IsValid: false,
                    Message: "Existen errores en el formulario",
                };
            }
            else {
                dataResult = {
                    Data: null,
                    IsValid: true,
                    Message: null,
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



jQuery.widget("ui.product", jQuery.ui.crud,
{
    options: {
        filterModel: [{
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
        }],
        gridSearchMethod: productAjax.ajax.productSearch,
        gridSearchForEditMethod : productAjax.ajax.productSearchForEdit,
        gridButtonsGet: function (crudWidget, defaultButtons) {
            for (var i = 0; i < defaultButtons.length; i++) {
                if (defaultButtons[i].id == "search") {
                    defaultButtons[i].text = "Buscar productos";
                }
            }
            return defaultButtons;
        },
        gridHeaderTemplate: function (crudGridWidget) {
            return '<th class="ui-productGrid-productId">Nº</th>' +
                    '<th class="ui-productGrid-productTypeDesc">Producto</th>' +
                    '<th class="ui-productGrid-fechaDesde">Fecha alta</th>' +
                    '<th class="ui-productGrid-gridCommand"></th>';
        },
        gridRowTemplate: function (crudGridWidget) {

            return '<td class="ui-productGrid-productId"></td>' +
                    '<td class="ui-productGrid-productTypeDesc"></td>' +
                    '<td class="ui-productGrid-fechaDesde"></td>' +
                    '<td class="ui-productGrid-gridCommand">' +
                        '<div class="ui-crudGrid-action ui-crudGrid-actionEdit ui-widget-content" title="Editar">' +
                            '<span class="ui-icon ui-state-default ui-icon-pencil"></span>' +
                        '</div>' +
                    '</td>';
        },
        gridBindRowColumns: function (crudGridWidget, $row, dataItem) {

            var templateRowSetValue = function (node, valueString) {
                jQuery(node).attr('title', valueString).html(valueString);
            };

            $row.data("dataItem", dataItem);

            templateRowSetValue($row.find('td.ui-productGrid-productId:first'), dataItem.productId);
            templateRowSetValue($row.find('td.ui-productGrid-productTypeDesc:first'), dataItem.productTypeDesc);
            templateRowSetValue($row.find('td.ui-productGrid-fechaDesde:first'), dataItem.fechaDesde !== null ? Globalize.format(dataItem.fechaDesde, 'd') : '');
        },
        gridBindRowEvents: function (crudGridWidget, $row, dataItem) {
            $row.find('div.ui-crudGrid-actionEdit')
                    .click(function () {
                        crudGridWidget._trigger('onEdit', null, jQuery(this).parents('tr.ui-crudGrid-dataRow:first').data("dataItem"));
                    })
                    .end();
        },



        formInit: function (crudWidget, formOptions) {

            var tBasicInfo = '' +
                '<div class="ui-productCrud-form-searchOutput">' +
                    '<h3 class="ui-state-default">Información básica</h3>' +
                    '<div data-fielditem="nombre" data-fielditem-name="Nombre/Razón Social"></div>' +
                    '<div data-fielditem="productId" data-fielditem-name="Num. Producto"></div>' +
                    '<div data-fielditem="productTypeDesc" data-fielditem-name="Producto"></div>' +
                    '<div data-fielditem="fechaDesde" data-fielditem-name="Fecha desde"></div>' +
                    '<div data-fielditem="fechaHasta" data-fielditem-name="Fecha hasta"></div>' +
                '</div>' +
                '<div class="ui-productCrud-form-type">' +
                    '<h3 class="ui-state-default">Información detallada del préstamo</h3>' +
                '</div>';

            jQuery(crudWidget.options.formDOMId)
                .append(tBasicInfo)
                .fieldItem();


            jQuery(crudWidget.options.formDOMId)
                .crudForm(jQuery.extend({}, formOptions,
                    {
                        formModel: crudWidget.options.formModel,
                        formButtonsGet: crudWidget.options.formButtonsGet,
                        formBind: crudWidget.options.formBind,
                        formValueGet: crudWidget.options.formValueGet,
                        formSave: crudWidget.options.formSave
                    }));

            jQuery(crudWidget.options.formDOMId)
                .find('div.ui-crudForm-modelBinding:first')
                    .widgetModel({
                        modelItems: crudWidget.options.formModel,
                        errorsCleared: function () {
                            console.log(crudWidget);
                            crudWidget.errorHide();
                        }
                    })
                .end();



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
                    .end()
                    .find('div.ui-crudForm-modelBinding:first')
                        .widgetModel('bindValue', dataItem)
                    .end();

            jQuery(self.element)
                .find('div.ui-crudForm-modelBinding:first')
                    .widgetModel('bindValue', dataItem.EditData)
            .end();
        },
        formSave: function (self) {

            var dfd = jQuery.Deferred();

            dfd.notify("Guardando informacion del producto...");

            var viewModel = jQuery(self.element).find('div.ui-crudForm-modelBinding:first').widgetModel('valAsObject');

            jQuery.when(productAjax.ajax.productSave(viewModel))
                .then(
                    function (result, statusText, jqXHR) {
                        if (result.IsValid) {
                            self._trigger('messagedisplayAutoHide', null, 'Producto guardado', 50);
                            self._trigger('change', null, result.Data);
                            self.bind(result.Data.Model);
                            dfd.resolve();
                        }
                        else {
                            if (result.Data) {

                                jQuery(self.element)
                                    .find('div.ui-crudForm-modelBinding:first')
                                    .widgetModel('bindErrors', result.Data.ModelState);
                            }
                            dfd.reject(result.Message);
                        }
                    },
                    function (jqXHR, textStatus, errorThrown) {
                        dfd.reject("Error no controlado guadando el producto");
                    })
                .done(function () {

                });

            return dfd.promise();


        },
        formModel: [{
            id: "SomeString",
            displayName: "Some String value",
            input: { value: "some characaters" },
        }, {
            id: "SomeDate",
            displayName: "Some Date value",
            input: { type: "date", value: "09/02/2015" },
        }, {
            id: "SomeFloat",
            displayName: "Some Float Value",
            input: { type: "float", value: 24.67 },
        }, {
            id: "SomeBoolean",
            displayName: "Some Boolean Value",
            input: { type: "bool", value: false },
        }, {
            id: "SomeBooleanNullable",
            displayName: "Some Boolean Nullable Value",
            input: { type: "bool", value: null, nullable: true },
        }, {
            id: "SomeStringFromList",
            displayName: "Some String From List",
            input: { type: "list", value: null, listValues: [{ value: "", text: "Select from list" }, { value: "1", text: "First value" }] },
        }, {
            id: "SomeCustomValue",
            displayName: "Some Custom Value",
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
        ],

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