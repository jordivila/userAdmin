(function (module) {

    "use strict";

    module.exports.initRequestTheme = initRequestTheme;
    module.exports.index = index;
    module.exports.indexJSON = indexJSON;
    module.exports.getAll = getAll;
    module.exports.update = update;

    var config = require('../libs/config');
    var pkg = require('../../../package.json');
    var i18n = require('i18n-2');
    var util = require('../libs/commonFunctions');
    var utilsNode = require('util');
    var DataResultModel = require('../models/dataResult');
    //var ErrorHandled = require('../models/errorHandled.js');
    var commonController = require('../controllers/common');


    function sendCookie(res, langId) {
        res.cookie(config.get('themes:cookieName'), langId, { expires: new Date(Date.now() + 900000), httpOnly: true });
    }

    function initRequestTheme(req, res) {

        if (req.cookies[config.get('themes:cookieName')]) {

        }
        else {
            sendCookie(res, config.get('themes:default'));
        }
    }

    function getAll(req, cb) {

        var viewModel = {
            ThemesAvailable: [
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
            ]
        };

        cb(null, viewModel);
    }

    function indexBaseModel(app, req, res, next) {
        var viewPath = 'themes/index.handlebars';
        var viewModelPath = app.get('views') + '/' + viewPath + '.json';
        var viewModel = commonController.getModelMerged(req, require(viewModelPath));
        return {
            viewPath: viewPath,
            viewModel: viewModel
        };
    }

    function index(app, req, res, next) {

        var tplInfo = indexBaseModel(app, req, res, next);

        if (tplInfo.viewModel.IsSEORequest) {

            getAll(req, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.render(tplInfo.viewPath, util.extend(tplInfo.viewModel, result));
            });
        }
        else {
            res.sendFile(tplInfo.viewPath, {
                root: app.get('views')
            });
        }
    }

    function indexJSON(app, req, res, next) {

        var tplInfo = indexBaseModel(app, req, res, next);

        getAll(req, function (err, result) {

            if (err) {
                return next(err);
            }

            res.json(util.extend(tplInfo.viewModel, result));
        });
    }

    function update(req, res, next) {

        var themeValue = req.body.newTheme;

        console.log("theme");
        console.log(themeValue);

        sendCookie(res, themeValue);

        res.json(new DataResultModel(true, '', {}));
    }

})(module);