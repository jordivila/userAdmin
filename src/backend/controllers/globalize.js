(function (module) {

    "use strict";

    module.exports = GlobalizeController;

    var markdown = require("markdown").markdown;
    var GenericViewController = require('./classes/genericView');
    var cldrDownloader = require("cldr-data-downloader");
    var Globalize = require("globalize");
    var config = require("../libs/config");
    var util = require("../libs/commonFunctions");
    var fs = require('fs');
    var bowerSrc = JSON.parse(fs.readFileSync(__dirname + "../../../../.bowerrc", 'utf8'));


    function GlobalizeController() {
        GenericViewController.apply(this, arguments);
    }
    GlobalizeController.prototype = new GenericViewController();
    GlobalizeController.prototype.initCldrData = function (cb) {

        cldrDownloader(
          "http://www.unicode.org/Public/cldr/26/json.zip",
          "./" + bowerSrc.directory + "/cldr-data",
          function (error) {



              if (error) {
                  console.error("Whops", error.message);
              }


              // Before we can use Globalize, we need to feed it on the appropriate I18n content (Unicode CLDR). 
              //Read Requirements on Getting Started on the root's README.md for more information.
              Globalize.load(
                  require("cldr-data/main/es/ca-gregorian"),
                  require("cldr-data/main/es/currencies"),
                  require("cldr-data/main/es/dateFields"),
                  require("cldr-data/main/es/numbers"),

                  require("cldr-data/main/en/ca-gregorian"),
                  require("cldr-data/main/en/currencies"),
                  require("cldr-data/main/en/dateFields"),
                  require("cldr-data/main/en/numbers"),

                  require("cldr-data/supplemental/currencyData"),
                  require("cldr-data/supplemental/likelySubtags"),
                  require("cldr-data/supplemental/plurals"),
                  require("cldr-data/supplemental/timeData"),
                  require("cldr-data/supplemental/weekData")
              );


              Globalize.loadMessages({
                  "es": {
                      "like": [
                        "{0, plural, offset:1",
                        "     =0 {Se el primero en darle click a 'Me gusta'}",
                        "     =1 {Te gusta esto}",
                        "    one {A ti y a alguien mas le gsuta esto}",
                        "  other {A ti y a # mas os gusta esto}",
                        "}"
                      ]
                  },
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
              });


              cb(error);
          }
        );


    };
    GlobalizeController.prototype.viewIndexModel = function (req, cb) {


        var like;
        var currentCulture = req.viewModel.Globalization.cultureGlobalization;


        Globalize.locale(currentCulture);

        var globInstance = new Globalize(Globalize.cldr);



        // Use Globalize to format dates.
        console.log(globInstance.formatDate(new Date(), { datetime: "medium" }));

        // Use Globalize to format numbers.
        console.log(globInstance.formatNumber(12345.6789));

        // Use Globalize to format currencies.
        console.log(globInstance.formatCurrency(69900, "USD"));

        // Use Globalize to get the plural form of a numeric value.
        console.log(globInstance.plural(12345.6789));

        // Use Globalize to format a message with plural inflection.
        like = globInstance.messageFormatter("like");
        console.log(like(0));
        console.log(like(1));
        console.log(like(2));
        console.log(like(3));

        // do the same in other way
        console.log(globInstance.formatMessage("like", [0]));
        console.log(globInstance.formatMessage("like", [1]));
        console.log(globInstance.formatMessage("like", [2]));
        console.log(globInstance.formatMessage("like", [3]));


        // Use Globalize to format relative time.
        console.log(globInstance.formatRelativeTime(-35, "second"));

        cb(null, {
            TheDate: globInstance.formatDate(new Date(), { datetime: "medium" }),
            TheNumber: globInstance.formatNumber(12345.6789),
            TheCurrency: globInstance.formatCurrency(69900, "USD"),
            ThePlural: globInstance.plural(12345.6789),
            TheTimeAgo: globInstance.formatRelativeTime(-35, "second"),
            TheMessages: [like(0), like(1), like(2), like(3)]
        });
    };

})(module);