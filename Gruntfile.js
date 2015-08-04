module.exports = function (grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['./app.js', './controllers/*.js', './services/*.js'],
        dest: 'dist/built.js'
      }
    },
    uglify: {
      my_target: {
        files: {
          'dist/built.min.js': ['dist/built.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
};