// Module definition https://github.com/umdjs/umd/blob/master/returnExports.js

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.handleBarsHelpers = factory();
    }
}(this, function () {


    var handleBarsHelpers = {
        jsonHelper: function (context) { return JSON.stringify(context); },
        breadcrumbHelper: function (context) {

            if (context.breadcrumb) {
                var tEach = function () {

                    var r = '';

                    for (var i = 0; i < context.breadcrumb.length; i++) {

                        if (context.breadcrumb[i].url) {
                            r += '<a href="' + context.breadcrumb[i].url + '">' + context.breadcrumb[i].title + '</a>';
                        }
                        else {
                            r += '<a href="javascript:void(0);">' + context.breadcrumb[i].title + '</a>';
                        }

                        r += '<i class="ui-icon fa fa-angle-double-left"></i>';

                    }

                    return r;
                };
                var t = '<div class="ui-breadcrumb ui-widget-content ui-corner-all ui-state-default">' +
                            '<i class="ui-breadcrumb-moveLeft fa fa-backward"></i>' +
                            '<div class="ui-breadcrumb-path">' +
                                tEach() + 
                            '</div>' +
                            '<i class="ui-breadcrumb-moveRight fa fa-forward "></i>' +
                            '<div class="ui-helper-clearfix"></div>' +
                        '</div>';

                return t;
            }
            else {
                return '';
            }
        }
    };


    return handleBarsHelpers;



}));