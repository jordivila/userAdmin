var crudCustomerDefaultOptions = function () {

    return {
        filterModel: [{
            id: "nombre",
            displayName: "Nombre / Razón Social",
            input: { value: "" },
        }, {
            id: "dni",
            displayName: "Nº Documento",
            input: { value: "" },
        }],

        gridCustomOptions: {
            //example: see code below
            //onSelect: function (e, dataItem) {
            //    var $crudParent = jQuery(e.target).parents('div.ui-crud:first');
            //    $crudParent.customer('fireCustomEvent', dataItem);
            //}
        },
        gridSearchMethod: customerAjax.ajax.customerSearch,
        gridModel: [
            {
                key: "nombre",
                displayName: "Nomber/Razón Social"
            },
            {
                key: "NumDocumento",
                displayName: "NIF"
            },
        ],
        gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

            switch (columnName) {
                case "nombre":
                    $cell.html('<span>{0}</span>'.format(dataItem[columnName]));
                    break;
                default: break;
            }
        },
        gridButtonsGet: function (self, defaultButtons) {
            for (var i = 0; i < defaultButtons.length; i++) {
                if (defaultButtons[i].id == "search") {
                    defaultButtons[i].text = "Buscar clientes";
                }
            }

            return defaultButtons;
        },
        formInit: function (self, formOptions) {

        },
    };
};


var crudCustomerDefaultFormOptions = function () {
    return jQuery.extend({}, crudCustomerDefaultOptions(), {
        gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {
            switch (columnName) {
                case "nombre":
                    $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                    $cell.find('a')
                        .click(function () {
                            crudGridWidget._trigger('onEdit', null, dataItem);
                        });
                    break;
                default: break;
            }
        },
        gridSearchForEditMethod: customerAjax.ajax.customerSearchForEdit,

        formInit: function (crudWidget, $parent) {
            jQuery($parent).prepend('<h3 class="ui-state-default">Información detallada del cliente</h3>');
        },
        formModel: function () {
            return [
                {
                    id: "nombre",
                    displayName: "Nombre",
                    input: { value: "" },
                },
                {
                    id: "NumDocumento",
                    displayName: "Dni/Cif",
                    input: { value: "" },
                },
                {
                    id: "fechaNacimiento",
                    displayName: "Fecha nacimiento",
                    input: { type: "date", value: "" },
                },
            ];
        }(),
        formBind: function (self, dataItem) {
            // automatic model binding is done
            // you can perform customizations here
        },
        formSaveMethod: customerAjax.ajax.customerSave,
        formValueGet: function (self, currentValue) {
            // automatic model value retriving is done
            // you can perform value modifications here
            return currentValue;
        },
    });
};