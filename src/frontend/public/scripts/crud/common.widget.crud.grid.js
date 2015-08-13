define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "scripts/crud/common.widget.crud.base"
],
    function ($, jqUI, clientApp) {

        jQuery.widget("ui.crudGrid", jQuery.ui.crudBase,
        {
            options: {
                gridBodyDOMId: null,
                gridHeaderDOMId: null,
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
                //gridExpand: false,                        // -> this option comes from ui.crud

                texts: {
                    gridFirstTime: clientApp.i18n.texts.get("Template.Widget.Crud.EmptyResultsFirstTime"),
                    gridEmptyData: clientApp.i18n.texts.get("Template.Widget.Crud.EmptyResults"),
                    gridBindingError: clientApp.i18n.texts.get("Template.Widget.Crud.UnhandledErrorBindingGridData")
                }
            },
            _create: function () {

                this._super();

                jQuery(this.element)
                    .addClass('ui-crudGrid ui-widgetGrid')
                    .append(this._gridTemplate());

                this.options.gridBodyDOMId = jQuery(this.element).find('table.ui-crudGrid-body:first');
                this.options.gridPagerDOMId = jQuery(this.element).find('div.ui-crudGrid-pager');
                this.options.gridHeaderDOMId = jQuery(this.element).find('tr.ui-crudGrid-header');

            },
            _init: function () {
                this._gridExpandInit();
                this._gridPagerInit();
                this._super();
            },
            destroy: function () {

                jQuery(window).unbind('resize');


                this._super();

            },
            emptyData: function () {
                this._emptyGridSet(this.options.texts.gridEmptyData);
            },
            emptyFirstLoad: function () {
                this._emptyGridSet(this.options.texts.gridFirstTime);
            },
            bind: function (data) {

                try {

                    jQuery(this.element)
                        .removeClass('ui-crudGrid-isEmpty')
                        .find(this.options.gridHeaderDOMId)
                            .removeClass('ui-helper-hidden')
                        .end();

                    this._bindRows(data);
                    this._bindPagination(data);
                    this._trigger('dataBound', null, data);
                } catch (e) {

                    console.error(e);
                    this._trigger('errorDisplay', null, this.options.texts.gridBindingError);
                }


                this._trigger('onHeightSet', null, {});

            },
            _gridTemplate: function () {

                return '<table class="ui-crudGrid-container">' +
                            '<tr>' +
                                '<td colspan="' + this.options.gridModel.length + '">' +
                                    '<div class="ui-crudGrid-pager ui-crudGrid-pager-top ui-state-default"></div>' +
                                '</td>' +
                            '</tr>' +
                            '<tr class="ui-crudGrid-header ui-widgetGrid-header ui-widget-header">' +
                                    this._gridHeaderTemplate() +
                            '</tr>' +
                            '<tr>' +
                                '<td colspan="' + this.options.gridModel.length + '">' +
                                    '<div class="ui-crudGrid-body-container">' +
                                        '<table class="ui-crudGrid-body ui-widgetGrid-body" >' +

                                        '</table>' +
                                    '</div>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td colspan="' + this.options.gridModel.length + '">' +
                                    '<div class="ui-crudGrid-pager ui-crudGrid-pager-bottom ui-state-default"></div>' +
                                '</td>' +
                            '</tr>' +
                        '</table>';
            },
            _gridHeaderTemplate: function () {

                var str = '';

                for (var i = 0; i < this.options.gridModel.length; i++) {
                    str += '<td class="ui-crudGrid-{0} ui-widgetGrid-column">{1}</td>'.format(this.options.gridModel[i].key, this.options.gridModel[i].displayName);
                }

                return str;
            },
            _gridRowTemplate: function (dataItem) {

                var str = '';

                for (var i = 0; i < this.options.gridModel.length; i++) {
                    str += '<td class="ui-crudGrid-{0} ui-widgetGrid-column ui-state-default {2}"><div class="ui-widgetGrid-column-content">{1}</div></td>'
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
                    .children('tr')
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

                var pagerOptions = this.options.gridPagerInit();

                if (data.data.length > 0) {

                    if (pagerOptions.infiniteScrolling !== true) {
                        jQuery(self.options.gridBodyDOMId).empty();
                    }
                    else {
                        jQuery(self.options.gridBodyDOMId).find('tr.ui-widgetGrid-emptyRow:first').remove();
                    }

                    for (var i = 0; i < data.data.length; i++) {
                        var dataItem = data.data[i];
                        var $row = jQuery('<tr class="ui-crudGrid-dataRow ui-widgetGrid-row ui-state-default {1}">{0}</tr>'
                                    .format(self._gridRowTemplate(dataItem),
                                            (i == (data.data.length - 1) ? 'ui-crudGrid-row-last' : '')));

                        for (var j = 0; j < this.options.gridModel.length; j++) {

                            var $cell = $row.find('td.ui-crudGrid-{0}:first'.format(this.options.gridModel[j].key))
                                            .find('div.ui-widgetGrid-column-content');


                            self.options.gridViewCellBound(this, $row, $cell, dataItem, this.options.gridModel[j].key);
                        }

                        jQuery(self.options.gridBodyDOMId).append($row);

                        self._bindRowAlternatedColor();
                    }
                }
                else {

                    if (pagerOptions.infiniteScrolling !== true) {
                        self._buildEmptyDataRow();
                    }
                    else {
                        // Pager unbind scroll event automatically when no data is present based on Page*PageSize>TotalRows
                    }
                }
            },
            _bindPagination: function (data) {
                jQuery(this.options.gridPagerDOMId).gridPagination('bind', data.page, data.pageSize, data.totalRows);
            },
            _buildSingleDataRow: function (message) {
                var $emtpyRow = '<tr class="ui-widgetGrid-emptyRow ui-state-active"><td class="ui-widgetGrid-column"><div class="ui-widgetGrid-column-content">{0}</div></td></tr>'
                                    .format(message);

                jQuery(this.options.gridBodyDOMId).append($emtpyRow);
            },
            _gridExpandInit: function () {

                var self = this;

                if (this.options.gridExpand === true) {

                    jQuery(this.element)
                        .find('div.ui-crudGrid-body-container:first')
                            .addClass('ui-crudGrid-expanded')
                        .end();

                    jQuery(window)
                        .resize(function (e, ui) {
                            self._trigger('onHeightSet', null, {});
                        });
                }
            },
            _gridPagerInit: function () {

                var self = this;

                var pagerOpts = {
                    change: function (e, pagination) {
                        self._trigger('paginated', null, pagination);
                    },
                };

                var pagerConfig = jQuery.extend({},
                    {
                        infiniteScrolling: false,
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


                if (pagerConfig.infiniteScrolling === true) {
                    pagerConfig.pagerTop.infiniteScrolling = true;
                    pagerConfig.pagerBottom.infiniteScrolling = true;
                }

                pagerConfig = jQuery.extend({}, pagerOpts, pagerConfig);

                jQuery(self.options.gridPagerDOMId)
                        .first()
                            .gridPagination(jQuery.extend({}, pagerConfig, pagerConfig.pagerTop))
                        .end()
                        .last()
                            .gridPagination(jQuery.extend({}, pagerConfig, pagerConfig.pagerBottom))
                        .end();


            },
            _emptyGridSet: function (message) {
                jQuery(this.element)
                    .addClass('ui-crudGrid-isEmpty')
                    .find(this.options.gridBodyDOMId)
                        .empty()
                    .end()
                    .find(this.options.gridHeaderDOMId)
                        .addClass('ui-helper-hidden')
                    .end();


                this._buildSingleDataRow(message);
                this._trigger('onHeightSet', null, {});
            }
        });

    });