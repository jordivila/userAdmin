﻿(function (module) {

    "use strict";


    var passport = require('passport');
    var BasicStrategy = require('passport-http').BasicStrategy;
    var myUtils = require('../libs/commonFunctions');
    var Encoder = require('node-html-encoder').Encoder;
    var DataResult = require('../../crossLayer/models/dataResult');
    var DataResultPaginated = require('../../crossLayer/models/dataResultPaginated');
    var _ = require("underscore");

    var crudAjaxOpts = {
        ajax: {
            _ajaxBaseAddress: null,
            _ajaxMergeConfig: null,

            _fakeCurrentCustomer: null,    // this should be set at backend runtime by getting auth info
            _fakeCurrentEmployee: null,
            _fakeDefaultEmployee: null,

            _fakeDataGridTalks: null,
            _fakeDataGridMessages: null,
            _fakeDataGridPeople: null,
            _fakeDataGridPeopleInvolved: null,
            _fakeDataGridPeopleFindById: function (idPeople) {

                var result = null;

                for (var i = 0; i < crudAjaxOpts.ajax._fakeDataGridPeople.length; i++) {
                    if (crudAjaxOpts.ajax._fakeDataGridPeople[i].idPeople === idPeople) {
                        result = crudAjaxOpts.ajax._fakeDataGridPeople[i];
                    }
                }

                return result;
            },
            _fakeDataGridTalksByIdPeople: function (idPeople, cb) {


                var talksInvolved = _.filter(crudAjaxOpts.ajax._fakeDataGridPeopleInvolved, function (o) {
                    return o.idPeople === idPeople;
                });


                var talks = _.filter(crudAjaxOpts.ajax._fakeDataGridTalks, function (talk) {
                    var found = _.find(talksInvolved, function (talkInvolved) {
                        return talkInvolved.idTalk == talk.idTalk;
                    });
                });



                cb(null, talks);
            },
            _fakeDataGridTalksFindById: function (idTalk) {

                var result = null;

                for (var i = 0; i < crudAjaxOpts.ajax._fakeDataGridTalks.length; i++) {
                    if (crudAjaxOpts.ajax._fakeDataGridTalks[i].idTalk === idTalk) {
                        // just ensure no reference is passed by creating new object using jQuery.extend
                        // Do not need to simulate this at backend. As far as database query will return new object
                        result = myUtils.extendDeep(crudAjaxOpts.ajax._fakeDataGridTalks[i], {});
                    }
                }

                return result;
            },
            _fakeDataGridTalkSave: function (i18n, idTalk, subject, customerId, employeeId, cb) {
                try {


                    var dataResult = null;
                    var modelErrors = [];
                    var isNew = idTalk === null;

                    if (((subject.trim() === '') === true)) {
                        modelErrors.push({ key: "subject", value: [i18n.__("Views.Crud.FieldRequired")] });
                    }

                    if (isNew && (customerId.toString().trim() === "")) {
                        modelErrors.push({ key: "customerInfo", value: [i18n.__("Views.Crud.FieldRequired")] });
                    }




                    if (modelErrors.length > 0) {
                        dataResult = new DataResult(false, i18n.__("Views.Crud.ErrorExistsInForm"), { modelState: modelErrors });
                    }
                    else {

                        subject = subject.trim();
                        employeeId = parseInt(employeeId);
                        customerId = parseInt(customerId);


                        // Simulate saving data
                        if (idTalk === null) {
                            idTalk = crudAjaxOpts.ajax._fakeDataGridTalks.length;
                        }
                        else {

                            if (idTalk === undefined) {
                                throw new Error("Argument exception");
                            }

                            idTalk = parseInt(idTalk);
                        }

                        if (isNew) {
                            crudAjaxOpts.ajax._fakeDataGridTalks.push({
                                idTalk: idTalk,
                                subject: subject,
                                //dateLastMessage: new Date(),
                            });
                        }
                        else {
                            crudAjaxOpts.ajax._fakeDataGridTalks[idTalk].subject = subject;
                        }

                        //add an employee to that talk
                        crudAjaxOpts.ajax._fakeDataGridPeopleInvolved.push({
                            idTalk: idTalk,
                            idPeople: employeeId
                        });



                        if (isNew) {
                            // add a customer to that talk -> this should be done at backend  by taking the current logged user id
                            crudAjaxOpts.ajax._fakeDataGridPeopleInvolved.push({
                                idTalk: idTalk,
                                idPeople: customerId
                            });
                        }
                        else {
                            // existing talks must NOT change its customerId
                        }


                        dataResult = new DataResult(
                            true,
                            isNew ? i18n.__("Helpdesk.Talks.Subject.NewSubjectAdded") :
                                    i18n.__("Template.Widget.Crud.SavedChanges"),
                            {
                                idTalk: idTalk
                            });
                    }

                    cb(null, dataResult);

                } catch (e) {
                    console.error(e);
                    cb(e, null);
                }
            },
            _fakeDataGridTalkGetByIdForEdit: function (i18n, idTalk, cb) {

                try {
                    var dataResult = null;
                    // search for talkId
                    var talk = crudAjaxOpts.ajax._fakeDataGridTalksFindById(idTalk);


                    if (talk === null) {
                        dataResult = new DataResult(false, i18n.__("Helpdesk.Talks.TalkNotFound"), null);
                    }
                    else {
                        var peopleInvolved = crudAjaxOpts.ajax._fakeDataGridPeopleInvolvedByTalkId(idTalk);
                        var customerInfo = function () {
                            for (var i = 0; i < peopleInvolved.length; i++) {
                                if (peopleInvolved[i].isEmployee === false) {
                                    return {
                                        customerId: peopleInvolved[i].idPeople,
                                        customerName: peopleInvolved[i].name
                                    };
                                }
                            }
                            return null;
                        }();
                        var dataObj = myUtils.extendDeep({}, talk);
                        dataObj.editData = myUtils.extendDeep(talk, { customerInfo: customerInfo });
                        dataResult = new DataResult(true, "", dataObj);
                    }

                    cb(null, dataResult);
                }
                catch (e) {

                    console.error(e);

                    cb(e, null);
                }
            },
            _fakeDataGridPeopleInvolvedByTalkId: function (idTalk) {

                var peopleInvolved = [];



                for (var i = 0; i < crudAjaxOpts.ajax._fakeDataGridPeopleInvolved.length; i++) {
                    if (crudAjaxOpts.ajax._fakeDataGridPeopleInvolved[i].idTalk == idTalk) {



                        peopleInvolved.push(
                            crudAjaxOpts.ajax._fakeDataGridPeopleFindById(crudAjaxOpts.ajax._fakeDataGridPeopleInvolved[i].idPeople)
                        );
                    }
                }

                return peopleInvolved.slice(0); //--> clone array. This is not needed at backend
            },
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

                console.log("_fakeDataInit");
                console.log(crudAjaxOpts.ajax._fakeDataGridTalks);

                var pMax = 10; // pMax -> number of employees & number of customers created

                // create fake table models
                crudAjaxOpts.ajax._fakeDataGridTalks = [];
                crudAjaxOpts.ajax._fakeDataGridMessages = [];
                crudAjaxOpts.ajax._fakeDataGridPeople = function (pMax) {

                    var peopleAll = [];

                    for (var j = 0; j < pMax; j++) {
                        peopleAll.push({
                            idPeople: j,
                            idPersonBackOffice: j,    //identificaador de la persona en ORG_TB_EMLPEADOS
                            isEmployee: true,
                            name: "Empleado " + j
                        });
                    }

                    for (var k = 0; k < pMax; k++) {
                        peopleAll.push({
                            idPeople: pMax + k,
                            idPersonBackOffice: k,    //identificaador de la persona en PEF_tb_personaFisica
                            isEmployee: false,
                            name: "Cliente " + k
                        });
                    }

                    return peopleAll;

                }(pMax);
                crudAjaxOpts.ajax._fakeDataGridPeopleInvolved = [];

                // assign fake users
                crudAjaxOpts.ajax._fakeCurrentEmployee = crudAjaxOpts.ajax._fakeDataGridPeople[0];
                crudAjaxOpts.ajax._fakeDefaultEmployee = crudAjaxOpts.ajax._fakeDataGridPeople[1];
                crudAjaxOpts.ajax._fakeCurrentCustomer = crudAjaxOpts.ajax._fakeDataGridPeople[pMax + 1];

                var createFakeTalks = function () {

                    var calcDatePosted = function (days) {
                        var g = new Date();
                        g.setDate(g.getDate() - days);
                        return g;
                    };


                    for (var i = 0; i < 78; i++) {

                        //create a talk
                        crudAjaxOpts.ajax._fakeDataGridTalks.push({
                            //subject: "{0} {1}".format(i18n.__("Helpdesk.Talks.History.Message"), i),
                            idTalk: i,
                            subject: myUtils.stringFormatCSharp("{0} - {1}", i, crudAjaxOpts.ajax._fakeTextGet()),
                        });

                        //add an employee to that talk
                        crudAjaxOpts.ajax._fakeDataGridPeopleInvolved.push({
                            idTalk: i,
                            idPeople: crudAjaxOpts.ajax._fakeDefaultEmployee.idPeople
                        });

                        //add a customer to that talk
                        crudAjaxOpts.ajax._fakeDataGridPeopleInvolved.push({
                            idTalk: i,
                            idPeople: crudAjaxOpts.ajax._fakeCurrentCustomer.idPeople
                        });

                        // add messages to that talk
                        for (var z = 0; z < 10; z++) {

                            var messageInstance = {
                                idMessage: crudAjaxOpts.ajax._fakeDataGridMessages.length,
                                idTalk: i,
                                idPeople: (z % 2 === 0) ? crudAjaxOpts.ajax._fakeDefaultEmployee.idPeople : crudAjaxOpts.ajax._fakeCurrentCustomer.idPeople,
                                message: crudAjaxOpts.ajax._fakeTextGet(),
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

                };

                // uncomment the line below to create fake conversations
                //createFakeTalks();

                console.log("_fakeDataInit Despues");
                console.log(crudAjaxOpts.ajax._fakeDataGridTalks);

            },
            _fakeDelay: 1000,
            _fakeTextGet: function () {

                var loremIpsumText = function () {

                    return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lobortis pharetra elit, vitae pharetra dolor tristique sed. Aliquam non magna et sem pellentesque egestas. Pellentesque sit amet arcu elit. Suspendisse at risus id tellus auctor maximus. Suspendisse eget nibh pretium, ornare dui non, convallis sem. Aenean at pellentesque eros. Donec volutpat tristique odio, eget hendrerit leo sodales sed. Fusce in condimentum mi. Donec rhoncus velit at risus mollis congue. Ut bibendum ex sit amet est tincidunt, quis vulputate libero convallis. Maecenas neque dolor, ullamcorper sit amet aliquam nec, venenatis quis neque. In in metus urna. Pellentesque cursus bibendum quam id tincidunt. Vestibulum ultricies mauris elit, ut tempor mi mollis quis.                        In hac habitasse platea dictumst. Ut vitae posuere arcu. In at enim tortor. Mauris quis est vel lorem fermentum hendrerit. Phasellus malesuada nisi in felis mattis, eget ultrices ex auctor. Maecenas dolor elit, lobortis et dolor sit amet, accumsan blandit felis. Etiam sodales magna dui, sed dapibus est varius vel. Nulla ornare, ante vitae consectetur rhoncus, augue massa feugiat ligula, id tempus dui mi at dui. Mauris nec consequat nibh, non efficitur urna. Vivamus ullamcorper lacus vitae lectus porta viverra. Nunc varius diam eget ipsum interdum, ut interdum felis gravida. Quisque placerat libero non rutrum consectetur. Proin massa purus, consectetur vel posuere in, mollis ut risus. In commodo turpis augue, id tincidunt ligula volutpat ut. Proin a nisl enim. Nullam ut nibh arcu.                        Suspendisse mollis tempor risus a gravida. Vivamus aliquam elit sed posuere tristique. Donec vitae sem ut turpis elementum sodales. Curabitur efficitur justo et risus pellentesque egestas. Aliquam lobortis diam at ultrices condimentum. Pellentesque id dolor eu mauris lobortis vulputate ultrices congue quam. Maecenas a ullamcorper quam.                        Nullam dapibus ex at nunc tempus convallis. Proin semper erat eget elit ornare ullamcorper. Morbi semper, quam ut mollis placerat, lectus dui consequat sem, in congue felis mi at ex. Donec nec pellentesque erat, nec scelerisque libero. Vivamus aliquet pellentesque venenatis. Nullam luctus tincidunt erat luctus rhoncus. Phasellus nec felis vulputate, consectetur quam sit amet, egestas orci.                        Maecenas ac tortor eget dolor varius accumsan vel a nisi. Nullam vulputate felis eget tincidunt mattis. Etiam eget nisi vel erat malesuada porta eu quis neque. Quisque sed rhoncus dui, eu elementum ipsum. Vestibulum tincidunt enim elit, non consequat lorem semper et. Nullam sed nunc vitae neque rhoncus tincidunt. Nullam efficitur neque sit amet velit ultrices, nec consectetur tortor congue.                        Praesent eu placerat leo, et congue ipsum. Aenean vel odio id tellus ornare volutpat. Integer ornare arcu ultrices, commodo eros in, bibendum sapien. Vestibulum a nisl at est sollicitudin semper sit amet nec massa. Nulla fermentum lacus a imperdiet convallis. Cras placerat ante vitae eleifend iaculis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec diam eget sapien facilisis fermentum ut interdum diam. Curabitur ornare orci leo, in elementum turpis placerat vitae. Fusce id ligula mauris. Pellentesque euismod a tellus sed lacinia. Cras vel sapien enim. Pellentesque malesuada ante vel ipsum sollicitudin, id finibus nibh sodales. Sed blandit augue ut pulvinar scelerisque.                        Phasellus ut ornare eros. Suspendisse potenti. Vestibulum elementum, augue sagittis accumsan eleifend, enim nisl molestie tellus, ac venenatis sem leo ut nulla. Suspendisse potenti. Morbi consequat metus quis odio viverra dictum. Duis in rhoncus est. Suspendisse potenti. Duis tincidunt arcu euismod diam malesuada, quis sollicitudin dolor lobortis. Cras a felis diam. Duis eget turpis velit. Cras fringilla dui vitae accumsan cursus. Ut rutrum lorem eget lectus viverra ultricies. Integer ac libero sollicitudin, scelerisque sapien vel, imperdiet diam. Donec id lectus in nulla mollis bibendum in et ipsum. Phasellus lobortis massa quam, in efficitur lectus vulputate eu.                        Praesent sagittis nibh ut ligula posuere, pretium ultricies turpis condimentum. Pellentesque hendrerit egestas odio, ut ultrices sem commodo ut. Sed consectetur hendrerit dui, eu pulvinar neque tristique quis. Nunc viverra nibh lobortis, sodales nunc nec, scelerisque nulla. Quisque commodo ultrices tortor id fringilla. Maecenas sollicitudin, diam in hendrerit sollicitudin, nunc dolor commodo purus, ac feugiat libero diam ut mi. Nulla dignissim tempus maximus. Duis gravida ex nunc.                        Duis lobortis, nulla et fermentum varius, tortor est vehicula elit, vitae suscipit nisi nunc non purus. Mauris accumsan accumsan eros. Pellentesque mi tellus, porttitor ut mi quis, efficitur pretium eros. Donec pellentesque molestie mattis. Nunc sit amet eros non ante tempor feugiat in eu enim. In ante nibh, dignissim sit amet enim nec, auctor viverra nisl. Fusce auctor porttitor lorem in tristique.                        Nam neque arcu, pulvinar non faucibus at, dapibus ut dolor. Maecenas pellentesque sagittis tempor. Praesent eu dolor non enim malesuada volutpat. Nam ac blandit libero. Nunc at est quis enim suscipit eleifend. Suspendisse potenti. Vivamus interdum scelerisque pretium. Nulla facilisi.                        Morbi ut massa ut ante dictum laoreet ut eu ligula. Nullam nec leo eros. Donec ut massa eu neque malesuada pellentesque. Nulla pharetra, ipsum ut euismod ultricies, erat nibh rhoncus mauris, et lobortis ipsum mauris vel magna. Suspendisse egestas hendrerit enim quis facilisis. Duis vitae commodo est. Nullam a cursus nisl. In dignissim ante ut diam facilisis molestie. Sed vulputate libero in lorem tristique viverra. Maecenas velit erat, iaculis a lectus non, egestas interdum ante. Sed vehicula pretium ipsum in convallis. Vivamus quis orci pellentesque, facilisis lorem vitae, varius ex. Donec et eros sed justo blandit lobortis.                        Nunc quis arcu eget massa rhoncus tristique ac non nunc. Nulla vitae odio quis nunc tristique scelerisque. Nam arcu sapien, tristique ac lectus et, congue ultricies ipsum. In erat ipsum, tincidunt quis lacinia a, blandit id justo. Suspendisse potenti. Vestibulum eu nibh augue. Proin eu dui at est dignissim mattis. Duis vitae est varius, dapibus elit vitae, lacinia urna.                        Curabitur consequat faucibus velit non pharetra. Fusce scelerisque consequat justo ac varius. Morbi viverra, tortor quis viverra suscipit, purus metus tincidunt dui, eget porttitor mi libero ut mauris. In hac habitasse platea dictumst. In iaculis, elit congue sodales dictum, dui odio maximus eros, vel mollis risus diam eu nisi. Proin sodales tempus dignissim. Nullam imperdiet maximus ligula quis blandit. Nullam eget lobortis nunc. Ut consectetur elit eu varius accumsan. In hac habitasse platea dictumst. Aenean non justo eget nisl tempus porta vitae sit amet sem. Praesent ac tellus volutpat, pellentesque nisi ac, laoreet arcu. Integer eget condimentum neque, malesuada dignissim lectus.                        Vivamus ut blandit nisi. Mauris mattis, nibh id tristique fermentum, ipsum velit malesuada urna, at consectetur nisi sem in metus. Fusce nec feugiat nibh. Phasellus nulla risus, laoreet nec arcu quis, finibus iaculis ligula. Fusce volutpat id lectus at imperdiet. Aliquam erat volutpat. Nulla tristique eleifend neque ac rutrum. Duis dignissim suscipit tellus, ac rutrum elit sodales eu. Integer sodales, nulla a ullamcorper condimentum, est enim molestie velit, vitae iaculis lorem mi ac diam. Morbi augue mauris, viverra eu efficitur sit amet, vulputate ac orci. Mauris feugiat sed mauris vitae efficitur. Nulla vehicula in nibh non mollis. Aenean facilisis rutrum turpis, nec aliquam lacus venenatis et.                        Etiam risus sapien, tempus at tortor quis, egestas dignissim nisi. Aliquam dignissim dapibus lectus eu pretium. Fusce at tempus nunc. Proin quis nisi mi. Phasellus nisi nisl, malesuada et nisi a, faucibus fringilla eros. Nulla vulputate justo non lacus fringilla, sit amet laoreet arcu tincidunt. Cras et velit eu enim fringilla pulvinar sodales vel elit. Sed lobortis, dolor vitae posuere fringilla, eros nulla ornare leo, ut aliquet felis sem at est. Suspendisse molestie tristique nisl, id pretium erat feugiat a. Nulla ligula tortor, eleifend eu lectus sit amet, tincidunt porta dolor. Nam at consectetur velit. Sed pretium, velit vel rhoncus suscipit, dui ligula ultricies nibh, non condimentum felis magna sed odio. In hac habitasse platea dictumst.                        Mauris vel bibendum nisl, sed efficitur sapien. Nunc nec dictum felis, et viverra odio. In ut erat id turpis vulputate lacinia. Nullam scelerisque ipsum eu leo pellentesque euismod. Phasellus mollis dolor non nibh cursus, vitae consequat odio tincidunt. Phasellus eget risus eget enim placerat egestas sit amet sit amet sapien. Sed rutrum faucibus velit, sed efficitur ligula porta vitae. Donec tincidunt ultricies elit at commodo. Sed nec elementum metus, ultrices venenatis augue. Vivamus ante urna, vulputate in purus sed, molestie efficitur felis. Duis sed neque tempor, semper orci a, varius odio. Suspendisse a consequat nulla. Sed rhoncus ligula ex, vitae mattis ipsum posuere posuere. Pellentesque nec libero vel ligula sagittis placerat sed id purus.                        Pellentesque maximus feugiat lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean fermentum sapien vitae neque pellentesque, et vehicula enim placerat. Phasellus blandit quam euismod cursus laoreet. Ut consequat nisl a efficitur maximus. Praesent egestas neque nec metus porttitor convallis. Ut eu mattis leo, nec aliquet tortor.                        Fusce molestie quis purus eu sagittis. Proin eget urna tristique nulla euismod rutrum. Etiam vel tellus mauris. Mauris vitae tortor cursus, semper eros a, malesuada est. Mauris nec lobortis erat. Vivamus tincidunt sagittis ipsum, a tempus massa sodales a. Nunc iaculis ex in egestas pharetra. Morbi vel risus id nibh fringilla consectetur eget a orci. In imperdiet malesuada metus, id facilisis ipsum rutrum venenatis. Vestibulum eget posuere libero.                        Phasellus dignissim semper dolor sed molestie. Nulla ac erat congue, fringilla erat vitae, rhoncus felis. Nulla mauris orci, commodo eu ex ac, tincidunt pellentesque sem. Sed dignissim urna finibus arcu molestie hendrerit. Etiam non tempor eros. Donec dictum risus ut nulla molestie imperdiet. Morbi nisi quam, faucibus quis posuere nec, posuere nec dui. Praesent quis ultrices nisl. Donec dui quam, dignissim non diam in, molestie faucibus purus.                        Curabitur augue leo, consequat eu suscipit id, sagittis nec massa. Sed et metus diam. Cras quis neque sed ex ullamcorper sollicitudin. Integer tempus massa et mi maximus tempor. Quisque ut erat ac sem hendrerit semper eu quis tellus. Fusce tincidunt sit amet elit sed dapibus. Sed justo elit, scelerisque ut consectetur et, tristique nec odio.';
                };

                var loremSplit = loremIpsumText().split('.');
                var indexBegin = Math.floor((Math.random() * (loremSplit.length - 3)) + 1);
                var indexEnd = indexBegin + Math.floor((Math.random() * (3)) + 1);
                var loremResult = [];

                for (var i = indexBegin; i < indexEnd; i++) {
                    loremResult.push(loremSplit[i]);
                }

                return loremResult.join(' ');
            },
            _fakeConversationsPartner: function () {

                var _doConversationsPartner = function (cb) {

                    // imitate conversations adding messages as an employee
                    for (var i = 0; i < crudAjaxOpts.ajax._fakeDataGridTalks.length; i++) {

                        crudAjaxOpts.ajax._fakeDataGridMessages.push({
                            idMessage: crudAjaxOpts.ajax._fakeDataGridMessages.length,
                            idTalk: crudAjaxOpts.ajax._fakeDataGridTalks[i].idTalk,
                            idPeople: 0, // --> employee
                            message: crudAjaxOpts.ajax._fakeTextGet(),
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
                        isCurrentUser: message.idPeople === crudAjaxOpts.ajax._fakeCurrentCustomer.idPeople
                    }
                };

            },




            reqCredentialsCheck: function (req, username, password, callback) {

                var i18n = req.i18n;

                var invalidCredentials = function () {
                    callback(null, false, {
                        message: i18n.__("AccountResources.InvalidCredentials")
                    });
                };

                var checkByCookieName = function (cookieName) {

                    if (req.cookies[cookieName]) {
                        var peopleId = parseInt(req.cookies[cookieName]);
                        var peopleInfo = crudAjaxOpts.ajax._fakeDataGridPeopleFindById(peopleId);
                        if (peopleInfo === null) {
                            invalidCredentials();
                        }
                        else {
                            callback(null, peopleInfo);
                        }
                    }
                    else {
                        invalidCredentials();
                    }
                };

                // some api routes are for customers
                // and another ones are for employees only
                // this methods returns tru if api route for the current request
                // was a customer route
                // See /src/backend/routing/routesApiUser.js
                if (req.params.apiEndpointType === 'customer') {
                    checkByCookieName("customerId");
                }
                else {
                    checkByCookieName("employeeId");
                }
            },
            reqAuthenticate: function (req, res, next) {

                //  when using basic auth passports sends header WWW-Authenticate
                //  which forces browser to show a dialog box asking for user credentials 
                //  

                //passport.authenticate('basic', {
                //    session: false
                //})(req, res, next);

                // I use a custom callback on passport baic auth
                // avoiding this header to be sent

                passport.authenticate(
                    'basic', {
                        session: false
                    },
                    function (err, user, info) {

                        if (err) {
                            return next(err);
                        }
                        if (!user) {
                            res.status(401);
                        }

                        req.user = user;

                        next();

                    })(req, res, next);
            },


            talkSearch: function (req, filter, cb) {

                var dataToViewModel = function (dataSourceArray) {

                    console.log("dataSourceArray");
                    console.log(dataSourceArray);

                    var dataResult = new DataResultPaginated();
                    dataResult.isValid = true;
                    dataResult.data.totalRows = dataSourceArray.length;
                    dataResult.data.page = filter.page;
                    dataResult.data.pageSize = filter.pageSize;

                    for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
                        if (i < dataSourceArray.length) {
                            dataResult.data.data.push({
                                idTalk: dataSourceArray[i].idTalk,
                                subject: dataSourceArray[i].subject,
                                dateLastMessage: crudAjaxOpts.ajax._fakeMessagesGetDateLastMessage(dataSourceArray[i].idTalk),
                                nMessagesUnread: i
                            });
                        }
                    }

                    return dataResult;
                };

                if (!req.user.isEmployee) {
                    // set filter on customer talks
                    filter.customerInfo = {
                        customerId: req.user.idPeople
                    };

                    crudAjaxOpts.ajax._fakeDataGridTalksByIdPeople(
                        filter.customerInfo.customerId,
                        function (errTalksByPeople, talksByPeople) {
                            if (errTalksByPeople) {
                                cb(errTalksByPeople, null);
                            }
                            else {
                                cb(null, dataToViewModel(talksByPeople));
                            }
                        });
                }
                else {
                    console.log("Es Empleado !!!!");
                    cb(null, dataToViewModel(crudAjaxOpts.ajax._fakeDataGridTalks));
                }
            },
            talkAdd: function (req, dataItem, cb) {

                crudAjaxOpts.ajax._fakeDataGridTalkSave(
                    req.i18n,
                    null,
                    dataItem.subject,
                    crudAjaxOpts.ajax._fakeDefaultEmployee.idPeople, //employeeId
                    crudAjaxOpts.ajax._fakeCurrentCustomer.idPeople, // customerId
                    function (e, dataResult) {
                        if (e) {
                            cb(e, null);
                        }
                        else {

                            if (dataResult.isValid === true) {
                                // Simulate retrieving data from server
                                dataItem.editData = crudAjaxOpts.ajax._fakeDataGridTalks[dataResult.data.idTalk];
                                // Simulate server response
                                dataItem.formData = undefined;
                                // return result
                                dataResult.data = dataItem;
                            }

                            cb(null, dataResult);
                        }
                    });
            },
            messageAdd: function (req, dataItem, cb) {



                // Recordar !!!!
                // solo en este metodo !!!!
                // Sobreescribir los defaults de jQuery ajax
                // para que no saquen el progress bar
                // ya que la pantalla que utiliza el metodo 
                // utiliza otro tipo de indicativo a la hora de enseñar progreso


                var dataResult = null;
                var modelErrors = [];

                if (((dataItem.message.trim() === '') === true)) {
                    // do not validate
                    // In case message is empty then fail silently at backend
                    // as far as client validation should occur before arrive here

                    //modelErrors.push({ key: "message", value: [i18n.__("Views.Crud.FieldRequired")] });
                }




                if (modelErrors.length > 0) {
                    dataResult = new DataResult(false, i18n.__("Views.Crud.ErrorExistsInForm"), { modelState: modelErrors });
                }
                else {



                    // Simulate saving data
                    var newId = crudAjaxOpts.ajax._fakeDataGridMessages.length;

                    crudAjaxOpts.ajax._fakeDataGridMessages.push({
                        idMessage: newId,
                        idTalk: dataItem.idTalk,
                        idPeople: crudAjaxOpts.ajax._fakeCurrentCustomer.idPeople, // this should be set at server runtime using authentication info
                        message: dataItem.message, // --> REMEMBER !!!! as far as this is going to be at server side: do HtmlEncode of the dataItem.message property value (use some npm-hemlEncode existing module)
                        datePosted: new Date(),
                    });

                    // Simulate retrieving data from server
                    dataItem = myUtils.extendDeep(crudAjaxOpts.ajax._fakeDataGridMessages[newId], {});
                    // return result
                    //dataResult = new DataResult(true, i18n.__("Helpdesk.Talks.Subject.NewMessageAdded"), dataItem);
                    dataResult = new DataResult(true, "", dataItem);
                }

                cb(null, dataResult);
            },
            messageGetAll: function (req, params, cb) {

                // simulate pagination. BUT set pageSize to a huge number
                // as far as client message page is not indended to be paginated
                // at least first version

                //var filter = {
                //    page: 0,
                //    pageSize: 1000,
                //    filter: {
                //        idTalk: idTalk
                //    }
                //};

                var filter = params;
                var idTalk = filter.filter.idTalk;
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
                    dataResult.message = i18n.__("GeneralTexts.PermissionDenied");
                }

                cb(null, dataResult);
            },
            messageGetUnread: function (req, params, cb) {

                //var idTalk = params.idTalk;
                //var idMessageLastRead = params.idMessageLastRead;

                // simulate pagination. BUT set pageSize to a huge number
                // as far as client message page is not indended to be paginated
                // at least first version

                //var filter = {
                //    page: 0,
                //    pageSize: 1000,
                //    filter: {
                //        idTalk: idTalk,
                //        idMessageLastRead: idMessageLastRead
                //    }
                //};

                var filter = params;
                var idTalk = filter.filter.idTalk;
                var idMessageLastRead = filter.filter.idMessageLastRead;



                //var self = this;
                //var dfd = jQuery.Deferred();
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
                    dataResult.message = i18n.__("GeneralTexts.PermissionDenied");
                }

                cb(null, dataResult);
            },
            /************************************************************
                                Methods for employee
            *************************************************************/
            talkGetById: function (req, dataItem, cb) {

                var dataResult = null;

                crudAjaxOpts.ajax._fakeDataGridTalkGetByIdForEdit(req.i18n, dataItem.idTalk,
                    function (error, dataResult) {
                        if (error) {
                            cb(error, null);
                        }
                        else {
                            cb(null, dataResult);
                        }
                    });

            },
            talkSavedByEmployee: function (req, dataItem, cb) {

                crudAjaxOpts.ajax._fakeDataGridTalkSave(
                    req.i18n,
                    dataItem.isNew === true ? null : dataItem.formData.idTalk,
                    dataItem.formData.subject,
                    dataItem.formData.customerInfo.customerId, // customerId
                    crudAjaxOpts.ajax._fakeCurrentEmployee.idPeople, //employeeId -> taken from current user request
                    function (e, dataResult) {


                        if (e) {
                            cb(e, null);
                        }
                        else {

                            if (dataResult.isValid === true) {

                                crudAjaxOpts.ajax._fakeDataGridTalkGetByIdForEdit(
                                    req.i18n,
                                    dataResult.data.idTalk,
                                    function (eGetById, dataResultGetById) {
                                        if (eGetById) {
                                            setTimeout(function () { dfd.reject(eGetById); }, crudAjaxOpts.ajax._fakeDelay);
                                        }
                                        else {

                                            if (dataResultGetById.isValid) {
                                                // ponemos en el mensaje de salida
                                                // el mensaje resultado de guardar
                                                dataResultGetById.messages[0] = dataResult.messages[0];
                                            }

                                            cb(null, dataResultGetById);
                                        }
                                    });
                            }

                            cb(null, dataResult);
                        }
                    });




            },
            customerSearch: function (req, filter, cb) {

                var customers = [];

                for (var j = 0; j < crudAjaxOpts.ajax._fakeDataGridPeople.length; j++) {
                    if (crudAjaxOpts.ajax._fakeDataGridPeople[j].isEmployee === false) {
                        customers.push(crudAjaxOpts.ajax._fakeDataGridPeople[j]);
                    }
                }

                var dataResult = new DataResultPaginated();
                dataResult.isValid = true;
                dataResult.data.totalRows = customers.length;
                dataResult.data.page = filter.page;
                dataResult.data.pageSize = filter.pageSize;


                for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
                    if (i < customers.length) {

                        dataResult.data.data.push({
                            customerCardId: new Array(11).join(customers[i].idPeople.toString()), // make inner join using idPersonBackOffice and get customer card id 
                            customerId: customers[i].idPeople,
                            customerName: customers[i].name
                        });

                    }
                }

                cb(null, dataResult);
            },
            employeeSearch: function (req, filter, cb) {

                var employees = [];
                var i18n = req.i18n;

                for (var j = 0; j < crudAjaxOpts.ajax._fakeDataGridPeople.length; j++) {
                    if (crudAjaxOpts.ajax._fakeDataGridPeople[j].isEmployee === true) {
                        employees.push(crudAjaxOpts.ajax._fakeDataGridPeople[j]);
                    }
                }

                var dataResult = new DataResultPaginated();
                dataResult.isValid = true;
                dataResult.data.totalRows = employees.length;
                dataResult.data.page = filter.page;
                dataResult.data.pageSize = filter.pageSize;


                for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
                    if (i < employees.length) {

                        dataResult.data.data.push({
                            employeeId: employees[i].idPeople,
                            employeeName: employees[i].name,
                            employeeEmail: myUtils.stringFormatCSharp("{0}{1}@something.com", i18n.__("Helpdesk.Talks.Employee"), employees[i].idPeople),// make inner join using idPersonBackOffice and get employee email address
                        });

                    }
                }

                cb(null, dataResult);
            },

        },
        cache: {

        }
    };

    crudAjaxOpts.ajax._fakeDataInit();
    crudAjaxOpts.ajax._fakeConversationsPartner();


    passport.use(new BasicStrategy({ passReqToCallback: true }, crudAjaxOpts.ajax.reqCredentialsCheck));




    module.exports.isAuthenticated = crudAjaxOpts.ajax.reqAuthenticate;
    module.exports.talkSearch = crudAjaxOpts.ajax.talkSearch;
    module.exports.talkAdd = crudAjaxOpts.ajax.talkAdd;
    module.exports.messageAdd = crudAjaxOpts.ajax.messageAdd;
    module.exports.messageGetAll = crudAjaxOpts.ajax.messageGetAll;
    module.exports.messageGetUnread = crudAjaxOpts.ajax.messageGetUnread;

    module.exports.talkGetById = crudAjaxOpts.ajax.talkGetById;
    module.exports.talkSavedByEmployee = crudAjaxOpts.ajax.talkSavedByEmployee;
    module.exports.customerSearch = crudAjaxOpts.ajax.customerSearch;
    module.exports.employeeSearch = crudAjaxOpts.ajax.employeeSearch;


})(module);