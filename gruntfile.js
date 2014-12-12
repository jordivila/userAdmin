module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
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
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['src/public/test/mocha/**/*.js', '!src/public/test/mocha/libs/**/*.js']
            }
        },
        jshint: {
            files: ['gruntfile.js',
                'server.js',
                'src/**/*.js',


                'src/public/test/qunit/**/*.js',
                '!src/public/test/qunit/libs/**/*.js',

                'src/public/test/mocha/**/*.js'
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



        // Grunt express - our webserver
        // https://github.com/blai/grunt-express
        express: {
            testQunit: {
                options: {
                    script: './server.js',
                    node_env: 'test',
                    livereload: true,
                    port: 3000
                }
            },
            testMocha: {
                options: {
                    script: './server.js',
                    node_env: 'test',
                    livereload: false,
                    port: 3001
                }
            }

        },

        // grunt-watch will monitor the projects files
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            qunit: {
                files: ['<%= jshint.files %>'],
                options: {
                    livereload: true
                }
            },
            mocha: {
                files: ['<%= jshint.files %>'],
                tasks: ['frontend', 'backendMochaTests'],
            }
        },

        // grunt-open will open your browser at the project's URL
        // https://www.npmjs.org/package/grunt-open
        open: {
            all: {
                path: 'http://localhost:3000/public/test/qunit/index.html'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-open');

    grunt.registerTask('frontend', ['jshint:files', 'concat', 'uglify']);
    grunt.registerTask('backendMochaTests', ['mochaTest']);
    //grunt.registerTask('backendDev', ['express:dev']);
    grunt.registerTask('liveReload', ['express:testQunit', 'open', 'watch:qunit']);
    //grunt.registerTask('serverMocha', ['express:testMocha', 'mochaTest', 'watch:withNoReload']);


};