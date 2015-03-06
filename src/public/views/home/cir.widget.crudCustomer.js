/*
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
*/

var customerAjax = {
    ajax: {
        _ajaxBaseAddress: null,
        _ajaxMergeConfig: null,
        _fakeDataGrid: null,
        _fakeDataGridInit: function () {

            customerAjax.ajax._fakeDataGrid = [];

            for (var i = 0; i < 1000; i++) {
                customerAjax.ajax._fakeDataGrid.push({
                    NumDocumento: Array(11).join(i.toString()),
                    fechaAlta: new Date(),
                    fechaNacimiento: new Date(),
                    id: i,
                    nombre: "person {0}".format(i),
                    oficinaNombre: "Bcn",
                    oficinaOrigen: i,
                });
            }
        },
        _fakeDelay: 1000,
        customerSearch: function (filter) {

            var self = this;
            var dfd = jQuery.Deferred();


            if (customerAjax.ajax._fakeDataGrid === null) {
                customerAjax.ajax._fakeDataGridInit();
            }

            var dataResult = {
                "IsValid": true,
                "Message": "",
                "MessageType": 0,
                "Data":
                    {
                        "TotalRows": customerAjax.ajax._fakeDataGrid.length - 10,
                        "Page": filter.Page,
                        "PageSize": filter.PageSize,
                        "SortBy": "",
                        "SortAscending": false,
                        "Data": [],
                    }
            };

            for (var i = (filter.Page * filter.PageSize) ; i < ((filter.Page * filter.PageSize) + filter.PageSize) ; i++) {
                if (i < customerAjax.ajax._fakeDataGrid.length) {
                    dataResult.Data.Data.push(customerAjax.ajax._fakeDataGrid[i]);
                }
            }

            setTimeout(function () { dfd.resolve(dataResult); }, customerAjax.ajax._fakeDelay);

            return dfd.promise();
        }
    },
    cache: {

    }
};



var crudCustomerOptions = function () {

    return {
        filterModel: [{
            id: "nombre",
            displayName: "Nombre / Razón Social",
            input: { value: "" },
        }, {
            id: "dni",
            displayName: "Nº Documento",
            input: { value: "" },
        }],

        gridCustomOptions: {
            //example: see code below
            //onSelect: function (e, dataItem) {
            //    var $crudParent = jQuery(e.target).parents('div.ui-crud:first');
            //    $crudParent.customer('fireCustomEvent', dataItem);
            //}
        },
        gridSearchMethod: customerAjax.ajax.customerSearch,
        gridHeaderTemplate: function (crudGridWidget) {
            return '<th class="ui-customerGrid-nombre">Nombre/Razón Social</th>' +
                   '<th class="ui-customerGrid-NumDocumento">NIF</th>';
        },
        gridRowTemplate: function (crudGridWidget) {
            return '<td class="ui-customerGrid-nombre"><a href="javascript:void(0);"></a></td>' +
                    '<td class="ui-customerGrid-NumDocumento"></td>';
        },
        gridBindRowColumns: function (crudGridWidget, $row, dataItem) {

            var templateRowSetValue = function (node, valueString) {
                jQuery(node).attr('title', valueString).html(valueString);
            };

            templateRowSetValue($row.find('td.ui-customerGrid-nombre:first').find('a'), dataItem.nombre);
            templateRowSetValue($row.find('td.ui-customerGrid-NumDocumento:first'), dataItem.NumDocumento);
        },
        gridBindRowEvents: function (crudGridWidget, $row, dataItem) {
            $row.data("dataItem", dataItem)
                .find('td.ui-customerGrid-nombre:first')
                    .find('a')
                        .click(function () {
                            crudGridWidget._trigger('onSelect', null, jQuery(this).parents('tr.ui-crudGrid-dataRow:first').data("dataItem"));
                        });

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

        },
    };
};