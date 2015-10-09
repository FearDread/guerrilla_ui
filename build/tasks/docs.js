
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jsdoc : {
            dist : {
                src: ['./*.js'],
                jsdoc: './node_modules/.bin/jsdoc',
                options: {
                    destination: 'doc',
                    configure: './node_modules/jsdoc/conf.json',
                    template: './node_modules/ink-docstrap/template'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');

};
