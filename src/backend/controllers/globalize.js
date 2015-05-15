(function (module) {

    "use strict";

    module.exports = GlobalizeController;

    var markdown = require("markdown").markdown;
    var GenericViewController = require('./classes/genericView');

    function GlobalizeController() {
        GenericViewController.apply(this, arguments);
    }
    GlobalizeController.prototype = new GenericViewController();
    GlobalizeController.prototype.viewIndexModel = function (req, cb) {


        var like;
        var Globalize = require("globalize");

        var currentCulture = 'es';

        // Before we can use Globalize, we need to feed it on the appropriate I18n content (Unicode CLDR). Read Requirements on Getting Started on the root's README.md for more information.
        Globalize.load(
            require("cldr-data/main/" + currentCulture + "/ca-gregorian"),
            require("cldr-data/main/" + currentCulture + "/currencies"),
            require("cldr-data/main/" + currentCulture + "/dateFields"),
            require("cldr-data/main/" + currentCulture + "/numbers"),
            require( "cldr-data/supplemental/currencyData" ),
            require( "cldr-data/supplemental/likelySubtags" ),
            require( "cldr-data/supplemental/plurals" ),
            require( "cldr-data/supplemental/timeData" ),
            require( "cldr-data/supplemental/weekData" )
        );
        //Globalize.loadMessages( require( "./messages/es" ) );

        // Set "en" as our default locale.
        Globalize.locale(currentCulture);

        // Use Globalize to format dates.
        console.log( Globalize.formatDate( new Date(), { datetime: "medium" } ) );

        // Use Globalize to format numbers.
        console.log( Globalize.formatNumber( 12345.6789 ) );

        // Use Globalize to format currencies.
        console.log( Globalize.formatCurrency( 69900, "USD" ) );

        // Use Globalize to get the plural form of a numeric value.
        console.log( Globalize.plural( 12345.6789 ) );

        // Use Globalize to format a message with plural inflection.
        //like = Globalize.messageFormatter( "like" );
        //console.log( like( 0 ) );
        //console.log( like( 1 ) );
        //console.log( like( 2 ) );
        //console.log( like( 3 ) );

        // Use Globalize to format relative time.
        console.log( Globalize.formatRelativeTime( -35, "second" ) );

        cb(null, {
            TheDate: Globalize.formatDate(new Date(), { datetime: "medium" }),
            TheNumber: Globalize.formatNumber(12345.6789),
            TheCurrency: Globalize.formatCurrency(69900, "USD"),
            ThePlural: Globalize.plural(12345.6789),
            TheTimeAgo: Globalize.formatRelativeTime(-35, "second")
        });
    };

})(module);