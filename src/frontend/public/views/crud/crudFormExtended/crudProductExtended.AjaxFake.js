define([
    "scripts/Template.App.Init",
],
function (VsixMvcAppResult) {


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

                VsixMvcAppResult.Globalizer.get()
                 .done(function (Globalize) {


                     var dataResult = null;
                     var modelErrors = [];

                     if (dataItem.FormData.SomeStringFromList === "") {
                         modelErrors.push({ key: "SomeStringFromList", value: ["este es un campo requerido"] });
                     }

                     if (dataItem.FormData.SomeDate === "") {
                         modelErrors.push({ key: "SomeDate", value: ["este es un campo requerido"] });
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

                         console.log("productSave");
                         console.log(dataItem.FormData.SomeDate);


                         // Simulate saving data
                         dataItem.EditData.SomeBoolean = dataItem.FormData.SomeBoolean;
                         dataItem.EditData.SomeBooleanNullable = dataItem.FormData.SomeBooleanNullable;
                         dataItem.EditData.SomeCustomValue = dataItem.FormData.SomeCustomValue;
                         dataItem.EditData.SomeDate = dataItem.FormData.SomeDate !== "" ? Globalize.dateParser()(dataItem.FormData.SomeDate) : null;
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

                 });

                return dfd.promise();
            }
        },
        cache: {
            productSearchTypes: null
        }
    };

    return productAjax;

});