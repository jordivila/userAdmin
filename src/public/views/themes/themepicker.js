jQuery.widget("ui.themepicker", jQuery.ui.widgetBase, {
    options: {

    },
    _create: function () {

        this._super();

    },
    _init: function () {

        this._super();

        var self = this;

        
        var crudThemesAjax = {
            ajax: {
                _fakeDataGrid: null,
                _fakeDataGridInit: function () {

                    crudThemesAjax.ajax._fakeDataGrid = [
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
                _fakeDelay: 1,
                themeSearch: function (filter) {

                    var self = this;
                    var dfd = jQuery.Deferred();

                    filter.PageSize = 40; //-> ensure all themes are loaded


                    if (crudThemesAjax.ajax._fakeDataGrid === null) {
                        crudThemesAjax.ajax._fakeDataGridInit();
                    }

                    var dataResult = {
                        "IsValid": true,
                        "Message": "",
                        "MessageType": 0,
                        "Data":
                            {
                                "TotalRows": crudThemesAjax.ajax._fakeDataGrid.length - 10,
                                "Page": filter.Page,
                                "PageSize": filter.PageSize,
                                "SortBy": "",
                                "SortAscending": false,
                                "Data": [],
                            }
                    };

                    for (var i = (filter.Page * filter.PageSize) ; i < ((filter.Page * filter.PageSize) + filter.PageSize) ; i++) {
                        if (i < crudThemesAjax.ajax._fakeDataGrid.length) {
                            dataResult.Data.Data.push(crudThemesAjax.ajax._fakeDataGrid[i]);
                        }
                    }

                    setTimeout(function () { dfd.resolve(dataResult); }, crudThemesAjax.ajax._fakeDelay);

                    return dfd.promise();
                }
            },
            cache: {

            }
        };
        var crudThemesOptions = function () {

            return {
                filterModel: [{
                    id: "themeName",
                    displayName: "Nombre",
                    input: { value: "" },
                },
                ],
                gridSearchMethod: crudThemesAjax.ajax.themeSearch,
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



        jQuery(self.element)
            .crud(jQuery.extend({}, crudThemesOptions(), {
                onSelect: function (e, dataItem) {
                    var cssUri = '//ajax.googleapis.com/ajax/libs/jqueryui/1/themes/{0}/jquery-ui.css'.format(dataItem.name);

                    self.progressShow('Loading styles');

                    jQuery.ajax({
                        url: cssUri,
                        type: "GET",
                        dataType: "text",
                        data: {}
                    })
                    .done(function (data, textStatus, jqXHR) {
                        jQuery('#jQueryUITheme').attr('href', cssUri);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {

                    })
                    .always(function () {
                        self.progressHide();
                    });


                },
            }))
            .find('div.ui-crudFilter-buttons')
                .find('button.ui-search-button')
                    .click()
                .end()
            .end()
            .find('div.ui-crudGrid-body:first')
                .addClass('ui-state-default');
    },
    destroy: function () {
        this._super();

        jQuery(this.element).crud('destroy');
        jQuery(this.element).empty();
    },
});

jQuery('div.ui-themeCrud:first').themepicker();