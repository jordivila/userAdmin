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
                _fakeDataGridTalks: null,
                _fakeDataGridMessages: null,
                _fakeDataInit: function () {

                    crudAjaxOpts.ajax._fakeDataGridTalks = [];
                    crudAjaxOpts.ajax._fakeDataGridMessages = [];

                    for (var i = 0; i < 100; i++) {

                        crudAjaxOpts.ajax._fakeDataGridTalks.push({
                            //subject: "{0} {1}".format(clientApp.i18n.texts.get("Arquia.Talks.History.Message"), i),
                            idTalk: i,
                            subject: "{0} - {1}".format(clientApp.utils.guid(), i),
                            dateLastMessage: new Date(),
                        });

                        for (var j = 0; j < 56; j++) {
                            crudAjaxOpts.ajax._fakeDataGridMessages.push({
                                idMessage: crudAjaxOpts.ajax._fakeDataGridMessages.length,
                                idTalk: i,
                                idPeopleInvolved: 0,
                                message: "esto es un mensaje de prueba",
                                datePosted: new Date()
                            });
                        }

                    }
                },
                _fakeDelay: 1000,

                talkSearch: function (filter) {

                    var self = this;
                    var dfd = jQuery.Deferred();
                    var dataResult = new DataResultPaginated();

                    dataResult.isValid = true;
                    dataResult.data.totalRows = crudAjaxOpts.ajax._fakeDataGridTalks.length - 10;
                    dataResult.data.page = filter.page;
                    dataResult.data.pageSize = filter.pageSize;

                    for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
                        if (i < crudAjaxOpts.ajax._fakeDataGridTalks.length) {
                            dataResult.data.data.push(crudAjaxOpts.ajax._fakeDataGridTalks[i]);
                        }
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
                        var newId = crudAjaxOpts.ajax._fakeDataGridTalks.length;
                        crudAjaxOpts.ajax._fakeDataGridTalks.push({
                            id: newId,
                            subject: dataItem.subject,
                            dateLastMessage: new Date(),
                        });

                        // Simulate retrieving data from server
                        dataItem.editData = crudAjaxOpts.ajax._fakeDataGridTalks[newId];
                        // Simulate server response
                        dataItem.formData = undefined;
                        // return result
                        dataResult = new DataResult(true, clientApp.i18n.texts.get("Arquia.Talks.Subject.NewSubjectAdded"), dataItem);
                    }

                    setTimeout(function () { dfd.resolve(dataResult); }, crudAjaxOpts.ajax._fakeDelay);

                    return dfd.promise();
                },
                messageAdd: function (dataItem) {



                    // Recordar !!!!
                    // solo en este metodo !!!!
                    // Sobreescribir los defaults de jQuery ajax
                    // para que no saquen el progress bar
                    // ya que la pantalla que utiliza el metodo 
                    // utiliza otro tipo de indicativo a la hora de enseñar progreso


                    var dfd = jQuery.Deferred();
                    var dataResult = null;
                    var modelErrors = [];

                    if (((dataItem.message.trim() === '') === true)) {
                        // do not validate
                        // In case message is empty then fail silently
                        // as far as client validation should occur before arrive here

                        //modelErrors.push({ key: "message", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                    }




                    if (modelErrors.length > 0) {
                        dataResult = new DataResult(false, clientApp.i18n.texts.get("Views.Crud.ErrorExistsInForm"), { modelState: modelErrors });
                    }
                    else {
                        // Simulate saving data
                        var newId = crudAjaxOpts.ajax._fakeDataGridMessages.length;

                        crudAjaxOpts.ajax._fakeDataGridMessages.push({
                            idMessage: newId,
                            idTalk: dataItem.idTalk,
                            idPeopleInvolved: 0, // this should be set at server runtime using authentication info
                            message: dataItem.message,
                            datePosted: new Date(),
                        });

                        // Simulate retrieving data from server
                        dataItem.editData = crudAjaxOpts.ajax._fakeDataGridMessages[newId];
                        // Simulate server response
                        dataItem.formData = undefined;
                        // return result
                        dataResult = new DataResult(true, clientApp.i18n.texts.get("Arquia.Talks.Subject.NewMessageAdded"), dataItem);
                    }


                    setTimeout(function () { dfd.resolve(dataResult); }, crudAjaxOpts.ajax._fakeDelay);

                    return dfd.promise();

                },
                messageGetUnread: function () {





                    




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
                        var newId = crudAjaxOpts.ajax._fakeDataGridTalks.length;
                        crudAjaxOpts.ajax._fakeDataGridTalks.push({
                            id: newId,
                            subject: dataItem.subject,
                            dateLastMessage: new Date(),
                        });

                        // Simulate retrieving data from server
                        dataItem.editData = crudAjaxOpts.ajax._fakeDataGridTalks[newId];
                        // Simulate server response
                        dataItem.formData = undefined;
                        // return result
                        dataResult = new DataResult(true, clientApp.i18n.texts.get("Arquia.Talks.Subject.NewSubjectAdded"), dataItem);
                    }

                    setTimeout(function () { dfd.resolve(dataResult); }, crudAjaxOpts.ajax._fakeDelay);

                    return dfd.promise();


                },


            },
            cache: {

            }
        };

        crudAjaxOpts.ajax._fakeDataInit();

        return crudAjaxOpts;

    });