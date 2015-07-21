define([
    'scripts/Template.App.Cache.Init',
    'scripts/Template.App.Utils.Init',
    'scripts/Template.App.Ajax.Init',
    'scripts/Template.App.I18n.Init',
    'scripts/Template.App.Globalize.Init',
    'scripts/Template.App.TemplateHelper.Init',
],
function (CacheControl, Utils, Ajax, I18NTexts, GlobalizeHelper, TemplateHelper) {

    var clientApp = {};

    clientApp.ajax = new Ajax();
    clientApp.cache = new CacheControl();
    clientApp.utils = new Utils();
    clientApp.i18n = {
        texts: new I18NTexts(),
        images: {}
    };
    clientApp.globalizer = new GlobalizeHelper();
    clientApp.widgets = {};
    clientApp.template = new TemplateHelper();
    return clientApp;

});
