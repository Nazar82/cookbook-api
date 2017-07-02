module.exports = function(grunt) {



    grunt.initConfig({

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './public/min-safe/js/main.js': ['./public/js/main.js'],
                    './public/min-safe/js/controllers.js': ['./public/js/controllers.js'],
                    './public/min-safe/js/config.js': ['./public/js/config.js']
                }
            }
        },


        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['public/min-safe/js/main.js', 'public/min-safe/js/controllers.js', 'public/min-safe/js/config.js'],
                dest: 'public/js/built.js',
            }
        },
        uglify: {
            build_1: {
                src: 'public/js/built.js',
                dest: 'public/js/main.min.js'
            },
            build_2: {
                src: 'routes/src/api.js',
                dest: 'routes/api.js'
            },
            build_3: {
                src: 'routes/src/authenticate.js',
                dest: 'routes/authenticate.js'
            },
            build_4: {
                src: 'models/src/models.js',
                dest: 'models/models.js'
            }
        },
        autoprefixer: {
            options: {
                // We need to `freeze` browsers versions for testing purposes.
                browsers: ['opera 12', 'ff 15', 'chrome 25']
            },

            file: {
                src: 'public/stylesheets/src/style1.css',
                dest: 'public/stylesheets/src/style.css'
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/stylesheets/src',
                    src: ['*.css'],
                    dest: 'public/stylesheets',
                    ext: '.css'
                }]
            }
        }



    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');


    grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify', 'autoprefixer', 'cssmin']);


};
