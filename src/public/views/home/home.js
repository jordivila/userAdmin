
(function ($) {

    VsixMvcAppResult.Ajax.HomePost = function (data, onOK, onKO, onComplete) {
        var jqxhr = jQuery.ajax({
            url: "/home",
            type: "POST",
            data: JSON.stringify(data),
            //dataType: "html",
            cache: false
        })
        .done(function (data, textStatus, jqXHR) {
            onOK(data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            onKO(jqXHR);
        })
        .always(function (jqXHR, textStatus, errorThrown) {
            onComplete();
        });
    };


    jQuery(document).ready(function () {
        VsixMvcAppResult.Widgets.PageOptions.onInit(function () {
            /*
            var modelItems = function () {
                return [{
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
                                .append('<p>some hidden value with custom widget functionality</p>')
                                .find('p:first')
                                    .click(function () {
                                        jQuery(widget).widgetModelItem('change');
                                    });
                        },
                        onItemValue: function (parent) {
                            return 2;
                        },
                    },
                },
                ];
            };

            var $modelForm = jQuery('#modelContainer').widgetModel({
                //widgetBase options
                allowClose: true,      // creates a close button on the top-right of a widget
                allowCollapse: true,   // creates a collapse button
                isCollapsed: false,     // initializes as a collapsed item
                onCollapsed: function (e, isVisible) {
                    console.log(isVisible);
                },
                //
                displayName: "Demo UI Controls",
                modelItems: modelItems()
            });

            jQuery('#modelButtons')
                .find('button')
                    .button()
                    .click(function () {
                        var modelValue = $modelForm.widgetModel('val');

                        VsixMvcAppResult.Ajax.HomePost(
                            modelValue,
                            function (data, textStatus, jqXHR) {
                                var keyValueArray = [];
                                for (var i = 0; i < data.data.length; i++) {
                                    if (jQuery.isArray(data.data[i].errors)) {
                                        keyValueArray.push({ key: data.data[i].id, value: data.data[i].errors });
                                    }
                                }
                                $modelForm.widgetModel('bindErrors', keyValueArray);
                            },
                            function (jqXHR, textStatus, errorThrown) {
                                console.log("HOMKE POST KO");
                            },
                            function (jqXHR, textStatus, errorThrown) {
                                console.log("HOMKE POST COMLPETED");
                            });
                    })
                .end();


            setTimeout(function () { return jQuery('#modelButtons').find('button').click(); }, 1000);
            */







            jQuery('div.ui-cirDataEntry:first').cirDataEntry();







        });
    });
})(jQuery);




/*FAKE CUSTOMERS*/
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
                        "TotalPages": null,
                        "TotalRows": customerAjax.ajax._fakeDataGrid.length - 10,
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

                dataResult.Data.Data.push(customerAjax.ajax._fakeDataGrid[i]);
            }

            setTimeout(function () { dfd.resolve(dataResult); }, customerAjax.ajax._fakeDelay);

            return dfd.promise();
        }
    },
    cache: {

    }
};
/*FAKE PRODUCTS*/
var productAjax = {
    ajax: {
        _ajaxBaseAddress: null,
        _ajaxMergeConfig: null,
        _fakeDataGrid: null,
        _fakeDataGridInit: function () {

            productAjax.ajax._fakeDataGrid = [];

            for (var i = 0; i < 1000; i++) {
                productAjax.ajax._fakeDataGrid.push({
                    dniCif: "X4752159Z",
                    fechaDesde: new Date(),
                    fechaHasta: new Date(),
                    nombre: "person {0}".format(i),
                    productId: i,
                    productType: "PRSP1",
                    productTypeDesc: "Prestamo garantia personal-1",
                });
            }
        },
        _fakeDelay: 1000,
        productSearch: function (filter) {

            var self = this;
            var dfd = jQuery.Deferred();


            if (productAjax.ajax._fakeDataGrid === null) {
                productAjax.ajax._fakeDataGridInit();
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
                if (productAjax.ajax._fakeDataGrid[i].productId === dataItem.productId)
                {
                    var productForEdit = jQuery.extend({}, productAjax.ajax._fakeDataGrid[i], { someEditInt: true });

                    dataResult = {
                        Data: productForEdit,
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

            var self = this;
            var dfd = jQuery.Deferred();


            dataResult = {
                Data: null,
                IsValid: true,
                Message: null,
                MessageType: 0,
            };

            setTimeout(function () { dfd.resolve(dataResult); }, productAjax.ajax._fakeDelay);

            return dfd.promise();
        }
    },
    cache: {
        productSearchTypes: null
    }
};

