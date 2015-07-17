define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",
    "scripts/Template.Widget.Base"],
       function ($, jqUI, clientApp) {

           jQuery.widget("ui.gridPagination", jQuery.ui.widgetBase,
           {
               options: {
                   paginationShow: true,
                   totalRowsShow: true,
                   pageSizeShow: true,
                   nPagesInPaginator: 3,
                   pageSize: 10,
                   infiniteScrolling: false,
                   texts: {
                       showingData: clientApp.i18n.texts.get("Template.Widget.Crud.Showing_From_To_Of"),
                       showXPerPage: clientApp.i18n.texts.get("Template.Widget.Crud.PerPage")
                   }
               },
               _create: function () {

                   this._super();
               },
               _init: function () {

                   this._super();

               },
               destroy: function () {

                   this._super();

                   jQuery(window).data('infiniteScrollingEventOk', false);
               },
               _onChange: function (pageIndex, pageSize) {
                   pageSize = pageSize || parseInt(jQuery(this.element).find('div.ui-gridPagination-pageSizePicker:first').find('select:first').val());

                   this._trigger('change', null,
                       {
                           pageIndex: parseInt(pageIndex),
                           pageSize: pageSize
                       });
               },
               _buildPage: function (page, currentPage, isNavigationItem, text) {
                   var cssClass = ((currentPage == page) && (!isNavigationItem)) ? "ui-state-highlight" : "ui-state-default";
                   return "<td class='" + cssClass + "' value='" + page + "'>" + text + "</td>";
               },
               _getCurrentPage: function (currentPage) {
                   return parseInt(currentPage === null ? 0 : currentPage);
               },
               _getStartPage: function (nPagesInPaginators, totalPages, currentPage) {
                   var startPage = (currentPage > 0) ?
                                       (currentPage > (nPagesInPaginators / 2)) ?
                                           ((currentPage + 1) - Math.ceil((nPagesInPaginators / 2))) : 1 : 1;

                   if ((startPage + nPagesInPaginators) > totalPages) {
                       startPage = totalPages - nPagesInPaginators;
                   }

                   if (startPage < 1) {
                       startPage = 1;
                   }

                   return parseInt(startPage);
               },
               _getEndPage: function (nPagesInPaginators, totalPages, startPage) {
                   var endPage = startPage + nPagesInPaginators;
                   endPage = endPage > totalPages ? totalPages : endPage;
                   return parseInt(endPage);
               },
               _getNPagesInPaginator: function (nPagesInPaginators) {

                   var defaultNPages = 2;

                   if (isNaN(nPagesInPaginators)) {
                       return defaultNPages;
                   }
                   else {
                       if (nPagesInPaginators < defaultNPages) {
                           return defaultNPages;
                       }
                       else {
                           return parseInt(nPagesInPaginators) - 1;
                       }
                   }
               },
               _buildPaginationNumbers: function (Page, PageSize, TotalRows, TotalPages) {

                   var self = this;

                   if (TotalPages > 1) {
                       var nPagesInPaginator = self._getNPagesInPaginator(this.options.nPagesInPaginator);
                       var start = self._getStartPage(nPagesInPaginator, TotalPages, self._getCurrentPage(Page));
                       var end = self._getEndPage(nPagesInPaginator, TotalPages, start);
                       var tPager = jQuery("<table></table>");
                       var $firstColumn = jQuery(self._buildPage(0, self._getCurrentPage(Page), true, "&lt;&lt;", null));

                       $firstColumn.addClass('ui-gridPagination-navBar-firstCol');
                       tPager.append($firstColumn);

                       tPager.append(self._buildPage(self._getCurrentPage(Page) - 1 < 0 ? 0 : self._getCurrentPage(Page) - 1, self._getCurrentPage(Page), true, "&lt;", null));

                       for (var i = start; i <= end; i++) {
                           tPager.append(self._buildPage(i - 1, self._getCurrentPage(Page), false, i.toString(), null));
                       }

                       tPager.append(self._buildPage(self._getCurrentPage(Page) + 1 >= TotalPages ? self._getCurrentPage(Page) : self._getCurrentPage(Page) + 1, self._getCurrentPage(Page), true, "&gt;", null));


                       var $lastColumn = jQuery(self._buildPage(TotalPages - 1, self._getCurrentPage(Page), true, "&gt;&gt;", null));
                       $lastColumn.addClass('ui-gridPagination-navBar-lastCol');
                       tPager.append($lastColumn);

                       jQuery(self.element)
                               .append(tPager)
                               .find('table:first')
                                   .wrapAll("<div class='ui-gridPagination-navBar'/>")
                                   .find('td')
                                       .click(function () {
                                           self._onChange(jQuery(this).attr('value'));
                                       });
                   }

               },
               _buildPaginationTotals: function ($parent) {
                   jQuery($parent).append("<div class='ui-gridPagination-totals ui-state-default'></div>");
                   return jQuery($parent).find('div.ui-gridPagination-totals:first');
               },
               _buildPaginationTotalsShowing: function ($parent, Page, PageSize, TotalRows) {

                   var self = this;

                   var $totalRows = function () {

                       var str = "<div class='ui-gridPagination-totalRows'>" + self.options.texts.showingData + "</div>";

                       return str.format(((Page * PageSize) + 1), (((Page + 1) * PageSize)), TotalRows);

                   }();

                   $parent.append($totalRows);

                   return jQuery($parent).find('div.ui-gridPagination-totalRows:first');
               },
               _buildPaginationSizePicker: function ($parent, PageSize) {

                   var self = this;

                   $parent
                           .append("<div class='ui-gridPagination-pageSizePicker'><select></select> " + self.options.texts.showXPerPage + "</div>"
                               .format(PageSize));

                   var strOptions = '';

                   for (var iPageSize = 10; iPageSize < 60; (iPageSize += 10)) {
                       strOptions += "<option value='{0}'>{0}</option>".format(iPageSize);
                   }


                   var $select = $parent
                                   .find('div.ui-gridPagination-pageSizePicker')
                                       .find('select');

                   $select.append(strOptions);

                   if ($select.find('option[value="{0}"]'.format(PageSize)).length === 0) {
                       $select.prepend('<option value="{0}">{0}</option>'.format(PageSize));
                   }

                   $select
                       .val(PageSize)
                       .change(function () {
                           self._onChange(0);
                       });

                   return $select;
               },
               _buildPaginationTotalsVisibility: function ($totalsBox, $totalRowsShowing, $totalPageSizePicker) {

                   if ((this.options.totalRowsShow === false) && (this.options.pageSizeShow === false)) {

                       $totalsBox
                        .hide()
                        .parents('div.{0}-{1}:first'.format(this.namespace, this.widgetName))
                            .addClass('ui-helper-hidden');
                   }
                   else {
                       if (this.options.totalRowsShow === false) {
                           jQuery($totalRowsShowing).hide();
                       }

                       if (this.options.pageSizeShow === false) {
                           jQuery($totalPageSizePicker).hide();
                       }
                   }

               },
               _buildPagination: function (Page, PageSize, TotalRows, TotalPages) {

                   if (this.options.paginationShow === true) {
                       this._buildPaginationNumbers(Page, PageSize, TotalRows, TotalPages);
                   }


                   var $totalsBox = this._buildPaginationTotals(jQuery(this.element));
                   var $totalRowsShowing = this._buildPaginationTotalsShowing($totalsBox, Page, PageSize, TotalRows);
                   var $totalPageSizePicker = this._buildPaginationSizePicker($totalsBox, PageSize);

                   $totalsBox.append('<div class="ui-helper-clearfix" />');

                   this._buildPaginationTotalsVisibility($totalsBox, $totalRowsShowing, $totalPageSizePicker);
               },
               _buildInfiniteScroll: function (Page, PageSize, TotalRows, TotalPages) {

                   var self = this;

                   var bindScroll = function () {
                       jQuery(window).scroll(function () {
                           if (jQuery(window).scrollTop() == jQuery(document).height() - jQuery(window).height()) {

                               self._onChange(Page + 1, PageSize);

                               console.log("Paginaaaaaaa->{0}----{1}".format(Page + 1, PageSize));
                           }
                       });
                   };

                   if (jQuery(window).data('infiniteScrollingEventOk') !== true) {
                       jQuery(window).data('infiniteScrollingEventOk', true);
                       bindScroll();
                   }
                   else {
                       jQuery(window).unbind('scroll');
                       if ((Page * PageSize) < TotalRows) {
                           bindScroll();
                       }
                   }

               },
               bind: function (pageIndex, pageSize, totalRows) {

                   var self = this;

                   jQuery(self.element).empty();

                   console.log("On pre binding");
                   console.log(arguments);

                   pageSize = pageSize || this.options.pageSize;

                   console.log("On binding");
                   console.log(arguments);


                   var Page = parseInt(pageIndex);
                   var PageSize = parseInt(pageSize);
                   var TotalRows = parseInt(totalRows);
                   var TotalPages = ((totalRows / pageSize) | 0) + (((totalRows % pageSize) === 0) ? 0 : 1);

                   if (this.options.infiniteScrolling === true) {
                       this._buildInfiniteScroll(Page, PageSize, totalRows, TotalPages);
                   }
                   else {
                       this._buildPagination(Page, PageSize, totalRows, TotalPages);
                   }
               }
           });

       });