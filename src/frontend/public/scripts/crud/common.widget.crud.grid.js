define(["jquery", "jqueryui", "/public/scripts/crud/common.widget.crud.base.js"],
       function ($, jqUI) {

           jQuery.widget("ui.crudGrid", jQuery.ui.crudBase,
           {
               options: {
                   gridBodyDOMId: null,
                   gridPagerDOMId: null,

                   gridModel: [],
                   gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {
                       // use this option to customize row's display items, events, etc

                       //throw new Error(crudGridWidget.namespace + '.' + crudGridWidget.widgetName + ".options.gridViewCellBound is an abstract method. Child class method must be implemented");
                   },
                   gridRowAlternateClass: '',
                   gridPagerInit: function () {
                       return {};
                       //return {
                       //    pagerTop: {
                       //        paginationShow: false,
                       //        totalRowsShow: false,
                       //        pageSizeShow: false,
                       //    },
                       //    pagerBottom: {
                       //        paginationShow: true,
                       //        totalRowsShow: true,
                       //        pageSizeShow: true,
                       //    }
                       //};
                   },

                   texts: {
                       emptyRowText: "No data found here",
                       gridBindingError:"Unhandled error binding data"
                   }
               },
               _create: function () {

                   this._super();

                   jQuery(this.element)
                       .addClass('ui-crudGrid ui-widgetGrid')
                       .append(this._gridTemplate());

                   this.options.gridBodyDOMId = jQuery(this.element).find('div.ui-crudGrid-body:first');
                   this.options.gridPagerDOMId = jQuery(this.element).find('div.ui-crudGrid-pager');

               },
               _init: function () {

                   this._super();

                   var self = this;

                   var pagerOpts = {
                       change: function (e, pagination) {
                           self._trigger('paginated', null, pagination);
                       },
                   };

                   var pagerConfig = jQuery.extend({},
                       {
                           pagerTop: {
                               paginationShow: false,
                               totalRowsShow: false,
                               pageSizeShow: false,
                           },
                           pagerBottom: {
                               paginationShow: true,
                               totalRowsShow: true,
                               pageSizeShow: true,
                           }
                       },
                       this.options.gridPagerInit());


                   jQuery(self.options.gridPagerDOMId)
                           .first()
                               .gridPagination(jQuery.extend({}, pagerOpts, pagerConfig.pagerTop))
                           .end()
                           .last()
                               .gridPagination(jQuery.extend({}, pagerOpts, pagerConfig.pagerBottom))
                           .end();
               },
               destroy: function () {

                   this._super();

               },
               bind: function (data) {

                   try {
                       this._bindRows(data);
                       this._bindPagination(data);
                       this._trigger('dataBound', null, data);
                   } catch (e) {

                       console.error(e);
                       this._trigger('errorDisplay', null, this.options.texts.gridBindingError);
                   }
                   
               },
               _gridTemplate: function () {

                   return '<div class="ui-crudGrid-container">' +
                               '<div class="ui-crudGrid-pager ui-crudGrid-pager-top ui-state-default"></div>' +
                               '<div class="ui-helper-clearfix" ></div>' +

                               '<div class="ui-crudGrid-header ui-widgetGrid-header ui-state-default">' +
                                   '<div class="ui-widgetGrid-row" >' +
                                       this._gridHeaderTemplate() +
                                   '</div>' +
                               '</div>' +
                               '<div class="ui-helper-clearfix" ></div>' +
                               '<div class="ui-crudGrid-body ui-widgetGrid-body ui-helper-clearfix" >' +

                               '</div>' +
                               '<div class="ui-helper-clearfix" ></div>' +
                               '<div class="ui-crudGrid-pager ui-crudGrid-pager-bottom ui-state-default"></div>' +
                               '<div class="ui-helper-clearfix" ></div>' +
                           '</div>'
                   ;
               },
               _gridHeaderTemplate: function () {

                   var str = '';

                   for (var i = 0; i < this.options.gridModel.length; i++) {
                       str += '<div class="ui-crudGrid-{0} ui-widgetGrid-column">{1}</div>'.format(this.options.gridModel[i].key, this.options.gridModel[i].displayName);
                   }

                   return str;
               },
               _gridRowTemplate: function (dataItem) {

                   var str = '';

                   for (var i = 0; i < this.options.gridModel.length; i++) {
                       str += '<div class="ui-crudGrid-{0} ui-widgetGrid-column ui-state-default {2}"><div class="ui-widgetGrid-column-content">{1}</div></div>'
                           .format(
                                   this.options.gridModel[i].key,
                                   dataItem[this.options.gridModel[i].key],
                                   (i == (this.options.gridModel.length - 1) ? 'ui-crudGrid-column-last' : ''));
                   }

                   return str;
               },
               _bindRowAlternatedColor: function () {

                   var self = this;

                   jQuery(self.options.gridBodyDOMId)
                       .children('div')
                           .each(function (i, ui) {
                               if (((i % 2) == 1)) {
                                   //jQuery(this).addClass('');
                               }
                               else {
                                   jQuery(this).addClass(self.options.gridRowAlternateClass);
                               }
                           });
               },
               _bindRows: function (data) {

                   var self = this;

                   jQuery(self.options.gridBodyDOMId).empty();

                   if (data.Data.length > 0) {

                       for (var i = 0; i < data.Data.length; i++) {
                           var dataItem = data.Data[i];
                           var $row = jQuery('<div class="ui-crudGrid-dataRow ui-widgetGrid-row ui-state-default {1}">{0}</div>'
                                       .format(self._gridRowTemplate(dataItem),
                                               (i == (data.Data.length - 1) ? 'ui-crudGrid-row-last' : '')));

                           for (var j = 0; j < this.options.gridModel.length; j++) {

                               var $cell = $row.find('div.ui-crudGrid-{0}:first'.format(this.options.gridModel[j].key))
                                               .find('div.ui-widgetGrid-column-content');


                               self.options.gridViewCellBound(this, $row, $cell, dataItem, this.options.gridModel[j].key);
                           }

                           jQuery(self.options.gridBodyDOMId).append($row);

                           self._bindRowAlternatedColor();
                       }
                   }
                   else {
                       var $emtpyRow = '<div class="ui-widgetGrid-emptyRow ui-widgetGrid-column  ui-state-active"><div class="ui-widgetGrid-column-content">{0}</div></div>'
                                           .format(self.options.texts.emptyRowText);

                       jQuery(self.options.gridBodyDOMId).append($emtpyRow);
                   }
               },
               _bindPagination: function (data) {

                   var self = this;

                   jQuery(self.options.gridPagerDOMId).gridPagination('bind', data.Page, data.PageSize, data.TotalRows);
               }
           });

       });