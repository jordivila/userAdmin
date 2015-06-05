define([
    "scripts/Template.App.Init",
],
function (VsixMvcAppResult) {

    VsixMvcAppResult.View = {
        main: function () {

            var currentCulture = VsixMvcAppResult.Utils.getCookie("locale");

            VsixMvcAppResult.Globalizer.init(currentCulture)
             .done(function (Globalize) {

                 //console.log("yahooooooooooooooooooooo");
                 //console.log(arguments);
                 //console.log(Globalize("en"));
                 //console.log(VsixMvcAppResult.Globalizer.instance);

                 //Globalize = VsixMvcAppResult.Globalizer.instance;

                 var showSample = function () {

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


                 };

                 showSample();
                 



             });

        }
    };

    return VsixMvcAppResult;
});