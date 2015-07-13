define([
    "scripts/Template.App.Init",
],
function (clientApp) {

    var productGridModelGet = function () {

        return [
                {
                    key: "productId",
                    displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.ProductNum")
                },
                {
                    key: "productTypeDesc",
                    displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.ProductTypeDescColumn")
                },
                {
                    key: "fechaDesde",
                    displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.ProductDateAddedColumn")
                }
        ];
    };

    return productGridModelGet;
});