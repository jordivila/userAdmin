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
        gridSearch: function (self) {

            var dfd = jQuery.Deferred();

            dfd.notify("Buscando productos...");


            jQuery.when(productAjax.ajax.productSearch(self.options.gridFilterObject))
                .then(
                    function (result, statusText, jqXHR) {
                        if (result.IsValid) {
                            jQuery(self.options.gridDOMId).productGrid('bind', result.Data);
                            dfd.resolve();
                        }
                        else {
                            dfd.reject(result.Message);
                        }
                    },
                    function (jqXHR, textStatus, errorThrown) {
                        dfd.reject("Error obteniendo productos");
                    })
                .done(function () {

                });

            return dfd.promise();
        },
        gridFilterInit: function (self, filterOptions) {
            jQuery(self.options.gridFilterDOMId).productFilter(jQuery.extend({}, filterOptions, { Model: self.options.filterModel }));
        },
        gridEditSearch: function (self, dataItem) {

            var dfd = jQuery.Deferred();

            dfd.notify("Buscando información del producto...");

            jQuery.when(productAjax.ajax.productSearchForEdit(dataItem))
                    .then(
                        function (result, statusText, jqXHR) {
                            if (result.IsValid) {
                                jQuery(self.options.formDOMId).productForm('bind', result.Data);
                                dfd.resolve();
                            }
                            else {
                                dfd.reject(result.Message);
                            }
                        },
                        function (jqXHR, textStatus, errorThrown) {
                            dfd.reject("Error obteniendo información del producto");
                        })
                    .done(function () {

                    });

            return dfd.promise();
        },
        gridInit: function (self, gridOptions) {
            jQuery(self.options.gridDOMId).productGrid(gridOptions);
        },
        gridButtonsGet: function (self, defaultButtons) {
            for (var i = 0; i < defaultButtons.length; i++) {
                if (defaultButtons[i].id == "search") {
                    defaultButtons[i].text = "Buscar productos";
                }
            }
            return defaultButtons;
        },
        formInit: function (self, formOptions) {

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

            jQuery(self.options.formDOMId)
                .append(tBasicInfo)
                .fieldItem();


            jQuery(self.options.formDOMId)
                .productForm(jQuery.extend({}, formOptions,
                    {
                        formModel: self.options.formModel,
                        formButtonsGet: self.options.formButtonsGet,
                        formBind: self.options.formBind,
                        formValueGet: self.options.formValueGet,
                        formSave: self.options.formSave
                    }));

            jQuery(self.options.formDOMId)
                .find('div.ui-crudForm-modelBinding:first')
                    .widgetModel({
                        modelItems: self.options.formModel
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
                console.log(this.options.filterModel[i]);
                this.options.filterModel[i].input.onItemBind(jQuery(this.element), custInfo);
            }
        }

    },
    filterSearchCustomer: function () {
        this._trigger('onSearchCustomer', null, null);
    },

});



jQuery.widget("ui.productFilter", jQuery.ui.crudFilter,
{
    options: {
        Model: null,
        filterButtonsInit: function (self, defaultButtons) {
            for (var i = 0; i < defaultButtons.length; i++) {
                if (defaultButtons[i].id == "filter") {
                    defaultButtons[i].text = "Buscar productos";
                }
            }
            return defaultButtons;
        }
    },
    _create: function () {

        jQuery(this.element).widgetModel({
            modelItems: this.options.Model
        });

        this._super();
    },
    _init: function () {

        this._super();

        this._done();
    },
    destroy: function () {

        this._super();
    },
    val: function () {

        var self = this;

        var model = {

            Filter: jQuery(this.element).widgetModel('valAsObject'),
            Page: 0,
            PageSize: this.options.PageSize,
            SortBy: this.options.SortBy,
            SortAscending: this.options.SortAscending
        };

        return model;
    }
});

