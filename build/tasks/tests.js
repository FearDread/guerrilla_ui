/* --------------------------------------- *
* Gurilla JS                               *
* @module: Grunt jsHint test               * 
* ---------------------------------------- */
module.exports = function(grunt) {

    grunt.config(['jshint'], {
        ignore_warning: {
            options: {
                '-W083': true
            },
            src: ['Gruntfile.js', 'src/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
  
    grunt.registerTask('test', ['jshint']);
};
