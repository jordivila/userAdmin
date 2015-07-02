(function (module) {

    "use strict";

    module.exports = ThemeController;

    var config = require('../libs/config');
    var PreferenceSetter = require('./classes/preferenceSetter.js');

    function ThemeController() {
        PreferenceSetter.apply(this, arguments);
    }
    ThemeController.prototype = new PreferenceSetter();
    ThemeController.prototype.getAll = function (req, cb) {

        this.data = [
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

        cb(null, this.data);

    };
    ThemeController.prototype.cookieName = config.get('clientApp:themes:cookieName');
    ThemeController.prototype.cookieValueGet = function (req) {
        if (req.cookies[this.cookieName]) {
            return req.cookies[this.cookieName];
        }
        else {
            return config.get('clientApp:themes:default');
        }
    };

})(module);