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
                    $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                    $cell.find('a')
                        .click(function () {
                            crudGridWidget._trigger('onSelect', null, dataItem);
                        });
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
