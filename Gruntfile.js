'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: ['gruntfile.js', 'application.js', 'lib/**/*.js', 'test/**/*.js'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['public/views/**', 'app/views/**'],
        options: {
          livereload: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'application.js',
        options: {
          args: [],
          ignore: ['public/**'],
          ext: 'js,html',
          nodeArgs: [],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      serve: ['nodemon', 'watch'],
      debug: ['node-inspector', 'shell:debug', 'open:debug'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {
      options: {},
      // environment variables - see https://github.com/jsoverson/grunt-env for more information
      local: {
        FH_USE_LOCAL_DB: true,
        DEBUG_LEVEL: 'silly',
        SLACK_CLIENT_ID: '12345.12345',
        SLACK_CLIENT_SECRET: '52a2dac8345f33ad23e958a0f7c0b6b8',
        SLACK_VERIFY_TOKEN: 'localdevelopment',
        SLACK_BOT_COMMAND: '/testbot',
        FH_SERVICE_MAP: function() {
          /*
           * Define the mappings for your services here - for local development.
           * You must provide a mapping for each service you wish to access
           * This can be a mapping to a locally running instance of the service (for local development)
           * or a remote instance.
           */
          var serviceMap = {
            'SERVICE_GUID_1': 'http://127.0.0.1:8010',
            'SERVICE_GUID_2': 'https://host-and-path-to-service'
          };
          return JSON.stringify(serviceMap);
        }
      }
    },
    'node-inspector': {
      dev: {}
    },
    shell: {
      debug: {
        options: {
          stdout: true
        },
        command: 'env NODE_PATH=. node --debug-brk application.js'
      }
    },
    open: {
      debug: {
        path: 'http://127.0.0.1:8080/debug?port=5858',
        app: 'Google Chrome'
      }
    },
    jshint: {
      files: ['*.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true
      }
    },
    mochaTest: {
        accept: {
            options: {
                reporter: 'spec',
                // Require blanket wrapper here to instrument other required 
                // files on the fly.  
                // 
                // NB. We cannot require blanket directly as it 
                // detects that we are not running mocha cli and loads differently. 
                // 
                // NNB. As mocha is 'clever' enough to only run the tests once for 
                // each file the following coverage task does not actually run any 
                // tests which is why the coverage instrumentation has to be done here 
                require: 'coverage/blanket'
            },
            src: ['test/accept/**/*.js']
        },
        unit: {
            options: {
                reporter: 'spec',
                // Require blanket wrapper here to instrument other required 
                // files on the fly.  
                // 
                // NB. We cannot require blanket directly as it 
                // detects that we are not running mocha cli and loads differently. 
                // 
                // NNB. As mocha is 'clever' enough to only run the tests once for 
                // each file the following coverage task does not actually run any 
                // tests which is why the coverage instrumentation has to be done here 
                require: 'coverage/blanket'
            },
            src: ['test/unit/**/*.js']
        },
        'html-cov': {
            options: {
                reporter: 'html-cov',
                // use the quiet flag to suppress the mocha console output 
                quiet: true,
                // specify a destination file to capture the mocha 
                // output (the quiet option does not suppress this) 
                captureFile: 'coverage/coverage.html'
            },
            src: ['test/**/*.js']
        },
        // The travis-cov reporter will fail the tests if the 
        // coverage falls below the threshold configured in package.json 
        'travis-cov': {
            options: {
                reporter: 'travis-cov'
            },
            src: ['test/**/*.js']
        }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['mochaTest']);

  grunt.registerTask('serve', ['env:local', 'concurrent:serve']);
  grunt.registerTask('debug', ['env:local', 'concurrent:debug']);
  grunt.registerTask('default', ['serve']);
};
