
module.exports = function (grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cdnFolder: 'src/public/cdn',
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
                src: ["src/public/css/reset.css",
                      "src/public/css/site.css",
                      "src/public/css/font-awesome.min.css",
                      "src/public/css/Site.FontSizes.css",
                      "src/public/css/Site.jQuery.OverrideRoundCorners.css",
                      "src/public/css/Site.JqueryUI.IconsExtendWithFontAwsome.css",
                      "src/public/css/ui-widgetMsg.css",
                      "src/public/css/ui-breadcrumb.css",
                      "src/public/css/ui-dateSelector.css",
                      "src/public/css/ui-widgetTreeList.css",
                      "src/public/css/ui-widgetModel.css",
                      "src/public/css/ui-widgetGrid.css",


                      "src/public/scripts/crud/common.widget.crud.css",
                      "src/public/scripts/crud/cir.css",

                    ],
                dest: '<%= cdnFolder %>/<%= pkg.name %>.<%= grunt.file.readJSON("package.json").version %>.ui.css'
            },
            ui_js: {
                options: {
                    separator: ';',
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: "'use strict';\n",
                    process: function (src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                          src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
                src: [
                    "src/public/scripts/libs/jQuery/jquery-1.9.1.min.js",
                    //"src/public/scripts/libs/jquery-ui-1.10.0/ui/minified/jquery-ui.min.js",
                    // jQuery UI components Begin 
                    "src/public/scripts/libs/jquery-ui-1.10.0/ui/minified/jquery.ui.core.min.js",
                    "src/public/scripts/libs/jquery-ui-1.10.0/ui/minified/jquery.ui.widget.min.js",
                    "src/public/scripts/libs/jquery-ui-1.10.0/ui/minified/jquery.ui.datepicker.min.js",
                    "src/public/scripts/libs/jquery-ui-1.10.0/ui/minified/jquery.ui.button.min.js",
                    // jQuery UI components End
                    "src/public/scripts/libs/jquery-validation-1.11.0/dist/jquery.validate.min.js",
                    "src/public/scripts/libs/jQuery-globalize/lib/globalize.js",
                    // app 
                    "src/public/scripts/Template.ExtendPrototypes.js",
                    "src/public/scripts/Template.App.Init.js",
                    "src/public/scripts/Template.App.Ajax.Init.js",
                    "src/public/scripts/Template.App.Widgets.Init.js",
                    "src/public/scripts/Template.App.Resources.Init.js",
                    "src/public/scripts/Template.Widget.Base.js",
                    //"src/public/scripts/Template.Widget.jQueryzer.js",
                    "src/public/scripts/Template.Widget.Model.js",
                    "src/public/scripts/Template.Widget.ModelDate.js",
                    "src/public/scripts/Template.Widget.ModelBool.js",
                    "src/public/scripts/Template.Widget.Grid.js",
                    "src/public/scripts/Template.Widget.AjaxProgress.js",
                    "src/public/scripts/Template.Widget.ButtonWrapper.js",
                    "src/public/scripts/Template.Widget.UserActivity.js",
                    "src/public/scripts/Template.Widget.Message.js",
                    "src/public/scripts/Template.Widget.Dialogs.js",
                    "src/public/scripts/Template.Widget.DialogInline.js",
                    "src/public/scripts/Template.Widget.NavMenu.js",
                    //"src/public/scripts/ui-widgetTreeList/ui-widgetTreeList.js"
                    //CRUD begin
                    "src/public/scripts/crud/common.widget.base.js",
                    "src/public/scripts/crud/common.widget.fieldItem.js",
                    "src/public/scripts/crud/common.widget.crud.js",
                    "src/public/scripts/crud/common.widget.grid.pagination.js",
                    "src/public/scripts/crud/cir.widget.crudCustomer.js",
                    "src/public/scripts/crud/cir.widget.crudProduct.js",
                    "src/public/scripts/crud/cir.widget.cirDataEntry.js",
                    //CRUD end


                    
                    "src/public/scripts/Template.Widget.Page.js",
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
                src: ["src/public/scripts/libs/jquery-ui-1.10.0/ui/i18n/jquery.ui.datepicker-es.js",
                        "src/public/scripts/libs/jquery-validation-1.11.0/localization/messages_es.js",
                        "src/public/scripts/libs/jQuery-globalize/lib/cultures/globalize.culture.es.js",
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
                    '<%= cdnFolder %>/<%= pkg.name %>.<%= grunt.file.readJSON("package.json").version %>.ui_libs.js': ['<%= concat.ui_js_libs.dest %>'],
                    '<%= cdnFolder %>/<%= pkg.name %>.<%= grunt.file.readJSON("package.json").version %>.ui_appCommon.js': ['<%= concat.ui_js_appCommon.dest %>'],
                }
            }
        },
        qunit: {
            allTests: ['src/public/test/qunit/**/*.html']
        },
        mochaTest: {
            test: {
                options: {
                    timeout: 4000,
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false),
                    bail: true // bail after first test failure
                },
                src: ['src/public/test/mocha/**/*.js', '!src/public/test/mocha/libs/**/*.js']
            }
        },
        jshint: {
            files: ['gruntfile.js',
                    'server.js',
                    'src/**/*.js',
                    'src/public/test/qunit/**/*.js',
                    'src/public/test/mocha/**/*.js',

                    '!src/public/scripts/libs/**/*.*',
                    '!src/public/scripts/ui-dateSelector/**/*.*',
                    '!src/public/scripts/ui-gmap/**/*.*',
                    '!src/public/scripts/ui-widgetMsg/**/*.*',
                    '!src/public/scripts/ui-widgetTreeList/**/*.*',
                    '!src/public/scripts/ui-widgetTreeListNest/**/*.*',
                    '!src/public/scripts/ui-widgetTreeListSort/**/*.*',

                    '!src/public/cdn/**/*.*',
                    '!src/public/test/qunit/libs/**/*.js',
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
        // Grunt express - our webserver
        // https://github.com/blai/grunt-express
        express: {
            testQunit: {
                options: {
                    script: './server.js',
                    node_env: 'test',
                    //livereload: true,
                    spawn: false, //Must have for reload
                    port: 3000 //,
                    //background: false // --> false = keep server alive after grunt tasks,
                },
            },
            testLiveReload: {
                options: {
                    script: './server.js',
                    node_env: 'test',
                    //livereload: true,
                    //spawn: false, //Must have for reload
                    port: 3001 //,
                    //background: false // --> false = keep server alive after grunt tasks,
                },
            }
        },
        
        // grunt-watch will monitor the projects files
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            testLiveReload: {
                files: ['<%= jshint.files %>', '<%= concat.ui_css.src %>'],
                tasks: ['jshint:files', 'bump', 'clean', 'concat', /*'uglify', */'express:testLiveReload'],
                options: {
                    spawn: false, //Must have for reload
                    livereload: true //Enable LiveReload
                }
            },
            
            test: {
                files: ['<%= jshint.files %>'],
                //tasks: ['jshint:files', 'mochaTest', 'express:testQunit', 'qunit']
                tasks: ['jshint:files', 'bump', 'mochaTest', 'express:testQunit', 'qunit']
            },
        },
        open: {
            qunit: {
                path: 'http://localhost:3001/public/test/qunit/index.html'
            },
            home: {
                path: 'http://localhost:3001/home'
            }
        }

    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-bump');
    
    
    
    
    grunt.registerTask('test', ['watch:test']);
    grunt.registerTask('live', ['express:testLiveReload', 'open', 'watch:testLiveReload']);

};