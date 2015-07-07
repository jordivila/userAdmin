module.exports = function (grunt) {

    var gruntOptions = {
        pkg: grunt.file.readJSON('package.json'),
        cdnFolder: 'src/frontend/public-build/cdn',
        env: {
            dev: {
                NODE_ENV: 'dev'
            },
            test: {
                NODE_ENV: 'test'
            },
            prod: {
                NODE_ENV: 'production'
            }
        },
        clean: {
            options: {
                //'no-write': true
                force: true
            },
            plugins: [
                '<%= cdnFolder %>/**/*',
            ]
        },
        concat: {
            ui_css: {
                options: {
                    separator: ' '
                },
                src: ["src/frontend/public/css/reset.css",
                      "src/frontend/public/css/site.css",
                      "src/frontend/bower_components/components-font-awesome/css/font-awesome.min.css",
                      "src/frontend/public/css/Site.FontSizes.css",
                      "src/frontend/public/css/Site.jQuery.OverrideRoundCorners.css",
                      "src/frontend/public/css/Site.JqueryUI.IconsExtendWithFontAwsome.css",
                      "src/frontend/public/css/ui-widgetBase.css",
                      "src/frontend/public/css/ui-widgetMsg.css",
                      "src/frontend/public/css/ui-breadcrumb.css",
                      "src/frontend/public/css/ui-dateSelector.css",
                      "src/frontend/public/css/ui-menuList.css",
                      "src/frontend/public/css/ui-widgetModel.css",
                      "src/frontend/public/css/ui-widgetGrid.css",
                      "src/frontend/public/css/ui-fieldItem.css",
                      "src/frontend/public/css/ui-progress.css",
                      "src/frontend/public/css/ui-crud.css",
                ],
                dest: '<%= cdnFolder %>/<%= pkg.name %>.<%= grunt.file.readJSON("package.json").version %>.ui.css'
            },
        },
        uglify: {
            public_build_js: {
                files: [{
                    expand: true,
                    src: ['src/frontend/public-build/**/*.js'],
                }]
            },
            requirejs: {
                files: [{
                    expand: true,
                    src: ['src/frontend/bower_components/requirejs/**/*.js'],
                }]
            }

        },
        cssmin: {
            target: {
                files: {
                    '<%= cdnFolder %>/<%= pkg.name %>.<%= grunt.file.readJSON("package.json").version %>.ui.css': ['<%= cdnFolder %>/<%= pkg.name %>.<%= grunt.file.readJSON("package.json").version %>.ui.css']
                }
            }

        },
        qunit: {
            options: {

            },
            allTests: ['src/test/qunit/**/*.html']
        },
        mochaTest: {
            test: {
                options: {
                    timeout: 4000,
                    reporter: 'spec',
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false),
                    bail: true, // bail after first test failure
                },
                src: ['src/test/mocha/dev/**/*.js', '!src/test/mocha/dev/libs/**/*.js']
            },
            testProd: {
                options: {
                    timeout: 4000,
                    reporter: 'spec',
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false),
                    bail: true, // bail after first test failure
                },
                src: ['src/test/mocha/prod/**/*.js', '!src/test/mocha/prod/libs/**/*.js']
            }
        },
        jshint: {
            files: ['gruntfile.js',
                    'server.js',
                    'src/**/*.js',
                    'src/test/qunit/**/*.js',
                    'src/test/mocha/**/*.js',

                    '!src/frontend/public-build/**/*.*',
                    '!src/frontend/bower_components/**/*',
                    '!src/test/qunit/libs/**/*.js',
            ],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: false,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'upstream',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false
            }
        },
        express: {
            testQunit: {
                options: {
                    script: './server.js',
                    spawn: false, //Must have for reload
                    port: 3000 //,
                },
            },
            testLiveReload: {
                options: {
                    script: './server.js',
                    port: 3001 //,
                },
            }
        },
        watch: {
            test: {
                files: ['<%= jshint.files %>'],
                tasks: ['env:test', 'jshint:files', 'mochaTest:test', 'express:testQunit', 'qunit']
            },
            preCompile: {
                files: ['<%= jshint.files %>', '<%= concat.ui_css.src %>'],
                tasks: ['preCompile'],

            },
            testLiveReload: {
                files: ['<%= cdnFolder %>/**/*'],
                tasks: ['env:dev', 'express:testLiveReload'],
                options: {
                    spawn: false, //Must have for reload
                    livereload: true //Enable LiveReload
                }
            },
        },
        open: {
            qunit: {
                path: 'http://localhost:<%= express.testLiveReload.options.port %>/tests/'
            },
            home: {
                path: 'http://localhost:<%= express.testLiveReload.options.port %>/'
            }
        },
        sortJSON: {
            src: [
                'src/backend/libs/locales/es.json',
                'src/backend/libs/locales/en.json',
            ]
        },
        requirejs: {
            compile: {
                options: {
                    appDir: "src/frontend/public",
                    baseUrl: "./",
                    dir: "src/frontend/public-build",
                    modules: [

                        {
                            name: "scripts/modules/jquery.ui.custom.bundle",
                            exclude: [

                            ]
                        },
                        {
                            name: "scripts/modules/main",
                            exclude: [
                                 //"bower/jquery-ui/ui/minified/jquery.ui.core.min",
                                 //"bower/jquery-ui/ui/minified/jquery.ui.widget.min",
                                 //"bower/jquery-ui/ui/minified/jquery.ui.datepicker.min",
                                 //"bower/jquery-ui/ui/minified/jquery.ui.button.min",
                                 //"bower/jquery-ui/ui/minified/jquery.ui.effect.min",
                                 //"bower/jquery-ui/ui/minified/jquery.ui.effect-drop.min",
                                 //"bower/jquery-ui/ui/minified/jquery.ui.effect-slide.min",
                                 //"scripts/modules/jquery.ui.custom.bundle.js",
                            ]
                        },
                        {
                            name: "scripts/modules/crud",
                            exclude: [
                                    // exclude all dependencies set on main module
                                    // as far as main module load them before crud
                                    'jquery',
                                    'domReady',
                                    'jqueryui',
                                    '/scripts/modules/jquery.ui.custom.bundle.js',
                                    'history',
                                    'handlebars',
                                    '/scripts/url/urlHelper.js',
                                    '/scripts/Template.ExtendPrototypes.js',
                                    '/scripts/Template.Widget.Base.js',
                                    '/scripts/Template.Widget.Menu.base.js',
                                    '/scripts/Template.Widget.Menu.slides.js',
                                    '/scripts/Template.Widget.Menu.nav.js',
                                    '/scripts/Template.Widget.Page.js',
                                    "/scripts/Template.App.Init.js",
                                    "/scripts/Template.App.Ajax.Init.js",
                                    "/scripts/Template.App.Widgets.Init.js",
                                    "/scripts/Template.App.I18n.Init.js",
                                    '/scripts/Template.App.Globalize.Init.js',
                                    '/scripts/Template.App.Page.Init.js',
                            ]
                        },
                        {
                            name: "scripts/modules/es5Shim",
                            exclude: [
                                'jquery',
                            ]
                        },
                        {
                            name: "scripts/modules/glob",
                            exclude: [
                                "bower/requirejs-text/text",
                                "bower/requirejs-plugins/src/json",
                            ]
                        }

                    ],
                    waitSeconds: 0,
                    paths: {

                        jquery: "../bower_components/jquery/jquery.min",
                        jqueryui: "scripts/modules/jquery.ui.custom.bundle",
                        domReady: "../bower_components/requirejs-domready/domReady",
                        handlebars: "../bower_components/handlebars/handlebars.min",
                        history: '../bower_components/history.js/scripts/bundled/html4+html5/jquery.history',
                        bower: '../bower_components/',
                        pPromises: '../bower_components/p-promise/p.min',
                        crossLayer: '../../crossLayer',
                        es5shim: '../bower_components/es5-shim',
                        respond: '../bower_components/respond/dest/respond.src',
                        /**************************************************************
                                    Globalize dependencies paths begin
                        **************************************************************/
                        cldr: "../bower_components/cldrjs/dist/cldr",
                        // Unicode CLDR JSON data.
                        "cldr-data": "../bower_components/cldr-data",
                        // require.js plugin we'll use to fetch CLDR JSON content.
                        json: "../bower_components/requirejs-plugins/src/json",
                        // text is json's dependency.
                        text: "../bower_components/requirejs-text/text",
                        // Globalize.
                        globalize: "../bower_components/globalize/dist/globalize"
                        /**************************************************************
                                    Globalize dependencies paths end
                        **************************************************************/

                    },
                    shim: {
                        'jqueryui': {
                            deps: ["jquery"]
                        },
                        'history': {
                            deps: ["jquery"]
                        },
                        'respond': {
                            deps: ['jquery']
                        },
                    },


                    done: function (done, output) {


                        /*
                        Analyse your r.js build output for potential mistakes.
                        */

                        var duplicates = require('rjs-build-analysis').duplicates(output);

                        if (Object.keys(duplicates).length > 0) {
                            grunt.log.subhead('Duplicates found in requirejs build:');
                            for (var key in duplicates) {
                                grunt.log.error(duplicates[key] + ": " + key);
                            }

                            // rjs-build-analysis-> seems not to work very well
                            // It finds as duplicates some files that modules need.
                            // I keep this code for warning messages only
                            // that's why I comment the next line 
                            //return done(new Error('r.js built duplicate modules, please check the excludes option.'));

                        } else {
                            grunt.log.success("No duplicates found!");
                        }

                        done();
                    }

                }
            }
        }
    };

    grunt.initConfig(gruntOptions);


    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sort-json');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-bump');




    grunt.registerTask('i18nCheck', 'checks i18n files', function () {

        var config = grunt.file.readJSON('./src/backend/libs/config.json');
        var files = function () {
            var result = [];
            for (var i in config.i18n.locales) {
                var path = config.i18n.directory + '/' + config.i18n.locales[i] + config.i18n.extension;
                var localeFile = grunt.file.readJSON(path);
                result.push({ locale: config.i18n.locales[i], json: localeFile });
            }
            return result;
        }();
        var checkKeysLength = function () {

            var isValid = true;
            var keysLength = null;

            for (var i = 0; i < files.length; i++) {
                var localeFile = files[i];
                var keysLengthCurrent = Object.keys(localeFile.json).length;

                if (keysLength === null) {
                    keysLength = keysLengthCurrent;
                }

                if (keysLength != keysLengthCurrent) {
                    isValid = false;
                }
            }

            return isValid;

        };
        var listNotFoundKeys = function () {

            var maxLengthFile = function () {

                var result = null;

                files.forEach(function (f) {

                    if (result === null) {
                        result = f;
                    }

                    if (Object.keys(f.json).length > Object.keys(result.json).length) {
                        result = f;
                    }

                });

                return result;

            }();

            // compare with first element
            // as far as first element is the default

            var list = [];

            files.forEach(function (file, fileIndex, fileTravObject) {

                Object.keys(maxLengthFile.json).forEach(function (fileKey, fileKeyIndex, fileKeyTravObject) {

                    if ((Object.keys(file.json).indexOf(fileKey)) == -1) {
                        list.push({ locale: file.locale, key: fileKey });
                    }

                });

            });

            return list;

        };

        if (checkKeysLength() === true) {
            return true;
        }
        else {

            var summary = "";

            listNotFoundKeys().forEach(function (item) {
                summary += item.locale + config.i18n.extension + " file is missing key: '" + item.key + "'\n";
            });

            grunt.fail.warn('Locale files have missing keys. Read below summary for details...\n\n' + summary + "\n");
        }

    });
    grunt.registerTask('globCldrData', 'Copying cldr-data folder from npm source into bower folder', function () {

        var done = this.async();
        var bowerDirectory = grunt.file.readJSON('.bowerrc').directory;
        var folderCldrData = "cldr-data";
        var cldrDownloader = require("cldr-data-downloader");

        if (grunt.file.exists(bowerDirectory, folderCldrData, "state.json")) {
            done();
        }
        else {

            grunt.log.writeln("Loading globalize cldr-data...");

            cldrDownloader(
              "http://www.unicode.org/Public/cldr/26/json.zip",
              bowerDirectory + "/cldr-data",
              function (error) {
                  if (error) {
                      grunt.fail.fatal(error);
                      done(false);
                  }
                  else {
                      done();
                  }
              }
            );
        }
    });
    grunt.registerTask('preCompile', 'Compile css, js & resources', function (isDeploy) {
        // parameters are passed when grunt is run using -> grunt preCompile:deploy

        var tasks2Run = [];

        var requireConfig = function (optimize, skipDirOptimize, keepBuildDir) {
            grunt.config('requirejs.compile.options.optimize', optimize);
            grunt.config('requirejs.compile.options.skipDirOptimize', skipDirOptimize);
            grunt.config('requirejs.compile.options.keepBuildDir', keepBuildDir);

            //optimize: "none",//The biggest time drain is minification. If you are just doing builds as part of a dev workflow, then set optimize to "none".
            //skipDirOptimize: true, //If doing a whole project optimization, but only want to minify the build layers specified in modules options and not the rest of the JS files in the build output directory, you can set skipDirOptimize to true.
            //keepBuildDir: true, //Normally each run of a whole project optimization will delete the output build directory specified by dir for cleanliness. Some build options, like onBuildWrite, will modify the output directory in a way that is hazardous to do twice over the same files. However, if you are doing simple builds with no extra file transforms besides build layer minification, then you can set keepBuildDir to true to keep the build directory between runs. Then, only files that have changed between build runs will be copied.
        };

        if (isDeploy && (isDeploy === 'deploy')) {

            requireConfig('uglify', false, false);

            tasks2Run.push('env:prod', 'globCldrData', 'i18nCheck', 'jshint:files', /*'bump',*/ 'clean','mochaTest:testProd'/*, 'express:testQunit', 'qunit'*/, 'requirejs', 'concat', 'cssmin', 'uglify');
        }
        else {

            requireConfig('none', true, true);

            tasks2Run.push('jshint:files', 'i18nCheck', 'globCldrData', 'bump', 'clean', 'sortJSON', 'requirejs', 'concat' /*,'cssmin', 'uglify'*/);
        }

        grunt.task.run(tasks2Run);
    });
    grunt.registerTask('test', 'Starts grunt with only tests option', function () {
        grunt.event.on('watch', function (action, filepath) {
            grunt.config('watch.preCompile.tasks', []);
            grunt.config('watch.testLiveReload.tasks', []);
        });

        grunt.task.run('watch');

    });
    grunt.registerTask('live', 'Starts grunt with only livereload options', function () {
        grunt.event.on('watch', function (action, filepath) {
            grunt.config('watch.test.tasks', []);
        });

        grunt.task.run('env:dev', 'preCompile', 'express:testLiveReload', 'open', 'watch');
    });
    grunt.registerTask('default', ['env:test', 'preCompile', 'express:testLiveReload', 'open', 'watch']);

};