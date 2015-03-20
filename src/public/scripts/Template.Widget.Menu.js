jQuery.widget("ui.menuBase", jQuery.ui.widgetBase, {
    options: {
        IMenuModel: null
    },
    _create: function () {

        this._super();

    },
    _init: function () {

        this._super();

        jQuery(this.element).addClass('ui-state-default');
    },
    destroy: function () {

        jQuery(this.element).empty();

        this._super();
    },
    _dataBound: function () {

        var w = this;

        jQuery(this.element)
            .addClass('ui-menuList ui-widget-content ui-corner-all')
            .find('div.ui-menuList-itemLink')
                .bind('click', function (e) {

                    var $node = jQuery(this).parents('li:first');
                    var liData = $node.data('dataItem');

                    if (liData.childs === undefined) {

                        jQuery(w.element)
                            .find('div.ui-menuList-itemLink')
                                .removeClass('ui-state-highlight')
                            .end();

                        $node.find('div.ui-menuList-itemLink:first').addClass('ui-state-highlight');

                        w._trigger('selected', null, liData);
                    }
                    else {
                        var b = $node.find('ul:first').is(':visible');
                        if (b) w.closeNode($node);
                        else w.openNode($node);
                    }
                });

        w._trigger('dataBound', null, null);

    },
    bind: function (IMenuModel) {

        /* // IMenuModel sample
        var k = [{
            url: null,
            text: "menu item 1",
            childs: [{
                url: "/anUrl",
                text: "submenu item 1 "
            }]

        }, {
            url: "/anUrl2",
            text: "Menu item 2 with no childs",
        }];
        */

        this.options.IMenuModel = IMenuModel;
        this._build();
        this.collapseAll();
        this._dataBound();
    },
});

jQuery.widget("ui.menuTree", jQuery.ui.menuBase, {
    options: {
        
    },
    _create: function () {

        this._super();

    },
    _init: function () {

        this._super();

    },
    destroy: function () {

        this._super();
    },
    openNode: function ($lisOpen) {
        if ($lisOpen) {
            $lisOpen
                //.removeClass('ui-state-default')
                .children('ul')
                    .addClass('ui-state-active')
                    .show('blind')
                .end()
                .find('div.ui-menuList-itemLink:first')
                    .addClass('ui-state-active')
                    .find('div.ui-menuList-toggle')
                        .addClass('ui-state-active')
                        .removeClass('ui-icon-triangle-1-e')
                        .addClass('ui-icon ui-icon-triangle-1-s')
                    .end()
                .end();
        }
    },
    closeNode: function ($lisClose) {

        if ($lisClose) {
            $lisClose
                //.addClass('ui-state-default')
                .children('ul')
                    .hide('blind')
                    .removeClass('ui-state-active')
                .end()
                .find('div.ui-menuList-itemLink:first')
                    .removeClass('ui-state-active')
                    .find('div.ui-menuList-toggle')
                        .removeClass('ui-state-active')
                        .addClass('ui-icon ui-icon-triangle-1-e')
                        .removeClass('ui-icon-triangle-1-s')
                    .end()
                .end();

            if ($lisClose.find('li').length > 0) {
                this.closeNode($lisClose.find('li'));
            }
        }
    },
    collapseAll: function () {
        this.closeNode(jQuery(this.element).find('li'));
    },
    _build: function () {
        var menuItemRender = function (IMenuItem) {
            var $li = jQuery('<li class="ui-menuList-item ui-widget-content ui-corner-all ui-state-default"></li>');


            $li.html('<div class="ui-menuList-itemLink ui-state-default"><span class="ui-menuList-link">{0}</span><div class="ui-helper-clearfix" /></div>'.format(IMenuItem.text));
            $li.data('dataItem', IMenuItem);

            if (IMenuItem.childs) {
                var $ul = jQuery('<ul class="ui-menuList-childs"></ul>');

                $li.find('div.ui-menuList-itemLink')
                        .find('div.ui-helper-clearfix:first')
                            .before('<div class="ui-menuList-toggle ui-state-default ui-icon ui-icon-triangle-1-e"></div>')
                        .end()
                   .end();

                for (var i = 0; i < IMenuItem.childs.length; i++) {
                    $ul.append(menuItemRender(IMenuItem.childs[i]));
                }
                $li.append($ul);
            }
            return $li;
        };

        for (var i = 0; i < this.options.IMenuModel.length; i++) {
            jQuery(this.element).append(menuItemRender(this.options.IMenuModel[i]));
        }
    },
});



jQuery.widget("ui.menuSlides", jQuery.ui.menuBase, {
    options: {
        //slidesOpened: [], //http://bugs.jqueryui.com/ticket/8645
        slidesOpened: null, //since jQuery.ui 1.9 array options are static. So initialized them on create event
    },
    _create: function () {

        this._super();

        this.options.slidesOpened = [];

    },
    _init: function () {

        this._super();

    },
    destroy: function () {
        this._super();
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

        var $backButton = jQuery(this.element).find('div.ui-menuSlide-backButton:first');

        if ($backButton.length === 0) {
            $backButton = jQuery('<div class="ui-menuSlide-backButton ui-state-default"><span class="ui-icon ui-icon-triangle-1-w"></span><span>Back</span><div class="ui-helper-clearfix"></div></div>');
            jQuery(this.element).prepend($backButton);


            $backButton.click(function () {

                jQuery(self.element)
                    .find('ul.ui-menuList-childs:visible')
                    .each(function () {
                        jQuery(this).hide('slide');
                    });

                jQuery(self.options.slidesOpened[self.options.slidesOpened.length - 1]).show('slide');
                self.options.slidesOpened.splice(self.options.slidesOpened.length - 1, 1);

                if (self.options.slidesOpened.length === 0) {
                    $backButton.addClass('ui-helper-hidden');
                }

            });
        }



        jQuery(this.element)
            .find('ul.ui-menuList-childs')
            .each(function () {

                if (jQuery(this).is(':visible')) {
                    jQuery(this).hide('slide');

                    self.options.slidesOpened.push(jQuery(this));
                    console.log(self.options.slidesOpened);

                    $backButton.removeClass('ui-helper-hidden');
                }

                if (matches(jQuery(this))) {
                    jQuery(this).show('slide');

                    //self.options.slidesOpened.push(jQuery(this));
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

        menuLevelRender(this.options.IMenuModel);
    },
});
