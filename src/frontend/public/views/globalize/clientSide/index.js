define([
    "scripts/Template.App.Init",
    "crossLayer/config"
],
function (clientApp, crossLayer) {

    
    console.log("clientApp");
    console.log(clientApp);
    


    clientApp.View = {
        main: function () {

            console.log("clientAppII");
            console.log(clientApp);


            clientApp.Globalizer.get()
             .done(function (Globalize) {

                 console.log("clientAppIII");
                 console.log(clientApp);


                 var currency = clientApp.Utils.getCookie(crossLayer.cookies.currency);

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