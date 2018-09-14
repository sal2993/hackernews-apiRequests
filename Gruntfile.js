'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
          build: 'build',
        },
        jshint: {
          server: {
            src: [
            './*.js'
            ],
            options: {
              jshintrc: '.jshintrc',
              reporterOutput: ''
            }
          },
          build: {
            src: ['Gruntfile.js'],
            options: {
              jshintrc: '.jshintrc',
              reporterOutput: ''
            }
          }
        },
        watch: {
          api: {
            files: ['./*.js'],
            tasks: ['run:commands']
          },
          lint_server: {
            files: ['./*.js'],
            tasks: ['jshint:server']
          }
        },
        run: {
            commands: {
                options: {
                    wait: true
                },
                exec: 'npm test'
            }
        },
    });
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['jshint']); // register a default task alias
    grunt.registerTask('timestamp', function() {
      var options = this.options({
        file: '.timestamp'
      });
      var timestamp = +new Date();
      var contents = timestamp.toString();

      grunt.file.write(options.file, contents);
    });
    // TODO: See if we need a build task for pug
    grunt.registerTask('build:debug', "Lint and Compile", ['jshint']);
    grunt.registerTask('build:release', ['jshint', 'less:release', 'pug:release']);
    grunt.registerTask('dev', ['build:debug', 'watch']);
    //grunt.registerTask('notes', ['bump-only', 'conventionalChangelog', 'bump-commit']);
};
