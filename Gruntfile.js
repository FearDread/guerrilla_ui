/* --------------------------------------- *
* Gurilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
* @module: Grunt CLI build & config        * 
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
                  'src/utils.js',
                  'src/broker.js',
                  'src/api.js',
                  'src/GUI.js',
                  'src/plugin.js',
                  'src/modules/mvc/model.js',
                  'src/modules/mvc/view.js',
                  'src/modules/mvc/controller.js',
                  'src/modules/network/router.js',
                  'src/modules/lang/lang.js',
                  'src/modules/lang/array.js',
                  'src/modules/lang/object.js',
                  'src/modules/util/cache.js',
                  'src/modules/util/cookie.js',
                  'src/plugins/glisslider.js',
                  'src/plugins/stargaze.js',
                  'src/plugins/misty.js',
              ],
              dest: 'dist/<%= pkg.name %>.js'
           }
      },
      uglify: {
          options: {
              preserveComments: false,
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
