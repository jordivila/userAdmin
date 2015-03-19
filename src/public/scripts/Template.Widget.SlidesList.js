(function ($) {
    jQuery.widget("ui.slidesList", jQuery.ui.widgetBase, {
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

                        if (liData.childs === undefined) {

                            jQuery(w.element)
                                .find('div.ui-treeList-itemLink')
                                    .removeClass('ui-state-highlight')
                                .end();

                            $node.find('div.ui-treeList-itemLink:first').addClass('ui-state-highlight');

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



            var $backButton = jQuery(this.element).find('div.backButton:first');
            var $backButtonArray = [];
            if ($backButton.length === 0) {
                $backButton = jQuery('<div class="backButton ui-state-default">back</div>');
                jQuery(this.element).prepend($backButton);


                $backButton.click(function(){
                    //jQuery(self.element).find('ul.ui-treeList-childs:visible').hide('slide');
                    //$lisOpen.parents('ul:first').show('slide');
                    jQuery($backButtonArray[$backButtonArray.length - 1]).hide('slide');
                    $backButtonArray.splice($backButtonArray.length - 1, 1);

                });


            }



            jQuery(this.element)
                .find('ul.ui-treeList-childs')
                .each(function () {

                    if (jQuery(this).is(':visible')) {
                        jQuery(this).hide('slide');
                    }

                    if (matches(jQuery(this))) {
                        jQuery(this).show('slide');

                        $backButtonArray.push(jQuery(this));
                    }
                });
        },
        closeNode: function ($lisClose) {
            //var matches = function ($ul) {
            //    for (var i = 0; i < $lisClose.length; i++) {
            //        var lisInUl = $ul.find('li');
            //        for (var j = 0; j < lisInUl.length; j++) {
            //            if(lisInUl[j]==$lisClose[i]){
            //                return true;
            //            }
            //        }
            //        //$ul.find('li').each(function () {

            //        //});
            //        //if ($ul.find('li')[0] == $lisClose[0]) {
            //        //    return true;
            //        //}
            //    }
            //    return false;
            //};

            //console.log($lisClose);

            //$lisClose.parents('ul.ui-treeList-childs').show();


            //if ($lisClose) {
            //    $lisClose
            //        //.addClass('ui-state-default')
            //        .children('ul')
            //            .hide('blind')
            //            .removeClass('ui-state-active')
            //        .end()
            //        .find('div.ui-treeList-itemLink:first')
            //            .removeClass('ui-state-active')
            //            .find('div.ui-treeList-toggle')
            //                .removeClass('ui-state-active')
            //                .addClass('ui-icon ui-icon-triangle-1-e')
            //                .removeClass('ui-icon-triangle-1-s')
            //            .end()
            //        .end();

            //    if ($lisClose.find('li').length > 0) {
            //        this.closeNode($lisClose.find('li'));
            //    }
            //}
        },
        collapseAll: function () {

            jQuery(this.element)
                .find('ul.ui-treeList-childs')
                .each(function () {
                    if (jQuery(this).data('parentNode') !== undefined) {
                        jQuery(this).hide();
                    }
                });
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

            var self = this;

            this.options.IMenuModel = IMenuModel;

            var menuItemRender = function (IMenuItem) {
                var $li = jQuery('<li class="ui-treeList-item ui-widget-content ui-corner-all ui-state-default"></li>');
                $li.html('<div class="ui-treeList-itemLink ui-state-default"><span class="ui-treeList-link">{0}</span><div class="ui-helper-clearfix" /></div>'.format(IMenuItem.text));
                $li.data('dataItem', IMenuItem);

                if (IMenuItem.childs) {

                    $li.find('div.ui-treeList-itemLink')
                            .find('div.ui-helper-clearfix:first')
                                .before('<div class="ui-treeList-toggle ui-state-default ui-icon ui-icon-triangle-1-e"></div>')
                            .end()
                       .end();

                    menuLevelRender(IMenuItem.childs, $li);
                }
                return $li;
            };

            var menuLevelRender = function (ImenuLevel, $parentLevel) {

                var $ul = jQuery('<ul class="ui-treeList-childs"></ul>');

                if (jQuery($parentLevel).length > 0) {
                    $ul.data('parentNode', $parentLevel);
                }

                jQuery(self.element).append($ul);

                for (var i = 0; i < ImenuLevel.length; i++) {
                    $ul.append(menuItemRender(ImenuLevel[i]));
                }

            };

            menuLevelRender(IMenuModel);

            this.collapseAll();
            this._dataBound();
        }
    });
})(jQuery);