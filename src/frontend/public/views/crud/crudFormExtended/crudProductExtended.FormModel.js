define([
    "scripts/Template.App.I18n.Init",
],
function (clientApp) {

    var productFormModelGet = function () {
        return [{
            id: "SomeString",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeString"),
            input: { value: "" },
        }, {
            id: "SomeDate",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeDate"),
            input: { type: "date", value: "" },
        }, {
            id: "SomeFloat",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeFloat"),
            input: { type: "float", value: null },
        }, {
            id: "SomeBoolean",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeBool"),
            input: { type: "bool", value: null },
        }, {
            id: "SomeBooleanNullable",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeBoolNullable"),
            input: { type: "bool", value: null, nullable: true },
        }, {
            id: "SomeStringFromList",
            displayName: clientApp.i18n.texts.get("Views.Crud.CrudExtended.ListOfString"),
            input: { type: "list", value: null, listValues: [{ value: "", text: clientApp.i18n.texts.get("Views.Crud.SelectFromList") }, { value: "1", text: clientApp.i18n.texts.get("Views.Crud.CrudExtended.FirstValue") }] },
        }, {
            id: "SomeCustomValue",
            displayName: clientApp.i18n.texts.get("Views.Crud.SelectFromList"),
            input: {
                type: "custom",
                value: null,
                nullable: true,
                onItemBuild: function (widget, parent) {
                    jQuery(parent)
                        .append('<p>' + clientApp.i18n.texts.get("Views.Crud.CrudExtended.SomeReadonlyValue") + '-><span class="SomeCustomValue">2</span></p>')
                        .find('p:first')
                            .click(function () {
                                jQuery(widget).widgetModelItem('change');
                            });
                },
                onItemValue: function (parent) {
                    return jQuery(parent).find('span.SomeCustomValue').html();
                },
                onItemBind: function (parent, dataItem) {
                    return jQuery(parent).find('span.SomeCustomValue').html(dataItem);
                }
            },
        }
        ];
    };

    return productFormModelGet;
});