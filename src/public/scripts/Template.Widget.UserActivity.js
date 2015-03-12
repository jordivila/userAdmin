
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
        var $siteContent = jQuery('div.ui-siteContent:first');
        var $panelMenu = jQuery('#panelMenu');
        var $panelMenuList = jQuery($panelMenu).find('ul:first');
        var $panelMenuToggle = jQuery('div.ui-mainMenuToggle');
        

        var panelMenuHide = function (cb) {
            $sitePage.show();
            $panelMenu.hide('slide', function () {
                $panelMenu.removeClass('ui-front');
                //$panelMenuList.navMenu('collapseAll');
                if (jQuery.isFunction(cb)) {
                    cb();
                }
            });
        };
        var panelMenuShow = function () {
            $panelMenu.addClass('ui-front').show('drop', function () {
                $sitePage.hide();
            });
        };


        $panelMenu.hide();

        $panelMenuList.navMenu({
            loadTemplate: function (e, templ) {

                var templGetFunc = function () {

                    var templUrl = templ.url;

                    self.progressShow('Loading template');

                    jQuery.ajax({
                        url: templUrl,
                        type: "GET",
                        dataType: "html",
                        data: {}
                    })
                    .done(function (data, textStatus, jqXHR) {
                        $siteContent.empty().html(data);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {

                        console.error("Error lading template '{0}' ->".format(templUrl), {
                            jqXHR: jqXHR,
                            textStatus: textStatus,
                            errorThrown: errorThrown
                        });

                        $siteContent.html('<div class="ui-state-error ui-site-templateInfo">Error loading template: {0} - {1} - {2} </div>'.format(jqXHR.status, textStatus, errorThrown));

                    })
                    .always(function () {
                        self.progressHide();
                    });

                };

                if ($panelMenuToggle.is(':visible')) {
                    panelMenuHide(setTimeout(function () {
                        templGetFunc();
                    },
                    500));
                }
                else {
                    templGetFunc();
                }
            }
        });

        $panelMenuToggle
            .click(function () {
                if ($panelMenu.is(':visible')) {
                    panelMenuHide();
                }
                else {
                    panelMenuShow();
                }
            });


        VsixMvcAppResult.Ajax.UserMenu(
            function (data, textStatus, jqXHR) {
                $panelMenuList.navMenu('bind', data);
            },
            function (jqXHR, textStatus, errorThrown) {
                self._errMsgSet($panelMenu, VsixMvcAppResult.Resources.unExpectedError);
            },
            function () {
                self._trigger('complete', null, null);
            });
    }
});