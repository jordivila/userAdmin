var themeAjax = {
    ajax: {
        _ajaxBaseAddress: null,
        _ajaxMergeConfig: null,
        _fakeDataGrid: null,
        _fakeDataGridInit: function () {

            themeAjax.ajax._fakeDataGrid = [
    			{
    			    title: "Black Tie",
    			    name: "black-tie",
    			    icon: "theme_90_black_tie.png"
    			},
    			{
    			    title: "Blitzer",
    			    name: "blitzer",
    			    icon: "theme_90_blitzer.png"
    			},
    			{
    			    title: "Cupertino",
    			    name: "cupertino",
    			    icon: "theme_90_cupertino.png"
    			},
    			{
    			    title: "Dark Hive",
    			    name: "dark-hive",
    			    icon: "theme_90_dark_hive.png"
    			},
    			{
    			    title: "Dot Luv",
    			    name: "dot-luv",
    			    icon: "theme_90_dot_luv.png"
    			},
    			{
    			    title: "Eggplant",
    			    name: "eggplant",
    			    icon: "theme_90_eggplant.png"
    			},
    			{
    			    title: "Excite Bike",
    			    name: "excite-bike",
    			    icon: "theme_90_excite_bike.png"
    			},
    			{
    			    title: "Flick",
    			    name: "flick",
    			    icon: "theme_90_flick.png"
    			},
    			{
    			    title: "Hot Sneaks",
    			    name: "hot-sneaks",
    			    icon: "theme_90_hot_sneaks.png"
    			},
    			{
    			    title: "Humanity",
    			    name: "humanity",
    			    icon: "theme_90_humanity.png"
    			},
    			{
    			    title: "Le Frog",
    			    name: "le-frog",
    			    icon: "theme_90_le_frog.png"
    			},
    			{
    			    title: "Mint Choc",
    			    name: "mint-choc",
    			    icon: "theme_90_mint_choco.png"
    			},
    			{
    			    title: "Overcast",
    			    name: "overcast",
    			    icon: "theme_90_overcast.png"
    			},
    			{
    			    title: "Pepper Grinder",
    			    name: "pepper-grinder",
    			    icon: "theme_90_pepper_grinder.png"
    			},
    			{
    			    title: "Redmond",
    			    name: "redmond",
    			    icon: "theme_90_windoze.png"
    			},
    			{
    			    title: "Smoothness",
    			    name: "smoothness",
    			    icon: "theme_90_smoothness.png"
    			},
    			{
    			    title: "South Street",
    			    name: "south-street",
    			    icon: "theme_90_south_street.png"
    			},
    			{
    			    title: "Start",
    			    name: "start",
    			    icon: "theme_90_start_menu.png"
    			},
    			{
    			    title: "Sunny",
    			    name: "sunny",
    			    icon: "theme_90_sunny.png"
    			},
    			{
    			    title: "Swanky Purse",
    			    name: "swanky-purse",
    			    icon: "theme_90_swanky_purse.png"
    			},
    			{
    			    title: "Trontastic",
    			    name: "trontastic",
    			    icon: "theme_90_trontastic.png"
    			},
    			{
    			    title: "UI Darkness",
    			    name: "ui-darkness",
    			    icon: "theme_90_ui_dark.png"
    			},
    			{
    			    title: "UI Lightness",
    			    name: "ui-lightness",
    			    icon: "theme_90_ui_light.png"
    			},
    			{
    			    title: "Vader",
    			    name: "vader",
    			    icon: "theme_90_black_matte.png"
    			}
            ];
        },
        _fakeDelay: 1000,
        themeSearch: function (filter) {

            var self = this;
            var dfd = jQuery.Deferred();



            filter.PageSize = 100; //-> ensure all themes are loaded


            if (themeAjax.ajax._fakeDataGrid === null) {
                themeAjax.ajax._fakeDataGridInit();
            }

            var dataResult = {
                "IsValid": true,
                "Message": "",
                "MessageType": 0,
                "Data":
                    {
                        "TotalRows": themeAjax.ajax._fakeDataGrid.length - 10,
                        "Page": filter.Page,
                        "PageSize": filter.PageSize,
                        "SortBy": "",
                        "SortAscending": false,
                        "Data": [],
                    }
            };

            for (var i = (filter.Page * filter.PageSize) ; i < ((filter.Page * filter.PageSize) + filter.PageSize) ; i++) {
                if (i < themeAjax.ajax._fakeDataGrid.length) {
                    dataResult.Data.Data.push(themeAjax.ajax._fakeDataGrid[i]);
                }
            }

            setTimeout(function () { dfd.resolve(dataResult); }, themeAjax.ajax._fakeDelay);

            return dfd.promise();
        }
    },
    cache: {

    }
};

var crudThemeOptions = function () {

    return {
        filterModel: [{
            id: "themeName",
            displayName: "Nombre",
            input: { value: "" },
        },
        ],
        gridSearchMethod: themeAjax.ajax.themeSearch,
        //gridHeaderTemplate: function (crudGridWidget) {
        //    return '<div class="ui-themeGrid-thumbnail ui-widgetGrid-column">Thumbnail</div>';
        //},
        //gridRowTemplate: function (crudGridWidget) {
        //    return '<div class="ui-themeGrid-thumbnail ui-widgetGrid-column"><img src="" /></div>';
        //},
        //gridBindRowColumns: function (crudGridWidget, $row, dataItem) {

        //    var templateRowSetValue = function (node, valueString) {
        //        jQuery(node).attr('title', valueString).html(valueString);
        //    };

        //    $row.find('div.ui-themeGrid-thumbnail:first').find('img').attr('src', 'public/scripts/jQueryUIThemes/images/{0}'.format(dataItem.icon));
        //},
        gridModel: [
            {
                key: "icon",
                displayName: "thumbnail"
            },
        ],

        gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

            switch (columnName) {
                case "icon":

                    $cell.html('<img src="public/scripts/jQueryUIThemes/images/{0}" alt="{1}" />'.format(dataItem.icon, dataItem.title));
                    $cell.find('img')
                        .click(function () {
                            crudGridWidget._trigger('onSelect', null, dataItem);
                        });
                    break;
                default:
                    break;
            }


        },
        formInit: function (self, formOptions) {

        },
    };
};