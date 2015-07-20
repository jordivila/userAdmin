define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",
    "history",

    "scripts/modules/crud",
    "/arquia/talks/customer/arquiaCommon/arquiaCrudFakeData.js",
    "/arquia/talks/customer/arquiaCommon/arquiaCrudDefaultOptions.js",
],
function ($, jqUI, clientApp, hist, crudModule, crudAjaxOpts, crudDefaultOptions) {

    clientApp.view = {
        main: function () {

            var initMain = function () {

                var crudOptions = jQuery.extend(
                    {},
                    crudDefaultOptions.crudCustomerDefaultFormOptions(),
                    {
                        gridPagerInit: function () {
                            return {
                                pageSize: 50,
                                infiniteScrolling: true
                            };
                        },
                    });


                jQuery('body')
                    .find('div.ui-arquia-talks-summary-crud:first')
                        .crud(crudOptions)
                        .crud('gridButtonsVisible', false)
                        //.crud('gridPagerVisible', false)
                        .crud('gridSearch')

                        .hide()
                        .removeClass('ui-helper-hidden')
                        .fadeIn()
                    .end()
                    .find('i.ui-arquia-talks-summary-userIcon:first')
                        .click(function () {
                            History.pushState(null, null, 'add');
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
