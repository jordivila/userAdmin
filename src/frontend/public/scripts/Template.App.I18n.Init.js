define(["scripts/Template.App.Init"],
       function (clientApp) {

           clientApp.i18n = {
               texts: {
                   data: null,
                   get: function (key) {
                       if (clientApp.i18n.texts.data[key]) {
                           return clientApp.i18n.texts.data[key];
                       }
                       else {
                           return key;
                       }
                   }
               }
           };

           return clientApp;

       });