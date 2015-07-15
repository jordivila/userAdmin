define([
    "scripts/Template.App.Init"
],
    function (clientApp) {

        var customerAjax = {
            ajax: {
                _ajaxBaseAddress: null,
                _ajaxMergeConfig: null,
                _fakeDataGrid: null,
                _fakeDataGridInit: function () {

                    customerAjax.ajax._fakeDataGrid = [];

                    for (var i = 0; i < 1000; i++) {
                        customerAjax.ajax._fakeDataGrid.push({
                            //subject: "{0} {1}".format(clientApp.i18n.texts.get("Arquia.Talks.History.Message"), i),
                            subject: "{0} {1}".format("sk dhskjdh ksjdh ksjdhksjdh ksjdhkjjhksjdh kjhkjhkjsdh sjkdh kshdkjshdk", i),
                            dateLastMessage: new Date(),


                            NumDocumento: Array(11).join(i.toString()),
                            fechaAlta: new Date(),
                            fechaNacimiento: new Date(),
                            id: i,
                            nombre: "{0} {1}".format(clientApp.i18n.texts.get("Views.Crud.Person"), i),
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


                    console.log(filter);

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
                },
                customerSearchForEdit: function (dataItem) {

                    var self = this;
                    var dfd = jQuery.Deferred();
                    var dataResult = null;

                    for (var i = 0; i < customerAjax.ajax._fakeDataGrid.length; i++) {
                        if (customerAjax.ajax._fakeDataGrid[i].id === dataItem.id) {


                            dataResult = {
                                Data: jQuery.extend({},
                                            customerAjax.ajax._fakeDataGrid[i],
                                            {
                                                EditData: customerAjax.ajax._fakeDataGrid[i]
                                            }),
                                IsValid: true,
                                Message: null,
                                MessageType: 0,
                            };
                        }
                    }



                    setTimeout(function () { dfd.resolve(dataResult); }, customerAjax.ajax._fakeDelay);

                    return dfd.promise();
                },
                customerSave: function (dataItem) {

                    var dfd = jQuery.Deferred();

                    var dataResult = null;
                    var modelErrors = [];

                    if (dataItem.FormData.NumDocumento === "") {
                        modelErrors.push({ key: "NumDocumento", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                    }

                    if (dataItem.FormData.Nombre === "") {
                        modelErrors.push({ key: "Nombre", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                    }

                    if (dataItem.FormData.fechaNacimiento === "") {
                        modelErrors.push({ key: "fechaNacimiento", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                    }


                    if (modelErrors.length > 0) {
                        dataResult = {
                            Data: { ModelState: modelErrors },
                            IsValid: false,
                            Message: clientApp.i18n.texts.get("Views.Crud.ErrorExistsInForm"),
                        };
                    }
                    else {
                        // Simulate saving data
                        customerAjax.ajax._fakeDataGrid[dataItem.id].NumDocumento = dataItem.FormData.NumDocumento;
                        customerAjax.ajax._fakeDataGrid[dataItem.id].nombre = dataItem.FormData.nombre;
                        customerAjax.ajax._fakeDataGrid[dataItem.id].fechaNacimiento = dataItem.FormData.fechaNacimiento;
                        // Simulate retrieving data from server
                        dataItem.EditData = customerAjax.ajax._fakeDataGrid[dataItem.id];
                        // Simulate server response
                        dataItem.FormData = undefined;
                        // return result
                        dataResult = {
                            Data: dataItem,
                            IsValid: true,
                            Message: clientApp.i18n.texts.get("Views.Crud.ProductSaved"),
                            MessageType: 0,
                        };
                    }

                    setTimeout(function () { dfd.resolve(dataResult); }, customerAjax.ajax._fakeDelay);

                    return dfd.promise();
                },
            },
            cache: {

            }
        };

        return customerAjax;

    });