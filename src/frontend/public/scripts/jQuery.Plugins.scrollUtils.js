define([
    "jquery",
    "scripts/Template.Class.Utils"
],
    function ($, Utils) {


        (function ($) {

            var utils = new Utils();

            $.fn.hasScrollBar = function () {
                return this.get(0).scrollHeight > this.get(0).clientHeight;
            };

            $.fn.isScrollAtBottom = function () {
                return $(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight);
            };

            $.fn.isScrollAtRight = function () {
                return $(this).scrollLeft() + $(this).innerWidth() >= ($(this)[0].scrollWidth);
            };

            $.fn.isScrollNearBottom = function (howNearInEmUnits) {
                return $(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - utils.convertEmToPixels(howNearInEmUnits));
            };

            $.fn.isScrollNearRight = function (howNearInEmUnits) {
                return $(this).scrollLeft() + $(this).innerWidth() >= ($(this)[0].scrollWidth - utils.convertEmToPixels(howNearInEmUnits));
            };

            $.fn.scrollToBottom = function () {
                return $(this).scrollTop($(this)[0].scrollHeight);
            };


        })(jQuery);

       
    });