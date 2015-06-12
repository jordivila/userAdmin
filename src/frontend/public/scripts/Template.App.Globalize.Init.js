define([
    "jquery",
    "scripts/Template.App.Init",
], function ($, VsixMvcAppResult) {

    VsixMvcAppResult.Globalizer = {
        instance: null,
        get: function (currentCulture) {

            if (currentCulture !== undefined) {
                // argument passed and not undefined
            } else {
                currentCulture = VsixMvcAppResult.Utils.getCookie("locale");
            }

            var dfd = jQuery.Deferred();

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


                return dfd.resolve(Globalize);

            });


            return dfd.promise();


        }
    };

    return VsixMvcAppResult;

});






















//define([
//    "jquery",
//    "scripts/Template.App.Init",
//], function ($, VsixMvcAppResult) {

//    VsixMvcAppResult.Globalizer = {
//        instance: null,
//        get: function (currentCulture) {

//            if (currentCulture !== undefined) {
//                // argument passed and not undefined
//            } else {
//                currentCulture = VsixMvcAppResult.Utils.getCookie("locale");
//            }

//            var dfd = jQuery.Deferred();

//            require([
//                "globalize",
//                // CLDR content.
//                "json!cldr-data/main/" + currentCulture + "/ca-gregorian.json",
//                "json!cldr-data/main/" + currentCulture + "/currencies.json",
//                "json!cldr-data/main/" + currentCulture + "/dateFields.json",
//                "json!cldr-data/main/" + currentCulture + "/numbers.json",
//                "json!cldr-data/supplemental/currencyData.json",
//                "json!cldr-data/supplemental/likelySubtags.json",
//                "json!cldr-data/supplemental/plurals.json",
//                "json!cldr-data/supplemental/timeData.json",
//                "json!cldr-data/supplemental/weekData.json",
//                //"json!messages/en.json",

//                // Extend Globalize with Date and Number modules.
//                "globalize/currency",
//                "globalize/date",
//                "globalize/message",
//                "globalize/number",
//                "globalize/plural",
//                "globalize/relative-time"
//            ], function (Globalize, enGregorian, enCurrencies, enDateFields, enNumbers, currencyData, likelySubtags,
//                pluralsData, timeData, weekData/*, messages*/) {



//                // At this point, we have Globalize loaded. But, before we can use it, we need to feed it on the appropriate I18n content (Unicode CLDR). Read Requirements on Getting Started on the root's README.md for more information.
//                Globalize.load(
//                    currencyData,
//                    enCurrencies,
//                    enDateFields,
//                    enGregorian,
//                    enNumbers,
//                    likelySubtags,
//                    pluralsData,
//                    timeData,
//                    weekData
//                );


//                // Uncomment these lines for a standalone sample
//                // This messages are actually setted at layout initialization

//                Globalize.loadMessages({
//                    "en": {
//                        "like": [
//                          "{0, plural, offset:1",
//                          "     =0 {Be the first to like this}",
//                          "     =1 {You liked this}",
//                          "    one {You and someone else liked this}",
//                          "  other {You and # others liked this}",
//                          "}"
//                        ]
//                    },
//                    "es": {
//                        "like": [
//                          "{0, plural, offset:1",
//                          "     =0 {Se el primero en darle a 'me gusta'}",
//                          "     =1 {Te gusta esto}",
//                          "    one {A ti y a alguien mas os gusta esto}",
//                          "  other {A ti y a # más os gusta esto}",
//                          "}"
//                        ]
//                    }
//                });


//                Globalize.locale(currentCulture);


//                return dfd.resolve(Globalize);

//            });


//            return dfd.promise();


//        }
//    };

//    return VsixMvcAppResult;

//});