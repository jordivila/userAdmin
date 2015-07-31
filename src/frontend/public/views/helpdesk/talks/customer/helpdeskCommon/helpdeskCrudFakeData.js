define([
    "scripts/Template.App.ClientApp",
    "crossLayer/models/dataResult",
    "crossLayer/models/dataResultPaginated"
],
    function (clientApp, DataResult, DataResultPaginated) {

        var crudAjaxOpts = {
            ajax: {
                _ajaxBaseAddress: null,
                _ajaxMergeConfig: null,

                _fakeCurrentUser: null,    // this should be set at backend runtime by getting auth info
                _fakeDataGridTalks: null,
                _fakeDataGridMessages: null,
                _fakeDataGridPeople: null,
                //_fakeDataGridPeopleLastRead: [],
                /*
                _fakeDataGridPeopleLastReadAdd: function (idTalk, idPeople, idMessage) {

                    var index = null;

                    for (var i = 0; i < crudAjaxOpts.ajax._fakeDataGridPeopleLastRead.length; i++) {
                        if (crudAjaxOpts.ajax._fakeDataGridPeopleLastRead[i].idTalk === idTalk) {
                            if (crudAjaxOpts.ajax._fakeDataGridPeopleLastRead[i].idPeople === idPeople) {
                                index = i;
                            }
                        }
                    }

                    if (index === null) {
                        // el registro no existe. Lo creamos

                        crudAjaxOpts.ajax._fakeDataGridPeopleLastRead.push({
                            idTalk: idTalk,
                            idPeople: idPeople,
                            idMessage: idMessage,
                            dateRead: new Date()
                        });
                    }
                    else {
                        crudAjaxOpts.ajax._fakeDataGridPeopleLastRead[index].idMessage = idMessage;
                        crudAjaxOpts.ajax._fakeDataGridPeopleLastRead[index].dateRead = new Date();
                    }

                },
                */
                _fakeDataGridPeopleFindById: function (idPeople) {

                    var result = null;

                    for (var i = 0; i < crudAjaxOpts.ajax._fakeDataGridPeople.length; i++) {
                        if (crudAjaxOpts.ajax._fakeDataGridPeople[i].idPeople === idPeople) {
                            result = crudAjaxOpts.ajax._fakeDataGridPeople[i];
                        }
                    }

                    return result;
                },
                _fakeDataGridPeopleInvolved: null,

                _fakeMessagesGetDateLastMessage: function (idTalk) {

                    // busca dentro del maestro de mensajes cual es el ultimo
                    // este metodo estara en backend

                    var result = null;

                    for (var i = 0; i < crudAjaxOpts.ajax._fakeDataGridMessages.length; i++) {

                        if (crudAjaxOpts.ajax._fakeDataGridMessages[i].idTalk === idTalk) {
                            if (result === null) {
                                result = crudAjaxOpts.ajax._fakeDataGridMessages[i].datePosted;
                            }

                            if (result < crudAjaxOpts.ajax._fakeDataGridMessages[i].datePosted) {
                                result = crudAjaxOpts.ajax._fakeDataGridMessages[i].datePosted;
                            }
                        }
                    }

                    return result;
                },
                _fakeDataInit: function () {

                    crudAjaxOpts.ajax._fakeDataGridTalks = [];
                    crudAjaxOpts.ajax._fakeDataGridMessages = [];
                    crudAjaxOpts.ajax._fakeDataGridPeople = function () {

                        return [
                            {
                                idPeople: 0,
                                idPerson: 1,    //identificaador de la persona en ORG_TB_EMLPEADOS
                                isEmployee: true,

                                name: "Empleado 1" // this is not part of the BDD model. instead will be added ArquiaXXI o ArquiaRed BBDD
                            },
                            {
                                idPeople: 1,
                                idPerson: 1,    //identificador de la persona en PEF_TB_personaFisica
                                isEmployee: false,

                                name: "Cliente 1" // this is not part of the BDD model. instead will be added ArquiaXXI o ArquiaRed BBDD
                            }];

                    }();
                    crudAjaxOpts.ajax._fakeCurrentUser = crudAjaxOpts.ajax._fakeDataGridPeople[1].idPeople;
                    crudAjaxOpts.ajax._fakeDataGridPeopleInvolved = [];


                    var calcDatePosted = function (days) {
                        var k = new Date();
                        k.setDate(k.getDate() - days);
                        return k;
                    };


                    for (var i = 0; i < 78; i++) {

                        //create a talk
                        crudAjaxOpts.ajax._fakeDataGridTalks.push({
                            //subject: "{0} {1}".format(clientApp.i18n.texts.get("Helpdesk.Talks.History.Message"), i),
                            idTalk: i,
                            subject: "{0} - {1}".format(clientApp.utils.guid(), i),
                        });

                        //add an employee to that talk
                        crudAjaxOpts.ajax._fakeDataGridPeopleInvolved.push({
                            idTalk: i,
                            idPeople: crudAjaxOpts.ajax._fakeDataGridPeople[0].idPeople
                        });

                        //add a customer to that talk
                        crudAjaxOpts.ajax._fakeDataGridPeopleInvolved.push({
                            idTalk: i,
                            idPeople: crudAjaxOpts.ajax._fakeDataGridPeople[1].idPeople
                        });

                        // add messages to that talk
                        for (var j = 0; j < 10; j++) {

                            var messageInstance = {
                                idMessage: crudAjaxOpts.ajax._fakeDataGridMessages.length,
                                idTalk: i,
                                idPeople: (j % 2 === 0) ? crudAjaxOpts.ajax._fakeDataGridPeople[0].idPeople : crudAjaxOpts.ajax._fakeDataGridPeople[1].idPeople,
                                message: clientApp.utils.replaceAll('-', ' ', clientApp.utils.guid()),
                                datePosted: calcDatePosted(crudAjaxOpts.ajax._fakeDataGridMessages.length)
                            };

                            // add the message
                            crudAjaxOpts.ajax._fakeDataGridMessages.push(messageInstance);

                            // add message as a read one. As far as the message is written by the current idPeople 
                            //crudAjaxOpts.ajax._fakeDataGridPeopleLastReadAdd(
                            //    messageInstance.idTalk,
                            //    messageInstance.idPeople,
                            //    messageInstance.idMessage);
                        }
                    }



                },
                _fakeDelay: 1000,
                _fakeConversationsPartner: function () {

                    var _doConversationsPartner = function (cb) {

                        // imitate conversations adding messages as an employee
                        for (var i = 0; i < crudAjaxOpts.ajax._fakeDataGridTalks.length; i++) {

                            crudAjaxOpts.ajax._fakeDataGridMessages.push({
                                idMessage: crudAjaxOpts.ajax._fakeDataGridMessages.length,
                                idTalk: crudAjaxOpts.ajax._fakeDataGridTalks[i].idTalk,
                                idPeople: 0, // --> employee
                                message: clientApp.utils.replaceAll('-', ' ', clientApp.utils.guid()),
                                datePosted: new Date(),
                            });

                        }

                        setTimeout(function () { crudAjaxOpts.ajax._fakeConversationsPartner(); }, 1);
                    };

                    setTimeout(function () { _doConversationsPartner(); }, 3000);
                },
                _fakeMessagesByidTalkGet: function (idTalk) {

                    var result = [];

                    for (var i = 0; i < crudAjaxOpts.ajax._fakeDataGridMessages.length; i++) {
                        if (crudAjaxOpts.ajax._fakeDataGridMessages[i].idTalk === idTalk) {
                            result.push(crudAjaxOpts.ajax._fakeDataGridMessages[i]);
                        }
                    }

                    result.sort(function (a, b) {
                        return parseInt(a.idMessage) - parseInt(b.idMessage);
                    });

                    return result;
                },
                _fakeMessageObjectToViewModel: function (message) {

                    var whoPosted = crudAjaxOpts.ajax._fakeDataGridPeopleFindById(message.idPeople);

                    return {
                        idMessage: message.idMessage,
                        idTalk: message.idTalk,
                        message: message.message,
                        datePosted: message.datePosted,
                        whoPosted: {
                            name: whoPosted.name,
                            isEmployee: whoPosted.isEmployee,
                            isCurrentUser: message.idPeople === crudAjaxOpts.ajax._fakeCurrentUser
                        }
                    };

                },

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
                            dataResult.data.data.push({
                                idTalk: crudAjaxOpts.ajax._fakeDataGridTalks[i].idTalk,
                                subject: crudAjaxOpts.ajax._fakeDataGridTalks[i].subject,
                                dateLastMessage: crudAjaxOpts.ajax._fakeMessagesGetDateLastMessage(crudAjaxOpts.ajax._fakeDataGridTalks[i].idTalk),
                                nMessagesUnread: i
                            });
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
                            idTalk: newId,
                            subject: dataItem.subject,
                            //dateLastMessage: new Date(),
                        });

                        // Simulate retrieving data from server
                        dataItem.editData = crudAjaxOpts.ajax._fakeDataGridTalks[newId];
                        // Simulate server response
                        dataItem.formData = undefined;
                        // return result
                        dataResult = new DataResult(true, clientApp.i18n.texts.get("Helpdesk.Talks.Subject.NewSubjectAdded"), dataItem);
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
                        // In case message is empty then fail silently at backend
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
                            idPeople: crudAjaxOpts.ajax._fakeCurrentUser, // this should be set at server runtime using authentication info
                            message: dataItem.message,
                            datePosted: new Date(),
                        });

                        // Simulate retrieving data from server
                        dataItem = jQuery.extend({}, crudAjaxOpts.ajax._fakeDataGridMessages[newId], {});
                        // return result
                        dataResult = new DataResult(true, clientApp.i18n.texts.get("Helpdesk.Talks.Subject.NewMessageAdded"), dataItem);
                    }


                    setTimeout(function () { dfd.resolve(dataResult); }, crudAjaxOpts.ajax._fakeDelay);

                    return dfd.promise();

                },
                messageGetAll: function (idTalk) {

                    // simulate pagination. BUT set pageSize to a huge number
                    // as far as client message page is not indended to be paginated
                    // at least first version

                    var filter = {
                        page: 0,
                        pageSize: 1000,
                        filter: {
                            idTalk: idTalk
                        }
                    };

                    var self = this;
                    var dfd = jQuery.Deferred();
                    var dataResult = new DataResultPaginated();

                    // as far as this should be executed at server runtime:
                    // check first if current request user has permission to see this conversation
                    // this will be hardcodeed just to make fake easier

                    var hasPermission = true;

                    if (hasPermission) {

                        var messagesByIdTalk = crudAjaxOpts.ajax._fakeMessagesByidTalkGet(idTalk);

                        for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
                            if (i < messagesByIdTalk.length) {
                                dataResult.data.data.push(crudAjaxOpts.ajax._fakeMessageObjectToViewModel(messagesByIdTalk[i]));
                            }
                        }

                        dataResult.isValid = true;
                        dataResult.data.totalRows = messagesByIdTalk.length;
                        dataResult.data.page = filter.page;
                        dataResult.data.pageSize = filter.pageSize;
                    }
                    else {

                        dataResult.isValid = false;
                        dataResult.message = clientApp.i18n.texts.get("GeneralTexts.PermissionDenied");
                    }

                    setTimeout(function () { dfd.resolve(dataResult); }, crudAjaxOpts.ajax._fakeDelay);

                    return dfd.promise();
                },
                messageGetUnread: function (idTalk, idMessageLastRead) {

                    // simulate pagination. BUT set pageSize to a huge number
                    // as far as client message page is not indended to be paginated
                    // at least first version

                    var filter = {
                        page: 0,
                        pageSize: 1000,
                        filter: {
                            idTalk: idTalk,
                            idMessageLastRead: idMessageLastRead
                        }
                    };

                    var self = this;
                    var dfd = jQuery.Deferred();
                    var dataResult = new DataResultPaginated();


                    // as far as this should be executed at server runtime:
                    // check first if current request user has permission to see this conversation
                    // this will be hardcodeed just to make fake easier

                    var hasPermission = true;


                    if (hasPermission) {

                        var messagesAlreadyRead = function (arrayItem) {
                            return arrayItem.idMessage > idMessageLastRead;
                        };
                        var messagesFromOtherUsers = function (arrayItem) {

                            var viewModeledItem = crudAjaxOpts.ajax._fakeMessageObjectToViewModel(arrayItem);

                            return viewModeledItem.whoPosted.isCurrentUser === false;
                        };

                        var messagesByIdTalk = [];
                        messagesByIdTalk = crudAjaxOpts.ajax._fakeMessagesByidTalkGet(idTalk);
                        messagesByIdTalk = messagesByIdTalk.filter(messagesAlreadyRead);
                        messagesByIdTalk = messagesByIdTalk.filter(messagesFromOtherUsers);

                        for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
                            if (i < messagesByIdTalk.length) {
                                dataResult.data.data.push(crudAjaxOpts.ajax._fakeMessageObjectToViewModel(messagesByIdTalk[i]));
                            }
                        }

                        dataResult.isValid = true;
                        dataResult.data.totalRows = messagesByIdTalk.length;
                        dataResult.data.page = filter.page;
                        dataResult.data.pageSize = filter.pageSize;
                    }
                    else {

                        dataResult.isValid = false;
                        dataResult.message = clientApp.i18n.texts.get("GeneralTexts.PermissionDenied");
                    }

                    setTimeout(function () { dfd.resolve(dataResult); }, crudAjaxOpts.ajax._fakeDelay);

                    return dfd.promise();
                },
            },
            cache: {

            }
        };

        crudAjaxOpts.ajax._fakeDataInit();
        crudAjaxOpts.ajax._fakeConversationsPartner();

        return crudAjaxOpts;

    });