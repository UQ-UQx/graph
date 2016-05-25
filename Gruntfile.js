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
        },
	shell:{
	  make_data_folder:{
	  	command: 'test -d data && echo "Data folder exists" || mkdir -m 777 data'
	  },
	  make_config_file:{
		command: 'test -d config.php && echo "config.php exists" || touch config.php'
	  }
	  
	}
    })

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sass');  
    grunt.loadNpmTasks('grunt-shell');
    

    grunt.registerTask('run', ["shell", "browserify:init","sass:dist","concurrent:app"]);
    grunt.registerTask('build', ["browserify:init","sass:dist","shell"]);

}
