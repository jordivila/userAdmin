define([
    "scripts/Template.App.Init",
],
function (clientApp) {


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
                        SomeString: "{0} -> {1}".format(clientApp.i18n.texts.get("Views.Crud.CrudFormExtended.SomeString"),i),
                        SomeDate: new Date(Math.abs(d - (i * 1000 * 60 * 60 * 24))),
                        SomeFloat: i,
                        SomeBoolean: i % 2 === true,
                        SomeBooleanNullable: null,
                        SomeStringFromList: "",
                        SomeCustomValue: i,
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

                var dataResult = {
                    "IsValid": true,
                    "Message": "",
                    "MessageType": 0,
                    "Data":
                        {
                            //"TotalPages": null,
                            "TotalRows": productAjax.ajax._fakeDataGrid.length,
                            "Page": filter.Page,
                            "PageSize": filter.PageSize,
                            "SortBy": "",
                            "SortAscending": false,
                            "Data": [],
                        }
                };

                for (var i = (filter.Page * filter.PageSize) ; i < ((filter.Page * filter.PageSize) + filter.PageSize) ; i++) {
                    if (i < productAjax.ajax._fakeDataGrid.length) {
                        dataResult.Data.Data.push(productAjax.ajax._fakeDataGrid[i]);
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
                        dataResult = {
                            Data: jQuery.extend({},
                                        productAjax.ajax._fakeDataGrid[i],
                                        {
                                            EditData: productAjax.ajax._fakeDataEdit[i]
                                        }),
                            IsValid: true,
                            Message: null,
                            MessageType: 0,
                        };
                    }
                }

                setTimeout(function () { dfd.resolve(dataResult); }, productAjax.ajax._fakeDelay);

                return dfd.promise();
            },
            productSave: function (dataItem) {

                var dfd = jQuery.Deferred();

                clientApp.Globalizer.get()
                 .done(function (Globalize) {


                     var dataResult = null;
                     var modelErrors = [];

                     if (dataItem.FormData.SomeStringFromList === "") {
                         modelErrors.push({ key: "SomeStringFromList", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                     }

                     if (dataItem.FormData.SomeDate === "") {
                         modelErrors.push({ key: "SomeDate", value: [clientApp.i18n.texts.get("Views.Crud.FieldRequired")] });
                     }

                     if (isNaN(dataItem.FormData.SomeFloat)) {
                         modelErrors.push({ key: "SomeFloat", value: [clientApp.i18n.texts.get("Views.Crud.FieldNumericRequired")] });
                     }

                     if (modelErrors.length > 0) {
                         dataResult = {
                             Data: { ModelState: modelErrors },
                             IsValid: false,
                             Message: clientApp.i18n.texts.get("Views.Crud.FormErrorsExist"),
                         };
                     }
                     else {

                         // Simulate saving data
                         dataItem.EditData.SomeBoolean = dataItem.FormData.SomeBoolean;
                         dataItem.EditData.SomeBooleanNullable = dataItem.FormData.SomeBooleanNullable;
                         dataItem.EditData.SomeCustomValue = dataItem.FormData.SomeCustomValue;
                         dataItem.EditData.SomeDate = dataItem.FormData.SomeDate !== "" ? Globalize.dateParser()(dataItem.FormData.SomeDate) : null;
                         dataItem.EditData.SomeFloat = parseFloat(dataItem.FormData.SomeFloat);
                         dataItem.EditData.SomeString = dataItem.FormData.SomeString;
                         dataItem.EditData.SomeStringFromList = dataItem.FormData.SomeStringFromList;

                         productAjax.ajax._fakeDataEdit[dataItem.productId] = dataItem.EditData;
                         // Simulate server response
                         dataItem.FormData = undefined;

                         dataResult = {
                             Data: dataItem,
                             IsValid: true,
                             Message: clientApp.i18n.texts.get("Views.Crud.ProductSaved"),
                             MessageType: 0,
                         };
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