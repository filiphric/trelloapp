module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'public/css/trello.css': 'assets/scss/trello.scss'
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'public/js/trello.js': 'assets/js/trello/main.js',
        }
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass'],
      },
      scripts: {
        files: './assets/**/*.js',
        tasks: ['browserify'],
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('s', ['sass']);
  grunt.registerTask('b', ['browserify']);
  grunt.registerTask('dev', ['sass', 'browserify']);
};