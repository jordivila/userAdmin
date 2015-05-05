jQuery.widget("ui.langSelector", jQuery.ui.widgetBase,
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
            .find('ul.ui-languageSelector-list:first')
                .find('li')
                    .click(function (e, ui) {
                        var langSelected = jQuery(this).attr('data-language-id');
                        self.errorHide();
                        self.applyLang(langSelected);
                    })
                .end()
            .end();

        jQuery(self.element)
            .find('div.ui-languageSelector-messages:first')
                .each(function () {
                    self.errorInit(jQuery(this));
                })
            .end();

    },
    destroy: function () {

        this._super();

    },
    applyLang: function (langId) {

        var self = this;

        self._applyLang(langId)
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
    _applyLang: function (langId) {

        var self = this;
        var dfd = jQuery.Deferred();

        dfd.notify("Aplicando idioma...");

        var ajaxMethod = function () {
            return jQuery.ajax({
                url: "/languages/",
                type: "PUT",
                data: JSON.stringify({ localeNewValue: langId }),
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