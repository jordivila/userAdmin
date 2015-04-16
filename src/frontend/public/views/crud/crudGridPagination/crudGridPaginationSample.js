jQuery(document).ready(function () {

    var crudOptions = jQuery.extend(
        {},
        crudCustomerDefaultOptions(),
        {
            gridPagerInit: function () {
                return {
                    pageSize: 30,
                    pagerTop: {
                        paginationShow: true,
                        totalRowsShow: true,
                        pageSizeShow: true,
                    },
                    //default config for pagerBottom
                    //pagerBottom: {
                    //    paginationShow: true,
                    //    totalRowsShow: true,
                    //    pageSizeShow: true,
                    //}
                };
            },
        });


    jQuery('body')
        .find('h1:first')
            .html('Crud widget - Grid pagination config')
        .end()
        .find('div.ui-customerCrud:first')
            .crud(crudOptions)

            .hide()
            .removeClass('ui-helper-hidden')
            .fadeIn()
        .end();
});