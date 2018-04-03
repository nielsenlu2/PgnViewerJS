module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["dist/css", 'dist/js', 'dist/img', 'dist/locales', 'dist/doc', "docu/dist/css",
            'docu/dist/js', 'docu/dist/img', 'docu/dist/locales', 'docu/dist/doc',
            'PgnViewerJS.zip'],
        concat: {
            all: {
                src: [
                    'chess.js/chess.js',
                    'js/chessground.min.js',
                    'js/i18next.min.js',
                    'js/i18nextXHRBackend.js',
                    'js/i18nextLocalStorageCache.js',
                    'js/Timer.js',
                    'js/smoothscroll.js',
                    'js/mousetrap.js',
                    'js/pgn.js',
                    'js/pgn-parser.js',
                    'js/pgnvjs.js'
                ],
                dest: 'dist/js/pgnvjs.js'
            },
            dev: {
                src: [
                    'chess.js/chess.js',
                    'js/chessground.min.js',
                    'js/i18next.js',
                    'js/i18nextXHRBackend.js',
                    'js/i18nextLocalStorageCache.js',
                    'js/Timer.js',
                    'js/smoothscroll.js',
                    'js/mousetrap.js',
                    'js/pgn-parser.js'
                ],
                dest: 'dist/js/third.js'
            }
        },
        uglify: {
            js: {
                src: ['dist/js/pgnvjs.js'],
                dest: 'dist/js/min/pgnvjs.js'
            }
        },
        copy: {
            all: {
                files: [
                    {
                        src: [
                            'locales/**',
                            'img/chesspieces/**',
                            'img/pattern/**',
                            'img/*.png',
                            'css/images/**'],
                        dest: 'dist',
                        expand: true
                    },
                    {
                        expand: true,
                        cwd: 'font-awesome',
                        src: 'fonts/**',
                        dest: 'dist'
                    }
                ]
            },
            markdown: {
                files: [
                    {
                        expand: true,
                        cwd: 'docu',
                        src: ['css/**', 'img/**'],
                        dest: 'dist/doc'
                    }
                ]
            }
        },
        markdown: {
            all: {
                files: [
                    {
                        expand: true,
                        src: '*.md',
                        dest: 'dist/doc/',
                        ext: '.html'
                    }
                ],
                options: {
                    template: 'template.jst'}
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'dist/PgnViewerJS-0.9.6.zip'
                },
                expand: true,
                cwd: 'dist/',
                src: ['**/*', '!PgnViewerJS-*.zip'],
                dest: ''
            }
        },
        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: [
                    'font-awesome/css/font-awesome.css',
                    'css/chessground.css',
                    'css/theme.css',
                    'css/pgnvjs.css'
                ],
                dest: "dist/css/pgnvjs.css"
            },
            dev: {
                src: [
                    'font-awesome/css/font-awesome.css',
                    'css/chessground.css'
                ],
                dest: 'dist/css/third.css'
            }
        }

    });

    // Load the necessary tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-concat-css');

    // Default task.
    // uglify does not work with ES6
    //grunt.registerTask('default', ['clean', 'concat:all', 'concat_css',  'uglify', 'copy:all', 'genExamples']);
    grunt.registerTask('default', ['clean', 'concat:all', 'concat_css',  'copy:all', 'genExamples']);
    grunt.registerTask('debug', ['clean', 'concat:all', 'copy:all']);
    grunt.registerTask('dev', ['concat:dev', 'concat_css:dev']);

    /* Define the function and register it to generate the HTML example files in the documentation.
       This should be redone for each release then ...        */
    grunt.registerTask('genExamples', function() {
        var htmlEscape = function(str) {
            return (str + '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/\//g, '&#x2F;')
                .replace(/`/g, '&#x60;');
        };
        console.log("Will generate examples in directory: " + __dirname + '\\docu\\examples');
        var fs = require('fs');
        require('./docu/js/examples.js');
        console.log("Available keys: " + Object.keys(examples));
        var exKeys = Object.keys(examples);
        // Loop through all examples
        for (var i=0; i < exKeys.length; i++) {
            var ex = examples[exKeys[i]];
            var buf = "";
            buf += '<!DOCTYPE html>' + "\n";
            buf += '<html>' + "\n";
            buf += '<head>' + "\n";
            buf += '<meta charset="utf-8" />' + "\n";
            buf += '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />' + "\n";
            buf += '<title>' + ex.name + '</title>' + "\n";
            buf += '<link rel="stylesheet" href="../../dist/css/pgnvjs.css" />' + "\n";
            buf += '<link rel="stylesheet" href="../css/prettify.css" />' + "\n";
            buf += '<link rel="stylesheet" href="../css/layout.css" />' + "\n";
            buf += '<script src="../../dist/js/pgnvjs.js" type="text/javascript" ></script>' + "\n";
            buf += '<script src="../js/prettify.js" type="text/javascript" ></script>' + "\n";
            buf += '</head>' + "\n";
            buf += '<body class="merida zeit">' + "\n";
            buf += '<h2>' + ex.name + '</h2>' + "\n";
            buf += '<h3>Javascript part</h3>' + "\n";
            buf += '<pre class="prettyprint lang-js">' + ex.jsStr + '</pre>' + "\n";
            buf += '<h3>HTML part</h3>' + "\n";
            buf += '<pre class="prettyprint lang-html">' + htmlEscape(ex.html) + '</pre>' + "\n";
            buf += '<p>See the <a href="../examples.html#' + exKeys[i] + '">back link</a> to the original examples page.</p>' + "\n";
            buf += '<div>' + ex.desc + '</div>' + "\n";
            buf += ex.html + "\n";
            buf += '<script>' + "\n";
            buf += ex.jsStr + "\n";
            buf += '</script>' + "\n";
            buf += '<script>prettyPrint();</script>' + "\n";
            buf += '</body>' + "\n";
            buf += '</html>' + "\n";
            fs.writeFileSync('docu/examples/' + exKeys[i] + ".html", buf);
        }
    })
};