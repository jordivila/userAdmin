
jQuery.widget("ui.menuSlides", jQuery.ui.menuBase, {
    options: {
        //slidesOpened: [], //http://bugs.jqueryui.com/ticket/8645
        slidesOpened: null //since jQuery.ui 1.9 array options are static. So initialized them on create event
    },
    _create: function () {

        this._super();

        this.options.slidesOpened = [];

        jQuery(this.element).prepend('<div class="ui-menuSlide-backButton ui-helper-hidden ui-state-default"><span class="ui-icon ui-icon-triangle-1-w"></span><span>Back</span><div class="ui-helper-clearfix"></div></div>');

    },
    _init: function () {
        this._super();
        this._initBackButton();
    },
    _initBackButton: function () {

        var self = this;
        var $backButton = jQuery(this.element).find('div.ui-menuSlide-backButton:first');

        $backButton
            .click(function () {
                jQuery(self.element)
                    .find('ul.ui-menuList-childs:visible:first')
                    .each(function () {

                        var theListToHide = jQuery(this);
                        var theListToShow = self.options.slidesOpened[self.options.slidesOpened.length - 1];
                        self._animatePanel(theListToHide, theListToShow, false, function () {
                            self.options.slidesOpened.splice(self.options.slidesOpened.length - 1, 1);
                            if (self.options.slidesOpened.length === 0) {
                                $backButton.addClass('ui-helper-hidden');
                            }
                        });
                    });
            });
    },
    destroy: function () {
        this._super();
    },
    _animatePanel: function ($hidingList, $showingList, forward, cb) {

        if (forward) {
            $hidingList.hide('drop', function () {
                $showingList.show('slide', function () {
                    cb();
                });
            });
        }
        else {
            $hidingList.hide('drop', function () {
                $showingList.show('slide', function () {
                    cb();
                });
            });
        }

    },
    openNode: function ($lisOpen) {

        var self = this;

        var matches = function ($ul) {
            for (var i = 0; i < $lisOpen.length; i++) {
                if (jQuery($ul.data('parentNode'))[0] == $lisOpen[0]) {
                    return true;
                }
            }
            return false;
        };


        jQuery(self.element)
            .find('ul.ui-menuList-childs')
            .each(function () {

                if (matches(jQuery(this))) {

                    var theListToShow = jQuery(this);

                    jQuery(self.element)
                        .find('ul.ui-menuList-childs:visible:first')
                            .each(function () {
                                var theListToHide = jQuery(this);
                                self.options.slidesOpened.push(theListToHide);
                                self._animatePanel(theListToHide, theListToShow, true, function () {

                                    jQuery(self.element)
                                        .find('div.ui-menuSlide-backButton:first')
                                        .removeClass('ui-helper-hidden');

                                });
                            });
                }
            });
    },
    closeNode: function ($lisClose) {

    },
    collapseAll: function () {

        jQuery(this.element)
            .find('ul.ui-menuList-childs')
            .each(function () {
                if (jQuery(this).data('parentNode') !== undefined) {
                    jQuery(this).hide();
                }
            });
    },
    _build: function () {

        var self = this;
        var dfd = jQuery.Deferred();

        var menuItemRender = function (IMenuItem) {
            var $li = jQuery('<li class="ui-menuList-item ui-widget-content ui-corner-all ui-state-default"></li>');
            $li.html('<div class="ui-menuList-itemLink ui-state-default"><span class="ui-menuList-link">{0}</span><div class="ui-helper-clearfix" /></div>'.format(IMenuItem.text));
            $li.data('dataItem', IMenuItem);

            if (IMenuItem.childs) {

                $li.find('div.ui-menuList-itemLink')
                        .find('div.ui-helper-clearfix:first')
                            .before('<div class="ui-menuList-toggle ui-state-default ui-icon ui-icon-triangle-1-e"></div>')
                        .end()
                   .end();

                menuLevelRender(IMenuItem.childs, $li);
            }
            return $li;
        };

        var menuLevelRender = function (ImenuLevel, $parentLevel) {

            var $ul = jQuery('<ul class="ui-menuList-childs"></ul>');

            if (jQuery($parentLevel).length > 0) {
                $ul.data('parentNode', $parentLevel);
            }

            jQuery(self.element).append($ul);

            for (var i = 0; i < ImenuLevel.length; i++) {
                $ul.append(menuItemRender(ImenuLevel[i]));
            }

        };

        var menuRender = function () {

            menuLevelRender(self.options.IMenuModel);

            dfd.resolve();
        };

        menuRender();
        

        return dfd.promise();
    },
});
