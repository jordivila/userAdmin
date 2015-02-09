(function($) {
    jQuery.widget("ui.navMenu", jQuery.ui.widgetBase, {
        options: {
            selectable: true,
            IMenuModel: null
        },
        _create: function() {

            this._super();

        },
        _init: function () {

            this._super();

        },
        destroy: function() {

            jQuery(this.element)
                .unbind('click')
                .removeClass('ui-treeList ui-widget-content ui-corner-all')
                .find('li')
                .unbind('mouseenter mouseleave')
                .removeClass('ui-treeList-item ui-widget-content ui-corner-all ui-state-default ui-state-active ui-state-hover')
                .children('div.ui-treeList-toggle')
                .remove()
                .end()
                .find('ul')
                .unbind('mouseenter mouseleave')
                .removeClass('ui-treeList-childs');

            this._super();
        },
        _dataBound: function () {

            var w = this;

            w._initItem(jQuery(this.element).find("li"));
            w._initChildList(jQuery(this.element).find("ul"));

            var $lisOpen = jQuery(this.element).find("li[class*='ui-treeList-open']");
            w.openNode($lisOpen);
            w.openNode($lisOpen.parents('li'));

            jQuery(this.element)
                .addClass('ui-treeList ui-widget-content ui-corner-all')
                .bind('click', function (e) {
                    var $t = jQuery(e.target);

                    var $node = null;

                    if ($t.hasClass('ui-treeList-toggle')) {
                        $node = $t.parents('li.ui-treeList-item:first');
                    } else {
                        if ($t.hasClass('ui-treeList-item')) {
                            $node = $t;
                        } else {
                            if ($t.hasClass('ui-treeList-link')) {
                                $node = $t.parents('li.ui-treeList-item:first');
                            }
                        }
                    }


                    if ($node !== null) {
                        if ($node.find('ul:first').length > 0) {
                            var b = $node.find('ul:first').is(':visible');
                            if (b) w.closeNode($node);
                            else w.openNode($node);
                        } else {
                            if ($node.find('a:first').length > 0) {
                                window.location.href = $node.find('a:first').attr('href');
                            }
                        }
                    }

                })
                .css('min-height', jQuery(document).height() - 20)
                .disableSelection();


        },
        _initItem: function($lis) {
            $lis.addClass('ui-treeList-item ui-widget-content ui-corner-all ui-state-default')
                .find('a:first')
                .addClass('ui-treeList-link');

            return;
        },
        _initChildList: function($uls) {
            $uls.addClass('ui-treeList-childs')
                .hide()
                .before('<div class="ui-treeList-toggle ui-icon ui-icon-triangle-1-s"></div>');
        },
        openNode: function($lisOpen) {
            if ($lisOpen) {
                $lisOpen.removeClass('ui-state-default')
                    .children('ul')
                    .show()
                    .siblings('div.ui-treeList-toggle')
                    .removeClass('ui-icon ui-icon-triangle-1-s')
                    .addClass('ui-icon ui-icon-triangle-1-n')
                    .end()
                    .end()
                    .find('ul:has(li)')
                    .parents('li')
                    .removeClass('ui-state-default');
            }
        },
        closeNode: function($lisClose) {
            if ($lisClose) {
                $lisClose.addClass('ui-state-default')
                    .children('ul')
                    .hide()
                    .siblings('div.ui-treeList-toggle').removeClass('ui-icon-triangle-1-n').addClass('ui-icon ui-icon-triangle-1-s');
            }
        },
        selected: function($lis) {
            if ($lis) {
                jQuery(this.element).find('li').removeClass('ui-state-active');
                $lis.addClass('ui-state-active');
                this._trigger('onSelect');
            } else {
                return jQuery(this.element).find('li.ui-state-active');
            }
        },
        collapseAll: function() {
            this.closeNode(jQuery(this.element).find('li'));
        },
        bind: function(IMenuModel) {

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

            var menuItemRender = function(IMenuItem) {
                var $li = jQuery('<li></li>');
                var $a = jQuery('<a>' + IMenuItem.text + '</a>');
                if (IMenuItem.url) {
                    $li.attr('data-action', IMenuItem.url);
                    $a.attr('href', IMenuItem.url);
                } else {
                    //$a.attr('href', 'javascript:void(0);');
                    $a.attr('href', '#').click(function () { });
                }
                $li.append($a);

                if (IMenuItem.childs) {
                    var $ul = jQuery('<ul></ul>');
                    for (var i = 0; i < IMenuItem.childs.length; i++) {
                        $ul.append(menuItemRender(IMenuItem.childs[i]));
                    }
                    $li.append($ul);
                }
                return $li;
            };

            for (var i = 0; i < IMenuModel.length; i++) {
                jQuery(this.element).append(menuItemRender(IMenuModel[i]));
            }

            this._dataBound();


        }


    });

})(jQuery);