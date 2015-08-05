define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "scripts/Template.Widget.Menu.slides"
],
function ($, jqUI, clientApp, wSlides) {

    jQuery.widget("ui.menuNav", jQuery.ui.widgetBase, {
        options: {
            texts: {
                errLoadingMenuData: null
            },
            $sitePage: null,
            $panelMenu: null,
            $panelMenuList: null,
            $panelMenuToggle: null,
        },
        _create: function () {
            this._super();

            this.options.texts.errLoadingMenuData = clientApp.i18n.texts.get("Template.Widget.Menu.nav.errLoadingMenuData");
            this.options.$sitePage = jQuery('div.ui-sitePage:first');
            this.options.$panelMenu = jQuery('#panelMenu');
            this.options.$panelMenuList = jQuery(this.options.$panelMenu).find('div.ui-menuBase:first');
            this.options.$panelMenuToggle = jQuery('div.ui-mainMenuToggle');
        },
        _init: function () {

            this._super();

            this._initMenuNav();
        },
        destroy: function () {
            this._super();
        },
        _errMsgSet: function (selector, msg) {
            jQuery(selector)
                .append("<div class='userActiviyErrMsg ui-state-error'></div><div class='ui-helper-clearfix'></div>")
                .find("div.userActiviyErrMsg:first")
                .html(msg);
        },
        _initMenuNav: function () {

            //TODO: load async Menu based on user identity
            var self = this;
            //var $sitePage = jQuery('div.ui-sitePage:first');
            //var $panelMenu = jQuery('#panelMenu');
            //var $panelMenuList = jQuery($panelMenu).find('div.ui-menuBase:first');
            //var $panelMenuToggle = jQuery('div.ui-mainMenuToggle');
            var panelMenuHide = function (cb) {
                self.options.$sitePage.show();
                self.options.$panelMenu.hide('slide', function () {
                    self.options.$panelMenu.removeClass('ui-front');

                    if (jQuery.isFunction(cb)) {
                        cb();
                    }
                });
            };
            var panelMenuShow = function (cb) {
                self.options.$panelMenu
                    .addClass('ui-front')
                    .show('drop', function () {
                        self.options.$sitePage.hide();

                        if (jQuery.isFunction(cb)) {
                            cb();
                        }
                    });
            };
            var panelMenuToggleOnClick = function (cb) {
                if (self.options.$panelMenu.is(':visible')) {
                    panelMenuHide(cb);
                }
                else {
                    panelMenuShow(cb);
                }
            };





            self.options.$panelMenuList.menuSlides({
                selected: function (e, templ) {

                    var templGetFunc = function () {
                        self._trigger('selected', null, templ);
                    };

                    if (self.options.$panelMenuToggle.is(':visible')) {
                        panelMenuHide(function () {
                            templGetFunc();
                        });
                    }
                    else {
                        templGetFunc();
                    }
                },
                done: function (e) {
                    self._initMenuSelected();
                }
            });


            /* Begin Ensure panel animations:
                1.- prevent clicking twice the same toggle button before panel animations are done
                2.- prevent adding click events twice
            */
            var panelMenuToggleClickBind = null;

            panelMenuToggleClickBind = function () {
                self.options.$panelMenuToggle
                    .one('click', function () {
                        self.options.$panelMenuToggle.unbind('click');
                        panelMenuToggleOnClick(function () {
                            panelMenuToggleClickBind();
                        });
                    });
            };

            panelMenuToggleClickBind();
            /* End Ensure panel animations */


            clientApp.ajax.userMenu(function (err, data) {

                if (err !== null) {
                    self._errMsgSet(self.options.$panelMenu, self.options.texts.errLoadingMenuData);
                }
                else {
                    self.options.$panelMenuList.menuSlides('bind', data);
                }

                self._trigger('complete', null, null);
            });

        },
        _initMenuSelected: function () {

            var pathName = location.pathname;

            this.options.$panelMenuList.menuSlides('select', function (menuItem) {

                if (menuItem.url == pathName) {
                    return true;
                }
            });

        },
        setCurrentUrl: function () {
            this._initMenuSelected();
        }
    });


});
