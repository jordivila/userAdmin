define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",

    "scripts/modules/crud",
    "/arquia/talks/customer/arquiaCommon/arquiaCrudFakeData.js",
    "/arquia/talks/customer/arquiaCommon/arquiaUrls.js",
],
function ($, jqUI, clientApp, crudModule, crudAjaxOpts, arquiaUrls) {

    clientApp.view = {
        main: function () {

            var initMain = function () {

                var crudOptions = function () {

                    var r = {
                        //filterModel: [

                        //],
                        gridSearchMethod: crudAjaxOpts.ajax.talkSearch,
                        gridModel: function () {
                            return [
                                {
                                    key: "subject",
                                    displayName: clientApp.i18n.texts.get("Arquia.Talks.History.GridColumns.Subject")
                                },
                                {
                                    key: "dateLastMessage",
                                    displayName: clientApp.i18n.texts.get("Arquia.Talks.History.GridColumns.Date")
                                }
                            ];
                        }(),
                        gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

                            switch (columnName) {
                                case "subject":
                                    $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                                    $cell.find('a')
                                        .click(function () {
                                            clientApp.template.loadByUrl('{0}{1}'.format(arquiaUrls.baseAddress, arquiaUrls.message(dataItem.idTalk)));

                                            

                                        });
                                    break;
                                case "dateLastMessage":

                                    clientApp.globalizer.get()
                                     .done(function (Globalize) {
                                         $cell.html(dataItem[columnName] !== null ? Globalize.formatDate(dataItem[columnName]) : '');
                                     });

                                    break;
                                default: break;
                            }
                        },
                        gridButtonsGet: function (self, defaultButtons) {
                            for (var i = 0; i < defaultButtons.length; i++) {
                                if (defaultButtons[i].id == "search") {
                                    defaultButtons[i].text = clientApp.i18n.texts.get("Arquia.Talks.History.SearchMessages");
                                }
                            }

                            return defaultButtons;
                        },
                        gridPagerInit: function () {
                            return {
                                pageSize: 50,
                                infiniteScrolling: true
                            };
                        },
                        formInit: function (self, formOptions) {

                        },
                    };

                    return r;
                }();

                jQuery('body')
                    .find('div.ui-arquia-talks-summary-crud:first')
                        .crud(crudOptions)
                        .crud('gridButtonsVisible', false)
                        .crud('gridSearch')
                        .hide()
                        .removeClass('ui-helper-hidden')
                        .fadeIn()
                    .end()
                    .find('i.ui-arquia-talks-summary-userIcon:first')
                        .click(function () {
                            clientApp.template.loadByUrl('{0}{1}'.format(arquiaUrls.baseAddress, arquiaUrls.subject()));
                        })
                    .end();
            };

            setTimeout(function () {
                initMain();
            },500);
        }
    };

    return clientApp;

});
