var customerAjax = {
    ajax: {
        _ajaxBaseAddress: "../../Controllers/CirDataEntryController.aspx/",
        _ajaxMergeConfig: function (ajaxProperties) {

            var _ajaxOptions = {
                cache: false,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            };

            return jQuery.extend({}, _ajaxOptions, ajaxProperties);
        },
        customerSearch: function (filter) {

            var self = this;
            var dfd = jQuery.Deferred();


            var ajaxConfig = self._ajaxMergeConfig({
                url: self._ajaxBaseAddress + 'CustomerSearch',
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
        }
    },
    cache: {

    }
};

jQuery.widget("ui.customer", jQuery.ui.crud,
{
    options: {
        filterModel: [{
            id: "nombre",
            displayName: "Nombre / Razón Social",
            input: { value: "" },
        }, {
            id: "dni",
            displayName: "Nº Documento",
            input: { value: "" },
        }],
        gridSearch: function (self) {

            var dfd = jQuery.Deferred();

            dfd.notify("Buscando clientes...");


            jQuery.when(customerAjax.ajax.customerSearch(self.options.gridFilterObject))
                .then(
                    function (result, statusText, jqXHR) {
                        if (result.IsValid) {
                            jQuery(self.options.gridDOMId).customerGrid('bind', result.Data);
                            dfd.resolve();
                        }
                        else {
                            dfd.reject(result.Message);
                        }
                    },
                    function (jqXHR, textStatus, errorThrown) {
                        dfd.reject("Error obteniendo clientes");
                    })
                .done(function () {

                });

            return dfd.promise();
        },
        gridFilterInit: function (self, filterOptions) {
            jQuery(self.options.gridFilterDOMId).customerFilter(jQuery.extend({}, filterOptions, { Model: self.options.filterModel }));
        },
        gridInit: function (self, gridOptions) {
            jQuery(self.options.gridDOMId).customerGrid(jQuery.extend(gridOptions, {
                onSelect: function (e, dataItem) {
                    self.errorHide();
                    self._trigger('onSelect', null, dataItem);
                }
            }));
        },
        gridButtonsGet: function (self, defaultButtons) {

            defaultButtons.unshift({
                id: "cancel",
                text: "Volver al filtro de productos",
                cssClass: "ui-cancel-button",
                icon: "ui-icon-circle-arrow-w",
                click: function (self) {
                    self._trigger('onCancel', null, null);
                }
            });

            for (var i = 0; i < defaultButtons.length; i++) {
                if (defaultButtons[i].id == "search") {
                    defaultButtons[i].text = "Buscar clientes";
                }
            }

            return defaultButtons;
        },
        formInit: function (self, formOptions) {
            self._done();
        },

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

jQuery.widget("ui.customerFilter", jQuery.ui.crudFilter,
{
    options: {
        Model: null,
        filterButtonsInit: function (self, defaultButtons) {
            for (var i = 0; i < defaultButtons.length; i++) {
                if (defaultButtons[i].id == "filter") {
                    defaultButtons[i].text = "Buscar clientes";
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

jQuery.widget("ui.customerGrid", jQuery.ui.crudGrid,
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
        return '<th class="ui-customerGrid-nombre">Nombre/Razón Social</th>' +
                '<th class="ui-customerGrid-oficinaNombre">Oficina</th>' +
                '<th class="ui-customerGrid-NumDocumento">NIF</th>' +
                '<th class="ui-customerGrid-fechaAlta">Fecha Alta</th>' +
                '<th class="ui-customerGrid-fechaNacimiento">Fecha N/C</th>' +
                '<th class="ui-customerGrid-gridCommand"></th>';
    },
    _gridRowTemplate: function () {

        return '<td class="ui-customerGrid-nombre"></td>' +
                '<td class="ui-customerGrid-oficinaNombre"></td>' +
                '<td class="ui-customerGrid-NumDocumento"></td>' +
                '<td class="ui-customerGrid-fechaAlta"></td>' +
                '<td class="ui-customerGrid-fechaNacimiento"></td>' +
                '<td class="ui-customerGrid-gridCommand">' +
                    '<div class="ui-crudGrid-actionsColumn">' +
                        '<table>' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td class="ui-crudGrid-action">' +
                                        '<div class="ui-crudGrid-action-select ui-widget-content" title="Seleccionar">' +
                                            '<span class="ui-icon  ui-icon-circle-arrow-e"></span>' +
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

        templateRowSetValue($row.find('td.ui-customerGrid-oficinaNombre:first'), dataItem.oficinaNombre);
        templateRowSetValue($row.find('td.ui-customerGrid-NumDocumento:first'), dataItem.NumDocumento);
        templateRowSetValue($row.find('td.ui-customerGrid-nombre:first'), dataItem.nombre);
        templateRowSetValue($row.find('td.ui-customerGrid-fechaAlta:first'), dataItem.fechaAlta !== null ? Globalize.format(dataItem.fechaAlta, 'd') : '');
        templateRowSetValue($row.find('td.ui-customerGrid-fechaNacimiento:first'), dataItem.fechaNacimiento !== null ? Globalize.format(dataItem.fechaNacimiento, 'd') : '');
    },
    _bindRowEvents: function ($row, dataItem) {

        var self = this;

        $row.data("dataItem", dataItem)
            .find('div.ui-crudGrid-action-select')
                .click(function () {
                    self._trigger('onSelect', null, jQuery(this).parents('tr.ui-crudGrid-dataRow:first').data("dataItem"));
                })
                .end();
    }
});