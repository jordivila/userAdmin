define([],
       function () {

           function CacheControl() {

           }

           CacheControl.prototype.get = function (key) {
               if (localStorage) {
                   return localStorage.getItem(key);
               }
               else {
                   return null;
               }
           };

           CacheControl.prototype.set = function (key, value) {
               if (localStorage) {
                   return localStorage.setItem(key, value);
               }
               else {
                   return null;
               }
           };

           return CacheControl;

       });