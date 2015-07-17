define([
    "scripts/Template.App.Init",
    "crossLayer/models/dataResultPaginated"
],
    function (clientApp, DataResultPaginated) {

        var customerAjax = {
            ajax: {
                _ajaxBaseAddress: null,
                _ajaxMergeConfig: null,
                _fakeDataGrid: null,
                _fakeDataGridInit: function () {

                    customerAjax.ajax._fakeDataGrid = [];

                    for (var i = 0; i < 100; i++) {
                        customerAjax.ajax._fakeDataGrid.push({
                            //subject: "{0} {1}".format(clientApp.i18n.texts.get("Arquia.Talks.History.Message"), i),
                            subject: "{0} - {1}".format(clientApp.utils.guid(), i),
                            dateLastMessage: new Date(),
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

                    var dataResult = new DataResultPaginated();
                    dataResult.isValid = true;
                    dataResult.data.totalRows = customerAjax.ajax._fakeDataGrid.length - 10;
                    dataResult.data.page = filter.page;
                    dataResult.data.pageSize = filter.pageSize;
                    
                    for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
                        if (i < customerAjax.ajax._fakeDataGrid.length) {
                            dataResult.data.data.push(customerAjax.ajax._fakeDataGrid[i]);
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
                                data: jQuery.extend({},
                                            customerAjax.ajax._fakeDataGrid[i],
                                            {
                                                editData: customerAjax.ajax._fakeDataGrid[i]
                                            }),
                                isValid: true,
                                message: null,
                                messageType: 0,
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

                    if (dataItem.formData.numDocumento === "") {
                        modelErrors.push({ key: "numDocumento", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                    }

                    if (dataItem.formData.nombre === "") {
                        modelErrors.push({ key: "nombre", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                    }

                    if (dataItem.formData.fechaNacimiento === "") {
                        modelErrors.push({ key: "fechaNacimiento", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                    }


                    if (modelErrors.length > 0) {
                        dataResult = {
                            data: { ModelState: modelErrors },
                            isValid: false,
                            message: clientApp.i18n.texts.get("Views.Crud.ErrorExistsInForm"),
                        };
                    }
                    else {
                        // Simulate saving data
                        customerAjax.ajax._fakeDataGrid[dataItem.id].numDocumento = dataItem.formData.numDocumento;
                        customerAjax.ajax._fakeDataGrid[dataItem.id].nombre = dataItem.formData.nombre;
                        customerAjax.ajax._fakeDataGrid[dataItem.id].fechaNacimiento = dataItem.formData.fechaNacimiento;
                        // Simulate retrieving data from server
                        dataItem.editData = customerAjax.ajax._fakeDataGrid[dataItem.id];
                        // Simulate server response
                        dataItem.formData = undefined;
                        // return result
                        dataResult = {
                            data: dataItem,
                            isValid: true,
                            message: clientApp.i18n.texts.get("Views.Crud.ProductSaved"),
                            messageType: 0,
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