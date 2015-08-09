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

           Utils.prototype.guid = function () {

               //NOTE: This creates GUID-like strings and not GUIDs. @broofa's node-uuid module is much better than this implementation.
               //https://github.com/broofa/node-uuid

               var d = new Date().getTime();
               var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                   var r = (d + Math.random() * 16) % 16 | 0;
                   d = Math.floor(d / 16);
                   return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
               });
               return uuid;
           };

           Utils.prototype.replaceAll = function (find, replace, string) {
               return string.replace(new RegExp(find, 'g'), replace);
           };

           Utils.prototype.convertEmToPixels = function (value) {
               return value * (parseFloat(getComputedStyle(document.documentElement).fontSize));
           };

           Utils.prototype.cssAdd = function (id, cssText) {

               // this method is intended to add css text. Not link href="whatever"

               if (document.getElementById(id) === null) {
                   var head = document.head || document.getElementsByTagName('head')[0],
                       style = document.createElement('style');

                   style.id = id;
                   style.type = 'text/css';
                   if (style.styleSheet) {
                       style.styleSheet.cssText = cssText;
                   } else {
                       style.appendChild(document.createTextNode(cssText));
                   }

                   head.appendChild(style);
               }


           };

           Utils.prototype.setPageTitle = function (content) {
               jQuery('div.ui-site-title')
                   .find('h1:first')
                       .html(content)
                   .end();
           };


           return Utils;

       });