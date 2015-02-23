
(function ($) {

    VsixMvcAppResult.Ajax.HomePost = function (data, onOK, onKO, onComplete) {
        var jqxhr = jQuery.ajax({
            url: "/home",
            type: "POST",
            data:  JSON.stringify(data),
            //dataType: "html",
            cache: false
        })
        .done(function (data, textStatus, jqXHR) {
            onOK(data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            onKO(jqXHR);
        })
        .always(function (jqXHR, textStatus, errorThrown) {
            onComplete();
        });
    };


    jQuery(document).ready(function () {
        VsixMvcAppResult.Widgets.PageOptions.onInit(function () {

            var modelItems = function () {
                return [{
                    id: "SomeDate",
                    displayName: "Some Date value",
                    input: { type: "date", value: "09/02/2015" },
                }, {
                    id: "SomeFloat",
                    displayName: "Some Float Value",
                    input: { type: "float", value: 24.67 },
                }, {
                    id: "SomeBoolean",
                    displayName: "Some Boolean Value",
                    input: { type: "bool", value: false },
                }, {
                    id: "SomeBooleanNullable",
                    displayName: "Some Boolean Nullable Value",
                    input: { type: "bool", value: null, nullable: true },
                }, {
                    id: "SomeStringFromList",
                    displayName: "Some String From List",
                    input: { type: "list", value: null, listValues: [{ value: "", text: "Select from list" }, { value: "1", text: "First value" }] },
                }, {
                    id: "SomeCustomValue",
                    displayName: "Some Custom Value",
                    input: {
                        type: "custom",
                        value: null,
                        nullable: true,
                        onItemBuildCb: function (widget, parent) {
                            jQuery(parent)
                                .append('<p>some hidden value with custom widget functionality</p>')
                                .find('p:first')
                                    .click(function () {
                                        jQuery(widget).widgetModelItem('change');
                                    });
                        },
                        onItemValueCb: function (parent) {
                            return 2;
                        },
                    },
                },
                ];
            };
            
            var $modelForm = jQuery('#modelContainer').widgetModel({
                //widgetBase options
                allowClose: true,      // creates a close button on the top-right of a widget
                allowCollapse: true,   // creates a collapse button
                isCollapsed: false,     // initializes as a collapsed item
                onCollapsed: function (e, isVisible) { 
                    console.log(isVisible);
                },
                //
                displayName: "Demo UI Controls",
                modelItems: modelItems()
            });

            jQuery('#modelButtons')
                .find('button')
                    .button()
                    .click(function () {
                        var modelValue = $modelForm.widgetModel('val');
                        
                        VsixMvcAppResult.Ajax.HomePost(
                            modelValue,
                            function (data, textStatus, jqXHR) {
                                var keyValueArray = [];
                                for (var i = 0; i < data.data.length; i++) {
                                    if (jQuery.isArray(data.data[i].errors)) {
                                        keyValueArray.push({ key: data.data[i].id, value: data.data[i].errors });
                                    }
                                }
                                $modelForm.widgetModel('bindErrors', keyValueArray);
                            },
                            function (jqXHR, textStatus, errorThrown) {
                                console.log("HOMKE POST KO");
                            },
                            function (jqXHR, textStatus, errorThrown) {
                                console.log("HOMKE POST COMLPETED");
                            });

                    })
                .end()
                .buttonRibbon();

            setTimeout(function () { return jQuery('#modelButtons').find('button').click(); }, 1000);
        });
    });
})(jQuery);