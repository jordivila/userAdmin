// Use $.getJSON instead of $.get if your server is not configured to return the
// right MIME type for .json files.
jQuery.when(
  jQuery.get("/public/cldr-data/main/en/ca-gregorian.json"),
  jQuery.get("/public/cldr-data/main/en/numbers.json"),
  jQuery.get("/public/cldr-data/main/en/currencies.json"),
  jQuery.get("/public/cldr-data/supplemental/currencyData.json"),
  jQuery.get("/public/cldr-data/supplemental/plurals.json"),
  jQuery.get("/public/cldr-data/supplemental/likelySubtags.json"),
  jQuery.get("/public/cldr-data/supplemental/timeData.json"),
  jQuery.get("/public/cldr-data/supplemental/weekData.json")
).then(function () {

    // Normalize jQuery.get results, we only need the JSON, not the request statuses.
    return [].slice.apply(arguments, [0]).map(function (result) {
        return result[0];
    });

}).then(Globalize.load).then(function () {



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
        }
    });




    // Your code goes here.

    var en, like, number;

    // Instantiate "en".
    en = Globalize("en");

    // Use Globalize to format dates.
    document.getElementById("date").innerHTML = en.formatDate(new Date(), {
        datetime: "medium"
    });

    // Use Globalize to format numbers.
    number = en.numberFormatter();
    document.getElementById("number").innerHTML = number(12345.6789);

    // Use Globalize to format currencies.ed
    document.getElementById("currency").innerHTML = en.formatCurrency(69900, "USD");

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
    //document.getElementById("relative-time").innerText = en.formatRelativeTime(-35, "second");

    document.getElementById("requirements").style.display = "none";
    document.getElementById("demo").style.display = "block";




});
