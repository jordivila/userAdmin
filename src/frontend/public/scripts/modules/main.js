
define(
[
    'json', //requirejs plugin to load json data
    'text', //requirejs plugin to load text data
    'jquery',
    'domReady',
    'jqueryui',
    'history',
    'handlebars',
    'modernizr',
    'scripts/Template.Class.UrlHelper',
    'scripts/Template.ExtendPrototypes.String',
    'scripts/Template.Widget.Base',
    'scripts/Template.Widget.Menu.base',
    'scripts/Template.Widget.Menu.slides',
    'scripts/Template.Widget.Menu.nav',
    'scripts/Template.Widget.Page',
    "scripts/Template.App.ClientApp",
],
function (json, text, $, domReady, jqUI, hist, handl, Modernizr, url, a, b, c, d, e, f, clientApp) {
    return clientApp;
},
function () {
    console.log("requirejs ERROR at scripts/modules/main.js");
    console.log(arguments);
});