define([
    "scripts/Template.App.Init",
],
function (clientApp) {

    clientApp.View = {
        main: function () {

            clientApp.Globalizer.get()
             .done(function (Globalize) {

                 jQuery("#date").html(Globalize.formatDate(new Date(), {
                     datetime: "medium"
                 }));

                 // Use Globalize to format numbers.
                 number = Globalize.numberFormatter();
                 jQuery("#number").html(number(12345.6789));

                 // Use Globalize to format currencies.
                 jQuery("#currency").html(Globalize.formatCurrency(69900, "EUR"));

                 // Use Globalize to get the plural form of a numeric value.
                 jQuery("#plural-number").html(number(12345.6789));
                 jQuery("#plural-form").html(Globalize.plural(12345.6789));

                 // Use Globalize to format a message with plural inflection.
                 like = Globalize.messageFormatter("like");
                 jQuery("#message-0").html(like(0));
                 jQuery("#message-1").html(like(1));
                 jQuery("#message-2").html(like(2));
                 jQuery("#message-3").html(like(3));

                 // Use Globalize to format a relative time.
                 jQuery("#relative-time").html(Globalize.formatRelativeTime(-35, "second"));

                 jQuery("#requirements").hide();
                 jQuery("#demo").show();

             });

        }
    };

    return clientApp;
});