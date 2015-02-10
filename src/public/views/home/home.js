/// <reference path="../../scripts/Template.Init.js" />


(function ($) {
    jQuery(document).ready(function () {
        VsixMvcAppResult.Widgets.PageOptions.onInit(function () {
            
            var $modelForm = jQuery('#modelContainer').widgetModel({
                //widgetBase options
                allowClose: false,      // creates a close button on the top-right of a widget
                allowCollapse: true,   // creates a collapse button
                isCollapsed: false,     // initializes as a collapsed item
                onCollapsed: function (e, isVisible) { 
                    console.log(isVisible);
                },
                //
                displayName: "Demo UI Controls",
                formItems: [{
                        id: "SomeDate",
                        displayName: "Some Date value",
                        input: { type: "date", value: "09/02/2015" }
                    }, {
                        id: "SomeFloat",
                        displayName: "Some Float Value",
                        input: { type: "float", value: 24.67 }
                    }, {
                        id: "SomeBoolean",
                        displayName: "Some Boolean Value",
                        input: { type: "bool", value: false }
                    }, {
                        id: "SomeBooleanNullable",
                        displayName: "Some Boolean Nullable Value",
                        input: { type: "bool", value: null, nullable: true }
                    },
                ]
            });

            jQuery('#modelButtons')
                .find('button')
                .button()
                .click(function () {
                    var modelValue = $modelForm.widgetModel('value');
                    console.log(modelValue);
                });

            setTimeout(function () { return jQuery('#modelButtons').find('button').click(); }, 1000);


            //jQuery('#homeForms').widgetJqueryzer();

            //jQuery('#formwidgetModelItems').widgetJqueryzer();

        });
    });
})(jQuery);