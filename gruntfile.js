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

        '!src/public/scripts/**/*.*', 

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
        files: ['<%= jshint.files %>'],
        tasks: ['jshint:files', 'concat', 'uglify', 'express:testLiveReload'],
        options: {
          spawn: false, //Must have for reload
          livereload: true //Enable LiveReload
        }
      },

      test: {
        files: ['<%= jshint.files %>'],
        //tasks: ['jshint:files', 'mochaTest', 'express:testQunit', 'qunit']
        tasks: ['jshint:files', 'express:testQunit', 'qunit']
      },
    },
    open: {
      all: {
        path: 'http://localhost:3001/public/test/qunit/index.html'
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



  grunt.registerTask('test', ['watch:test']);
  grunt.registerTask('live', ['express:testLiveReload', 'open', 'watch:testLiveReload']);

};