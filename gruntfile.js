module.exports = function (grunt) {

    var gruntOptions = {
        pkg: grunt.file.readJSON('package.json'),
        cdnFolder: 'src/frontend/public/cdn',
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
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {

                }
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
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false),
                    bail: true, // bail after first test failure
                    //NODE_ENV: 'test'
                },
                src: ['src/test/mocha/dev/**/*.js', '!src/test/mocha/dev/libs/**/*.js']
            },
            testProd: {
                options: {
                    timeout: 4000,
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false),
                    bail: true, // bail after first test failure
                    //NODE_ENV: 'test'
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

                    //'!src/frontend/public/scripts/modules/**/*',
                    //'!src/frontend/build/**/*.*',

                    '!src/frontend/app.build.js',
                    '!src/frontend/public-build/**/*.*',

                    '!src/frontend/public/scripts/libs/**/*.*',
                    '!src/frontend/public/cdn/**/*.*',
                    '!src/frontend/bower_components/**/*',
                    '!src/test/qunit/libs/**/*.js',
            ],
            options: {
                //jshintrc: ".jshintrc",
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
        // Grunt express - our webserver
        // https://github.com/blai/grunt-express
        express: {
            testQunit: {
                options: {
                    script: './server.js',
                    //node_env: 'test',
                    spawn: false, //Must have for reload
                    port: 3000 //,
                },
            },
            testLiveReload: {
                options: {
                    script: './server.js',
                    //node_env: 'dev',
                    port: 3001 //,
                },
            }
        },

        // grunt-watch will monitor the projects files
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            test: {
                files: ['<%= jshint.files %>'],
                tasks: ['env:test', 'jshint:files', /*'bump',*/ 'mochaTest:test', 'express:testQunit', 'qunit']
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

        requirejs: {
            compile: {
                options: {
                    appDir: "src/frontend/public",
                    baseUrl: "./",
                    dir: "src/frontend/public-build",
                    modules: [
                        {
                            name: "scripts/modules/main",
                        },
                        {
                            name: "scripts/modules/crud",
                            exclude: [
                                    // exclude all dependencies set on main module
                                    // as far as main module load them before crud
                                    'jquery',
                                    'domReady',
                                    'jqueryui',
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
                                    "/scripts/Template.App.Resources.Init.js",
                                    '/scripts/Template.App.Globalize.Init.js',
                                    '/scripts/Template.App.Page.Init.js',
                            ]
                        }

                    ],


                    //fileExclusionRegExp: /^\.|bower_components|build|examples|test/, // https://regex101.com/#javascript -> 


                    //Set config for finding 'jqueryui'. The path is relative
                    //to the location of require-jquery.js.
                    waitSeconds: 0,
                    paths: {

                        jquery: "../bower_components/jquery/jquery.min",
                        jqueryui: "../bower_components/jquery-ui/ui/minified/jquery-ui.custom.min",
                        domReady: "../bower_components/requirejs-domready/domReady",
                        handlebars: "../bower_components/handlebars/handlebars.min",
                        history: '../bower_components/history.js/scripts/bundled/html5/jquery.history',

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
                    },


                    done: function (done, output) {

                        //var duplicates = require('rjs-build-analysis').duplicates(output);

                        //if (Object.keys(duplicates).length > 0) {
                        //    grunt.log.subhead('Duplicates found in requirejs build:');
                        //    for (var key in duplicates) {
                        //        grunt.log.error(duplicates[key] + ": " + key);
                        //    }
                        //    return done(new Error('r.js built duplicate modules, please check the excludes option.'));
                        //} else {
                        //    grunt.log.success("No duplicates found!");
                        //}

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
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-bump');



    //grunt.registerTask('preCompile', ['jshint:files', 'bump', 'clean', 'concat']);


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

            //    by the time I write these lines grunt-contrib-cssmin is removing some media queries at minifying time.
            //    I prefer not to use this min.css generated until 'bugs' are fixed
            tasks2Run.push('env:prod', 'jshint:files', /*'bump',*/ 'clean', 'concat', 'uglify' /*, 'cssmin'*/, 'mochaTest:testProd'/*, 'express:testQunit', 'qunit'*/, 'requirejs');
        }
        else {

            requireConfig('none', true, true);


            tasks2Run.push('jshint:files', 'bump', 'clean', 'concat', 'requirejs');
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