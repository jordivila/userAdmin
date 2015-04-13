    

    (function ($) {
        jQuery(document).ready(function () {

            VsixMvcAppResult.Widgets.PageOptions.onInit(function () {
                
                var $siteContent = jQuery('div.ui-siteContent:first');
                var loadTemplate = function (templUrl) {

                    jQuery.ajax({
                        url: "/template" + templUrl,
                        type: "GET",
                        dataType: "html",
                        data: {}
                    })
                    .done(function (data, textStatus, jqXHR) {
                        $siteContent.empty().html(data);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {

                        console.error("Error lading template '{0}' ->".format(templUrl), {
                            jqXHR: jqXHR,
                            textStatus: textStatus,
                            errorThrown: errorThrown
                        });

                        $siteContent.html('<div class="ui-state-error ui-site-templateInfo">Error loading template: {0} - {1} - {2} </div>'.format(jqXHR.status, textStatus, errorThrown));

                    })
                    .always(function () {
                        //self.progressHide();
                    });

                };

                loadTemplate(location.pathname);

            });

        });
    })(jQuery);
