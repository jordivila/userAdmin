var customerAjax = {
    ajax: {
        _ajaxBaseAddress: null,
        _ajaxMergeConfig: null,
        _fakeDataGrid: null,
        _fakeDataGridInit: function () {

            customerAjax.ajax._fakeDataGrid = [];

            for (var i = 0; i < 1000; i++) {
                customerAjax.ajax._fakeDataGrid.push({
                    NumDocumento: Array(11).join(i.toString()),
                    fechaAlta: new Date(),
                    fechaNacimiento: new Date(),
                    id: i,
                    nombre: "person {0}".format(i),
                    oficinaNombre: "Bcn",
                    oficinaOrigen: i,
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

            var dataResult = {
                "IsValid": true,
                "Message": "",
                "MessageType": 0,
                "Data":
                    {
                        "TotalRows": customerAjax.ajax._fakeDataGrid.length - 10,
                        "Page": filter.Page,
                        "PageSize": filter.PageSize,
                        "SortBy": "",
                        "SortAscending": false,
                        "Data": [],
                    }
            };

            for (var i = (filter.Page * filter.PageSize) ; i < ((filter.Page * filter.PageSize) + filter.PageSize) ; i++) {
                if (i < customerAjax.ajax._fakeDataGrid.length) {
                    dataResult.Data.Data.push(customerAjax.ajax._fakeDataGrid[i]);
                }
            }

            setTimeout(function () { dfd.resolve(dataResult); }, customerAjax.ajax._fakeDelay);

            return dfd.promise();
        }
    },
    cache: {

    }
};