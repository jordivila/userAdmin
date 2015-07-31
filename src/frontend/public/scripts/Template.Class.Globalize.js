define([
    "jquery",
    "crossLayer/config",
    "scripts/Template.Class.Utils"
], function ($, crossLayer, Utils) {


    function GlobalizeHelper() {

    }

    GlobalizeHelper.prototype.instance = null;
    GlobalizeHelper.prototype.i18nTexts = null;
    GlobalizeHelper.prototype.get = function () {

        var dfd = jQuery.Deferred();
        var self = this;

        var currentCulture = new Utils().getCookie(crossLayer.cookies.i18nLocale);

        if (self.instance === null) {


            require([
                "scripts/modules/glob",

                "json!cldr-data/main/" + currentCulture + "/ca-gregorian.json",
                "json!cldr-data/main/" + currentCulture + "/currencies.json",
                "json!cldr-data/main/" + currentCulture + "/dateFields.json",
                "json!cldr-data/main/" + currentCulture + "/numbers.json",
            ], function (Globalize, enGregorian, enCurrencies, enDateFields, enNumbers) {


                // At this point, we have Globalize loaded. But, before we can use it, we need to feed it on the appropriate I18n content (Unicode CLDR). Read Requirements on Getting Started on the root's README.md for more information.
                Globalize.load(
                    enCurrencies,
                    enDateFields,
                    enGregorian,
                    enNumbers
                );


                // Uncomment these lines for a standalone sample
                // This messages are actually setted at layout initialization


                var messages = {};
                messages[currentCulture] = self.i18nTexts;// clientApp.i18n.texts.data;



                Globalize.loadMessages(messages);
                Globalize.locale(currentCulture);

                self.instance = Globalize;


                dfd.resolve(self.instance);

            });

        }
        else {

            dfd.resolve(self.instance);

        }

        return dfd.promise();

    };

    return GlobalizeHelper;

});