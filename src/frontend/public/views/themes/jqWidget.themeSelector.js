jQuery.widget("ui.themeSelector", jQuery.ui.widgetBase,
{
    options: {

    },
    _create: function () {

        var self = this;

        this._super();

    },
    _init: function () {

        var self = this;

        this._super();

        jQuery(self.element)
            .find('ul.ui-themeSelector-list:first')
                .find('li')
                    .click(function (e, ui) {
                        var themeSelected = jQuery(this).attr('data-theme-id');
                        self.errorHide();
                        self.applyTheme(themeSelected);
                    })
                .end()
            .end();

        jQuery(self.element)
            .find('div.ui-themeSelector-messages:first')
                .each(function () {
                    self.errorInit(jQuery(this));
                })
            .end();

    },
    destroy: function () {

        this._super();

    },
    applyTheme: function (themeId) {

        var self = this;

        self._applyTheme(themeId)
                .progress(function (status) {
                    self.progressShow(status);
                })
                .fail(function (args) {
                    self.progressHide();
                    self.errorDisplay(args);
                })
                .always(function () {
                    self.progressHide();
                });
    },
    _applyTheme: function (themeId) {

        var self = this;
        var dfd = jQuery.Deferred();

        dfd.notify("Aplicando idioma...");

        var ajaxMethod = function () {
            return jQuery.ajax({
                url: "/themes/",
                type: "PUT",
                data: JSON.stringify({ newTheme: themeId }),
                cache: false
            });
        };

        jQuery.when(ajaxMethod())
            .then(
                function (result, statusText, jqXHR) {
                    if (result.isValid) {
                        dfd.resolve();

                        location.reload();
                    }
                    else {
                        dfd.reject(result.messages[0]);
                    }
                },
                function (jqXHR, textStatus, errorThrown) {
                    dfd.reject("Error no controlado al seleccionar el idioma");
                })
            .done(function () {

            });


        return dfd.promise();
    }
});