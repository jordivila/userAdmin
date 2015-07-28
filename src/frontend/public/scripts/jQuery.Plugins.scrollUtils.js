define([
    "jquery",
    "scripts/Template.App.Utils.Init"
],
    function ($, Utils) {


        (function ($) {

            var utils = new Utils();

            $.fn.hasScrollBar = function () {
                return this.get(0).scrollHeight > this.get(0).clientHeight;
            };

            $.fn.isScrollToBottom = function () {
                return $(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight);
            };

            $.fn.isScrollNearToBottom = function (howNearInEmUnits) {
                return $(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - utils.convertEmToPixels(howNearInEmUnits));
            };

            $.fn.scrollToBottom = function () {
                return $(this).scrollTop($(this)[0].scrollHeight);
            };

        })(jQuery);

       
    });