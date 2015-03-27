


var customerOptions = jQuery.extend({}, crudCustomerDefaultOptions(), {
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

jQuery('div.ui-crudFormSimple:first')
    .find('div.ui-customerCrud:first')
        .crud(customerOptions)
        .hide()
        .removeClass('ui-helper-hidden')
        .fadeIn()
    .end();
