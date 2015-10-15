/* --------------------------------------- *
* Gurilla JS                               *
* @module: Grunt jsDocs3 task              * 
* ---------------------------------------- */
module.exports = function(grunt) {

    grunt.config(['jsdoc'], {
        dist : {
            src: ['./src/**/*.js'],
            jsdoc: './node_modules/.bin/jsdoc',
            options: {
                destination: 'out',
                configure: './node_modules/jsdoc/conf.json',
                template: './node_modules/ink-docstrap/template'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('docs', ['jsdoc']);
};
