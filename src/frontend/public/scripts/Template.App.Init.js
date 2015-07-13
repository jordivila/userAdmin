define([
    'scripts/Template.App.Cache.Init',
    'scripts/Template.App.Utils.Init',
    'scripts/Template.App.Ajax.Init',
    'scripts/Template.App.I18n.Init',
    'scripts/Template.App.Globalize.Init',
],
function (CacheControl, Utils, Ajax, I18NTexts, GlobalizeHelper) {

    var clientApp = {};

    clientApp.Ajax = new Ajax();
    clientApp.cache = new CacheControl();
    clientApp.Utils = new Utils();


    clientApp.i18n = {
        texts: new I18NTexts(),
        images: {}
    };

    clientApp.Globalizer = new GlobalizeHelper();

    clientApp.Widgets = {};

    return clientApp;

});
