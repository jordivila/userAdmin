jQuery.widget("ui.crud", jQuery.ui.crudBase,
{
    options: {
        crudHeaderDomId: null,
        gridButtonsDOMId: null,
        gridDOMId: null,
        gridFilterDOMId: null,
        gridFilterObject: null,
        gridFilterVisibleAlways: false,
        gridFilterButtonsInit: function (widgetFilter, defaultButtons) {
            return defaultButtons;
        },
        formDOMId: null,


        gridCustomOptions: {},
        gridSearchMethod: null,
        gridFilterInit: function (crudWidget, filterOptions) {
            jQuery(crudWidget.options.gridFilterDOMId).crudFilter(jQuery.extend({}, filterOptions, { Model: crudWidget.options.filterModel }));
        },
        gridModel: [],
        gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

        },
        gridSearchForEditMethod: null,
        gridButtonsGet: function (crudWidget, defaultButtons) {
            return defaultButtons;
        },
        gridPagerInit: function () {
            // overrides default pagination mode
            return {
                pageSize: 10,
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
            };
        },

        formInit: function (crudWidget, formOptions) {
            throw new Error(crudWidget.namespace + '.' + crudWidget.widgetName + ".formInit is an abstract method. Child class method must be implemented");
        },
    },
    _create: function () {

        var self = this;

        this._super();

        var gridFilterClass = 'ui-{0}Crud-filter'.format(this.widgetName);
        var gridButtonsClass = 'ui-{0}Crud-gridButtons'.format(this.widgetName);
        var gridControlClass = 'ui-{0}Crud-gridControl'.format(this.widgetName);
        var formControlClass = 'ui-{0}Crud-form'.format(this.widgetName);
        var templateGet = function () {

            var template = '<div class="ui-crud-messages ui-state-default ui-helper-hidden"></div>' +
                            '<div class="{0}"></div>' +
                            '<div class="{1} ui-ribbonButtons  ui-state-default"></div>' +
                            '<div class="{2}"></div>' +
                            '<div class="{3}"></div>';

            return template
                .format(gridFilterClass,
                        gridButtonsClass,
                        gridControlClass,
                        formControlClass);
        };

        jQuery(this.element)
            .addClass('ui-crud ui-widget-content')
            .append(templateGet())
            .find('div.ui-crud-messages:first')
                .each(function () {
                    self.options.crudHeaderDomId = jQuery(this);
                    self.errorInit(jQuery(this));
                });

        this.options.gridFilterDOMId = jQuery(this.element).find('div.{0}:first'.format(gridFilterClass));
        this.options.gridDOMId = jQuery(this.element).find('div.{0}:first'.format(gridControlClass));
        this.options.gridButtonsDOMId = jQuery(this.element).find('div.{0}:first'.format(gridButtonsClass));
        this.options.formDOMId = jQuery(this.element).find('div.{0}:first'.format(formControlClass));
    },
    _init: function () {

        var self = this;

        this._super();
        this._gridButtonsInit();


        var gridOptions = jQuery.extend(
            {},
            {
                gridModel: self.options.gridModel,
                gridViewCellBound: self.options.gridViewCellBound,
                gridPagerInit: self.options.gridPagerInit,

                errorDisplay: function (e, msg) {
                    self.errorDisplay(msg);
                },
                dataBound: function () {
                    if (jQuery(self.options.gridFilterDOMId).is(':visible')) {
                        if (self.options.gridFilterVisibleAlways === false) {
                            self._actionSet(self._actions.list);
                        }
                    }
                },
                paginated: function (e, pagination) {
                    self.options.gridFilterObject.Page = pagination.pageIndex;
                    self.options.gridFilterObject.PageSize = pagination.pageSize;

                    self.errorHide();
                    self._search();
                },
                onSelect: function (e, dataItem) {
                    self.errorHide();
                    self._trigger('onSelect', null, dataItem);
                },
                onEdit: function (e, dataItem) {
                    self.errorHide();
                    self._searchForEdit(dataItem);
                }
            },
            self.options.gridCustomOptions);



        var crudEmptyDataResult = {
            Data: [],
            IsValid: true,
            Message: null,
            Page: 0,
            PageSize: self.options.gridPagerInit().pageSize,
            SortAscending: false,
            SortBy: "",
            TotalRows: 0
        };

        jQuery(this.options.gridDOMId).crudGrid(gridOptions);
        jQuery(this.options.gridDOMId).crudGrid('bind', crudEmptyDataResult);

        this.options.gridFilterInit(self, {
            Model: self.options.filterModel,
            PageSize: self.options.gridPagerInit().pageSize,
            gridFilterVisibleAlways: self.options.gridFilterVisibleAlways,
            filterButtonsInit: self.options.gridFilterButtonsInit,
            errorDisplay: function (e, msg) {
                self.errorDisplay(msg);
            },
            change: function (e, filter) {
                self.options.gridFilterObject = filter;
                self.errorHide();
                self._search();
            },
            cancel: function () {
                self.errorHide();
                self._actionSet(self._actions.list);
            },
            done: function () {

                var crudWidget = self;

                jQuery(crudWidget.options.formDOMId)
                    .crudForm(jQuery.extend({}, {
                        messagedisplayAutoHide: function (e, msg) {
                            self.messagedisplayAutoHide(msg);
                        },
                        messageDisplay: function (e, msg) {
                            self.messageDisplay(msg);
                        },
                        errorDisplay: function (e, msg) {
                            self.errorDisplay(msg);
                        },
                        errorHide: function () {
                            self.errorHide();
                        },
                        change: function (e, formValue) {
                            self.errorHide();
                            self._search();
                        },
                        dataBound: function () {
                            self.errorHide();
                            self._actionSet(self._actions.form);
                        },
                        cancel: function () {
                            self.errorHide();
                            self._actionSet(self._actions.list);
                        },
                    },
                        {
                            formModel: crudWidget.options.formModel,
                            formButtonsGet: crudWidget.options.formButtonsGet,
                            formBind: crudWidget.options.formBind,
                            formValueGet: crudWidget.options.formValueGet,
                            formSaveMethod: crudWidget.options.formSaveMethod
                        }));

                jQuery(crudWidget.options.formDOMId)
                    .find('div.ui-crudForm-modelBinding:first')
                        .widgetModel({
                            modelItems: crudWidget.options.formModel,
                            errorsCleared: function () {
                                crudWidget.errorHide();
                            }
                        })
                    .end();

                self.options.formInit(self, jQuery(crudWidget.options.formDOMId).find('div.ui-crudForm-formContent:first'));

                jQuery(crudWidget.options.formDOMId).fieldItem();

            }
        });


        this._actionSet(this._actions.list);
    },
    destroy: function () {
        this._super();
    },
    _actions: {
        list: 1,
        filter: 2,
        form: 3
    },
    _actionSet: function (actionSelected) {

        var self = this;

        self._hidePanels();

        switch (actionSelected) {
            case self._actions.filter:
                jQuery(self.options.gridFilterDOMId).removeClass('ui-helper-hidden').fadeTo('slow', 1);
                break;
            case self._actions.list:

                jQuery(self.options.gridDOMId).removeClass('ui-helper-hidden').fadeTo('slow', 1);

                if (self.options.gridFilterVisibleAlways) {
                    jQuery(self.options.gridFilterDOMId).removeClass('ui-helper-hidden').show();
                    jQuery(self.options.gridButtonsDOMId).hide();
                }
                else {
                    jQuery(self.options.gridFilterDOMId).addClass('ui-helper-hidden');
                    jQuery(self.options.gridButtonsDOMId).show();
                }


                break;
            case self._actions.form:
                jQuery(self.options.formDOMId).removeClass('ui-helper-hidden').fadeTo('slow', 1);
                break;
            default:
                break;
        }
    },
    _hidePanels: function () {
        jQuery(this.options.gridFilterDOMId).hide();
        jQuery(this.options.gridButtonsDOMId).hide();
        jQuery(this.options.gridDOMId).hide();
        jQuery(this.options.formDOMId).hide();
    },
    _search: function () {

        var self = this;

        self._gridSearch()
                .progress(function (status) {
                    self.progressShow(status);
                })
                .fail(function (args) {
                    self.progressHide();
                    self.errorDisplay(args);
                })
                .always(function () {
                    self.progressHide();
                });
    },
    _gridSearch: function () {

        var self = this;
        var dfd = jQuery.Deferred();

        dfd.notify("Buscando...");

        if (self.options.gridSearchMethod === null) {
            dfd.reject(self.namespace + '.' + self.widgetName + "options.gridSearchMethod is an abstract method. Child class must implement");
        }
        else {

            jQuery.when(self.options.gridSearchMethod(self.options.gridFilterObject))
                .then(
                    function (result, statusText, jqXHR) {
                        if (result.IsValid) {
                            jQuery(self.options.gridDOMId).crudGrid('bind', result.Data);
                            dfd.resolve();
                        }
                        else {
                            dfd.reject(result.Message);
                        }
                    },
                    function (jqXHR, textStatus, errorThrown) {
                        dfd.reject("Error buscando");
                    })
                .done(function () {

                });
        }

        return dfd.promise();
    },
    _searchForEdit: function (dataItem) {

        var self = this;

        self._gridEditSearch(dataItem)
                .progress(function (status) {
                    self.progressShow(status);
                })
                .fail(function (args) {
                    self.progressHide();
                    self.errorDisplay(args);
                })
                .always(function () {
                    self.progressHide();
                });
    },
    _gridEditSearch: function (dataItem) {

        var self = this;
        var dfd = jQuery.Deferred();

        dfd.notify("Buscando información...");

        if (self.options.gridSearchForEditMethod === null) {
            dfd.reject(self.namespace + '.' + self.widgetName + ".options.gridSearchForEditMethod is an abstract method. Child class must implement");
        }
        else {

            jQuery.when(self.options.gridSearchForEditMethod(dataItem))
                    .then(
                        function (result, statusText, jqXHR) {
                            if (result.IsValid) {
                                jQuery(self.options.formDOMId).crudForm('bind', result.Data);

                                dfd.resolve();
                            }
                            else {
                                dfd.reject(result.Message);
                            }
                        },
                        function (jqXHR, textStatus, errorThrown) {
                            dfd.reject("Error obteniendo información");
                        })
                    .done(function () {

                    });
        }

        return dfd.promise();


    },
    _gridButtonsInit: function () {

        var defaultButtons = this.options.gridButtonsGet(this, [{
            id: "search",
            text: "Buscar",
            cssClass: "ui-crud-search",
            icon: "ui-icon-search",
            click: function (self) {
                self.errorHide();
                self._actionSet(self._actions.filter);
            }
        }]);

        for (var i = 0; i < defaultButtons.length; i++) {
            this._initButton(this, defaultButtons[i], jQuery(this.options.gridButtonsDOMId));
        }

    },
    //public methods
    gridSearch: function () {

        jQuery(this.element)
            .find('div.ui-crudFilter-buttons')
                .find('button.ui-search-button')
                    .click()
                .end()
            .end();

        return this;
    },
    gridButtonsVisible: function (trueOrFalse) {

        var $dom = jQuery(this.element).find('div.ui-crudCrud-gridButtons');

        if (trueOrFalse) {
            $dom.show();
        }
        else {
            $dom.hide();
        }

        return this;
    },
    gridPagerVisible: function (trueOrFalse) {

        var $dom = jQuery(this.element).find('div.ui-crudGrid-pager');

        if (trueOrFalse) {
            $dom.show();
        }
        else {
            $dom.hide();
        }

        return this;
    }
});