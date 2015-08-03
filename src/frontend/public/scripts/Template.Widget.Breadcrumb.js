define([
    "jquery",
    "jqueryui",
    "scripts/jQuery.Plugins.scrollUtils",
    "scripts/Template.Class.Utils"
],
function ($, jqUI, scrollUtils, Utils) {


    jQuery.widget("ui.breadcrumb", jQuery.ui.menuBase, {
        options: {

        },
        _create: function () {

            this._super();

        },
        _init: function () {

            this._super();

            var self = this;
            var utils = new Utils();
            var $el = $(self.element);
            var $breadCrumbPath = $el.find('div.ui-breadcrumb-path:first');
            var $breadCrumbLeft = $el.find('i.ui-breadcrumb-moveLeft:first');
            var $breadCrumbRight = $el.find('i.ui-breadcrumb-moveRight:first');
            var leftPlusRightWidth = $breadCrumbLeft.outerWidth(true) + $breadCrumbRight.outerWidth(true);
            var checkButtonsWhenScroll = function () {


                if ($breadCrumbPath.scrollLeft() === 0) {
                    $breadCrumbLeft.addClass('ui-state-disabled');
                }
                else {
                    $breadCrumbLeft.removeClass('ui-state-disabled');
                }


                if ($breadCrumbPath.isScrollNearRight(1)) {
                    $breadCrumbRight.addClass('ui-state-disabled');
                }
                else {
                    $breadCrumbRight.removeClass('ui-state-disabled');
                }

            };
            var messageWidgetResizeInit = function () {

                var widgetResize = function () {
                    $breadCrumbPath.width($el.parents().first().width() - (leftPlusRightWidth + utils.convertEmToPixels(7)));
                };

                jQuery(window)
                    .resize(function (e, ui) {
                        widgetResize();
                    });

                widgetResize();
            };
            var scrollStep = function () {
                return $breadCrumbPath.outerWidth() / ($breadCrumbPath.find('i.ui-icon:last').length);
            };

            $breadCrumbPath
                .addClass('ui-helper-hidden')
                .find('i.ui-icon:last')
                    .hide()
                .end();

            setTimeout(function () {
                messageWidgetResizeInit();

                

                $breadCrumbLeft.click(function () {
                    if (!$breadCrumbLeft.hasClass('ui-state-disabled')) {
                        
                        $breadCrumbPath.stop().animate({ scrollLeft: (($breadCrumbPath.scrollLeft()) - scrollStep()) }, '500', 'swing', function () {
                            checkButtonsWhenScroll();
                        });
                    }
                });
                $breadCrumbRight.click(function () {
                    if (!$breadCrumbRight.hasClass('ui-state-disabled')) {

                        $breadCrumbPath
                            .stop()
                            .animate({ scrollLeft: (($breadCrumbPath.scrollLeft()) + scrollStep()) }, '500', 'swing',
                                function () {
                                    checkButtonsWhenScroll();
                                });
                    }
                });


                $breadCrumbPath.removeClass('ui-helper-hidden');
            }, 1000);




        },
        destroy: function () {

            this._super();
        },
    });


});