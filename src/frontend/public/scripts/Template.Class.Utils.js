define([],
       function () {

           function Utils() {

           }

           function cookieHelper(name, value, days, deleteIt) {
               // if value is undefined, get the cookie value
               if (value === undefined) {
                   var cookiestring = "; " + window.document.cookie;
                   var cookies = cookiestring.split("; " + name + "=");
                   if (cookies.length === 2) {
                       return cookies.pop().split(";").shift();
                   }
                   return null;
               }
               else {
                   // if value is a false boolean, we'll treat that as a delete
                   if (deleteIt === true) {
                       days = -1;
                   }
                   var expires;
                   if (days) {
                       var date = new Date();
                       date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                       expires = "; expires=" + date.toGMTString();
                   }
                   else {
                       expires = "";
                   }
                   window.document.cookie = name + "=" + value + expires + "; path=/";
               }
           }

           Utils.prototype.cookieGet = function (name) {
               return cookieHelper(name);
           };

           Utils.prototype.cookieSet = function (name, value, days) {

               if (arguments.length !== 3) {
                   throw new Error("Argument exception");
               }

               cookieHelper(name, value, days);
           };

           Utils.prototype.cookieSetForSession = function (name, value) {

               if (arguments.length !== 2) {
                   throw new Error("Argument exception");
               }

               cookieHelper(name, value);
           };

           Utils.prototype.cookieDelete = function (name) {

               if (arguments.length !== 1) {
                   throw new Error("Argument exception");
               }

               cookieHelper(name, null, null, true);
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