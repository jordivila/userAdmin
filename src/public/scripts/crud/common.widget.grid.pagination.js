/// <reference path="inv.ajax.js" />

jQuery.widget("ui.gridPagination", jQuery.ui.commonBaseWidget,
{
    options: {

    },
    _create: function () {

        this._super();
    },
    _init: function () {

        this._super();
    }, destroy: function () {

        this._super();
    },
    bind: function (pageIndex, pageSize, totalRows) {

        var self = this;

        jQuery(self.element).empty();

        try {

            var buildPage = function (page, currentPage, isNavigationItem, text) {
                var cssClass = ((currentPage == page) && (!isNavigationItem)) ? "ui-state-highlight" : "ui-state-default";

                return "<td class='" + cssClass + "' value='" + page + "'>" + text + "</td>";
            };
            var getCurrentPage = function (currentPage) {
                return currentPage === null ? 0 : currentPage;
            };
            var getStartPage = function (nPagesInPaginators, totalPages, currentPage) {
                var startPage = (currentPage > 0) ?
                                    (currentPage > (nPagesInPaginators / 2)) ?
                                        ((currentPage + 1) - Math.ceil((nPagesInPaginators / 2))) : 1 : 1;

                if ((startPage + nPagesInPaginators) > totalPages) {
                    startPage = totalPages - nPagesInPaginators;
                }

                if (startPage < 1) {
                    startPage = 1;
                }

                return startPage;
            };
            var getEndPage = function (nPagesInPaginators, totalPages, startPage) {
                var endPage = startPage + nPagesInPaginators;
                endPage = endPage > totalPages ? totalPages : endPage;
                return endPage;
            };

            var Page = pageIndex;
            var PageSize = pageSize;
            var TotalRows = totalRows;
            var TotalPages = ((totalRows / pageSize) | 0) + (((totalRows % pageSize) === 0) ? 0 : 1);

            


            jQuery(self.element).append("<span class='ui-gridPagination-totalRows'> Total: " + totalRows + "</span>");

            if (TotalPages > 1)
            {
                var nPagesInPaginator = 10;    // Must be nPagerItems % 2 == 0
                var start = getStartPage(nPagesInPaginator, TotalPages, getCurrentPage(Page));
                var end = getEndPage(nPagesInPaginator, TotalPages, start);
                var tPager = jQuery("<table><tbody></tbody></table>");

                tPager.append(buildPage(0, getCurrentPage(Page), true, "&lt;&lt;", null));
                tPager.append(buildPage(getCurrentPage(Page) - 1 < 0 ? 0 : getCurrentPage(Page) - 1, getCurrentPage(Page), true, "&lt;", null));
                for (var i = start; i <= end; i++) {
                    tPager.append(buildPage(i - 1, getCurrentPage(Page), false, i.toString(), null));
                }
                tPager.append(buildPage(getCurrentPage(Page) + 1 >= TotalPages ? getCurrentPage(Page) : getCurrentPage(Page) + 1, getCurrentPage(Page), true, "&gt;", null));
                tPager.append(buildPage(TotalPages - 1, getCurrentPage(Page), true, "&gt;&gt;", null));


                jQuery(self.element)
                        .append(tPager)
                        .find('td')
                            .click(function () {
                                var pageIndex = jQuery(this).attr('value');
                                self._trigger('change', null, pageIndex);
                            });

                

            }
        } catch (e) {
            // just do nothing. Your pagination wont display anytighing
        }
    }
});