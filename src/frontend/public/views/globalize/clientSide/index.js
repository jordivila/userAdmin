define([
    "scripts/Template.App.ClientApp",
    "crossLayer/config"
],
function (clientApp, crossLayer) {

    clientApp.view = {
        main: function () {

            clientApp.globalizer.get()
             .done(function (Globalize) {

                 var currency = clientApp.utils.getCookie(crossLayer.cookies.currency);

                 jQuery("#date").html(Globalize.formatDate(new Date(), {
                     datetime: "medium"
                 }));

                 // Use Globalize to format numbers.
                 var number = Globalize.numberFormatter();
                 jQuery("#number").html(number(12345.6789));

                 // Use Globalize to format currencies.
                 jQuery("#currency").html(Globalize.formatCurrency(69900, currency));

                 // Use Globalize to get the plural form of a numeric value.
                 jQuery("#plural-number").html(number(12345.6789));
                 jQuery("#plural-form").html(Globalize.plural(12345.6789));

                 // Use Globalize to format a message with plural inflection.
                 like = Globalize.messageFormatter("Views.Globalize.Like");
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