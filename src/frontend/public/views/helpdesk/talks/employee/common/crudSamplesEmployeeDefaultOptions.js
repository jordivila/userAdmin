define([
    "scripts/Template.App.ClientApp",
    "./crudSamplesEmployeeData.js",
],
    function (clientApp, employeeAjax) {

        var crudEmployeeDefaultOptions = function () {

            var r = {
                filterModel: [
                    {
                        id: "employeeName",
                        displayName: clientApp.i18n.texts.get("GeneralTexts.Name"),
                        input: { value: "" },
                    },
                    {
                        id: "employeeEmail",
                        displayName: clientApp.i18n.texts.get("GeneralTexts.Email"),
                        input: { value: "" }
                    }
                ],
                gridFilterVisibleAlways: true,
                gridCustomOptions: {
                    //example: see code below
                    //onSelect: function (e, dataItem) {
                    //    var $crudParent = jQuery(e.target).parents('div.ui-crud:first');
                    //    $crudParent.employee('fireCustomEvent', dataItem);
                    //}
                },
                gridSearchMethod: employeeAjax.ajax.employeeSearch,
                gridModel: [
                    {
                        key: "employeeName",
                        displayName: clientApp.i18n.texts.get("GeneralTexts.Name")
                    },
                    {
                        key: "employeeEmail",
                        displayName: clientApp.i18n.texts.get("GeneralTexts.Email")
                    }
                ],
                gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

                    switch (columnName) {
                        case "employeeName":
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
                            defaultButtons[i].text = clientApp.i18n.texts.get("Helpdesk.Talks.SearchEmployees");
                        }
                    }

                    return defaultButtons;
                },
                gridPagerInit: function () {
                    return {
                        pageSize: 30,
                    };
                },
                formInit: function (self, formOptions) {

                },
            };

            return r;
        };

        return {
            crudEmployeeDefaultOptions: crudEmployeeDefaultOptions,
        };

    });