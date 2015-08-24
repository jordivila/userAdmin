define([
    "scripts/Template.App.ClientApp",
    "crossLayer/models/dataResult",
    "crossLayer/models/dataResultPaginated",
    "pPromises",
],
    function (clientApp, DataResult, DataResultPaginated, P) {

        var crudAjaxOpts = {
            ajax: {
                talkSearch: function (filter) {

                    var self = this;
                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax({
                            url: "/api/helpdesk/talk/search",
                            type: "POST",
                            data: JSON.stringify(filter),
                            cache: false
                        })
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

                    var self = this;
                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax({
                            url: "/api/helpdesk/talk/add",
                            type: "POST",
                            data: JSON.stringify(dataItem),
                            cache: false
                        })
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


                    var self = this;
                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax({
                            url: "/api/helpdesk/message/add",
                            type: "POST",
                            data: JSON.stringify(dataItem),
                            cache: false
                        })
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
                        jQuery.ajax({
                            url: "/api/helpdesk/message/getAll",
                            type: "POST",
                            data: JSON.stringify(filter),
                            cache: false
                        })
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
                        jQuery.ajax({
                            url: "/api/helpdesk/message/getUnread",
                            type: "POST",
                            data: JSON.stringify(filter),
                            cache: false
                        })
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


                /*************************************************************
                                    Methods for employee
                *************************************************************/
                talkGetById: function (dataItem) {

                    var self = this;
                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax({
                            url: "/api/helpdesk/talk/getById",
                            type: "POST",
                            data: JSON.stringify(dataItem),
                            cache: false
                        })
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

                    var self = this;
                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax({
                            url: "/api/helpdesk/talk/savedByEmployee",
                            type: "POST",
                            data: JSON.stringify(dataItem),
                            cache: false
                        })
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

                    var self = this;
                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax({
                            url: "/api/helpdesk/customer/search",
                            type: "POST",
                            data: JSON.stringify(filter),
                            cache: false
                        })
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

                    var self = this;
                    var dfd = jQuery.Deferred();

                    var a = [
                        jQuery.ajax({
                            url: "/api/helpdesk/employee/search",
                            type: "POST",
                            data: JSON.stringify(filter),
                            cache: false
                        })
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

            },
            cache: {

            }
        };

        return crudAjaxOpts;

    });