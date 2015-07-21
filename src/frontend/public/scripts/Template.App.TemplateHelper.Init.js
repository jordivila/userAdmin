define([
    "history"
],
function (hist) {


    function TemplateHelper() {

    }

    TemplateHelper.prototype.loadByUrl = function (url) {
        History.pushState(null, null, url);
    };

    return TemplateHelper;

});