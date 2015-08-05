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
            var $breadCrumbAnchors = $breadCrumbPath.find('div.ui-breadcrumb-anchors:first');
            var $breadCrumbLeft = $el.find('div.ui-breadcrumb-moveLeft:first');
            var $breadCrumbRight = $el.find('div.ui-breadcrumb-moveRight:first');
            var breadcrumbIsSinglePage = function () {
                return anchorsLength === 0;
            };
            var buttonsCheckAvailable = function () {


                if (anchorCurrent === 0) {
                    $breadCrumbLeft.addClass('ui-state-disabled');
                }
                else {
                    $breadCrumbLeft.removeClass('ui-state-disabled');
                }


                if (anchorCurrent === anchorsLength) {
                    $breadCrumbRight.addClass('ui-state-disabled');
                }
                else {
                    $breadCrumbRight.removeClass('ui-state-disabled');
                }

            };
            var anchorsLength = $breadCrumbPath.find('a').length - 1;
            var anchorCurrent = anchorsLength;
            var anchorMovement = function (callback) {

                $breadCrumbPath
                    .fadeOut(200, function () {
                        $breadCrumbPath
                            .find('a')
                                //.removeClass('ui-state-active')
                                .addClass('ui-helper-hidden')
                            .end()
                            .find('a:eq(' + (anchorCurrent) + ')')
                                //.addClass('ui-state-active')
                                .removeClass('ui-helper-hidden')
                            .end()
                            .fadeIn(function () {
                                if (callback) {
                                    callback();
                                }
                            });
                    });

                buttonsCheckAvailable();
            };
            var anchorMove = function (isForward) {

                console.log(isForward);
                console.log(anchorCurrent);
                console.log(anchorsLength);

                if (isForward) {
                    if (anchorCurrent < anchorsLength) {
                        anchorCurrent++;
                        anchorMovement();
                    }
                }
                else {
                    if (anchorCurrent > 0) {
                        anchorCurrent--;
                        anchorMovement();
                    }
                }
            };

            var init = function () {

                var afterInit = function () {

                    $breadCrumbAnchors
                        .find('a')
                        .click(function (event) {
                            event.preventDefault();
                            self._trigger('select', null, jQuery(this).attr('href'));
                        });

                    jQuery(self.element).removeClass('ui-helper-invisible');
                };

                if (breadcrumbIsSinglePage()) {
                    $breadCrumbLeft.click(function () {
                        $breadCrumbAnchors.find('a:first').click();
                    });
                    afterInit();
                }
                else {
                    $breadCrumbLeft.click(function () {
                        anchorMove(false);
                    });
                    $breadCrumbRight.click(function () {
                        anchorMove(true);
                    });
                    $breadCrumbPath.removeClass('ui-helper-hidden');
                    anchorMovement(function () {
                        afterInit();
                    });
                }
            };

            jQuery(this.element)
                .addClass(breadcrumbIsSinglePage() === true ? 'ui-breadcrumb-singlePage' : 'ui-breadcrumb-multiplePage')
                .find($breadCrumbPath)
                    .addClass('ui-helper-hidden')
                    .find('i.ui-icon:last')
                        .addClass('ui-helper-invisible')
                    .end()
                    .find($breadCrumbAnchors)
                        .addClass(breadcrumbIsSinglePage() === true ? '' : 'ui-state-active')
                    .end()
                .end();

            setTimeout(function () {
                init();
            }, 1);




        },
        destroy: function () {

            this._super();
        },
    });


});