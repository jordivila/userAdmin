define([
    "scripts/Template.App.Init",
],
function (VsixMvcAppResult) {

    VsixMvcAppResult.View = {
        main: function () {

            var currentCulture = VsixMvcAppResult.Utils.getCookie("locale");

            require([
                "globalize",

                // CLDR content.
                "json!cldr-data/main/" + currentCulture + "/ca-gregorian.json",
                "json!cldr-data/main/" + currentCulture + "/currencies.json",
                "json!cldr-data/main/" + currentCulture + "/dateFields.json",
                "json!cldr-data/main/" + currentCulture + "/numbers.json",
                "json!cldr-data/supplemental/currencyData.json",
                "json!cldr-data/supplemental/likelySubtags.json",
                "json!cldr-data/supplemental/plurals.json",
                "json!cldr-data/supplemental/timeData.json",
                "json!cldr-data/supplemental/weekData.json",
                //"json!messages/en.json",

                // Extend Globalize with Date and Number modules.
                "globalize/currency",
                "globalize/date",
                "globalize/message",
                "globalize/number",
                "globalize/plural",
                "globalize/relative-time"
            ], function (Globalize, enGregorian, enCurrencies, enDateFields, enNumbers, currencyData, likelySubtags,
                pluralsData, timeData, weekData/*, messages*/) {

                var en, like, number;

                // At this point, we have Globalize loaded. But, before we can use it, we need to feed it on the appropriate I18n content (Unicode CLDR). Read Requirements on Getting Started on the root's README.md for more information.
                Globalize.load(
                    currencyData,
                    enCurrencies,
                    enDateFields,
                    enGregorian,
                    enNumbers,
                    likelySubtags,
                    pluralsData,
                    timeData,
                    weekData
                );


                // Uncomment these lines for a standalone sample
                // This messages are actually setted at layout initialization

                //Globalize.loadMessages({
                //    "en": {
                //        "like": [
                //          "{0, plural, offset:1",
                //          "     =0 {Be the first to like this}",
                //          "     =1 {You liked this}",
                //          "    one {You and someone else liked this}",
                //          "  other {You and # others liked this}",
                //          "}"
                //        ]
                //    }
                //});



                // Instantiate "en".
                en = Globalize(currentCulture);

                // Use Globalize to format dates.
                document.getElementById("date").innerHTML = en.formatDate(new Date(), {
                    datetime: "medium"
                });

                // Use Globalize to format numbers.
                number = en.numberFormatter();
                document.getElementById("number").innerHTML = number(12345.6789);

                // Use Globalize to format currencies.
                document.getElementById("currency").innerHTML = en.formatCurrency(69900, "EUR");

                // Use Globalize to get the plural form of a numeric value.
                document.getElementById("plural-number").innerHTML = number(12345.6789);
                document.getElementById("plural-form").innerHTML = en.plural(12345.6789);

                // Use Globalize to format a message with plural inflection.
                like = en.messageFormatter("like");
                document.getElementById("message-0").innerHTML = like(0);
                document.getElementById("message-1").innerHTML = like(1);
                document.getElementById("message-2").innerHTML = like(2);
                document.getElementById("message-3").innerHTML = like(3);

                // Use Globalize to format a relative time.
                document.getElementById("relative-time").innerText = en.formatRelativeTime(-35, "second");

                document.getElementById("requirements").style.display = "none";
                document.getElementById("demo").style.display = "block";

            });

        }
    };

    return VsixMvcAppResult;
});