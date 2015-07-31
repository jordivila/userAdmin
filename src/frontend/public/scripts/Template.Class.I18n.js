define([
    'scripts/Template.Class.I18n.Texts'
],
function (I18NTexts) {

    function I18n() {
        this.texts = new I18NTexts();
        this.images = {};
    }

    I18n.prototype.texts = null;
    I18n.prototype.images = null;

    return I18n;

});