jQuery.widget("ui.productGrid", jQuery.ui.crudGrid,
{
    options: {

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
    _gridHeaderTemplate: function () {
        return '<th class="ui-productGrid-nombre">Nombre</th>' +
                '<th class="ui-productGrid-productId">Producto Nº</th>' +
                '<th class="ui-productGrid-productTypeDesc">Producto</th>' +
                '<th class="ui-productGrid-fechaDesde">Fecha alta</th>' +
                '<th class="ui-productGrid-fechaHasta">Fecha baja</th>' +
                '<th class="ui-productGrid-gridCommand"></th>';
    },
    _gridRowTemplate: function () {

        return '<td class="ui-productGrid-nombre"></td>' +
                '<td class="ui-productGrid-productId"></td>' +
                '<td class="ui-productGrid-productTypeDesc"></td>' +
                '<td class="ui-productGrid-fechaDesde"></td>' +
                '<td class="ui-productGrid-fechaHasta"></td>' +
                '<td class="ui-productGrid-gridCommand">' +
                    '<div class="ui-crudGrid-actionsColumn">' +
                        '<table>' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td class="ui-crudGrid-action">' +
                                        '<div class="ui-crudGrid-action-select ui-widget-content" title="Seleccionar">' +
                                            '<span class="ui-icon ui-state-default ui-icon-circle-arrow-e"></span>' +
                                        '</div>' +
                                    '</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>' +
                '</td>';
    },
    _bindRowColumns: function ($row, dataItem) {

        var templateRowSetValue = function (node, valueString) {
            jQuery(node).attr('title', valueString).html(valueString);
        };


        $row.data("dataItem", dataItem);


        templateRowSetValue($row.find('td.ui-productGrid-nombre:first'), dataItem.nombre);
        templateRowSetValue($row.find('td.ui-productGrid-productId:first'), dataItem.productId);
        templateRowSetValue($row.find('td.ui-productGrid-productTypeDesc:first'), dataItem.productTypeDesc);
        templateRowSetValue($row.find('td.ui-productGrid-fechaDesde:first'), dataItem.fechaDesde !== null ? Globalize.format(dataItem.fechaDesde, 'd') : '');
        templateRowSetValue($row.find('td.ui-productGrid-fechaHasta:first'), dataItem.fechaHasta !== null ? Globalize.format(dataItem.fechaHasta, 'd') : '');
    },
    _bindRowEvents: function ($row, dataItem) {

        var self = this;

        $row.find('div.ui-crudGrid-action-select')
                .click(function () {
                    self._trigger('onEdit', null, jQuery(this).parents('tr.ui-crudGrid-dataRow:first').data("dataItem"));
                })
                .end();
    }
});



jQuery.widget("ui.productForm", jQuery.ui.crudForm,
{
    options: {

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
});

/*
jQuery.widget("ui.productForm", jQuery.ui.crudForm,
{
    options: {

    },
    _create: function () {

        this._super();

        //this.options.productIdDOMId = jQuery(this.element).find('input[data-fieldItem="productId"]');
        //this.options.productTypeDOMId = jQuery(this.element).find('select[data-fieldItem="productType"]');
    },
    _init: function () {

        this._super();

        var self = this;

        jQuery(this.element)
            .find(':input')
            .change(function () {
                jQuery(this)
                    .parents('div.ui-widgetModelItem:first')
                        .find('div.ui-widgetModel-inputError:first')
                            .html('')
                            .addClass('ui-hidden')
                        .end();

                var $form = jQuery(this).parents('div.ui-productCrud-form-type:first');

                // si todos los errores estan escondidos
                var hideSummaryErrors =
                    $form.find('div.ui-widgetModel-inputError.ui-hidden').length ==
                    $form.find('div.ui-widgetModel-inputError').length;

                if (hideSummaryErrors === true) {
                    self._trigger('errorHide', null, null);
                }
            });

        self._done();
    },
    destroy: function () {

        this._super();
    },
    _formButtonsCustomTemplate: function () {
        return '';
    },
    val: function () {

        var self = this;

        var dataItem = jQuery(this.element).data('dataItem');

        var formValues = [];

        jQuery('div.ui-productCrud-form-type')
            .find('div[data-fielditem]')
                .each(function () {
                    var name = jQuery(this).attr('data-fielditem');
                    var value = jQuery('#' + name).val();
                    formValues.push({ Key: name, Value: value });
                });

        return formValues;
    },
    bind: function (dataItem) {

        var self = this;

        try {

            console.log("xxxxxxxxxxxxxxxxxxxx");
            console.log(dataItem);

            jQuery(this.element).data('dataItem', dataItem);

            this._bindCommonData(dataItem);


            // do data binding
            for (var prop in dataItem.DetailExtended) {
                jQuery('#' + prop).val(dataItem.DetailExtended[prop]);
            }

            self._trigger('dataBound', null, dataItem);

        } catch (e) {
            console.log(e);
            self._trigger('errorDisplay', null, "Ha ocurrido un error en el formulario");
        }
    },
    _bindCommonData: function (dataItem) {

        jQuery(this.element)
            .find('div.ui-productCrud-form-searchOutput')
                .find('div[data-fieldItem="productId"]')
                    .html(dataItem.productId)
                .end()
                .find('div[data-fieldItem="nombre"]')
                    .html(dataItem.nombre)
                .end()
                .find('div[data-fieldItem="productTypeDesc"]')
                    .html(dataItem.productTypeDesc)
                .end()
                .find('div[data-fieldItem="fechaDesde"]')
                    .html(dataItem.fechaDesde !== null ? Globalize.format(dataItem.fechaDesde, 'd') : '')
                .end()
                .find('div[data-fieldItem="fechaHasta"]')
                    .html(dataItem.fechaHasta !== null ? Globalize.format(dataItem.fechaHasta, 'd') : '')
                .end()
            .end();
    },
    _bindModelValidation: function (modelValidation) {

        var $form = jQuery('div.ui-productCrud-form-type-' + jQuery(this.element).data('dataItem').ProductParentType.Id);

        $form.find('div.ui-widgetModel-inputError')
                .addClass('ui-hidden')
                .html('');

        var setError = function ($elem, errorsArray) {
            $elem
                .find('div.ui-widgetModel-inputError')
                .html(errorsArray.join('<br />'))
                .removeClass('ui-hidden');
        };

        for (var i = 0; i < modelValidation.length; i++) {

            $form.find('div[data-widgetmodelitem-id="' + modelValidation[i].Id + '"]:first')
                .each(setError(jQuery(this), modelValidation[i].Errors));
        }

    },
    _dfdSave: function () {

        var self = this;
        var dfd = jQuery.Deferred();

        dfd.notify("Guardando informacion del producto...");

        var viewModel = jQuery(self.element).data('dataItem');
        viewModel.FormDataPost = this.val();

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
                            self._bindModelValidation(result.Data.ModelState);
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
    }

});
*/