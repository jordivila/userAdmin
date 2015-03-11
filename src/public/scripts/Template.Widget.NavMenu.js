(function ($) {
    jQuery.widget("ui.navMenu", jQuery.ui.widgetBase, {
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
                .addClass('ui-treeList ui-widget-content ui-corner-all')
                .find('div.ui-treeList-itemLink')
                    .bind('click', function (e) {

                        var $node = jQuery(this).parents('li:first');
                        var liData = $node.data('dataItem');

                        if (liData !== undefined) {
                            w._trigger('loadTemplate', null, liData);
                        }
                        else {
                            var b = $node.find('ul:first').is(':visible');
                            if (b) w.closeNode($node);
                            else w.openNode($node);
                        }
                    });
        },
        openNode: function ($lisOpen) {
            if ($lisOpen) {
                $lisOpen
                    //.removeClass('ui-state-default')
                    .children('ul')
                        .show()
                    .end()
                    .find('div.ui-treeList-itemLink:first')
                        .addClass('ui-state-active')
                        .find('div.ui-treeList-toggle')
                            .addClass('ui-state-active')
                            .removeClass('ui-icon-triangle-1-s')
                            .addClass('ui-icon ui-icon-triangle-1-n')
                        .end()
                    .end();
            }
        },
        closeNode: function ($lisClose) {

            if ($lisClose) {
                $lisClose
                    //.addClass('ui-state-default')
                    .children('ul')
                        .hide()
                    .end()
                    .find('div.ui-treeList-itemLink:first')
                        .removeClass('ui-state-active')
                        .find('div.ui-treeList-toggle')
                            .removeClass('ui-state-active')
                            .addClass('ui-icon ui-icon-triangle-1-s')
                            .removeClass('ui-icon-triangle-1-n')
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

            var menuItemRender = function (IMenuItem) {
                var $li = jQuery('<li class="ui-treeList-item ui-widget-content ui-corner-all ui-state-default"></li>');


                $li.html('<div class="ui-treeList-itemLink ui-state-default"><a href="#" class="ui-treeList-link">{0}</a><div class="ui-helper-clearfix" /></div>'.format(IMenuItem.text));

                //var $a = jQuery('<a>' + IMenuItem.text + '</a>');
                if (IMenuItem.url) {
                    $li.data('dataItem', IMenuItem);
                    //$a.attr('href', IMenuItem.url);
                    //$a.attr('href', '#');
                } else {
                    //$a.attr('href', 'javascript:void(0);');
                    //$a.attr('href', '#').click(function () {
                    //console.log();
                    //});
                }

                if (IMenuItem.childs) {
                    var $ul = jQuery('<ul class="ui-treeList-childs ui-state-focus"></ul>');

                    $li.find('div.ui-treeList-itemLink')
                            .find('div.ui-helper-clearfix:first')
                                .before('<div class="ui-treeList-toggle ui-state-default ui-icon ui-icon-triangle-1-s"></div>')
                            .end()
                       .end();

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


            this.collapseAll();
            this._dataBound();


        }
    });
})(jQuery);