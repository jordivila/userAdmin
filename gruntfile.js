module.exports = function (grunt) {
    
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
            files: ['src/public/test/qunit/**/*.html']
        },
        
         mochaTest: {
            test: {
                options: {
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
        watch: {
            
            files: ['<%= jshint.files %>'],
            tasks: ['frontend', 'backend'],
            express: {
                files: ['<%= jshint.files %>'],
                options: {
                    spawn: false 
                }
            }
        },
        express: {
            options: {
      
            },
            dev: {
                options: {
                    script: './src/server.js',
                    background: false, // --> false = keep server alive after grunt tasks,
                    node_env: 'dev'
                }
            },
            prod: {
                options: {
                    script: './src/server.js',
                    node_env: 'prod'
                }
            },
            test: {
                options: {
                    script: './src/server.js',
                    node_env: 'test'
                }
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

    
    
    
    grunt.registerTask('frontend', ['jshint:files', 'concat', 'uglify']);
    grunt.registerTask('backend', ['express:test', 'mochaTest', 'qunit' ]);
    grunt.registerTask('backendDev', ['express:dev']);
    

};