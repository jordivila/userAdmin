
var productFormModelGet = function () {
    return [{
        id: "SomeString",
        displayName: "String",
        input: { value: "" },
    }, {
        id: "SomeDate",
        displayName: "Date",
        input: { type: "date", value: "" },
    }, {
        id: "SomeFloat",
        displayName: "Float",
        input: { type: "float", value: null },
    }, {
        id: "SomeBoolean",
        displayName: "Bool",
        input: { type: "bool", value: null },
    }, {
        id: "SomeBooleanNullable",
        displayName: "Null of Bool",
        input: { type: "bool", value: null, nullable: true },
    }, {
        id: "SomeStringFromList",
        displayName: "List of string",
        input: { type: "list", value: null, listValues: [{ value: "", text: "Select from list" }, { value: "1", text: "First value" }] },
    }, {
        id: "SomeCustomValue",
        displayName: "Custom Value",
        input: {
            type: "custom",
            value: null,
            nullable: true,
            onItemBuild: function (widget, parent) {
                jQuery(parent)
                    .append('<p>some readOnly value-><span class="SomeCustomValue">2</span></p>')
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
    },
    ];
};
