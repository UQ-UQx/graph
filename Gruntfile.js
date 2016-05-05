module.exports = function(grunt){

    grunt.initConfig({
        concurrent:{
            app:["watch:dev_reload", "watch:ugly", "browserify", "watch:scss_bundle", "sass:dist"],
            options: {
                logConcurrentOutput: true
            }
        },
        browserify: {
            dist: {
                files: {
                  'build/js/app.js': ['www/js/app.js']
                },
                options:{
                    watch: true,
                    keepAlive: true
                }
            }
        },
        watch:{
            
            scss_bundle:{
                files:["www/sass/**/*.scss"],
                tasks:["sass"]
            },
            ugly:{
                files:["build/js/app.js", "build/css/app.css"],
                tasks:["uglify"]
            },
            dev_reload:{
                files:["build/js/app.js", "build/css/app.css", "*.php", "**/*.php"],
                options: {
                  livereload: {

                    host: 'localhost',

                  }
                }
            },
        },
        uglify: {
            js: {
              files: {
                'build/js/app.min.js': ['build/js/app.js']
              }
            },
            css: {
                files: {
                    'build/css/app.min.css': ['build/css/app.css']
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'build/css/app.css': 'www/sass/main.scss',
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sass');


    grunt.registerTask('run', ["concurrent:app"]);
}