define([
    "scripts/Template.App.Init",
    "crossLayer/models/dataResult",
    "crossLayer/models/dataResultPaginated"
],
    function (clientApp, DataResult, DataResultPaginated) {

        var crudAjaxOpts = {
            ajax: {
                _ajaxBaseAddress: null,
                _ajaxMergeConfig: null,
                _fakeDataGrid: null,
                _fakeDataGridInit: function () {

                    crudAjaxOpts.ajax._fakeDataGrid = [];

                    for (var i = 0; i < 100; i++) {
                        crudAjaxOpts.ajax._fakeDataGrid.push({
                            //subject: "{0} {1}".format(clientApp.i18n.texts.get("Arquia.Talks.History.Message"), i),
                            id: i,
                            subject: "{0} - {1}".format(clientApp.utils.guid(), i),
                            dateLastMessage: new Date(),
                        });
                    }
                },
                _fakeDelay: 1000,
                talkSearch: function (filter) {

                    var self = this;
                    var dfd = jQuery.Deferred();
                    var dataResult = new DataResultPaginated();

                    dataResult.isValid = true;
                    dataResult.data.totalRows = crudAjaxOpts.ajax._fakeDataGrid.length - 10;
                    dataResult.data.page = filter.page;
                    dataResult.data.pageSize = filter.pageSize;

                    for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
                        if (i < crudAjaxOpts.ajax._fakeDataGrid.length) {
                            dataResult.data.data.push(crudAjaxOpts.ajax._fakeDataGrid[i]);
                        }
                    }

                    setTimeout(function () { dfd.resolve(dataResult); }, crudAjaxOpts.ajax._fakeDelay);

                    return dfd.promise();
                },
                talkSearchForEdit: function (dataItem) {

                    var self = this;
                    var dfd = jQuery.Deferred();
                    var dataResult = null;

                    for (var i = 0; i < crudAjaxOpts.ajax._fakeDataGrid.length; i++) {
                        if (crudAjaxOpts.ajax._fakeDataGrid[i].id === dataItem.id) {


                            dataResult = {
                                data: jQuery.extend({},
                                            crudAjaxOpts.ajax._fakeDataGrid[i],
                                            {
                                                editData: crudAjaxOpts.ajax._fakeDataGrid[i]
                                            }),
                                isValid: true,
                                message: null,
                                messageType: 0,
                            };
                        }
                    }



                    setTimeout(function () { dfd.resolve(dataResult); }, crudAjaxOpts.ajax._fakeDelay);

                    return dfd.promise();
                },
                formSave: function (dataItem) {

                    var dfd = jQuery.Deferred();

                    console.log(dataItem);

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

                        dataResult = new DataResult(false, clientApp.i18n.texts.get("Views.Crud.ErrorExistsInForm"), { modelState: modelErrors });
                    }
                    else {
                        // Simulate saving data
                        crudAjaxOpts.ajax._fakeDataGrid[dataItem.id].numDocumento = dataItem.formData.numDocumento;
                        crudAjaxOpts.ajax._fakeDataGrid[dataItem.id].nombre = dataItem.formData.nombre;
                        crudAjaxOpts.ajax._fakeDataGrid[dataItem.id].fechaNacimiento = dataItem.formData.fechaNacimiento;
                        // Simulate retrieving data from server
                        dataItem.editData = crudAjaxOpts.ajax._fakeDataGrid[dataItem.id];
                        // Simulate server response
                        dataItem.formData = undefined;
                        // return result
                        dataResult = new DataResult(true, clientApp.i18n.texts.get("Views.Crud.ProductSaved"), dataItem);
                    }

                    setTimeout(function () { dfd.resolve(dataResult); }, crudAjaxOpts.ajax._fakeDelay);

                    return dfd.promise();
                },
                talkAdd: function (dataItem) {

                    var dfd = jQuery.Deferred();
                    var dataResult = null;
                    var modelErrors = [];

                    if (((dataItem.subject.trim() === '') === true)) {
                        modelErrors.push({ key: "subject", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                    }

                    if (modelErrors.length > 0) {
                        dataResult = new DataResult(false, clientApp.i18n.texts.get("Views.Crud.ErrorExistsInForm"), { modelState: modelErrors });
                    }
                    else {
                        // Simulate saving data
                        var newId = crudAjaxOpts.ajax._fakeDataGrid.length;
                        crudAjaxOpts.ajax._fakeDataGrid.push({
                            id: newId,
                            subject: dataItem.subject,
                            dateLastMessage: new Date(),
                        });

                        // Simulate retrieving data from server
                        dataItem.editData = crudAjaxOpts.ajax._fakeDataGrid[newId];
                        // Simulate server response
                        dataItem.formData = undefined;
                        // return result
                        dataResult = new DataResult(true, clientApp.i18n.texts.get("Arquia.Talks.Subject.NewSubjectAdded"), dataItem);
                    }

                    setTimeout(function () { dfd.resolve(dataResult); }, crudAjaxOpts.ajax._fakeDelay);

                    return dfd.promise();
                }
            },
            cache: {

            }
        };

        crudAjaxOpts.ajax._fakeDataGridInit();

        return crudAjaxOpts;

    });