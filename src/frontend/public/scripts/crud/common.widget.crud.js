define(["jquery",
        "jqueryui",
        "scripts/Template.App.ClientApp",
        "pPromises",
        "scripts/crud/common.widget.crud.base",
        "scripts/crud/common.widget.crud.grid",
        "scripts/crud/common.widget.crud.filter",
        "scripts/crud/common.widget.crud.form",
        "scripts/crud/common.widget.grid.pagination",
        "scripts/crud/common.widget.fieldItem",
],
function ($, jqUI, clientApp, P) {


    jQuery.widget("ui.crud", jQuery.ui.crudBase,
    {
        options: {

            // is used to identifiy crud as unique 
            // when navigating to another page crud loses its state
            // use this option to store state in a cookie 
            // when the user comes back from another page
            // crud searches for its state and uses it
            // trying to keep 
            stateStorageId: null,
            stateStorageDeserialize: function (currentValue) {
                // use this function to customize some deserialization
                // for example... Date conversion, number conversion, etc

                // as far as JSON.stringify serializes dates as string 
                // JSON.parse deserializes dates in string format.
                // thus, you should use something like currentValue.dateValue = new Date("2015-08-21T09:26:24.583Z")
                return currentValue;
            },

            //crudHeaderDomId: null,
            gridExpand: false,
            gridExpandHeightCalc: function ($widget) {

                var gridBoxHeight = jQuery(window).height() -
                (
                    jQuery($widget).find('div.ui-crudGrid-body-container:first').offset().top +
                    jQuery($widget).find('div.ui-crudGrid-pager-bottom:first').height() +
                    5
                );

                return gridBoxHeight;
            },
            gridButtonsDOMId: null,
            gridDOMId: null,
            gridFilterDOMId: null,
            gridFilterObject: null,
            gridFilterVisibleAlways: false,
            gridFilterButtonsInit: function (widgetFilter, defaultButtons) {
                return defaultButtons;
            },

            texts: {
                gridEmptyData: clientApp.i18n.texts.get("Template.Widget.Crud.EmptyResults"),
                gridSearchNotifyBeginMsg: clientApp.i18n.texts.get("Template.Widget.Crud.Searching"),
                gridSearchNotifyFailMsg: clientApp.i18n.texts.get("Template.Widget.Crud.UnhandledErrorSearchingData"),
                gridSearchEditNotifyBeginMsg: clientApp.i18n.texts.get("Template.Widget.Crud.SearchItemForEdit"),
                gridSearchEditNotifyFailMsg: clientApp.i18n.texts.get("Template.Widget.Crud.UnhandledErrorSearchingForEdit"),
            },




            gridCustomOptions: {},
            gridSearchMethod: null,
            gridFilterInit: function (crudWidget, filterOptions) {
                jQuery(crudWidget.options.gridFilterDOMId).crudFilter(jQuery.extend({}, filterOptions, { model: crudWidget.options.filterModel }));
            },
            gridModel: [],
            gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

            },
            gridSearchForEditMethod: null,
            gridButtonsGet: function (crudWidget, defaultButtons) {
                return defaultButtons;
            },
            gridButtonsVisible: true,
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
                    },
                    infiniteScrolling: false
                };
            },

            formDOMId: null,
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

            self._templateInit(gridFilterClass, gridButtonsClass, gridControlClass, formControlClass);
            self._templateSetSelectors(gridFilterClass, gridButtonsClass, gridControlClass, formControlClass);
        },
        _init: function () {

            var self = this;




            var errTreat = function (e) {
                console.error(e);
                self.errorDisplay(clientApp.i18n.texts.get("Template.Widget.Crud.UnhandledErrorInitCrud"));
            };

            P.all([
                self._gridInit(),
                self._gridFilterInit()
            ]).nodeify(function (errInitGrid, data) {
                if (errInitGrid !== null) {
                    errTreat(errInitGrid);
                }
                else {
                    P.all([
                        self._formInit()
                    ]).nodeify(function (errFormInit, data) {
                        if (errFormInit !== null) {
                            errTreat(errFormInit);
                        }
                        else {
                            self._gridButtonsInit();

                            if (self._stateExists() === true) {
                                self._stateToGrid();
                                self.gridSearch();
                            }
                            else {
                                jQuery(self.options.gridDOMId).crudGrid('emptyFirstLoad');
                            }

                            setTimeout(function () { self.gridExpandHeightSet(); }, 200);
                            self._actionSet(self._actions.list);


                            self._trigger('done', null, self);
                        }
                    });
                }
            });









            this._super();
        },
        destroy: function () {

            jQuery(this.options.gridDOMId).crudGrid('destroy');
            jQuery(this.options.gridFilterDOMId).crudFilter('destroy');

            this._super();
        },
        edit: function (dataItem) {
            // do NOT make this method private 
            this.errorHide();
            this._searchForEdit(dataItem);
        },
        add: function (dataItem) {
            // do NOT make this method private 
            this.errorHide();
            jQuery(this.options.formDOMId).crudForm('bind', dataItem);
        },
        _templateInit: function (gridFilterClass, gridButtonsClass, gridControlClass, formControlClass) {

            var self = this;

            jQuery(this.element)
                .addClass('ui-crud ui-widget-content')
                .append(self._templateGet(gridFilterClass, gridButtonsClass, gridControlClass, formControlClass))
                .find('div.ui-crud-messages:first')
                    .each(function () {
                        //self.options.crudHeaderDomId = jQuery(this);
                        self.errorInit(jQuery(this));
                    });


        },
        _templateGet: function (gridFilterClass, gridButtonsClass, gridControlClass, formControlClass) {

            var template = '<div class="ui-crud-messages ui-state-default"></div>' +
                            '<div class="{0}"></div>' +
                            '<div class="{1} ui-ribbonButtons  ui-state-default"></div>' +
                            '<div class="{2}"></div>' +
                            '<div class="{3}"></div>';

            return template
                .format(gridFilterClass,
                        gridButtonsClass,
                        gridControlClass,
                        formControlClass);
        },
        _templateSetSelectors: function (gridFilterClass, gridButtonsClass, gridControlClass, formControlClass) {
            this.options.gridFilterDOMId = jQuery(this.element).find('div.{0}:first'.format(gridFilterClass));
            this.options.gridDOMId = jQuery(this.element).find('div.{0}:first'.format(gridControlClass));
            this.options.gridButtonsDOMId = jQuery(this.element).find('div.{0}:first'.format(gridButtonsClass));
            this.options.formDOMId = jQuery(this.element).find('div.{0}:first'.format(formControlClass));
        },

        _actions: {
            list: 1,
            filter: 2,
            form: 3
        },
        _actionSet: function (actionSelected) {

            var self = this;

            self._hidePanels();

            if (actionSelected === self._actions.filter) {
                self._actionSetFilter();
            }

            if (actionSelected === self._actions.list) {
                self._actionSetList();
                //self.gridExpandHeightSet();
            }

            if (actionSelected === self._actions.form) {
                self._actionSetForm();
            }
        },
        _actionSetForm: function () {

            var self = this;

            jQuery(self.options.formDOMId).removeClass('ui-helper-hidden').fadeTo('slow', 1);
        },
        _actionSetList: function () {

            var self = this;

            jQuery(self.options.gridDOMId).removeClass('ui-helper-hidden').fadeTo('slow', 1);


            if (self.options.gridFilterVisibleAlways) {
                jQuery(self.options.gridFilterDOMId).removeClass('ui-helper-hidden').show();
                jQuery(self.options.gridButtonsDOMId).hide();
            }
            else {
                jQuery(self.options.gridFilterDOMId).addClass('ui-helper-hidden');

                if (this.options.gridButtonsVisible === true) {
                    jQuery(self.options.gridButtonsDOMId).show();
                }
                else {
                    jQuery(self.options.gridButtonsDOMId).hide();
                }
            }


            this.gridExpandHeightSet();

        },
        _actionSetFilter: function () {

            var self = this;

            jQuery(self.options.gridFilterDOMId).removeClass('ui-helper-hidden').fadeTo('slow', 1);
        },
        _hidePanels: function () {
            jQuery(this.options.gridFilterDOMId).hide();
            jQuery(this.options.gridButtonsDOMId).hide();
            jQuery(this.options.gridDOMId).hide();
            jQuery(this.options.formDOMId).hide();
        },
        _search: function () {

            var self = this;



            // sometimes self.options.gridFilterObject can be null
            // for instance: 
            //      1.- user adds a new item before searching-> thus crudfilter has not been set yet
            //      2.- new item is saved and crudForm.change event is fired
            //      3.- when crudForm.change is fired crudWidget fires crudGrid.search method
            //
            // That's why we will only fire search in case filterObject is not null
            if (self.options.gridFilterObject !== null) {
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
            }

        },
        _stateSave: function (filterValue, gridData) {

            if (this.options.stateStorageId !== null) {
                sessionStorage.setItem("{0}_filter".format(this.options.stateStorageId), JSON.stringify(filterValue));
                //sessionStorage.setItem("{0}_gridData".format(this.options.stateStorageId), JSON.stringify(gridData));
            }

        },
        _stateExists: function () {
            return this._stateGet() !== null;
        },
        _stateGet: function () {

            var result = null;

            if (this.options.stateStorageId !== null) {

                var stateFilter = sessionStorage.getItem("{0}_filter".format(this.options.stateStorageId));
                //var stateGridData = sessionStorage.getItem("{0}_gridData".format(this.options.stateStorageId));

                if ((stateFilter !== null) /*&& (stateGridData !== null)*/) {
                    result = this.options.stateStorageDeserialize({
                        filter: JSON.parse(stateFilter),
                        //gridData: JSON.parse(stateGridData)
                    });
                }
            }

            return result;

        },
        _stateToGrid: function () {

            if (this._stateExists() === true) {
                var state = this._stateGet();
                this.options.gridFilterObject = state.filter;
                jQuery(this.options.gridFilterDOMId).crudFilter('val', state.filter);
                //jQuery(this.options.gridDOMId).crudGrid('bind', state.gridData);
            }

        },

        _gridSearch: function () {

            var self = this;
            var dfd = jQuery.Deferred();

            dfd.notify(self.options.texts.gridSearchNotifyBeginMsg);

            if (self.options.gridSearchMethod === null) {
                dfd.reject(self.namespace + '.' + self.widgetName + "options.gridSearchMethod is an abstract method. Child class must implement");
            }
            else {

                jQuery.when(self.options.gridSearchMethod(self.options.gridFilterObject))
                    .then(
                        function (result, statusText, jqXHR) {
                            if (result.isValid) {
                                jQuery(self.options.gridDOMId).crudGrid('bind', result.data);
                                self._stateSave(self.options.gridFilterObject, result.data);
                                dfd.resolve();
                            }
                            else {
                                dfd.reject(result.messages[0]);
                            }
                        },
                        function (jqXHR, textStatus, errorThrown) {
                            dfd.reject(self.options.texts.gridSearchNotifyFailMsg);
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

            dfd.notify(self.options.texts.gridSearchEditNotifyBeginMsg);

            if (self.options.gridSearchForEditMethod === null) {
                dfd.reject(self.namespace + '.' + self.widgetName + ".options.gridSearchForEditMethod is an abstract method. Child class must implement");
            }
            else {

                jQuery.when(self.options.gridSearchForEditMethod(dataItem))
                        .then(
                            function (result, statusText, jqXHR) {
                                if (result.isValid) {
                                    jQuery(self.options.formDOMId).crudForm('bind', result.data);

                                    dfd.resolve();
                                }
                                else {
                                    dfd.reject(result.messages[0]);
                                }
                            },
                            function (jqXHR, textStatus, errorThrown) {
                                dfd.reject(self.options.texts.gridSearchEditNotifyFailMsg);
                            })
                        .done(function () {

                        });
            }

            return dfd.promise();


        },
        _gridButtonsInit: function () {

            var defaultButtons = this.options.gridButtonsGet(this, [{
                id: "search",
                text: clientApp.i18n.texts.get("Template.Widget.Crud.Search"),
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
        _gridInit: function () {

            var self = this;
            var dfd = jQuery.Deferred();

            try {
                jQuery(this.options.gridDOMId).crudGrid(function () {

                    return jQuery.extend(
                                    {},
                                    {
                                        gridModel: self.options.gridModel,
                                        gridViewCellBound: self.options.gridViewCellBound,
                                        gridPagerInit: self.options.gridPagerInit,
                                        gridExpand: self.options.gridExpand,
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
                                            self.options.gridFilterObject.page = pagination.pageIndex;
                                            self.options.gridFilterObject.pageSize = pagination.pageSize;

                                            self.errorHide();
                                            self._search();
                                        },
                                        onSelect: function (e, dataItem) {
                                            self.errorHide();
                                            self._trigger('onSelect', null, dataItem);
                                        },
                                        onEdit: function (e, dataItem) {
                                            self.edit(dataItem);
                                        },
                                        onHeightSet: function () {
                                            self.gridExpandHeightSet();
                                        },
                                    },
                                    self.options.gridCustomOptions);

                }());
                setTimeout(function () { dfd.resolve(); }, 1);
            } catch (e) {
                setTimeout(function () { dfd.reject(e); }, 1);
            }

            return dfd.promise();
        },
        _gridFilterInit: function () {
            var self = this;
            var dfd = jQuery.Deferred();

            try {
                this.options.gridFilterInit(self, {
                    model: self.options.filterModel,
                    pageSize: self.options.gridPagerInit().pageSize,
                    gridFilterVisibleAlways: self.options.gridFilterVisibleAlways,
                    filterButtonsInit: self.options.gridFilterButtonsInit,
                    errorDisplay: function (e, msg) {
                        self.errorDisplay(msg);
                    },
                    change: function (e, filter) {
                        self.options.gridFilterObject = filter;
                        self.errorHide();
                        jQuery(self.options.gridDOMId).crudGrid('emptyData');
                        self._search();


                    },
                    cancel: function () {
                        self.errorHide();
                        self._actionSet(self._actions.list);
                    },
                    done: function () {
                        setTimeout(function () { dfd.resolve(); }, 1);
                    }
                });
            }
            catch (e) {
                setTimeout(function () { dfd.reject(e); }, 1);
            }

            return dfd.promise();
        },
        _formInit: function () {
            var self = this;
            var dfd = jQuery.Deferred();

            try {

                var crudWidget = self;

                jQuery(crudWidget.options.formDOMId)
                    .crudForm(jQuery.extend({}, {
                        crudParent: self,
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

                setTimeout(function () { dfd.resolve(); }, 1);
            }
            catch (e) {
                setTimeout(function () { dfd.reject(e); }, 1);
            }

            return dfd.promise();
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

            this.options.gridButtonsVisible = trueOrFalse;

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
        },
        gridExpandHeightSet: function () {

            if (this.options.gridExpand === true) {
                var gridBoxHeight = this.options.gridExpandHeightCalc(this.element);

                jQuery(this.element)
                    .find('div.ui-crudGrid-body-container:first')
                        .height(gridBoxHeight)
                    .end()
                    .find('tr.ui-widgetGrid-emptyRow')
                        .height(gridBoxHeight - 5)
                    .end();
            }
        },

    });


});