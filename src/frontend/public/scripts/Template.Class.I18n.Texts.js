define([],
       function () {

           function I18NTexts() {

           }

           I18NTexts.prototype.data = null;

           I18NTexts.prototype.get = function (key) {
               if (this.data[key]) {
                   return this.data[key];
               }
               else {
                   return key;
               }
           };

           return I18NTexts;

       });