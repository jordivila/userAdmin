/// <reference path="VsixMvcAppResult.A.Intellisense.js" />

jQuery.widget("ui.widgetGrid", jQuery.ui.widgetBase,
{
    options: {

    }, 
    _create: function () {
        this._super();
    }, 
    _init: function () {

        this._super();

//        var self = this;

//        jQuery(window).resize(function () {
//            self._doResize();
//        });
//        self._doResize();
//        self._initPaginable();
//        self._initSortable();
    }, 
    destroy: function () {
        this._super();
    }
//    , _doResize: function () {
//        var self = this;
//        var $el = jQuery(self.element);
//        if ($el.hasClass('ui-widgetGrid-tableLess')) {
//            var nColumns = $el.find('div.ui-widgetGrid-body').find('div.ui-widgetGrid-row:first').find('div.ui-widgetGrid-column-content').length;
//            $el.find('div.ui-widgetGrid-column').width((($el.parents('*:first').innerWidth()) / (nColumns)) - (2 * nColumns));
//        }
//    }
//    , _initSortable: function () {
//        var self = this;
//        jQuery(this.element)
//            .find('div.ui-widgetGrid-header:first, thead.ui-widgetGrid-header:first')  //widgetGrid can be "tableless"
//                .find('div.ui-widgetGrid-column, th.ui-widgetGrid-column')
//                    .find('div.ui-widgetGrid-column-content')
//                        .click(function () {
//                            jQuery(this)
//                                .parents('form:first')
//                                    .submit();
//                        });
//    }
//    , _initPaginable: function () {
//        var self = this;
//        jQuery(this.element)
//            .find('div.ui-widgetGrid-pager:first, tfoot.ui-widgetGrid-pager:first')  //widgetGrid can be "tableless"
//                .find('li')
//                    .find('button')
//                        .click(function () {
//                            jQuery(this)
//                                .parents('form:first')
//                                    .submit();
//                        })
//                    .end()
//                .end()
//            .end();
//    }
});
