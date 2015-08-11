define([
    "scripts/Template.App.ClientApp",
    "crossLayer/models/dataResult",
    "crossLayer/models/dataResultPaginated"
],
    function (clientApp, DataResult, DataResultPaginated) {

        var customerAjax = {
            ajax: {
                _ajaxBaseAddress: null,
                _ajaxMergeConfig: null,
                _fakeDataGrid: null,
                _fakeDataGridInit: function () {

                    customerAjax.ajax._fakeDataGrid = [];

                    for (var i = 0; i < 1000; i++) {
                        customerAjax.ajax._fakeDataGrid.push({
                            customerCardId: Array(11).join(i.toString()),
                            //fechaAlta: new Date(),
                            //fechaNacimiento: new Date(),
                            customerId: i,
                            customerName: "{0} {1}".format(clientApp.i18n.texts.get("Views.Crud.Person"), i),
                            //oficinaNombre: "Bcn",
                            //oficinaOrigen: i,
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
                //customerSearchForEdit: function (dataItem) {

                //    var self = this;
                //    var dfd = jQuery.Deferred();
                //    var dataResult = null;

                //    for (var i = 0; i < customerAjax.ajax._fakeDataGrid.length; i++) {
                //        if (customerAjax.ajax._fakeDataGrid[i].id === dataItem.id) {

                //            var dataObj = jQuery.extend({},
                //                            customerAjax.ajax._fakeDataGrid[i],
                //                            {
                //                                editData: customerAjax.ajax._fakeDataGrid[i]
                //                            });

                //            dataResult = new DataResult(true, "", dataObj);
                //        }
                //    }

                //    setTimeout(function () { dfd.resolve(dataResult); }, customerAjax.ajax._fakeDelay);

                //    return dfd.promise();
                //},
                //customerSave: function (dataItem) {

                //    var dfd = jQuery.Deferred();

                //    var dataResult = null;
                //    var modelErrors = [];

                //    if (dataItem.formData.numDocumento === "") {
                //        modelErrors.push({ key: "numDocumento", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                //    }

                //    if (dataItem.formData.nombre === "") {
                //        modelErrors.push({ key: "nombre", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                //    }

                //    if (dataItem.formData.fechaNacimiento === "") {
                //        modelErrors.push({ key: "fechaNacimiento", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                //    }


                //    if (modelErrors.length > 0) {
                //        dataResult = new DataResult(
                //            false,
                //            clientApp.i18n.texts.get("Views.Crud.ErrorExistsInForm"),
                //            {
                //                modelState: modelErrors
                //            });
                //    }
                //    else {
                //        // Simulate saving data
                //        customerAjax.ajax._fakeDataGrid[dataItem.id].numDocumento = dataItem.formData.numDocumento;
                //        customerAjax.ajax._fakeDataGrid[dataItem.id].nombre = dataItem.formData.nombre;
                //        customerAjax.ajax._fakeDataGrid[dataItem.id].fechaNacimiento = dataItem.formData.fechaNacimiento;
                //        // Simulate retrieving data from server
                //        dataItem.editData = customerAjax.ajax._fakeDataGrid[dataItem.id];
                //        // Simulate server response
                //        dataItem.formData = undefined;
                //        // return result
                //        dataResult = new DataResult(true, clientApp.i18n.texts.get("Views.Crud.ProductSaved"), dataItem);
                //    }

                //    setTimeout(function () { dfd.resolve(dataResult); }, customerAjax.ajax._fakeDelay);

                //    return dfd.promise();
                //},
            },
            cache: {

            }
        };

        return customerAjax;

    });