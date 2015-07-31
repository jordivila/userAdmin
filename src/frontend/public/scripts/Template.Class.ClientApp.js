define([
    'scripts/Template.Class.Cache',
    'scripts/Template.Class.Utils',
    'scripts/Template.Class.Ajax',
    'scripts/Template.Class.I18n',
    'scripts/Template.Class.Globalize',
    'scripts/Template.Class.TemplateHelper',
],
function (CacheControl, Utils, Ajax, I18n, GlobalizeHelper, TemplateHelper) {

    function ClientApp() {
        this.ajax = new Ajax();
        this.cache = new CacheControl();
        this.utils = new Utils();
        this.i18n = new I18n();
        this.globalizer = new GlobalizeHelper();
        this.widgets = {};
        this.template = new TemplateHelper();
    }

    ClientApp.prototype.ajax = null;
    ClientApp.prototype.cache = null;
    ClientApp.prototype.utils = null;
    ClientApp.prototype.i18n = {};
    ClientApp.prototype.globalizer = null;
    ClientApp.prototype.widgets = null;
    ClientApp.prototype.template = null;

    return ClientApp;

    //return new ClientApp();

});
