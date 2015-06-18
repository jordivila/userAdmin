define([
    "jquery",
    "scripts/Template.App.Init",
], function ($, VsixMvcAppResult) {

    VsixMvcAppResult.Globalizer = {
        instance: null,
        get: function (currentCulture) {

            var dfd = jQuery.Deferred();

            if (VsixMvcAppResult.Globalizer.instance === null) {

                if (currentCulture !== undefined) {
                    // argument passed and not undefined
                } else {
                    currentCulture = VsixMvcAppResult.Utils.getCookie("locale");
                }

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

                    Globalize.loadMessages({
                        "en": {
                            "like": [
                              "{0, plural, offset:1",
                              "     =0 {Be the first to like this}",
                              "     =1 {You liked this}",
                              "    one {You and someone else liked this}",
                              "  other {You and # others liked this}",
                              "}"
                            ]
                        },
                        "es": {
                            "like": [
                              "{0, plural, offset:1",
                              "     =0 {Se el primero en darle a 'me gusta'}",
                              "     =1 {Te gusta esto}",
                              "    one {A ti y a alguien mas os gusta esto}",
                              "  other {A ti y a # más os gusta esto}",
                              "}"
                            ]
                        }
                    });


                    Globalize.locale(currentCulture);
                    VsixMvcAppResult.Globalizer.instance = Globalize;


                    dfd.resolve(VsixMvcAppResult.Globalizer.instance);

                });

            }
            else {

                dfd.resolve(VsixMvcAppResult.Globalizer.instance);

            }

            return dfd.promise();

        }
    };

    return VsixMvcAppResult;

});