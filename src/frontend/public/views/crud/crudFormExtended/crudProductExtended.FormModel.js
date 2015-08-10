define([
    "scripts/Template.App.ClientApp",
],
function (clientApp) {

    var productFormModelGet = function () {
        return [{
            id: "someString",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeString"),
            input: { value: "" },
        }, {
            id: "someDate",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeDate"),
            input: { type: "date", value: "" },
        }, {
            id: "someFloat",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeFloat"),
            input: { type: "float", value: null },
        }, {
            id: "someBoolean",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeBool"),
            input: { type: "bool", value: null },
        }, {
            id: "someBooleanNullable",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeBoolNullable"),
            input: { type: "bool", value: null, nullable: true },
        }, {
            id: "someStringFromList",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.ListOfString"),
            input: { type: "list", value: null, listValues: [{ value: "", text: clientApp.i18n.texts.get("GeneralTexts.SelectFromList") }, { value: "1", text: clientApp.i18n.texts.get("Views.Crud.CrudExtended.FirstValue") }] },
        }, {
            id: "someCustomValue",
            displayName: clientApp.i18n.texts.get("GeneralTexts.SelectFromList"),
            input: {
                type: "custom",
                value: null,
                nullable: true,
                onItemBuild: function (widget, parent) {
                    jQuery(parent)
                        .append('<p>' + clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeReadonlyValue") + '-><span class="someCustomValue">2</span></p>')
                        .find('p:first')
                            .click(function () {
                                jQuery(widget).widgetModelItem('change');
                            });
                },
                onItemValue: function (parent) {
                    return jQuery(parent).find('span.someCustomValue').html();
                },
                onItemBind: function (parent, dataItem) {
                    return jQuery(parent).find('span.someCustomValue').html(dataItem);
                }
            },
        }
        ];
    };

    return productFormModelGet;
});