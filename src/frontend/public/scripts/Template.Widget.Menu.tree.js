
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

        var self = this;
        var dfd = jQuery.Deferred();

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

        var menuRender = function () {
            for (var i = 0; i < self.options.IMenuModel.length; i++) {
                jQuery(self.element).append(menuItemRender(self.options.IMenuModel[i]));
            }

            dfd.resolve();
        };

        menuRender();


        return dfd.promise();
    },
});
