'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'spec/**/*.js'

module.exports = function(grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowerrc: grunt.file.readJSON('.bowerrc'),

    // configurable paths
    sweepstake: {
      app: 'app',
      dist: 'dist',
      vendor: '<%= bowerrc.directory %>',
      node: 'node_modules'
    },

    banner: '/*!\n' +
            ' * <%= pkg.name %>-<%= pkg.version %>\n' +
            ' * <%= pkg.author %>\n' +
            ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' */\n\n',
    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:conf']
      },
      templates: {
        files: '<%= sweepstake.app %>/templates/*.html',
        tasks: ['jst', 'concat:dev'],
      },
      browserify: {
        files: ['<%= sweepstake.app %>/**/*.js', 'spec/{,*/}*.js'],
        tasks: ['browserify:dev', 'jst' ,'concat:dev']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= sweepstake.app %>/**/*.html',
          '{.tmp,<%= sweepstake.app %>}/*.js'
        ]
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        browsers: ['PhantomJS']
      },
      ci: {
        singleRun: true
      },
      debug: {
        browsers: ['Chrome'],
        singleRun: false
      }
    },
    jst: {
      compile: {
        files: {
          '.tmp/app/templates.js': ['app/templates/*.html']
        }
      }
    },
    connect: {
      options: {
        port: 8080,
        livereload: 35729,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= sweepstake.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      }
    },
    clean: {
      dev: '.tmp',
      dist: 'dist'
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/app',
          dest: 'dist',
          src: 'app.js'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      app: ['app/js/**/*.js'],
      spec: ['spec/{,*/}*.js'],
      conf: ['Gruntfile.js']
    },
    browserify: {
      dev: {
        src: ['<%= sweepstake.app %>/main.js'],
        dest: '.tmp/app/main.js',
        options: {
          debug: true
        }
      },
      dist: {
        src: ['<%= sweepstake.app %>/main.js'],
        dest: '.tmp/app/main.js',
        options: {
          debug: false
        }
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>'
      },
      dev: {
        src: ['.tmp/app/templates.js', '.tmp/app/main.js'],
        dest: '.tmp/app/app.js'
      },
      dist: {
        src: ['.tmp/app/templates.js', '.tmp/app/main.js'],
        dest: '.tmp/app/app.js'
      }
    },
    concurrent: {
      dev: [
        'jshint:app',
        'browserify:dev'
      ],
      dist: [
        'jshint:app',
        'browserify:dist'
      ],
      test: [
        'jshint',
        'browserify:dev'
      ]
    }
  });

  grunt.registerTask('build:dev', [
    'clean:dev',
    'jst',
    'concurrent:dist',
    'concat:dev',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build:dist', [
    'clean:dist',
    'build:test',
    'jst',
    'concurrent:dist',
    'concat:dist',
    'copy:dist'
  ]);

  grunt.registerTask('build:test', [
    'clean:dev',
    'browserify:dev',
    'jst'
  ]);

  grunt.registerTask('specs', [
    'build:test',
    'karma:ci'
  ]);
};
