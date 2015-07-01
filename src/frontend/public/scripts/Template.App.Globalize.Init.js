define([
    "jquery",
    "scripts/Template.App.Init",
    "scripts/Template.App.I18n.Init",
], function ($, clientApp, cI18n) {

    clientApp.Globalizer = {
        instance: null,
        get: function () {

            var dfd = jQuery.Deferred();

            var currentCulture = clientApp.Utils.getCookie("locale");

            if (clientApp.Globalizer.instance === null) {


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
                    messages[currentCulture] = clientApp.i18n.texts.data;
                    


                    Globalize.loadMessages(messages);
                    Globalize.locale(currentCulture);
                    clientApp.Globalizer.instance = Globalize;


                    dfd.resolve(clientApp.Globalizer.instance);

                });

            }
            else {

                dfd.resolve(clientApp.Globalizer.instance);

            }

            return dfd.promise();

        }
    };

    return clientApp;

});