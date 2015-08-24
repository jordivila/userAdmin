define([
    "scripts/Template.App.ClientApp",
    "crossLayer/models/dataResult",
    "crossLayer/models/dataResultPaginated"
],
function (clientApp, DataResult, DataResultPaginated) {


    var productAjax = {
        ajax: {
            _ajaxBaseAddress: null,
            _ajaxMergeConfig: null,
            _fakeDataGrid: null,
            _fakeDataGridInit: function () {

                productAjax.ajax._fakeDataGrid = [];

                var i = 0;
                var d = new Date();

                for (i = 0; i < 1000; i++) {

                    d = new Date();

                    productAjax.ajax._fakeDataGrid.push({
                        fechaDesde: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                        fechaHasta: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                        nombre: "person {0}".format(i),
                        productId: (i.toString() + "").padIndex(4, '0'),
                        productType: "PRSP1",
                        productTypeDesc: clientApp.i18n.texts.get("Views.Crud.CrudFormExtended.PersonalGuaranteeLoan"),
                    });
                }



                i++;
                d = new Date();



                productAjax.ajax._fakeDataGrid.push({
                    fechaDesde: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                    fechaHasta: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                    nombre: "person {0}".format(i),
                    productId: i,
                    productType: "PRSP1",
                    productTypeDesc: clientApp.i18n.texts.get("Views.Crud.CrudFormExtended.PersonalGuaranteeLoan"),
                });


            },
            _fakeDataEdit: null,
            _fakeDataEditInit: function () {

                productAjax.ajax._fakeDataEdit = [];

                for (var i = 0; i < 1000; i++) {

                    var d = new Date();

                    productAjax.ajax._fakeDataEdit.push({
                        someString: "{0} -> {1}".format(clientApp.i18n.texts.get("Views.Crud.CrudFormExtended.SomeString"),i),
                        someDate: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                        someFloat: i,
                        someBoolean: i % 2 === true,
                        someBooleanNullable: null,
                        someStringFromList: "",
                        someCustomValue: i,
                    });
                }
            },
            _fakeDelay: 1000,
            productSearch: function (filter) {

                var self = this;
                var dfd = jQuery.Deferred();


                if (productAjax.ajax._fakeDataGrid === null) {
                    productAjax.ajax._fakeDataGridInit();
                    productAjax.ajax._fakeDataEditInit();
                }




                var dataResult = new DataResultPaginated();
                dataResult.isValid = true;
                dataResult.data.totalRows = productAjax.ajax._fakeDataGrid.length;
                dataResult.data.page = filter.page;
                dataResult.data.pageSize = filter.pageSize;



                for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
                    if (i < productAjax.ajax._fakeDataGrid.length) {
                        dataResult.data.data.push(productAjax.ajax._fakeDataGrid[i]);
                    }
                }

                setTimeout(function () { dfd.resolve(dataResult); }, productAjax.ajax._fakeDelay);

                return dfd.promise();
            },
            productSearchForEdit: function (dataItem) {

                var self = this;
                var dfd = jQuery.Deferred();
                var dataResult = null;

                for (var i = 0; i < productAjax.ajax._fakeDataGrid.length; i++) {
                    if (productAjax.ajax._fakeDataGrid[i].productId === dataItem.productId) {

                        var dataObj = jQuery.extend({},
                                        productAjax.ajax._fakeDataGrid[i],
                                        {
                                            editData: productAjax.ajax._fakeDataEdit[i]
                                        });

                        dataResult = new DataResult(true, "", dataObj);

                    }
                }

                setTimeout(function () { dfd.resolve(dataResult); }, productAjax.ajax._fakeDelay);

                return dfd.promise();
            },
            productSave: function (dataItem) {

                var dfd = jQuery.Deferred();

                clientApp.globalizer.get()
                 .done(function (Globalize) {


                     var dataResult = null;
                     var modelErrors = [];

                     if (dataItem.formData.someStringFromList === "") {
                         modelErrors.push({ key: "someStringFromList", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                     }

                     if (dataItem.formData.someDate === "") {
                         modelErrors.push({ key: "someDate", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                     }

                     if (isNaN(dataItem.formData.someFloat)) {
                         modelErrors.push({ key: "someFloat", value: [clientApp.i18n.texts.get("Views.Crud.FieldNumericRequired")] });
                     }

                     if (modelErrors.length > 0) {
                         dataResult = new DataResult(false, clientApp.i18n.texts.get("Views.Crud.FormErrorsExist"), { modelState: modelErrors });
                     }
                     else {

                         // Simulate saving data
                         dataItem.editData.someBoolean = dataItem.formData.someBoolean;
                         dataItem.editData.someBooleanNullable = dataItem.formData.someBooleanNullable;
                         dataItem.editData.someCustomValue = dataItem.formData.someCustomValue;
                         dataItem.editData.someDate = dataItem.formData.someDate !== "" ? Globalize.dateParser()(dataItem.formData.someDate) : null;
                         dataItem.editData.someFloat = parseFloat(dataItem.formData.someFloat);
                         dataItem.editData.someString = dataItem.formData.someString;
                         dataItem.editData.someStringFromList = dataItem.formData.someStringFromList;

                         productAjax.ajax._fakeDataEdit[dataItem.productId] = dataItem.editData;
                         // Simulate server response
                         dataItem.formData = undefined;


                         dataResult = new DataResult(true, clientApp.i18n.texts.get("Views.Crud.ProductSaved"), dataItem);
                     }

                     setTimeout(function () { dfd.resolve(dataResult); }, productAjax.ajax._fakeDelay);

                 });

                return dfd.promise();
            }
        },
        cache: {
            productSearchTypes: null
        }
    };

    return productAjax;

});