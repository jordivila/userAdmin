
jQuery.widget("ui.crudBase", jQuery.ui.commonBaseWidget,
{
    options: {
        errorDOMId: null,
        messagesDOMId: null
    },
    _create: function () {

        this._super();

        this.progressInit();

    },
    _init: function () {
        this._super();
    },
    destroy: function () {

        this._super();
    },
    _initButton: function (widgetInstance, theButtonOptions, buttonsBox) {

        var self = this;

        var theButton = jQuery('<button type="button" class="{0}">{1}</button>'
                            .format(theButtonOptions.cssClass,
                                    theButtonOptions.text));

        jQuery(buttonsBox).append(theButton);

        theButton
            .button({
                icons: {
                    primary: theButtonOptions.icon
                }
            });

        if (theButtonOptions.click) {
            theButton.click(function () {
                theButtonOptions.click(widgetInstance);
            });
        }
    },
    errorInit: function (parent) {

        if (parent) {

            var errorCustomDOMClassName = this.namespace + '-' + this.widgetName + '-errDisplayBox';
            var highlightCustomDOMClassName = this.namespace + '-' + this.widgetName + '-highlightDisplayBox';


            var template = '<div class="ui-crud-error {0} ui-state-error ui-hidden"></div>' +
                           '<div class="ui-crud-info {1} ui-state-highlight ui-hidden"></div>';

            template = template.format(errorCustomDOMClassName, highlightCustomDOMClassName);

            jQuery(this.element).find(parent).append(template);

            this.options.errorDOMId = jQuery(this.element).find('div.' + errorCustomDOMClassName + ':first');
            this.options.messagesDOMId = jQuery(this.element).find('div.' + highlightCustomDOMClassName + ':first');

            this.errorHide();
            this.messageHide();
        }
    },
    errorDisplay: function (msg, cb) {

        console.log("Error->" + msg);

        jQuery(this.options.errorDOMId)
            .parents('div:first')
                .addClass('ui-state-error')
            .end()
            .html(msg)
            .fadeTo('slow', 1, cb);
    },
    errorHide: function (cb) {

        jQuery(this.options.errorDOMId)
            .parents('div:first')
                .removeClass('ui-state-error')
            .end()
            .html('')
            .fadeTo('slow', 0, cb);
    },
    messageDisplay: function (msg, cb) {
        jQuery(this.options.messagesDOMId)
            .parents('div:first')
                .addClass('ui-state-highlight')
            .end()
            .html(msg)
            .fadeTo('slow', 1, cb);
    },
    messageHide: function (cb) {
        jQuery(this.options.messagesDOMId)
            .parents('div:first')
                .removeClass('ui-state-highlight')
            .end()
            .html('')
            .fadeTo('slow', 0, cb);
    },
    messagedisplayAutoHide: function (msg, miliseconds) {

        var time = 3000;
        var self = this;

        if (miliseconds) {
            time = miliseconds;
        }

        this.messageDisplay(msg,
            function () {
                jQuery(self.options.messagesDOMId)
                    .delay(time)
                    .fadeTo(time, 0, function () { self.messageHide(); });
            });
    },
});

