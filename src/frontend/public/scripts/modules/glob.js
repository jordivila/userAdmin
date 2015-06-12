define([
    "globalize",
    // CLDR content.
    //"json!cldr-data/main/" + currentCulture + "/ca-gregorian.json",
    //"json!cldr-data/main/" + currentCulture + "/currencies.json",
    //"json!cldr-data/main/" + currentCulture + "/dateFields.json",
    //"json!cldr-data/main/" + currentCulture + "/numbers.json",
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
], function (Globalize/*, enGregorian, enCurrencies, enDateFields, enNumbers*/,
            currencyData,
            likelySubtags,
            pluralsData,
            timeData,
            weekData
    /*, messages*/) {

    // At this point, we have Globalize loaded. But, before we can use it, we need to feed it on the appropriate I18n content (Unicode CLDR). Read Requirements on Getting Started on the root's README.md for more information.
    Globalize.load(
        currencyData,
        //enCurrencies,
        //enDateFields,
        //enGregorian,
        //enNumbers,
        likelySubtags,
        pluralsData,
        timeData,
        weekData
    );

    return Globalize;

});