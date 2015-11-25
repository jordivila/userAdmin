define([
    "scripts/Template.App.ClientApp",
    "crossLayer/models/dataResult",
    "crossLayer/models/dataResultPaginated",
    "pPromises",
],
    function (clientApp, DataResult, DataResultPaginated, P) {

        function CrudAjaxOpts() {

            var self = this;

            this.apiRoutes = {
                talkSearch: null,
                talkAdd: null,
                messageAdd: null,
                messageGetAll: null,
                messageGetUnread: null,

                talkGetById: null,
                talkSavedByEmployee: null,
                customerSearch: null,
                employeeSearch: null
            };

            this.ajax = {

                helpdeskCommonOptions: {
                    cache: false,
                    beforeSend: function (xhr, settings) {
                        //xhr.setRequestHeader("Authorization", "Basic " + btoa(helpdesk + ":" + user.password));
                        xhr.setRequestHeader("Authorization", "Basic " + btoa("helpdeskUsernameFake:helpdeskPasswordFake"));

                        console.log("argumentsargumentsargumentsargumentsarguments");
                        console.log(settings.url);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.history()));


                        if (jqXHR.status == 401) {
                            clientApp.template.loadByUrl('../unauthorize/');
                        }
                    }
                },
                talkSearch: function (filter) {

                    
                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax(jQuery.extend(self.ajax.helpdeskCommonOptions, {
                            url: self.apiRoutes.talkSearch,
                            type: "POST",
                            data: JSON.stringify(filter),
                            cache: false
                        }))
                    ];

                    P.all(a).nodeify(function (e, dataFromServer) {
                        if (e !== null) {
                            dfd.reject(e);
                        }
                        else {
                            var dataResult = new DataResultPaginated();
                            dataResult.clone(dataFromServer[0]);

                            for (var i = 0; i < dataResult.data.data.length; i++) {
                                if (dataResult.data.data[i].dateLastMessage) {
                                    // deserialize dates
                                    dataResult.data.data[i].dateLastMessage = new Date(dataResult.data.data[i].dateLastMessage);
                                }
                            }

                            dfd.resolve(dataResult);



                            //dfd.resolve(dataFromServer[0]);
                        }
                    });

                    return dfd.promise();
                },
                talkAdd: function (dataItem) {

                    
                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax(jQuery.extend(self.ajax.helpdeskCommonOptions, {
                            url: self.apiRoutes.talkAdd,
                            type: "POST",
                            data: JSON.stringify(dataItem),
                            cache: false
                        }))
                    ];

                    P.all(a).nodeify(function (e, dataFromServer) {
                        if (e !== null) {
                            dfd.reject(e);
                        }
                        else {

                            var dataResult = new DataResultPaginated();
                            dataResult.clone(dataFromServer[0]);
                            dfd.resolve(dataResult);
                        }
                    });

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

                    var a = [
                        jQuery.ajax(jQuery.extend(self.ajax.helpdeskCommonOptions, {
                            url: self.apiRoutes.messageAdd,
                            type: "POST",
                            data: JSON.stringify(dataItem),
                            cache: false
                        }))
                    ];

                    P.all(a).nodeify(function (e, dataFromServer) {
                        if (e !== null) {
                            dfd.reject(e);
                        }
                        else {

                            var dataResult = new DataResult();
                            dataResult.clone(dataFromServer[0]);

                            if (dataResult.data.datePosted) {
                                // deserialize dates
                                dataResult.data.datePosted = new Date(dataResult.data.datePosted);
                            }


                            dfd.resolve(dataResult);
                        }
                    });

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


                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax(jQuery.extend(self.ajax.helpdeskCommonOptions, {
                            url: self.apiRoutes.messageGetAll,
                            type: "POST",
                            data: JSON.stringify(filter),
                            cache: false
                        }))
                    ];

                    P.all(a).nodeify(function (e, dataFromServer) {
                        if (e !== null) {
                            dfd.reject(e);
                        }
                        else {

                            var dataResult = new DataResultPaginated();
                            dataResult.clone(dataFromServer[0]);
                            for (var i = 0; i < dataResult.data.data.length; i++) {
                                if (dataResult.data.data[i].datePosted) {
                                    // deserialize dates
                                    dataResult.data.data[i].datePosted = new Date(dataResult.data.data[i].datePosted);
                                }
                            }
                            dfd.resolve(dataResult);
                        }
                    });

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


                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax(jQuery.extend(self.ajax.helpdeskCommonOptions, {
                            url: self.apiRoutes.messageGetUnread,
                            type: "POST",
                            data: JSON.stringify(filter),
                            cache: false
                        }))
                    ];

                    P.all(a).nodeify(function (e, dataFromServer) {
                        if (e !== null) {
                            dfd.reject(e);
                        }
                        else {

                            var dataResult = new DataResultPaginated();
                            dataResult.clone(dataFromServer[0]);
                            for (var i = 0; i < dataResult.data.data.length; i++) {
                                if (dataResult.data.data[i].datePosted) {
                                    // deserialize dates
                                    dataResult.data.data[i].datePosted = new Date(dataResult.data.data[i].datePosted);
                                }
                            }
                            dfd.resolve(dataResult);
                        }
                    });

                    return dfd.promise();
                },

                talkGetById: function (dataItem) {

                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax(jQuery.extend(self.ajax.helpdeskCommonOptions, {
                            url: self.apiRoutes.talkGetById,
                            type: "POST",
                            data: JSON.stringify(dataItem),
                            cache: false
                        }))
                    ];

                    P.all(a).nodeify(function (e, dataFromServer) {
                        if (e !== null) {
                            dfd.reject(e);
                        }
                        else {
                            var dataResult = new DataResultPaginated();
                            dataResult.clone(dataFromServer[0]);

                            //for (var i = 0; i < dataResult.data.data.length; i++) {
                            //    if (dataResult.data.data[i].dateLastMessage) {
                            //        // deserialize dates
                            //        dataResult.data.data[i].dateLastMessage = new Date(dataResult.data.data[i].dateLastMessage);
                            //    }
                            //}

                            dfd.resolve(dataResult);



                            //dfd.resolve(dataFromServer[0]);
                        }
                    });

                    return dfd.promise();

                },
                talkSavedByEmployee: function (dataItem) {

                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax(jQuery.extend(self.ajax.helpdeskCommonOptions, {
                            url: self.apiRoutes.talkSavedByEmployee,
                            type: "POST",
                            data: JSON.stringify(dataItem),
                            cache: false
                        }))
                    ];

                    P.all(a).nodeify(function (e, dataFromServer) {
                        if (e !== null) {
                            dfd.reject(e);
                        }
                        else {
                            var dataResult = new DataResultPaginated();
                            dataResult.clone(dataFromServer[0]);

                            //for (var i = 0; i < dataResult.data.data.length; i++) {
                            //    if (dataResult.data.data[i].dateLastMessage) {
                            //        // deserialize dates
                            //        dataResult.data.data[i].dateLastMessage = new Date(dataResult.data.data[i].dateLastMessage);
                            //    }
                            //}

                            dfd.resolve(dataResult);



                            //dfd.resolve(dataFromServer[0]);
                        }
                    });

                    return dfd.promise();

                },
                customerSearch: function (filter) {

                    
                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax(jQuery.extend(self.ajax.helpdeskCommonOptions, {
                            url: self.apiRoutes.customerSearch,
                            type: "POST",
                            data: JSON.stringify(filter),
                            cache: false
                        }))
                    ];

                    P.all(a).nodeify(function (e, dataFromServer) {
                        if (e !== null) {
                            dfd.reject(e);
                        }
                        else {
                            var dataResult = new DataResultPaginated();
                            dataResult.clone(dataFromServer[0]);

                            //for (var i = 0; i < dataResult.data.data.length; i++) {
                            //    if (dataResult.data.data[i].dateLastMessage) {
                            //        // deserialize dates
                            //        dataResult.data.data[i].dateLastMessage = new Date(dataResult.data.data[i].dateLastMessage);
                            //    }
                            //}

                            dfd.resolve(dataResult);



                            //dfd.resolve(dataFromServer[0]);
                        }
                    });

                    return dfd.promise();

                },
                employeeSearch: function (filter) {

                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax(jQuery.extend(self.ajax.helpdeskCommonOptions, {
                            url: self.apiRoutes.employeeSearch,
                            type: "POST",
                            data: JSON.stringify(filter),
                            cache: false
                        }))
                    ];

                    P.all(a).nodeify(function (e, dataFromServer) {
                        if (e !== null) {
                            dfd.reject(e);
                        }
                        else {
                            var dataResult = new DataResultPaginated();
                            dataResult.clone(dataFromServer[0]);
                            dfd.resolve(dataResult);
                        }
                    });

                    return dfd.promise();
                },
            };

            
        }

        return CrudAjaxOpts;

    });