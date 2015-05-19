/* --------------------------------------- *
* Gurilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
*                                          *
* ---------------------------------------- */
module.exports = function(grunt){

  // Project configuration.
  grunt.initConfig({
      pkg:grunt.file.readJSON('package.json'),
      concat: {
          options: {
              separator: ';'
          },
          dist: {
              src: [
                  'src/core/instance.js',
                  'src/core/core.js',
                  'src/core/init.js'
              ],
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
      }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('default', ['concat','uglify']);
};
