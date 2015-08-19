//define([
//    "scripts/Template.App.ClientApp",
//    "crossLayer/models/dataResult",
//    "crossLayer/models/dataResultPaginated"
//],
//    function (clientApp, DataResult, DataResultPaginated) {

//        var employeeAjax = {
//            ajax: {
//                _ajaxBaseAddress: null,
//                _ajaxMergeConfig: null,
//                _fakeDataGrid: null,
//                _fakeDataGridInit: function () {

//                    employeeAjax.ajax._fakeDataGrid = [];

//                    for (var i = 0; i < 1000; i++) {
//                        employeeAjax.ajax._fakeDataGrid.push({
//                            employeeId: i,
//                            employeeName: "{0} {1}".format(clientApp.i18n.texts.get("Helpdesk.Talks.Employee"), i),
//                            employeeEmail: "{0}{1}@something.com".format(clientApp.i18n.texts.get("Helpdesk.Talks.Employee"), i),
//                        });
//                    }
//                },
//                _fakeDelay: 1000,
//                employeeSearch: function (filter) {

//                    var self = this;
//                    var dfd = jQuery.Deferred();


//                    if (employeeAjax.ajax._fakeDataGrid === null) {
//                        employeeAjax.ajax._fakeDataGridInit();
//                    }


//                    var dataResult = new DataResultPaginated();
//                    dataResult.isValid = true;
//                    dataResult.data.totalRows = employeeAjax.ajax._fakeDataGrid.length - 10;
//                    dataResult.data.page = filter.page;
//                    dataResult.data.pageSize = filter.pageSize;


//                    for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
//                        if (i < employeeAjax.ajax._fakeDataGrid.length) {
//                            dataResult.data.data.push(employeeAjax.ajax._fakeDataGrid[i]);
//                        }
//                    }

//                    setTimeout(function () { dfd.resolve(dataResult); }, employeeAjax.ajax._fakeDelay);

//                    return dfd.promise();
//                },
//            },
//            cache: {

//            }
//        };

//        return employeeAjax;

//    });