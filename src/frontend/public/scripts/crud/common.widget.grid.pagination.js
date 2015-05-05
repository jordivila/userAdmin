
jQuery.widget("ui.gridPagination", jQuery.ui.widgetBase,
{
    options: {
        paginationShow: true,
        totalRowsShow: true,
        pageSizeShow: true,
        nPagesInPaginator: 3,
        pageSize: 10,
    },
    _create: function () {

        this._super();
    },
    _init: function () {

        this._super();

        this.bind(0, this.options.pageSize, 0);

    }, destroy: function () {

        this._super();
    },
    _onChange: function (pageIndex) {

        this._trigger('change', null,
            {
                pageIndex: parseInt(pageIndex),
                pageSize: parseInt(jQuery(this.element).find('div.ui-gridPagination-pageSizePicker:first').find('select:first').val())
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

        var defaultNPages = 4;

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
    _buildPagination: function (Page, PageSize, TotalRows, TotalPages) {

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
    bind: function (pageIndex, pageSize, totalRows) {

        var self = this;

        jQuery(self.element).empty();

        //try {

        pageSize = pageSize || this.options.pageSize;

        var Page = parseInt(pageIndex);
        var PageSize = parseInt(pageSize);
        var TotalRows = parseInt(totalRows);
        var TotalPages = ((totalRows / pageSize) | 0) + (((totalRows % pageSize) === 0) ? 0 : 1);


        if (this.options.paginationShow === true) {

            self._buildPagination(Page, PageSize, TotalRows, TotalPages);
        }







        // Building totals

        var $totalsBox = null;

        jQuery(self.element)
            .append("<div class='ui-gridPagination-totals ui-state-default'></div>")
            .find('div.ui-gridPagination-totals:first')
            .each(function () {
                $totalsBox = jQuery(this);
            });


        //Showing results begin...

        $totalsBox
                .append("<div class='ui-gridPagination-totalRows'>Mostrando {0}-{1} resultados de {2}</div>"
                    .format(((Page * PageSize) + 1), (((Page + 1) * PageSize)), TotalRows));



        //Showing pagesize begin...
        $totalsBox
                .append("<div class='ui-gridPagination-pageSizePicker'><select></select> por pagina</div>"
                    .format(PageSize));



        var strOptions = '';

        for (var iPageSize = 10; iPageSize < 60; (iPageSize += 10)) {
            strOptions += "<option value='{0}'>{0}</option>".format(iPageSize);
        }


        var $select = $totalsBox
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

        $totalsBox.append('<div class="ui-helper-clearfix" />');

        if ((this.options.totalRowsShow === false) && (this.options.pageSizeShow === false)) {
            jQuery(this.element)
                .find('div.ui-gridPagination-totals:first')
                    .hide()
                .parents('div.{0}-{1}:first'.format(this.namespace, this.widgetName))
                    .addClass('ui-helper-hidden');

        }
        else {
            if (this.options.totalRowsShow === false) {
                jQuery(this.element).find('div.ui-gridPagination-totalRows:first').hide();
            }

            if (this.options.pageSizeShow === false) {
                jQuery(this.element).find('div.ui-gridPagination-pageSizePicker:first').hide();
            }
        }





        //} catch (e) {
        //    console.error(e);
        //}
    }
});
