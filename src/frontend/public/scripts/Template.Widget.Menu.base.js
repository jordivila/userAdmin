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
                        w._beforeSelected();
                        w._setSelectedCss($node);
                        w._trigger('selected', null, liData);
                    }
                    else {

                        var b = $node.find('ul:first').is(':visible');
                        if (b) w.closeNode($node);
                        else w.openNode($node);
                    }
                });

        jQuery(this.element)
            .find('ul')
                .each(function () {
                    jQuery(this).children().last().addClass('ui-menuList-item-last');
                });

        w._trigger('dataBound', null, { IMenuModel: w.options.IMenuModel });

    },
    _beforeSelected: function () {
        var self = this;
        var dfd = jQuery.Deferred();
        //dfd.notify("message...");
        //dfd.resolve();
        dfd.reject("{0}.{1}._beforeSelected is an abstract method and should be imlpemented in child class".format(this.namespace, this.widgetName));
        return dfd.promise();
    },
    _build: function () {
        var self = this;
        var dfd = jQuery.Deferred();
        //dfd.notify("message...");
        //dfd.resolve();
        dfd.reject("{0}.{1}._build is an abstract method and should be imlpemented in child class".format(this.namespace, this.widgetName));
        return dfd.promise();
    },
    bind: function (IMenuModel) {

        var self = this;

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
        this._build()
            .progress(function (status) {

            })
            .fail(function (args) {
                throw new Error(args);
            })
            .always(function () {

            })
            .done(function () {
                self._dataBound();
                self.collapseAll();
                self._trigger('done', null, null);
            });
    },
    _setSelectedCss: function ($node) {
        $node.find('div.ui-menuList-itemLink:first').addClass('ui-state-highlight');
    },
});