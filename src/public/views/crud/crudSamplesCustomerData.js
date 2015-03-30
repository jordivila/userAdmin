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
        },
        customerSearchForEdit: function (dataItem) {

            var self = this;
            var dfd = jQuery.Deferred();
            var dataResult = null;

            for (var i = 0; i < customerAjax.ajax._fakeDataGrid.length; i++) {
                if (customerAjax.ajax._fakeDataGrid[i].id === dataItem.id) {

                    console.log("found!!!!!!!!!");
                    console.log(customerAjax.ajax._fakeDataGrid[i].id);

                    dataResult = {
                        Data: jQuery.extend({},
                                    customerAjax.ajax._fakeDataGrid[i],
                                    {
                                        EditData: customerAjax.ajax._fakeDataGrid[i]
                                    }),
                        IsValid: true,
                        Message: null,
                        MessageType: 0,
                    };
                }
            }

            console.log(dataResult);

            setTimeout(function () { dfd.resolve(dataResult); }, customerAjax.ajax._fakeDelay);

            return dfd.promise();
        },
        customerSave: function (dataItem) {

            var dfd = jQuery.Deferred();

            var dataResult = null;
            var modelErrors = [];

            if (dataItem.FormData.NumDocumento === "") {
                modelErrors.push({ key: "NumDocumento", value: ["este es un campo requerido"] });
            }

            if (dataItem.FormData.Nombre === "") {
                modelErrors.push({ key: "Nombre", value: ["este es un campo requerido"] });
            }

            if (dataItem.FormData.fechaNacimiento === "") {
                modelErrors.push({ key: "fechaNacimiento", value: ["este es un campo requerido"] });
            }


            if (modelErrors.length > 0) {
                dataResult = {
                    Data: { ModelState: modelErrors },
                    IsValid: false,
                    Message: "Existen errores en el formulario",
                };
            }
            else {
                // Simulate saving data
                customerAjax.ajax._fakeDataGrid[dataItem.id].NumDocumento = dataItem.FormData.NumDocumento;
                customerAjax.ajax._fakeDataGrid[dataItem.id].nombre = dataItem.FormData.nombre;
                customerAjax.ajax._fakeDataGrid[dataItem.id].fechaNacimiento = dataItem.FormData.fechaNacimiento;
                // Simulate retrieving data from server
                dataItem.EditData = customerAjax.ajax._fakeDataGrid[dataItem.id];
                // Simulate server response
                dataItem.FormData = undefined;
                // return result
                dataResult = {
                    Data: dataItem,
                    IsValid: true,
                    Message: "Producto guardado",
                    MessageType: 0,
                };
            }

            setTimeout(function () { dfd.resolve(dataResult); }, customerAjax.ajax._fakeDelay);

            return dfd.promise();
        },
    },
    cache: {

    }
};