jQuery.widget("ui.crud", jQuery.ui.crudBase,
{
    options: {
        title: null,

        crudHeaderDomId: null,
        gridButtonsDOMId: null,
        gridDOMId: null,
        gridFilterDOMId: null,
        gridFilterObject: null,
        formDOMId: null,

        gridCustomOptions: {},
        gridSearchMethod: null,
        gridFilterInit: function (crudWidget, filterOptions) {
            jQuery(crudWidget.options.gridFilterDOMId).crudFilter(jQuery.extend({}, filterOptions, { Model: crudWidget.options.filterModel }));
        },
        gridHeaderTemplate: function (crudGridWidget) {
            throw new Error(crudGridWidget.namespace + '.' + crudGridWidget.widgetName + ".options.gridHeaderTemplate is an abstract method. Child class method must be implemented");
        },
        gridRowTemplate: function (crudGridWidget) {
            throw new Error(crudGridWidget.namespace + '.' + crudGridWidget.widgetName + ".options.gridRowTemplate is an abstract method. Child class method must be implemented");
        },
        gridBindRowColumns: function (crudGridWidget, $row, dataItem) {
            throw new Error(crudGridWidget.namespace + '.' + crudGridWidget.widgetName + ".options.gridBindRowColumns is an abstract method. Child class method must be implemented");
        },
        gridBindRowEvents: function (crudGridWidget, $row, dataItem) {
            throw new Error(crudGridWidget.namespace + '.' + crudGridWidget.widgetName + ".options.gridBindRowEvents is an abstract method. Child class method must be implemented");
        },
        gridSearchForEditMethod: null,
        gridButtonsGet: function (crudWidget, defaultButtons) {
            return defaultButtons;
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


            var template = '<div class="ui-widget-header">{0}</div>' +
                            '<div class="{1}"></div>' +
                            '<div class="{2} ui-ribbonButtons ui-widget-content ui-state-default"></div>' +
                            '<div class="{3}"></div>' +
                            '<div class="{4}"></div>';

            return template
                .format(self.options.title,
                        gridFilterClass,
                        gridButtonsClass,
                        gridControlClass,
                        formControlClass);
        };

        jQuery(this.element)
            .addClass('ui-crud')
            .append(templateGet())
            .find('div.ui-widget-header:first')
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
                //this.options.gridInit(self, {
                gridHeaderTemplate: self.options.gridHeaderTemplate,
                gridRowTemplate: self.options.gridRowTemplate,
                gridBindRowColumns: self.options.gridBindRowColumns,
                gridBindRowEvents: self.options.gridBindRowEvents,

                errorDisplay: function (e, msg) {
                    self.errorDisplay(msg);
                },
                dataBound: function () {
                    if (jQuery(self.options.gridFilterDOMId).is(':visible')) {
                        self._actionSet(self._actions.list);
                    }
                },
                paginated: function (e, pageIndex) {
                    self.options.gridFilterObject.Page = pageIndex;
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

        jQuery(this.options.gridDOMId).crudGrid(gridOptions);

        this.options.gridFilterInit(self, {
            Model: self.options.filterModel,
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

                self.options.formInit(self, {
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
                    done: function () {
                        self._done();
                    },
                    fail: function () {
                        self.errorDisplay(self.namespace + '.' + self.widgetName + " Error iniciando el control de formulario");
                    }
                });
            }
        });
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

        jQuery(self.options.gridFilterDOMId).hide();
        jQuery(self.options.gridButtonsDOMId).hide();
        jQuery(self.options.gridDOMId).hide();
        jQuery(self.options.formDOMId).hide();

        switch (actionSelected) {
            case self._actions.filter:
                jQuery(self.options.gridFilterDOMId).removeClass('ui-hidden').show('blind');
                break;
            case self._actions.list:
                jQuery(self.options.gridDOMId).removeClass('ui-hidden').show('blind');
                jQuery(self.options.gridButtonsDOMId).show();
                break;
            case self._actions.form:
                jQuery(self.options.formDOMId).removeClass('ui-hidden').show('blind');
                break;
            default:
                break;
        }
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
    _done: function () {
        this._trigger('done', null, null);
    }
});

jQuery.widget("ui.crudFilter", jQuery.ui.crudBase,
{
    options: {
        Page: 0,
        PageSize: 30,
        SortBy: "",
        SortAscending: false,
        filterButtonsInit: function (self, defaultButtons) {
            return defaultButtons;
        }
    },
    _create: function () {


        this._super();

        jQuery(this.element).widgetModel({
            modelItems: this.options.Model
        });

        jQuery(this.element)
            .addClass('ui-crudFilter ui-hidden')
                .children()
                .wrapAll('<div class="ui-crudFilter-form ui-widget-content" />')
                .end()
        .prepend('<div class="ui-crudFilter-buttons ui-ribbonButtons ui-widget-content ui-state-default"></div>');

        this._filterButtonsInit();
    },
    _init: function () {

        this._super();

        this._done();
    },
    _done: function () {
        this._trigger('done', null, null);
    },
    _filterButtonsInit: function () {

        var self = this;

        var defaultButtons = self.options.filterButtonsInit(this, [{
            id: "cancel",
            text: "Cancelar",
            cssClass: "ui-cancel-button ui-state-default",
            icon: "ui-icon-circle-arrow-w",
            click: function (self) {
                self._trigger('cancel', null, null);
            }
        }, {
            id: "filter",
            text: "Aplicar filtro",
            cssClass: "ui-search-button ui-state-default",
            icon: "ui-icon-search",
            click: function (self) {
                var filter = self.val();
                self._trigger('change', null, filter);
            }
        }]);

        var $buttonsBox = jQuery(this.element).find('div.ui-crudFilter-buttons:first');

        for (var i = 0; i < defaultButtons.length; i++) {
            this._initButton(this, defaultButtons[i], $buttonsBox);
        }

        jQuery($buttonsBox).append('<div class="ui-carriageReturn"></div>');
    },
    destroy: function () {

        this._super();

        ///TODO: unbind select change events + button events
    },
    val: function () {

        var self = this;

        var model = {

            Filter: jQuery(this.element).widgetModel('valAsObject'),
            Page: 0,
            PageSize: this.options.PageSize,
            SortBy: this.options.SortBy,
            SortAscending: this.options.SortAscending
        };

        return model;
    }
});

jQuery.widget("ui.crudGrid", jQuery.ui.crudBase,
{
    options: {
        gridBodyDOMId: null,
        gridPagerDOMId: null,


        gridHeaderTemplate: function (crudGridWidget) {
            throw new Error(crudGridWidget.namespace + '.' + crudGridWidget.widgetName + ".options.gridHeaderTemplate is an abstract method. Child class method must be implemented");
        },
        gridRowTemplate: function (crudGridWidget) {
            throw new Error(crudGridWidget.namespace + '.' + crudGridWidget.widgetName + ".options.gridRowTemplate is an abstract method. Child class method must be implemented");
        },
        gridBindRowColumns: function (crudGridWidget, $row, dataItem) {
            throw new Error(crudGridWidget.namespace + '.' + crudGridWidget.widgetName + ".options.gridBindRowColumns is an abstract method. Child class method must be implemented");
        },
        gridBindRowEvents: function (crudGridWidget, $row, dataItem) {
            throw new Error(crudGridWidget.namespace + '.' + crudGridWidget.widgetName + ".options.gridBindRowEvents is an abstract method. Child class method must be implemented");
        },

    },
    _create: function () {

        this._super();

        jQuery(this.element)
            .addClass('ui-crudGrid')
            .append(this._gridTemplate());

        this.options.gridBodyDOMId = jQuery(this.element).find('table.ui-crudGrid-body-tableBox:first').find('tbody:first');
        this.options.gridPagerDOMId = jQuery(this.element).find('div.ui-crudGrid-pager');

    },
    _init: function () {

        this._super();

        var self = this;

        jQuery(self.options.gridPagerDOMId)
                .gridPagination({
                    change: function (e, pageIndex) {
                        self._trigger('paginated', null, pageIndex);
                    }
                });
    },
    destroy: function () {

        this._super();

    },
    bind: function (data) {
        var self = this;
        self._bindRows(data);
        self._bindPagination(data);
        self._trigger('dataBound', null, data);
    },
    _gridTemplate: function () {

        return '<div class="ui-crudGrid">' +
                    '<div class="ui-crudGrid-header ui-state-default">' +
                        '<table>' +
                            '<tbody>' +
                                '<tr class="ui-crudGrid-header">' +
                                    this.options.gridHeaderTemplate(this) +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>' +
                    '<div class="ui-crudGrid-body ui-widget-content" >' +
                        '<table class="ui-crudGrid-body-tableBox">' +
                            '<tbody>' +

                            '</tbody>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
                '<div class="ui-crudGrid-pager ui-state-default"></div>';
    },
    _bindRowAlternatedColor: function () {

        var self = this;

        jQuery(self.options.gridBodyDOMId)
            .children('tr')
                .each(function (i, ui) {
                    if (((i % 2) == 1)) {
                        jQuery(this).addClass('ui-crudGrid-dataRowAlt ui-widget-content');
                        //.removeClass('ui-crudGrid-rowStyle');
                    }
                    else {
                        jQuery(this).addClass('ui-crudGrid-dataRowAlt ui-widget-content ui-state-default');
                    }
                });
    },
    _bindRows: function (data) {

        var self = this;

        jQuery(self.options.gridBodyDOMId).empty();

        for (var i = 0; i < data.Data.length; i++) {

            var dataItem = data.Data[i];
            var $row = jQuery('<tr class="ui-crudGrid-dataRow">' + self.options.gridRowTemplate(this) + "</tr>");
            self.options.gridBindRowColumns(this, $row, dataItem);
            self._bindRowAlternatedColor();
            self.options.gridBindRowEvents(this, $row, dataItem);

            jQuery(self.options.gridBodyDOMId).append($row);
        }
    },
    _bindPagination: function (data) {

        var self = this;

        jQuery(self.options.gridPagerDOMId).gridPagination('bind', data.Page, data.PageSize, data.TotalRows);
    }
});

jQuery.widget("ui.crudForm", jQuery.ui.crudBase,
{
    options: {
        formButtonsDOMId: null,
        formButtonsGet: function (self, defaultButtons) {
            return defaultButtons;
        },
        formBind: function (self, dataItem) {
            throw new Error(self.namespace + '.' + self.widgetName + ".formBind() is an abstract method. Child class method must be implemented");
        },
        formSave: function (self) {
            var dfd = jQuery.Deferred();
            dfd.reject(this.namespace + '.' + this.widgetName + ".formSave is an abstract method. Child class must implemented");
            return dfd.promise();
        }
    },
    _create: function () {

        this._super();


        jQuery(this.element)
            .addClass('ui-crudForm ui-hidden')
            .append('<div class="ui-crudForm-modelBinding"></div>')
            .children()
                .wrapAll('<div class="ui-crudForm-formContent ui-widget-content" />')
            .end()
            .prepend('<div class="ui-crudForm-buttons ui-ribbonButtons ui-widget-content ui-state-default">');

        this.options.formButtonsDOMId = jQuery(this.element).find('div.ui-crudForm-buttons:first');

        this._formButtonsInit();
    },
    _init: function () {

        this._super();

        this._done();
    },
    _formButtonsInit: function () {

        var defaultButtons = this.options.formButtonsGet(this, [{
            id: "cancel",
            text: "Cancelar",
            cssClass: "ui-cancel-button",
            icon: "ui-icon-circle-arrow-w",
            click: function (self) {
                self._trigger('cancel', null, null);
            }
        }, {
            id: "save",
            text: "Guardar cambios",
            cssClass: "ui-save-button",
            icon: "ui-icon-disk",
            click: function (self) {
                self._save();
            }
        }]);

        for (var i = 0; i < defaultButtons.length; i++) {
            this._initButton(this, defaultButtons[i], jQuery(this.options.formButtonsDOMId));
        }

        jQuery(this.options.formButtonsDOMId).append('<div class="ui-carriageReturn"></div>');

    },
    _done: function () {
        this._trigger('done', null, null);

    },
    destroy: function () {

        this._super();
    },
    bind: function (dataItem) {
        try {
            this.options.formBind(this, dataItem);
            this._trigger('dataBound', null, dataItem);
        } catch (e) {
            console.error(e);
            this._trigger('errorDisplay', null, "Ha ocurrido un error en el formulario");
        }
    },
    _save: function () {

        var self = this;

        self.options.formSave(this)
                .progress(function (status) {
                    self.progressShow(status);
                })
                .fail(function (args) {
                    self.progressHide();
                    self._trigger('errorDisplay', null, args);
                })
                .always(function () {
                    self.progressHide();
                });
    },
});
