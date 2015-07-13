define([],
       function () {


           function Utils() {

           }

           Utils.prototype.getCookie = function (cname) {
               var name = cname + "=";
               var ca = document.cookie.split(';');
               for (var i = 0; i < ca.length; i++) {
                   var c = ca[i];
                   while (c.charAt(0) == ' ') c = c.substring(1);
                   if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
               }
               return "";
           };

           Utils.prototype.htmlEncode = function (html) {
               return document.createElement('a').appendChild(
                   document.createTextNode(html)).parentNode.innerHTML;
           };

           Utils.prototype.htmlDecode = function (html) {
               var a = document.createElement('a'); a.innerHTML = html;
               return a.textContent;
           };

           return Utils;

       });