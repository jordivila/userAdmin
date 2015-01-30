/// <reference path="VsixMvcAppResult.A.Intellisense.js" />

jQuery.widget("ui.userOptions", jQuery.ui.widgetBase, {
    options: {

    },
    _create: function() {
        jQuery.ui.widgetBase.prototype._create.call(this);
    },
    _init: function() {

        jQuery.ui.widgetBase.prototype._init.call(this);

        //this.initMenuNav();
        this._updateUserLastActivity();
    },
    destroy: function() {
        jQuery.ui.widgetBase.prototype.destroy.call(this);
    },
    _errMsgSet: function(selector, msg) {
        jQuery(selector)
            .append("<div></div><div class='ui-carriageReturn'></div>")
            .find("div:first")
            .html(msg);

        VsixMvcAppResult.Widgets.DialogInline.Create(jQuery(selector).find("div:first"), VsixMvcAppResult.Widgets.DialogInline.MsgTypes.Error);
    },
    _updateUserLastActivity: function() {
        var self = this;

        VsixMvcAppResult.Ajax.UserUpdateLastActivity(
            function(data, textStatus, jqXHR) {
                jQuery(self.element).append(data);
                VsixMvcAppResult.Widgets.jQueryzer(self.element);
            },
            function(jqXHR, textStatus, errorThrown) {
                self._errMsgSet(jQuery(self.element), VsixMvcAppResult.Resources.unExpectedError);
            },
            function() {
                self._initMenuNav();
            });
    },
    _initMenuNav: function() {

        //TODO: load async Menu based on user identity
        var self = this;
        var $panelMenu = jQuery('#panelMenu');
        var $panelContent = jQuery('#panelContent');

        VsixMvcAppResult.Ajax.UserMenu(
            function(data, textStatus, jqXHR) {

                $panelMenu.navMenu({
                    IMenuModel: data
                });

                jQuery('#menuToggle').click(function() {

                    $panelMenu.show('slide', function() {
                        if (jQuery(this).is(':visible')) {

                            jQuery(document).bind("click", function(e) {

                                var menuClicked = jQuery(e.target).parents($panelMenu.selector).length > 0;

                                if (!menuClicked) {

                                    $panelMenu.hide('slide', function() {
                                        $panelMenu.navMenu('collapseAll');
                                    });

                                    jQuery(document).unbind("click");
                                }
                            });
                        }
                    });
                });
            },
            function(jqXHR, textStatus, errorThrown) {
                self._errMsgSet($panelMenu, VsixMvcAppResult.Resources.unExpectedError);
            },
            function() {
                self._trigger('complete', null, null);
            });



    }
});