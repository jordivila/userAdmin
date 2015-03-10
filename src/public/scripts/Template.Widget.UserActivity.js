/// <reference path="VsixMvcAppResult.A.Intellisense.js" />

jQuery.widget("ui.userActivity", jQuery.ui.widgetBase, {
    options: {

    },
    _create: function () {
        this._super();
    },
    _init: function () {

        this._super();

        //this.initMenuNav();
        this._updateUserLastActivity();
    },
    destroy: function () {
        this._super();
    },
    _errMsgSet: function (selector, msg) {
        jQuery(selector)
            .append("<div></div><div class='ui-helper-clearfix'></div>")
            .find("div:first")
            .html(msg);

        VsixMvcAppResult.Widgets.DialogInline.Create(jQuery(selector).find("div:first"), VsixMvcAppResult.Widgets.DialogInline.MsgTypes.Error);
    },
    _updateUserLastActivity: function () {
        var self = this;

        VsixMvcAppResult.Ajax.UserUpdateLastActivity(
            function (data, textStatus, jqXHR) {
                jQuery(self.element).append(data);
                //VsixMvcAppResult.Widgets.jQueryzer(self.element);
            },
            function (jqXHR, textStatus, errorThrown) {
                self._errMsgSet(jQuery(self.element), VsixMvcAppResult.Resources.unExpectedError);
            },
            function () {
                //self._trigger('complete', null, null);
                self._initMenuNav();
            });
    },
    _initMenuNav: function () {

        //TODO: load async Menu based on user identity
        var self = this;
        var $sitePage = jQuery('div.ui-sitePage:first');
        var $panelMenu = jQuery('#panelMenu');
        var $navMenu = jQuery($panelMenu).find('ul:first');

        VsixMvcAppResult.Ajax.UserMenu(
            function (data, textStatus, jqXHR) {


                var menu = $navMenu.navMenu();
                $navMenu.navMenu('bind', data);


                jQuery('div.ui-mainMenuToggle')
                    .click(function () {
                        if ($panelMenu.is(':visible')) {
                            $sitePage.show();
                            $panelMenu.removeClass('ui-front').hide('slide', function () {
                                $navMenu.navMenu('collapseAll');

                            });
                        }
                        else {
                            
                            $panelMenu.addClass('ui-front').show('drop', function () {
                                $sitePage.hide();
                            });
                        }
                    });
            },
            function (jqXHR, textStatus, errorThrown) {
                self._errMsgSet($panelMenu, VsixMvcAppResult.Resources.unExpectedError);
            },
            function () {
                self._trigger('complete', null, null);
            });



    }
});