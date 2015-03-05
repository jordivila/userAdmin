/// <reference path="inv.ajax.js" />

jQuery.widget("ui.gridPagination", jQuery.ui.commonBaseWidget,
{
    options: {
        showPager: true,
        showTotalRows: true,
        showSizePicker: true,
    },
    _create: function () {

        this._super();
    },
    _init: function () {

        this._super();


        this.bind(0, 0, 0);

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
    bind: function (pageIndex, pageSize, totalRows) {

        var self = this;

        jQuery(self.element).empty();

        try {

            var Page = parseInt(pageIndex);
            var PageSize = parseInt(pageSize);
            var TotalRows = parseInt(totalRows);
            var TotalPages = ((totalRows / pageSize) | 0) + (((totalRows % pageSize) === 0) ? 0 : 1);


            if (this.options.showPager === true) {

                var buildPage = function (page, currentPage, isNavigationItem, text) {
                    var cssClass = ((currentPage == page) && (!isNavigationItem)) ? "ui-state-highlight" : "ui-state-default";
                    return "<td class='" + cssClass + "' value='" + page + "'>" + text + "</td>";
                };
                var getCurrentPage = function (currentPage) {
                    return parseInt(currentPage === null ? 0 : currentPage);
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

                    return parseInt(startPage);
                };
                var getEndPage = function (nPagesInPaginators, totalPages, startPage) {
                    var endPage = startPage + nPagesInPaginators;
                    endPage = endPage > totalPages ? totalPages : endPage;
                    return parseInt(endPage);
                };

                if (TotalPages > 1) {
                    var nPagesInPaginator = 8;    // Must be nPagerItems % 2 == 0
                    var start = getStartPage(nPagesInPaginator, TotalPages, getCurrentPage(Page));
                    var end = getEndPage(nPagesInPaginator, TotalPages, start);
                    var tPager = jQuery("<table></table>");

                    tPager.append(buildPage(0, getCurrentPage(Page), true, "&lt;&lt;", null));
                    tPager.append(buildPage(getCurrentPage(Page) - 1 < 0 ? 0 : getCurrentPage(Page) - 1, getCurrentPage(Page), true, "&lt;", null));

                    for (var i = start; i <= end; i++) {
                        tPager.append(buildPage(i - 1, getCurrentPage(Page), false, i.toString(), null));
                    }

                    tPager.append(buildPage(getCurrentPage(Page) + 1 >= TotalPages ? getCurrentPage(Page) : getCurrentPage(Page) + 1, getCurrentPage(Page), true, "&gt;", null));
                    tPager.append(buildPage(TotalPages - 1, getCurrentPage(Page), true, "&gt;&gt;", null));

                    jQuery(self.element)
                            .append(tPager)
                            .find('table:first')
                                .wrapAll("<div class='ui-gridPagination-navBar'/>")
                                .find('td')
                                    .click(function () {
                                        self._onChange(jQuery(this).attr('value'));
                                    });
                }
            }







            // Building totals

            var $totalsBox = null;

            jQuery(self.element)
                .append("<div class='ui-gridPagination-totals'></div>")
                .find('div.ui-gridPagination-totals:first')
                .each(function () {
                    $totalsBox = jQuery(this);
                });


            //Showing results begin...

            $totalsBox
                    .append("<div class='ui-gridPagination-totalRows'>Mostrando {0}-{1} resultados de {2}</div>"
                        .format(Page, ((Page+1) * PageSize), TotalRows));



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

            if ((this.options.showTotalRows === false) && (this.options.showSizePicker === false)) {
                jQuery(this.element)
                    .find('div.ui-gridPagination-totals:first')
                        .hide()
                    .parents('div.{0}-{1}:first'.format(this.namespace, this.widgetName))
                        .addClass('ui-helper-hidden');
                    
            }
            else {
                if (this.options.showTotalRows === false) {
                    jQuery(this.element).find('div.ui-gridPagination-totalRows:first').hide();
                }

                if (this.options.showSizePicker === false) {
                    jQuery(this.element).find('div.ui-gridPagination-pageSizePicker:first').hide();
                }
            }





        } catch (e) {
            console.error(e);
        }
    }
});