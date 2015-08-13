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
                            customerId: i,
                            customerName: "{0} {1}".format(clientApp.i18n.texts.get("Views.Crud.Person"), i),
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
            },
            cache: {

            }
        };

        return customerAjax;

    });