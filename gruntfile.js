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
            },
            plugins: ['<%= cdnFolder %>/**/*']
        },
        concat: {
            ui_css: {
                options: {
                    separator: ' '
                },
                src: ["src/frontend/public/css/reset.css",
                      "src/frontend/public/css/site.css",
                      "src/frontend/public/css/font-awesome.min.css",
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
            ui_js: {
                options: {
                    separator: ';',
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: '"use strict";\n var appVersion = "<%= grunt.file.readJSON("package.json").version %>";',
                    process: function (src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                          src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
                src: [
                    "bower_components/jquery/jquery.min.js",
                    //"bower_components/jquery-ui/ui/minified/jquery-ui.custom.min.js",
                    // jQuery UI components Begin 
                    "bower_components/jquery-ui/ui/minified/jquery.ui.core.min.js",
                    "bower_components/jquery-ui/ui/minified/jquery.ui.widget.min.js",
                    "bower_components/jquery-ui/ui/minified/jquery.ui.datepicker.min.js",
                    "bower_components/jquery-ui/ui/minified/jquery.ui.button.min.js",
                    "bower_components/jquery-ui/ui/minified/jquery.ui.effect.min.js",
                    "bower_components/jquery-ui/ui/minified/jquery.ui.effect-drop.min.js",
                    "bower_components/jquery-ui/ui/minified/jquery.ui.effect-slide.min.js",

                    // jQuery UI components End
                    "bower_components/jquery-validation/jquery.validate.js",
                    "bower_components/history.js/scripts/bundled/html4+html5/jquery.history.js",
                    "bower_components/handlebars/handlebars.min.js",

                    "src/frontend/public/scripts/libs/jQuery-globalize/lib/globalize.js",
                    // app 
                    "src/frontend/public/scripts/Template.ExtendPrototypes.js",
                    "src/frontend/public/scripts/Template.App.Init.js",
                    "src/frontend/public/scripts/Template.App.Ajax.Init.js",
                    "src/frontend/public/scripts/Template.App.Widgets.Init.js",
                    "src/frontend/public/scripts/Template.App.Resources.Init.js",
                    "src/frontend/public/scripts/Template.Widget.Base.js",
                    //"src/frontend/public/scripts/Template.Widget.jQueryzer.js",
                    "src/frontend/public/scripts/Template.Widget.Model.js",
                    "src/frontend/public/scripts/Template.Widget.ModelItem.js",
                    "src/frontend/public/scripts/Template.Widget.ModelDate.js",
                    "src/frontend/public/scripts/Template.Widget.ModelBool.js",
                    "src/frontend/public/scripts/Template.Widget.Grid.js",
                    "src/frontend/public/scripts/Template.Widget.ButtonWrapper.js",
                    "src/frontend/public/scripts/Template.Widget.UserActivity.js",
                    "src/frontend/public/scripts/Template.Widget.Message.js",
                    "src/frontend/public/scripts/Template.Widget.Dialogs.js",
                    "src/frontend/public/scripts/Template.Widget.DialogInline.js",

                    "src/frontend/public/scripts/Template.Widget.Menu.base.js",
                    "src/frontend/public/scripts/Template.Widget.Menu.tree.js",
                    "src/frontend/public/scripts/Template.Widget.Menu.slides.js",

                    
                    //CRUD begin
                    "src/frontend/public/scripts/crud/common.widget.base.js",
                    "src/frontend/public/scripts/crud/common.widget.fieldItem.js",
                    "src/frontend/public/scripts/crud/common.widget.crud.base.js",
                    "src/frontend/public/scripts/crud/common.widget.crud.js",
                    "src/frontend/public/scripts/crud/common.widget.crud.filter.js",
                    "src/frontend/public/scripts/crud/common.widget.crud.grid.js",
                    "src/frontend/public/scripts/crud/common.widget.crud.form.js",
                    "src/frontend/public/scripts/crud/common.widget.grid.pagination.js",
                    //CRUD end
                    "src/frontend/public/scripts/Template.Widget.Themepicker.js",
                    "src/frontend/public/scripts/url/urlHelper.js",
                    "src/frontend/public/scripts/Template.Widget.Page.js",
                ],
                dest: '<%= cdnFolder %>/<%= pkg.name %>.<%= grunt.file.readJSON("package.json").version %>.ui_js.js'
            },
            ui_regional_es: {
                options: {
                    separator: ";",
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: "'use strict';\n",
                    process: function (src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                          src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
                src: ["bower_components/jquery-ui/ui/i18n/jquery.ui.datepicker-es.js",
                        "bower_components/jquery-validation/localization/messages_es.js",
                        "src/frontend/public/scripts/libs/jQuery-globalize/lib/cultures/globalize.culture.es.js",
                ],
                dest: '<%= cdnFolder %>/<%= pkg.name %>.<%= grunt.file.readJSON("package.json").version %>.ui_regional_es.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%= concat.ui_js.dest %>': ['<%= concat.ui_js.dest %>'],
                    '<%= concat.ui_regional_es.dest %>': ['<%= concat.ui_regional_es.dest %>'],
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
                    '!src/frontend/public/scripts/libs/**/*.*',
                    '!src/frontend/public/cdn/**/*.*',
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
        }
    };

    grunt.initConfig(gruntOptions);

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-bump');



    //grunt.registerTask('preCompile', ['jshint:files', 'bump', 'clean', 'concat']);

    grunt.registerTask('preCompile', 'Compile css, js & resources', function (isDeploy) {
        // parameters are passed when grunt is run using -> grunt preCompile:deploy

        var tasks2Run = [];

        if (isDeploy && (isDeploy === 'deploy')) {
            //    by the time I write these lines grunt-contrib-cssmin is removing some media queries at minifying time.
            //    I prefer not to use this min.css generated until bugs are fixed
            tasks2Run.push('env:prod', 'jshint:files', /*'bump',*/ 'clean', 'concat', 'uglify' /*, 'cssmin'*/, 'mochaTest:testProd'/*, 'express:testQunit', 'qunit'*/);

            //grunt.config('mochaTest.test.options.node_env', 'production');
            //console.log(grunt.config('mochaTest'));
        }
        else {
            tasks2Run.push('jshint:files', 'bump', 'clean', 'concat');
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