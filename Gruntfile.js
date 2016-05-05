module.exports = function(grunt){

    grunt.initConfig({
        concurrent:{
            app:["watch:dev_reload", "watch:js_ugly", "watch:css_ugly", "browserify", "watch:scss_bundle", "sass:dist"],
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
            js_ugly:{
                files:["build/js/app.js"],
                tasks:["uglify"]
            },
            css_ugly:{
                files:["build/css/app.css"],
                tasks:["cssmin"]
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
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'build/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/css',
                    ext: '.min.css'
                }]
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sass');


    grunt.registerTask('run', ["concurrent:app"]);
}