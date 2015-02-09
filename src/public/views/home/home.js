/// <reference path="../../scripts/Template.Init.js" />


(function ($) {
    jQuery(document).ready(function () {
        VsixMvcAppResult.Widgets.Page.onInit(function () {
            

            


            jQuery('#uiControls').widgetForm({
                displayName: "Demo UI Controls",
                formItems: [
                {
                    id: "SomeDate",
                    displayName: "Some Date value",
                    input: { type: "date", value: "09/02/2015" }
                },
                {
                    id: "SomeFloat",
                    displayName: "Some Float Value",
                    input: { type: "float", value: 24.67 }
                },
                {
                    id: "SomeBoolean",
                    displayName: "Some Boolean Value",
                    input: { type: "bool", value: false }
                },
                {
                    id: "SomeBooleanNullable",
                    displayName: "Some Boolean Nullable Value",
                    input: { type: "bool", value: null, nullable: true }
                },
                ]
            });



            jQuery('#homeForms').widgetJqueryzer();

            //jQuery('#formWidgetFormItems').widgetJqueryzer();

        });
    });
})(jQuery);