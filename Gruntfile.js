module.exports = function(grunt){

    grunt.initConfig({
        concurrent:{
            app:["watch:dev_reload","browserify:run", "watch:js_ugly", "watch:scss_bundle"],
            options: {
                logConcurrentOutput: true
            }
        },
        browserify: {
            init:{
                files: {
                  'build/js/app.js': ['www/js/app.js']
                }
            },
            run: {
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
            js_ugly:{
                files:["build/js/app.js"],
                tasks:["uglify:js"]
            },
            dev_reload:{
                files:["build/js/app.js", "build/css/app.min.css", "*.php", "**/*.php"],
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
            }
        },
        sass: {
            options:{
                outputStyle:"compressed"
            },
            dist: {
                files: {
                    'build/css/app.min.css': 'www/sass/main.scss',
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('run', ["browserify:init","sass:dist","concurrent:app"]);
    grunt.registerTask('build', ["browserify:init","sass:dist"]);

}