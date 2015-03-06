(function ($) {
    jQuery(document).ready(function () {
        VsixMvcAppResult.Widgets.PageOptions.onInit(function () {
            jQuery('div.ui-cirDataEntry:first').cirDataEntry();

            jQuery('div.ui-themeCrud').crud(jQuery.extend({}, crudThemeOptions(), {
                onSelect: function (e, dataItem) {
                    //<link id="jQueryUITheme" href="//ajax.googleapis.com/ajax/libs/jqueryui/1/themes/redmond/jquery-ui.css" rel="Stylesheet" type="text/css" />


                    //jQuery('#jQueryUITheme').attr('href', ');

                    var cssUri = '//ajax.googleapis.com/ajax/libs/jqueryui/1/themes/{0}/jquery-ui.css'.format(dataItem.name);


                    var themeGet = function (onOK, onKO) {

                        console.log("carga");

                        var jqxhr = jQuery.ajax({
                            url: cssUri,
                            type: "GET",
                            dataType: "script",
                            data: {}
                        })
                        .done(function (data, textStatus, jqXHR) {
                            onOK(data);
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            onKO(jqXHR);
                        })
                        .always(function () {
                            console.log("acaba");
                        });
                    };


                    themeGet(
                        function () {
                            jQuery('#jQueryUITheme').attr('href', cssUri);
                        },
                        function () {

                        });

                    //var jqxhr = $.get(cssUri, function () {
                    //    alert("success");
                    //})
                    //  .done(function () {
                    //      alert("second success");
                    //  })
                    //  .fail(function () {
                    //      alert("error");
                    //      console.log(arguments);
                    //  })
                    //  .always(function () {
                    //      alert("finished");
                    //  });





                    //jQuery.get(cssUri, function (data) {

                    //    alert("jsdh");

                    //    jQuery('#jQueryUITheme').attr('href', cssUri);
                    //    //$(".result").html(data);
                    //    //alert("Load was performed.");
                    //});

                },
            }));
        });
    });
})(jQuery);


