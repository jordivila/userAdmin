/// <reference path="VsixMvcAppResult.A.Intellisense.js" />


/*******************************************************************************
                            HELPER PUBLIC METHODS
********************************************************************************/

/*
VsixMvcAppResult.Widgets.jQueryzer = function (selector) {
    jQuery(selector).widgetJqueryzer();
};
*/

/*******************************************************************************
                            WIDGET DEFINITION
********************************************************************************/

//jQuery.widget('ui.widgetJqueryzer', jQuery.ui.widgetBase,
//{
//    options: {

//    },
//    _init: function () {
//        this._super();
//    },
//    _create: function () {

//        this._super();

//        var $list = jQuery(this.element).find(
//                                    'div[data-widget],' +
//                                    'table[data-widget],' +
//                                    'input[data-widget],' +
//                                    'ul[data-widget],' +
//                                    'button[data-widget]');

//        for (var i = 0; i < $list.length; i++) {

//            var $listItem = jQuery($list[i]);
//            var widgetName = $listItem.attr('data-widget');

//            this.item($listItem, widgetName);

//        }
//    }, 
//    destroy: function () {
//        this._super();
//    }, 
//    item: function ($listItem, widgetName) {
//        switch (widgetName) {
//            case 'widgetBase':
//                $listItem.widgetBase({
//                    allowCollapse: parseBoolean($listItem.attr('data-widget-allowCollapse')),
//                    allowClose: parseBoolean($listItem.attr('data-widget-allowClose')),
//                    isCollapsed: parseBoolean($listItem.attr('data-widget-isCollapsed')),
//                    onCollapsed: function (e, isVisible) {
//                        try {
//                            /*jslint evil: true */
//                            eval($listItem.attr('data-widget-jsOnCollapse'));
//                        }
//                        catch (ex) {

//                        }
//                    }
//                });
//                break;
//            case 'widgetModelItem':
//                $listItem.widgetModelItem({
//                    changed: function (e, id) {
//                        $listItem.parents('form:first').find('div.ui-widgetModel-ValidationSummary').widgetModelSummary('deleteByKey', id);
//                    }
//                });
//                break;
//            case 'widgetGrid':
//                $listItem.widgetGrid();
//                break;
//            case 'ui-widgetModelItemBool':
//                $listItem.widgetModelItemBool();
//                break;
//            case 'widgetModelItemDate':
//                $listItem.widgetModelItemDate({
//                    text: VsixMvcAppResult.Resources.clickToPickDate,
//                    value: Globalize.parseDate($listItem.attr('data-value'))
//                });
//                break;
//            case 'widgetMsg':
//                VsixMvcAppResult.Widgets.DialogInline.Create($listItem);
//                break;
//            case 'widgetButton':
//                $listItem.widgetButton();
//                break;
//            case 'widgetModelSummary':
//                $listItem.widgetModelSummary();
//                break;
//            default:
//                //console.log($listItem);
//                break;
//        }
//    }
//});

